package main

import (
	"fmt"
	"os"
	"regexp"
)

var envPlaceholderPattern = regexp.MustCompile(`^\$\{([A-Za-z_][A-Za-z0-9_]*)\}$`)

func resolveStringField(value string, fieldPath string) (string, error) {
	matches := envPlaceholderPattern.FindStringSubmatch(value)
	if len(matches) != 2 {
		return value, nil
	}

	envName := matches[1]
	envValue, exists := os.LookupEnv(envName)
	if !exists {
		return "", fmt.Errorf("missing env var %q for config field %q", envName, fieldPath)
	}

	return envValue, nil
}

func resolveEnvPlaceholders(config *Config) error {
	for i := range config.Sources {
		source := &config.Sources[i]

		var err error
		source.Name, err = resolveStringField(source.Name, fmt.Sprintf("sources[%d].name", i))
		if err != nil {
			return err
		}
		source.Type, err = resolveStringField(source.Type, fmt.Sprintf("sources[%d].type", i))
		if err != nil {
			return err
		}
		source.Path, err = resolveStringField(source.Path, fmt.Sprintf("sources[%d].path", i))
		if err != nil {
			return err
		}
		source.ServerName, err = resolveStringField(source.ServerName, fmt.Sprintf("sources[%d].serverName", i))
		if err != nil {
			return err
		}
		source.Host, err = resolveStringField(source.Host, fmt.Sprintf("sources[%d].host", i))
		if err != nil {
			return err
		}
		source.Username, err = resolveStringField(source.Username, fmt.Sprintf("sources[%d].username", i))
		if err != nil {
			return err
		}
		source.Password, err = resolveStringField(source.Password, fmt.Sprintf("sources[%d].password", i))
		if err != nil {
			return err
		}
		source.PrivateKeyPath, err = resolveStringField(source.PrivateKeyPath, fmt.Sprintf("sources[%d].privateKeyPath", i))
		if err != nil {
			return err
		}
		source.ContainerId, err = resolveStringField(source.ContainerId, fmt.Sprintf("sources[%d].containerId", i))
		if err != nil {
			return err
		}
	}

	for i := range config.Servers {
		server := &config.Servers[i]

		var err error
		server.Name, err = resolveStringField(server.Name, fmt.Sprintf("servers[%d].name", i))
		if err != nil {
			return err
		}
		server.Host, err = resolveStringField(server.Host, fmt.Sprintf("servers[%d].host", i))
		if err != nil {
			return err
		}
		server.Username, err = resolveStringField(server.Username, fmt.Sprintf("servers[%d].username", i))
		if err != nil {
			return err
		}
		server.Password, err = resolveStringField(server.Password, fmt.Sprintf("servers[%d].password", i))
		if err != nil {
			return err
		}
		server.PrivateKeyPath, err = resolveStringField(server.PrivateKeyPath, fmt.Sprintf("servers[%d].privateKeyPath", i))
		if err != nil {
			return err
		}
	}

	for i := range config.AllowedOrigins {
		allowedOrigin, err := resolveStringField(config.AllowedOrigins[i], fmt.Sprintf("allowedOrigins[%d]", i))
		if err != nil {
			return err
		}

		config.AllowedOrigins[i] = allowedOrigin
	}

	return nil
}
