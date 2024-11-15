package main

import "github.com/mishankov/go-utlz/cliutils"

var assetsPath = cliutils.GetEnvOrDefault("ASSETS", "public")
