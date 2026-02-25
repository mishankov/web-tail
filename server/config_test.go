package main

import (
	"strings"
	"testing"
)

func TestConfigValidation(t *testing.T) {
	tests := []struct {
		name      string
		config    string
		wantError string
	}{
		{
			name: "valid local file source",
			config: `
[[sources]]
name = "test"
type = "local:file"
path = "/tmp/test.log"
`,
			wantError: "",
		},
		{
			name: "valid local docker source",
			config: `
[[sources]]
name = "test"
type = "local:docker"
containerId = "abc123"
`,
			wantError: "",
		},
		{
			name: "valid SSH source with direct config",
			config: `
[[sources]]
name = "test"
type = "ssh:file"
path = "/var/log/test.log"
host = "example.com"
port = 22
username = "user"
password = "pass"
`,
			wantError: "",
		},
		{
			name: "valid SSH source with server reference",
			config: `
[[servers]]
name = "prod"
host = "example.com"
port = 22
username = "user"
password = "pass"

[[sources]]
name = "test"
type = "ssh:file"
path = "/var/log/test.log"
serverName = "prod"
`,
			wantError: "",
		},
		{
			name: "missing source name",
			config: `
[[sources]]
type = "local:file"
path = "/tmp/test.log"
`,
			wantError: "sources[0].name is required",
		},
		{
			name: "missing source type",
			config: `
[[sources]]
name = "test"
path = "/tmp/test.log"
`,
			wantError: "sources[0].type is required",
		},
		{
			name: "invalid source type",
			config: `
[[sources]]
name = "test"
type = "invalid:type"
path = "/tmp/test.log"
`,
			wantError: "sources[0].type must be one of",
		},
		{
			name: "missing path for file source",
			config: `
[[sources]]
name = "test"
type = "local:file"
`,
			wantError: "sources[0].path is required for type \"local:file\"",
		},
		{
			name: "missing containerId for docker source",
			config: `
[[sources]]
name = "test"
type = "local:docker"
`,
			wantError: "sources[0].containerId is required for type \"local:docker\"",
		},
		{
			name: "SSH source missing host",
			config: `
[[sources]]
name = "test"
type = "ssh:file"
path = "/var/log/test.log"
port = 22
username = "user"
password = "pass"
`,
			wantError: "sources[0].host is required for SSH source type \"ssh:file\"",
		},
		{
			name: "SSH source missing username",
			config: `
[[sources]]
name = "test"
type = "ssh:file"
path = "/var/log/test.log"
host = "example.com"
port = 22
password = "pass"
`,
			wantError: "sources[0].username is required for SSH source type \"ssh:file\"",
		},
		{
			name: "SSH source missing authentication",
			config: `
[[sources]]
name = "test"
type = "ssh:file"
path = "/var/log/test.log"
host = "example.com"
port = 22
username = "user"
`,
			wantError: "sources[0]: either password or privateKeyPath is required for SSH source type \"ssh:file\"",
		},
		{
			name: "SSH source invalid port",
			config: `
[[sources]]
name = "test"
type = "ssh:file"
path = "/var/log/test.log"
host = "example.com"
port = 99999
username = "user"
password = "pass"
`,
			wantError: "sources[0].port must be between 1 and 65535",
		},
		{
			name: "server missing name",
			config: `
[[servers]]
host = "example.com"
port = 22
username = "user"
password = "pass"
`,
			wantError: "servers[0].name is required",
		},
		{
			name: "server missing host",
			config: `
[[servers]]
name = "prod"
port = 22
username = "user"
password = "pass"
`,
			wantError: "servers[0].host is required",
		},
		{
			name: "server invalid port",
			config: `
[[servers]]
name = "prod"
host = "example.com"
port = 0
username = "user"
password = "pass"
`,
			wantError: "servers[0].port must be between 1 and 65535",
		},
		{
			name: "server missing username",
			config: `
[[servers]]
name = "prod"
host = "example.com"
port = 22
password = "pass"
`,
			wantError: "servers[0].username is required",
		},
		{
			name: "server missing authentication",
			config: `
[[servers]]
name = "prod"
host = "example.com"
port = 22
username = "user"
`,
			wantError: "servers[0]: either password or privateKeyPath is required",
		},
		{
			name: "duplicate source names",
			config: `
[[sources]]
name = "test"
type = "local:file"
path = "/tmp/test1.log"

[[sources]]
name = "test"
type = "local:file"
path = "/tmp/test2.log"
`,
			wantError: "sources[1].name \"test\" is duplicated",
		},
		{
			name: "duplicate server names",
			config: `
[[servers]]
name = "prod"
host = "example.com"
port = 22
username = "user"
password = "pass"

[[servers]]
name = "prod"
host = "example2.com"
port = 22
username = "user"
password = "pass"
`,
			wantError: "servers[1].name \"prod\" is duplicated",
		},
		{
			name: "non-existent server reference",
			config: `
[[sources]]
name = "test"
type = "ssh:file"
path = "/var/log/test.log"
serverName = "nonexistent"
`,
			wantError: "sources[0].serverName references non-existent server \"nonexistent\"",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			config, err := parseConfig([]byte(tt.config))

			if tt.wantError == "" {
				if err != nil {
					t.Errorf("expected no error, got: %v", err)
				}
			} else {
				if err == nil {
					t.Errorf("expected error containing %q, got no error", tt.wantError)
				} else if !strings.Contains(err.Error(), tt.wantError) {
					t.Errorf("expected error containing %q, got: %v", tt.wantError, err)
				}
			}

			// For valid configs, verify the config is properly set
			if tt.wantError == "" && err == nil {
				if config.Port == 0 {
					t.Error("expected default port to be set")
				}
				if len(config.AllowedOrigins) == 0 {
					t.Error("expected default allowed origins to be set")
				}
			}
		})
	}
}
