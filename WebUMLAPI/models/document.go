package models

import (
	u "WebUMLAPI/utils"
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

type NewDocInfo struct {
	Name     string `json:"name"`
	AuthorID int32  `json:"authorID"`
}

func (newDoc *NewDocInfo) SaveNewDoc() map[string]interface{} {
	log.Println(newDoc)
	//Open DB connection
	db, errDB := sql.Open("postgres", u.GetDBParams())
	if errDB != nil {
		resp := u.Message(true, "Server error.")
		return resp
	}
	defer db.Close()

	_, err := db.Query("INSERT INTO \"WebUML\".\"documents\"(creator_id,name) VALUES ($1,$2);",
		newDoc.AuthorID,
		newDoc.Name,
	)
	if err != nil {
		return u.Message(false, "Failed creating document.")
	}

	return u.Message(true, "Document created!")
}

type DocInfo struct {
	DocID    int32
	Name     string
	AuthorID uint `json:"authorID"`
}

func (Doc *DocInfo) GetDocuments() map[string]interface{} {

	log.Println("GetDocuments()", Doc)

	//Open DB connection
	db, errDB := sql.Open("postgres", u.GetDBParams())
	if errDB != nil {
		resp := u.Message(true, "Server error.")
		return resp
	}
	defer db.Close()

	rows, err := db.Query("SELECT id,name,creator_id FROM \"WebUML\".\"documents\" WHERE creator_id=$1;",
		Doc.AuthorID)
	if err != nil {
		return u.Message(false, "Failed get documents.")
	}

	var docs = make([]DocInfo, 0)
	var doc DocInfo
	for rows.Next() {
		err = rows.Scan(&doc.DocID, &doc.Name, &doc.AuthorID)
		if err == nil {
			docs = append(docs, doc)
		}
	}

	resp := u.Message(true, "Sucsessfull!")
	resp["Documents"] = docs
	return resp
}

type DocumentSnapshot struct {
	DocID      uint64
	SnapshotID uint64
	Name       string
	AuthorID   uint
	Data       string
}

func (Doc *DocumentSnapshot) GetDocumentSnapshot() map[string]interface{} {

	log.Println("GetDocumentSnapshots()", Doc.SnapshotID)

	//Open DB connection
	db, errDB := sql.Open("postgres", u.GetDBParams())
	if errDB != nil {
		resp := u.Message(true, "Server error.")
		return resp
	}
	defer db.Close()

	row := db.QueryRow("SELECT snapshot.data FROM \"WebUML\".\"snapshot\" WHERE snapshot.id=$1;",
		Doc.SnapshotID).
		Scan(&Doc.Data)
	if row != nil {
		log.Println(row)
		return u.Message(false, "Failed get snapshot.")
	}

	resp := u.Message(true, "Sucsessfull!")
	resp["SnapshotData"] = Doc
	return resp
}

type SnapshotInfo struct {
	DocID      uint64
	SnapshotID uint64
	Name       string
	AuthorID   uint
	TimeSave   string
}

func (Doc *SnapshotInfo) GetSnapshots() map[string]interface{} {

	log.Println("GetSnapshots()", Doc.DocID)

	//Open DB connection
	db, errDB := sql.Open("postgres", u.GetDBParams())
	if errDB != nil {
		resp := u.Message(true, "Server error.")
		return resp
	}
	defer db.Close()

	rec, err := db.Query(" SELECT "+
		"\"snapshot\".id,"+
		"\"snapshot\".time_save "+
		" FROM "+
		"\"WebUML\".snapshot "+
		" WHERE "+
		"\"WebUML\".\"snapshot\".document=$1",
		Doc.DocID,
	)
	if err != nil {
		log.Println(err)
		return u.Message(false, "Failed get snapshots.")
	}

	var rows = make([]SnapshotInfo, 0)
	var row SnapshotInfo
	for rec.Next() {
		err = rec.Scan(
			&row.SnapshotID,
			&row.TimeSave,
		)
		if err == nil {
			rows = append(rows, row)
		}
	}

	resp := u.Message(true, "Sucsessfull!")
	resp["Snapshots"] = rows
	return resp
}

func (DocS *DocumentSnapshot) SaveDocumentSnapshot() map[string]interface{} {

	log.Println("SaveDocumentSnapshot()", DocS.DocID)

	//Open DB connection
	db, errDB := sql.Open("postgres", u.GetDBParams())
	if errDB != nil {
		resp := u.Message(true, "Server error.")
		return resp
	}
	defer db.Close()

	err := db.QueryRow("SELECT \"WebUML\".\"AddSnapshot\"($1,$2)",
		DocS.DocID, DocS.Data).
		Scan(&DocS.SnapshotID)
	if err != nil {
		log.Println(DocS, err)
		return u.Message(false, "Failed add snapshot.")
	}

	resp := u.Message(true, "Sucsessfull!")
	resp["DocumentSnapshot"] = DocS
	return resp
}
