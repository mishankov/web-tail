package main

import (
	"bufio"
	"io"
	"iter"
	"os/exec"
	"strconv"

	"github.com/nxadm/tail"
)

type Tailer interface {
	Tail() (iter.Seq[string], error)
}

type BaseTailer struct {
	initialAmount int
}

func NewTailerFromSource(source SourceConfig, initialAmount int) Tailer {
	switch source.Type {
	case "local:file":
		return LocalFile{filePath: source.Path, BaseTailer: BaseTailer{initialAmount: initialAmount}}
	case "local:docker":
		return LocalDocker{containerId: source.ContainerId, BaseTailer: BaseTailer{initialAmount: initialAmount}}
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
