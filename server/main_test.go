package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

func TestHandleLogStreamSourceNames(t *testing.T) {
	t.Chdir(t.TempDir())
	tests := []struct {
		name    string
		encoded string
	}{
		{name: "plain-source", encoded: "plain-source"},
		{name: "bytter-system@201", encoded: "bytter-system%40201"},
		{name: "source with spaces", encoded: "source%20with%20spaces"},
		{name: "журнал", encoded: "%D0%B6%D1%83%D1%80%D0%BD%D0%B0%D0%BB"},
		{name: "source/child", encoded: "source%2Fchild"},
		{name: "source+name", encoded: "source%2Bname"},
		{name: "source+name", encoded: "source+name"},
		{name: "source?#name", encoded: "source%3F%23name"},
		{name: "source%", encoded: "source%25"},
		{name: "source%40name", encoded: "source%2540name"},
		{name: "source@%40name", encoded: "source%40%2540name"},
	}

	for _, tt := range tests {
		t.Run(tt.encoded, func(t *testing.T) {
			config := fmt.Sprintf(`allowedOrigins = ["https://allowed.example"]
[[sources]]
name = %q
type = "local:file"
path = "unused.log"
`, tt.name)
			if err := os.WriteFile("web-tail.config.toml", []byte(config), 0600); err != nil {
				t.Fatal(err)
			}

			req := httptest.NewRequest(http.MethodGet, "/logstream/"+tt.encoded+"/100", nil)
			req.Header.Set("Connection", "Upgrade")
			req.Header.Set("Upgrade", "websocket")
			req.Header.Set("Sec-WebSocket-Version", "13")
			req.Header.Set("Origin", "https://rejected.example")
			response := httptest.NewRecorder()
			router().ServeHTTP(response, req)

			// Origin rejection happens after a successful source lookup and avoids
			// starting a WebSocket connection or a long-running file tailer.
			if response.Code != http.StatusForbidden {
				t.Fatalf("status = %d, want %d; body = %q", response.Code, http.StatusForbidden, response.Body.String())
			}
		})
	}
}
