package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
	"web-tail/pkg/logging"

	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
)

var logger = logging.NewLogger("handlers")

func handleSources(w http.ResponseWriter, req *http.Request) {
	config, err := getConfig()
	if err != nil {
		logger.Error("Error getting config in sources handle:", err)
	}

	var sources []string
	for _, source := range config.Sources {
		sources = append(sources, source.Name)
	}

	sourcesJson, err := json.Marshal(sources)
	if err != nil {
		logger.Error("Error marshaling sources to JSON:", err)
	}

	w.Header().Add("Content-Type", "application/json")

	_, err = w.Write(sourcesJson)
	if err != nil {
		logger.Error("Error writing response for sources:", err)
	}
}

var allowedOrigins = make(map[string]bool)
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		return allowedOrigins[origin]
	},
}

func handleLogStream(w http.ResponseWriter, req *http.Request) {
	sourceName := chi.URLParam(req, "source")
	window, err := strconv.Atoi(chi.URLParam(req, "window"))
	if err != nil {
		logger.Error("Error converting window to int:", err)
		w.WriteHeader(400)
		return
	}

	logger.Infof("Logs requested for %v. Window: %v", sourceName, window)

	conn, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		logger.Error("Error upgrading to ws:", err)
		return
	}

	var tailer Tailer

	config, err := getConfig()
	if err != nil {
		logger.Error("Error getting config:", err)
		return
	}

	for _, source := range config.Sources {
		if source.Name == sourceName {
			tailer = NewTailerFromSource(source, window)
		}
	}

	lineIterator, err := tailer.Tail()
	if err != nil {
		return
	}

	for line := range lineIterator {
		if strings.TrimSpace(line) != "" {
			conn.WriteMessage(1, []byte(line))
		}
	}
}

func router() chi.Router {
	r := chi.NewRouter()

	r.Get("/healthcheck", func(w http.ResponseWriter, r *http.Request) { fmt.Fprintf(w, "Time: %v", time.Now()) })
	r.Get("/sources", handleSources)
	r.Get("/logstream/{source}/{window}", handleLogStream)

	r.Handle("/*", http.FileServer(http.Dir(assetsPath)))

	return r
}

func getDefaultOrigins(port port) []string {
	return []string{
		fmt.Sprintf("http://localhost:%v", port),
		fmt.Sprintf("http://127.0.0.1:%v", port),
	}
}

func main() {
	config, err := getConfig()
	if err != nil {
		logger.Fatal("Error getting config:", err)
	}
	logger.Infof("Config loaded. Sources amount: %v. Servers amount: %v", len(config.Sources), len(config.Servers))

	// Add all configured origins and default local origins to the map
	for _, origin := range append(getDefaultOrigins(config.Port), config.AllowedOrigins...) {
		allowedOrigins[origin] = true
	}

	r := router()

	logger.Infof("Starting server: http://localhost:%v", config.Port)

	if err := http.ListenAndServe(":"+strconv.Itoa(int(config.Port)), r); err != nil {
		logger.Fatal("Can't start server:", err)
	}
}
