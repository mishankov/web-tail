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

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
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

	config, err := getConfig()
	if err != nil {
		logger.Error("Error getting config:", err)
		return
	}

	upgrader.CheckOrigin = func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		return config.AllowedOrigins.Match(origin)
	}

	conn, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		logger.Error("Error upgrading to ws:", err)
		return
	}

	var tailer Tailer

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

func main() {
	config, err := getConfig()
	if err != nil {
		logger.Fatal("Error getting config:", err)
	}
	logger.Infof("Config loaded. Sources amount: %v. Servers amount: %v. Allowed origins: %v", len(config.Sources), len(config.Servers), config.AllowedOrigins)

	r := router()

	logger.Infof("Starting server: http://localhost:%v", config.Port)

	if err := http.ListenAndServe(":"+strconv.Itoa(int(config.Port)), r); err != nil {
		logger.Fatal("Can't start server:", err)
	}
}
