package main

import "log"

func main() {
	config, err := getConfig()
	if err != nil {
		log.Fatalln("Error getting config:", err)
	}
	log.Println(config)
}
