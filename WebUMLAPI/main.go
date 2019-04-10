package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"WebUMLAPI/app"
	"WebUMLAPI/controllers"
	"WebUMLAPI/utils"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	log.Println("Running Analytics Server API")
	config := utils.GetConfig()

	router := mux.NewRouter()
	router.Use(app.JwtAuthentication) //attach JWT auth middleware

	router.HandleFunc("/api/v1/user/new", controllers.CreateAccount).Methods("POST")
	router.HandleFunc("/api/v1/user/login", controllers.Authenticate).Methods("POST")
	router.HandleFunc("/api/v1/hello", helloWorld).Methods("GET")
	router.HandleFunc("/api/v1/document/new", controllers.NewDocument).Methods("POST")
	router.HandleFunc("/api/v1/documents", controllers.GetDocuments).Methods("GET")
	router.HandleFunc("/api/v1/snapshots", controllers.GetSnapshots).Methods("GET")
	router.HandleFunc("/api/v1/snapshot", controllers.GetDocumentSnapshot).Methods("GET")
	router.HandleFunc("/api/v1/snapshot", controllers.SaveDocumentSnapshot).Methods("POST")

	srv := &http.Server{
		Handler:      cors.AllowAll().Handler(router),
		Addr:         config["ListenAddress"].(string),
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	err := srv.ListenAndServeTLS("cert.pem", "key.pem")
	//err := srv.ListenAndServe()
	if err != nil {
		log.Fatal("Failed start server")
	}
	defer srv.Close()
}

var helloWorld = func(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World!")
	w.WriteHeader(200)
}
