package main

import (
	"iter"

	"github.com/nxadm/tail"
)

type Tailer interface {
	Tail() iter.Seq[string]
}

func NewTailerFromSource(source SourceConfig) Tailer {
	switch source.Type {
	case "local:file":
		return LocalFile{filePath: source.Path}
	default:
		return nil
	}
}

type LocalFile struct {
	filePath string
}

func (lf LocalFile) Tail() iter.Seq[string] {
	t, err := tail.TailFile(lf.filePath, tail.Config{Follow: true, ReOpen: true})
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
