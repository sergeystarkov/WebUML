package controllers

import (
	"WebUMLAPI/models"
	u "WebUMLAPI/utils"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

var NewDocument = func(w http.ResponseWriter, r *http.Request) {

	newDoc := &models.NewDocInfo{}
	err := json.NewDecoder(r.Body).Decode(newDoc)
	if err != nil {
		log.Println(err)
		u.Respond(w, u.Message(false, "Invalid request"))
		return
	}

	resp := newDoc.SaveNewDoc()
	u.Respond(w, resp)
}

var GetDocuments = func(w http.ResponseWriter, r *http.Request) {

	Doc := &models.DocInfo{}
	Doc.AuthorID = r.Context().Value("user").(uint)

	resp := Doc.GetDocuments()
	u.Respond(w, resp)
}

var GetSnapshots = func(w http.ResponseWriter, r *http.Request) {

	Doc := &models.SnapshotInfo{}
	Doc.AuthorID = r.Context().Value("user").(uint)
	Doc.DocID, _ = strconv.ParseUint(r.Header.Get("DocumentID"), 10, 64)
	resp := Doc.GetSnapshots()
	u.Respond(w, resp)
}

var GetDocumentSnapshot = func(w http.ResponseWriter, r *http.Request) {

	Doc := &models.DocumentSnapshot{}
	Doc.DocID, _ = strconv.ParseUint(r.Header.Get("DocumentID"), 10, 64)

	resp := Doc.GetDocumentSnapshot()
	u.Respond(w, resp)
}
var SaveDocumentSnapshot = func(w http.ResponseWriter, r *http.Request) {

	Doc := &models.DocumentSnapshot{}
	err := json.NewDecoder(r.Body).Decode(Doc)
	if err != nil {
		log.Println(err)
		u.Respond(w, u.Message(false, "Invalid request"))
		return
	}

	resp := Doc.SaveDocumentSnapshot()
	u.Respond(w, resp)
}