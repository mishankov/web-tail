package main

import (
	"bufio"
	"fmt"
	"io"
	"iter"
	"os/exec"
	"strconv"

	"github.com/nxadm/tail"
	"golang.org/x/crypto/ssh"
)

type Tailer interface {
	Tail() (iter.Seq[string], error)
}

// TODO: delete BaseTailer and make Tail take initial amount arg
type BaseTailer struct {
	initialAmount int
}

func NewTailerFromSource(source SourceConfig, initialAmount int) Tailer {
	switch source.Type {
	case "local:file":
		return LocalFile{filePath: source.Path, BaseTailer: BaseTailer{initialAmount: initialAmount}}
	case "local:docker":
		return LocalDocker{containerId: source.ContainerId, BaseTailer: BaseTailer{initialAmount: initialAmount}}
	case "ssh:docker":
		// TODO: create and use NewRemote
		// TODO: command may be determined in Tail, because initial amount would be passed to it. But Tail does not know about type
		return Remote{host: source.Host, port: source.Port, username: source.Username, password: source.Password, privateKeyPath: source.PrivateKeyPath, command: fmt.Sprintf("docker logs -f -n %v %v", strconv.Itoa(initialAmount), source.ContainerId), BaseTailer: BaseTailer{initialAmount: initialAmount}}
	default:
		return nil
	}
}

type LocalFile struct {
	BaseTailer
	filePath string
}

func (lf LocalFile) Tail() (iter.Seq[string], error) {
	t, err := tail.TailFile(lf.filePath, tail.Config{Poll: true, Follow: true, ReOpen: true, Location: &tail.SeekInfo{Offset: 0, Whence: io.SeekEnd}})
	if err != nil {
		logger.Error("Error setuping tail file:", err)
		return nil, err
	}

	return func(yield func(string) bool) {
		for line := range t.Lines {
			yield(line.Text)
		}
	}, nil
}

type LocalDocker struct {
	BaseTailer
	containerId string
}

func (ld LocalDocker) Tail() (iter.Seq[string], error) {
	cmd := exec.Command("docker", "logs", "-f", "-n", strconv.Itoa(ld.initialAmount), ld.containerId)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		logger.Error("Error conneting to stdout:", err)
		return nil, err
	}

	return func(yield func(string) bool) {
		logger.Debug("Begin of yield")

		scanner := bufio.NewScanner(stdout)
		logger.Debug("Scanner created")

		if err := cmd.Start(); err != nil {
			logger.Error(err)
		}

		for scanner.Scan() {
			yield(scanner.Text())
		}

		logger.Infof("Container %v stopped", ld.containerId)
	}, nil
}

type Remote struct {
	BaseTailer
	host           string
	port           port
	username       string
	password       string
	privateKeyPath string
	command        string
}

func (r Remote) hostAndPort() string {
	return fmt.Sprintf("%v:%v", r.host, r.port)
}

func (r Remote) Tail() (iter.Seq[string], error) {
	logger.Debug("Start of Tail. Command:", r.command)

	sshConfig := &ssh.ClientConfig{
		User: r.username,
		Auth: []ssh.AuthMethod{ssh.Password(r.password)}, //TODO: implement auth with key
	}
	sshConfig.HostKeyCallback = ssh.InsecureIgnoreHostKey()

	client, err := ssh.Dial("tcp", r.hostAndPort(), sshConfig)
	if err != nil {
		logger.Errorf("Error connectig to %v: %v", r.hostAndPort(), err)
		return nil, err
	}

	session, err := client.NewSession()
	if err != nil {
		logger.Error("Error creating new session:", err)
		return nil, err
	}

	stdout, err := session.StdoutPipe()
	if err != nil {
		logger.Error("Error getting stdout:", err)
	}

	return func(yield func(string) bool) {
		logger.Debug("Begin of yield")

		scanner := bufio.NewScanner(stdout)
		logger.Debug("Scanner created")

		if err := session.Start(r.command); err != nil {
			logger.Error("Error running command:", err)
		}

		for scanner.Scan() {
			yield(scanner.Text())
		}

		logger.Debug("End of yield")
	}, nil
}
