package main

import (
	"os"
	"slices"

	"github.com/BurntSushi/toml"
)

type port int32

type SourceConfig struct {
	Name string
	Type string
	Path string

	ServerName     string
	Host           string
	Port           port
	Username       string
	Password       string
	PrivateKeyPath string

	ContainerId string
}

type ServerConfig struct {
	Name           string
	Host           string
	Port           port
	Username       string
	Password       string
	PrivateKeyPath string
}

type allowedOrigins []string

func (ao allowedOrigins) Match(origin string) bool {
	return slices.Contains(ao, origin) || slices.Contains(ao, "*")
}

type Config struct {
	Sources            []SourceConfig
	Servers            []ServerConfig
	OpenBrowserOnStart bool
	Port               port
	AllowedOrigins     allowedOrigins
}

func getConfig() (Config, error) {
	data, err := os.ReadFile("web-tail.config.toml")
	if err != nil {
		return Config{}, err
	}

	var config Config
	_, err = toml.Decode(string(data), &config)
	if err != nil {
		return Config{}, err
	}

	for i, source := range config.Sources {
		if source.ServerName != "" {
			for _, server := range config.Servers {
				if source.ServerName == server.Name {
					config.Sources[i].Host = server.Host
					config.Sources[i].Port = server.Port
					config.Sources[i].Username = server.Username
					config.Sources[i].Password = server.Password
					config.Sources[i].PrivateKeyPath = server.PrivateKeyPath
				}
			}
		}
	}

	if config.Port == 0 {
		config.Port = 4444
	}

	if len(config.AllowedOrigins) == 0 {
		config.AllowedOrigins = allowedOrigins{"*"}
	}

	return config, nil
}
