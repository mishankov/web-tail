package main

import (
	"io"
	"iter"

	"github.com/nxadm/tail"
)

type Tailer interface {
	Tail() iter.Seq[string]
}

type BaseTailer struct {
	initialAmount int
}

func NewTailerFromSource(source SourceConfig, initialAmount int) Tailer {
	switch source.Type {
	case "local:file":
		return LocalFile{filePath: source.Path, BaseTailer: BaseTailer{initialAmount: initialAmount}}
	default:
		return nil
	}
}

type LocalFile struct {
	BaseTailer
	filePath string
}

func (lf LocalFile) Tail() iter.Seq[string] {
	t, err := tail.TailFile(lf.filePath, tail.Config{Poll: true, Follow: true, ReOpen: true, Location: &tail.SeekInfo{Offset: 0, Whence: io.SeekEnd}})
	if err != nil {
		// TODO: got to be better than that
		panic(err)
	}

	return func(yield func(string) bool) {
		for line := range t.Lines {
			yield(line.Text)
		}
	}
}
