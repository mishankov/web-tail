package client

import (
	"embed"
	"io/fs"
)

//go:embed dist dist/**
var embeddedAssets embed.FS

func EmbeddedAssets() (fs.FS, error) {
	return fs.Sub(embeddedAssets, "dist")
}
