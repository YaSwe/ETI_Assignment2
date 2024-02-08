package main

import (
	//"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	//"io"
	"net/http"
)

// Feedback represents the structure of feedback data
type Feedback struct {
	FeedbackID  int    `json:"FeedbackID"`
	AccountID   int    `json:"AccountID"`
	AccountName string `json:"AccountName"`
	ProductID   int    `json:"ProductID"`
	Rating      int    `json:"Rating"`
	Comment     string `json:"Comment"`
}

// FeedbackRepository simulates a database for storing feedback
var FeedbackRepository []Feedback

// AddFeedback saves the feedback to the repository
func AddFeedback(feedback Feedback) {
	FeedbackRepository = append(FeedbackRepository, feedback)
}

// GetFeedback retrieves all feedback from the repository
func GetFeedback() []Feedback {
	return FeedbackRepository
}

// AddFeedbackHandler handles the POST request to add feedback
func AddFeedbackHandler(w http.ResponseWriter, r *http.Request) {
	var feedback Feedback
	err := json.NewDecoder(r.Body).Decode(&feedback)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	insertFeedback(feedback)
	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "Feedback received and saved successfully!")
}

// GetFeedbackHandler handles the GET request to retrieve all feedback
func GetFeedbackHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	productID := params["productID"]

	feedbacks := getFeedback(productID) // Retrieve feedback based on productID
	if feedbacks == nil {
		feedbacks = make(map[string]Feedback) // Initialize if nil to avoid null in JSON
	}

	feedbackWrapper := struct {
		Feedbacks map[string]Feedback `json:"Feedbacks"`
	}{feedbacks}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(feedbackWrapper) // Encode the feedbackWrapper as JSON
}

func insertFeedback(f Feedback) {
	_, err := db.Exec(
		`INSERT INTO feedback (AccountID, AccountName, ProductID, Rating, Comment)
		VALUES (?, ?, ?, ?, ?)`, f.AccountID, f.AccountName, f.ProductID, f.Rating, f.Comment)
	if err != nil {
		panic(err.Error())
	}
}

func getFeedback(productID string) map[string]Feedback {
	results, err := db.Query("SELECT * FROM feedback WHERE ProductID=?", productID)
	if err != nil {
		panic(err.Error())
	}

	var feedbacks map[string]Feedback = map[string]Feedback{}

	for results.Next() {
		var f Feedback
		var id string

		err := results.Scan(&f.FeedbackID, &f.AccountID, &f.AccountName, &f.ProductID, &f.Rating, &f.Comment)
		if err != nil {
			panic(err.Error())
		}
		feedbacks[id] = f
	}

	return feedbacks
}
