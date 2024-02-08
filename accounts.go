package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"io"
	"log"
	"net/http"
)

type Account struct {
	ID        string `json:"ID"`
	Name      string `json:"Name"`
	Email     string `json:"Email"`
	Password  string `json:"Password"`
	CreatedAt string `json:"Created At"`
	UserType  string `json:"UserType"`
}

func HandleAccountRequest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	accountID := params["accountID"]

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}

	// Create account
	if r.Method == "POST" {
		var data Account

		if err := json.Unmarshal(body, &data); err == nil {
			InsertAccount(data)
			w.WriteHeader(http.StatusCreated)
		} else {
			fmt.Println(err)
		}
	} else if r.Method == "PUT" {
		var data Account
		if err := json.Unmarshal(body, &data); err == nil {
			if _, ok := IsAccountExist(accountID); ok {
				UpdateAccount(accountID, data)
				w.WriteHeader(http.StatusOK)
			} else {
				w.WriteHeader(http.StatusNotFound)
				fmt.Fprintf(w, "Account ID does not exist")
			}
		} else {
			fmt.Println(err)
		}
	} else if val, ok := IsAccountExist(accountID); ok {
		if r.Method == "DELETE" {
			DelAccount(accountID)
		} else {
			json.NewEncoder(w).Encode(val)
		}
	} else {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "Invalid Account ID")
	}
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	var creds struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var account Account
	var cart ShopCart

	// Read the body into a byte slice
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Unmarshal the JSON body into the creds struct
	if err := json.Unmarshal(body, &creds); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = db.QueryRow("SELECT ID, UserType, Name FROM accounts WHERE Email=? AND Password=?", creds.Email, creds.Password).Scan(&account.ID, &account.UserType, &account.Name)
	if err == sql.ErrNoRows {
		http.Error(w, "Invalid login credentials", http.StatusUnauthorized)
		return
	} else if err != nil {
		log.Println(err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// Get active shopping cart
	err = db.QueryRow("SELECT ShopCartID FROM ShopCart WHERE ID=?", account.ID).Scan(&cart.ShopCartID)
	if err != nil && err != sql.ErrNoRows {
		log.Println(err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	account.Email = creds.Email

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"Account": account,
		"Cart":    cart,
	})
}

func IsAccountExist(id string) (Account, bool) {
	var a Account
	var createdAt sql.NullString

	result := db.QueryRow("SELECT * FROM accounts WHERE ID=?", id)
	err := result.Scan(&id, &a.Name, &a.Email, &a.Password, &a.CreatedAt, &a.UserType)
	if err == sql.ErrNoRows {
		return a, false
	}

	// Handle null values
	if createdAt.Valid {
		a.CreatedAt = createdAt.String
	}

	return a, true
}

func InsertAccount(a Account) {
	_, err := db.Exec(
		`INSERT INTO accounts (Name, Email, Password, CreatedAt, UserType)
		VALUES (?, ?, ?, ?, ?)`, a.Name, a.Email, a.Password, a.CreatedAt, a.UserType)
	if err != nil {
		panic(err.Error())
	}
}

func UpdateAccount(id string, a Account) {
	_, err := db.Exec(
		"UPDATE accounts SET Name=?, Email=?, Password=?, CreatedAt=?, UserType=? WHERE ID=?",
		a.Name, a.Email, a.Password, a.CreatedAt, a.UserType, id)
	if err != nil {
		panic(err.Error())
	}
}

func DelAccount(id string) (int64, error) {
	result, err := db.Exec("DELETE from accounts WHERE ID=?", id)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}
