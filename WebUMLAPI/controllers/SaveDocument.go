package controllers

import (
	"encoding/json"
	"log"
	"net/http"
)

type SaveDocInfo struct {
	Name   string
	Author string
	Data   string
}

func api_saveDocument(w http.ResponseWriter, r *http.Request) {
	log.Println("Приняты данные")
	var data SaveDocInfo
	if r.Body == nil {
		http.Error(w, "Please send a json data", 400)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), 400)
		log.Println("Ошибка при парсинге JSON", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusOK)
}
