package main

import (
	"fmt"
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

	return parseConfig(data)
}

func parseConfig(data []byte) (Config, error) {
	var config Config
	_, err := toml.Decode(string(data), &config)
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

	if err := resolveEnvPlaceholders(&config); err != nil {
		return Config{}, err
	}

	if config.Port == 0 {
		config.Port = 4444
	}

	if len(config.AllowedOrigins) == 0 {
		config.AllowedOrigins = allowedOrigins{"*"}
	}

	if err := (&config).Validate(); err != nil {
		return Config{}, err
	}

	return config, nil
}

var validSourceTypes = []string{
	"local:file",
	"local:docker",
	"local:openclaw",
	"ssh:file",
	"ssh:docker",
	"ssh:openclaw",
}

func (c *Config) Validate() error {
	// Validate servers
	serverNames := make(map[string]bool)
	for i, server := range c.Servers {
		if server.Name == "" {
			return fmt.Errorf("servers[%d].name is required", i)
		}
		if serverNames[server.Name] {
			return fmt.Errorf("servers[%d].name %q is duplicated", i, server.Name)
		}
		serverNames[server.Name] = true

		if server.Host == "" {
			return fmt.Errorf("servers[%d].host is required", i)
		}
		if server.Port <= 0 || server.Port > 65535 {
			return fmt.Errorf("servers[%d].port must be between 1 and 65535, got %d", i, server.Port)
		}
		if server.Username == "" {
			return fmt.Errorf("servers[%d].username is required", i)
		}
		if server.Password == "" && server.PrivateKeyPath == "" {
			return fmt.Errorf("servers[%d]: either password or privateKeyPath is required", i)
		}
	}

	// Validate sources
	sourceNames := make(map[string]bool)
	for i, source := range c.Sources {
		if source.Name == "" {
			return fmt.Errorf("sources[%d].name is required", i)
		}
		if sourceNames[source.Name] {
			return fmt.Errorf("sources[%d].name %q is duplicated", i, source.Name)
		}
		sourceNames[source.Name] = true

		if source.Type == "" {
			return fmt.Errorf("sources[%d].type is required", i)
		}
		if !slices.Contains(validSourceTypes, source.Type) {
			return fmt.Errorf("sources[%d].type must be one of %v, got %q", i, validSourceTypes, source.Type)
		}

		// Validate type-specific required fields
		switch source.Type {
		case "local:file", "ssh:file":
			if source.Path == "" {
				return fmt.Errorf("sources[%d].path is required for type %q", i, source.Type)
			}
		case "local:docker", "ssh:docker":
			if source.ContainerId == "" {
				return fmt.Errorf("sources[%d].containerId is required for type %q", i, source.Type)
			}
		}

		// Validate SSH-specific fields
		if slices.Contains([]string{"ssh:file", "ssh:docker", "ssh:openclaw"}, source.Type) {
			if source.ServerName != "" {
				if !serverNames[source.ServerName] {
					return fmt.Errorf("sources[%d].serverName references non-existent server %q", i, source.ServerName)
				}
			} else {
				// Direct SSH config validation
				if source.Host == "" {
					return fmt.Errorf("sources[%d].host is required for SSH source type %q", i, source.Type)
				}
				if source.Port <= 0 || source.Port > 65535 {
					return fmt.Errorf("sources[%d].port must be between 1 and 65535, got %d", i, source.Port)
				}
				if source.Username == "" {
					return fmt.Errorf("sources[%d].username is required for SSH source type %q", i, source.Type)
				}
				if source.Password == "" && source.PrivateKeyPath == "" {
					return fmt.Errorf("sources[%d]: either password or privateKeyPath is required for SSH source type %q", i, source.Type)
				}
			}
		}
	}

	// Validate port
	if c.Port < 0 || c.Port > 65535 {
		return fmt.Errorf("port must be between 0 and 65535, got %d", c.Port)
	}

	return nil
}
