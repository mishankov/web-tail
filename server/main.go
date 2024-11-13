package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
	"web-tail/pkg/logging"

	"github.com/go-chi/chi/v5"
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

func router() chi.Router {
	r := chi.NewRouter()

	r.Get("/healthcheck", func(w http.ResponseWriter, r *http.Request) { fmt.Fprintf(w, "Time: %v", time.Now()) })
	r.Get("/sources", handleSources)

	r.Handle("/*", http.FileServer(http.Dir("public")))

	return r
}

func main() {
	config, err := getConfig()
	if err != nil {
		logger.Fatal("Error getting config:", err)
	}
	logger.Infof("Config loaded. Sources amount: %v. Severs amount: %v", len(config.Sources), len(config.Servers))

	r := router()

	logger.Infof("Starting server: http://localhost:%v", config.Port)

	if err := http.ListenAndServe(":"+strconv.Itoa(int(config.Port)), r); err != nil {
		logger.Fatal("Can't start server:", err)
	}
}
