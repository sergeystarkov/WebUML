package models

import (
	u "WebUMLAPI/utils"
	"database/sql"
	"log"
	"os"

	"github.com/dgrijalva/jwt-go"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

/*
JWT claims struct
*/ 
type Token struct {
	UserId uint
	jwt.StandardClaims
}

//user account
type Account struct {
	ID		 uint
	Login    string `json:"login"`
	Password string `json:"password"`
	Token    string `json:"token"`
}

//Validate incoming user details...
func (account *Account) Validate() (map[string]interface{}, bool) {

	//Email must be unique
	//temp := &Account{}

	//check for errors and duplicate emails
	//err := GetDB().Table("accounts").Where("email = ?", account.Email).First(temp).Error
	/*if err != nil && err != gorm.ErrRecordNotFound {
		return u.Message(false, "Connection error. Please retry"), false
	}
	if temp.Email != "" {
		return u.Message(false, "Email address already in use by another user."), false
	}
	*/
	return u.Message(false, "Requirement passed"), true
}

func (account *Account) Create() map[string]interface{} {

	if resp, ok := account.Validate(); !ok {
		return resp
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(account.Password), bcrypt.DefaultCost)

	//Open DB connection
	db, errDB := sql.Open("postgres", u.GetDBParams())
	if errDB != nil {
		resp := u.Message(true, "Server error.")
		return resp
	}
	defer db.Close()

	var CreateUser int
	err := db.QueryRow("SELECT \"WebUML\".\"CreateUser\"($1,$2,$3);",
		account.Login,
		string(hashedPassword),
		1,
	).Scan(&CreateUser)

	if CreateUser <= 0 || err != nil {
		return u.Message(false, "Failed to create account, connection error.")
	}

	account.ID = uint(CreateUser)

	//Create new JWT token for the newly registered account
	tk := &Token{UserId: account.ID}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
	account.Token = tokenString

	account.Password = "" //delete password

	response := u.Message(true, "Account has been created")
	response["account"] = account
	return response
}

func Login(login, password string) map[string]interface{} {

	account := &Account{}
	account.Login = login
	account.Password = password

	//Open DB connection
	db, errDB := sql.Open("postgres", u.GetDBParams())
	if errDB != nil {
		resp := u.Message(true, "Server error.")
		return resp
	}
	defer db.Close()

	row, err := db.Query("SELECT id, pass FROM \"WebUML\".\"users\" WHERE name=$1", account.Login )
	if err != nil {
		return u.Message(false, "Connection error or login not found.")
		log.Println(err)
	}
	row.Next()
	var HashedPassword string
	row.Scan(&account.ID, &HashedPassword)

	// Comparing the password with the hash
	err = bcrypt.CompareHashAndPassword([]byte(HashedPassword), []byte(account.Password))
	if err != nil { //Password does not match!
		return u.Message(false, "Invalid login credentials. Please try again")
	}

	//Worked! Logged In
	account.Password = ""

	//Create JWT token
	tk := &Token{UserId: account.ID}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
	account.Token = tokenString //Store the token in the response

	resp := u.Message(true, "Logged In")
	resp["account"] = account
	return resp
}

func GetUser(u uint) *Account {

	acc := &Account{}
	/*//GetDB().Table("accounts").Where("id = ?", u).First(acc)
	if acc.Login == "" { //User not found!
		return nil
	}

	acc.Password = ""*/
	return acc
}
