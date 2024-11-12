package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
	"web-tail/pkg/logging"
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

	_, err = w.Write(sourcesJson)
	if err != nil {
		logger.Error("Error writing response for sources:", err)
	}
}

func main() {
	config, err := getConfig()
	if err != nil {
		logger.Fatal("Error getting config:", err)
	}
	logger.Infof("Config loaded. Sources amount: %v. Severs amount: %v", len(config.Sources), len(config.Servers))

	http.HandleFunc("/healthcheck", func(w http.ResponseWriter, r *http.Request) { fmt.Fprintf(w, "Time: %v", time.Now()) })
	http.HandleFunc("/sources", handleSources)
	http.Handle("/", http.FileServer(http.Dir("public")))

	logger.Infof("Starting server: http://localhost:%v", config.Port)

	if err := http.ListenAndServe(":"+strconv.Itoa(int(config.Port)), nil); err != nil {
		logger.Fatal("Can't start server:", err)
	}
}
