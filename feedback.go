package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Feedback represents the structure of feedback data
type Feedback struct {
	Email     string `json:"email"`
	ProductID string `json:"productId"`
	Rating    int    `json:"rating"`
	Comment   string `json:"comment"`
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

	AddFeedback(feedback)

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "Feedback received and saved successfully!")
}

// GetFeedbackHandler handles the GET request to retrieve all feedback
func GetFeedbackHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(GetFeedback())
}

func InsertFeedback(f Feedback) {
	_, err := db.Exec(
		`INSERT INTO feedback (Email, ProductID, Rating, Comment)
		VALUES (?, ?, ?, ?)`, f.Email, f.ProductID, f.Rating, f.Comment)
	if err != nil {
		panic(err.Error())
	}
}
