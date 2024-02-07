package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

var (
	db  *sql.DB
	err error
)

func main() {
	db, err = sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/eti_assignment")

	if err != nil {
		panic(err.Error())
	}

	router := mux.NewRouter()

	// Product Service Routes
	router.HandleFunc("/api/products", SearchProducts).Methods("GET")
	router.HandleFunc("/api/products/{productID}", HandleProductRequest).Methods("GET")

	router.HandleFunc("/api/categories/{categoryID}", HandleCategoryRequest).Methods("GET", "POST", "PUT", "DELETE")
	router.HandleFunc("/api/categories", SearchCategory).Methods("GET")

	// User Account Service Routes
	router.HandleFunc("/api/accounts/{userID}", HandleAccountRequest).Methods("GET", "POST", "PUT", "DELETE")
	router.HandleFunc("/api/accounts", LoginUser).Methods("POST")

	// Shopping Cart Service Routes
	router.HandleFunc("/api/carts/{userID}", GetCart).Methods("GET")
	router.HandleFunc("/api/carts/{userID}", AddNewCart).Methods("POST")
	router.HandleFunc("/api/carts/{cartID}", AddExistingCart).Methods("PUT")
	router.HandleFunc("/api/carts/{userID}/items", ModifyCartItems).Methods("PUT", "DELETE")
	/*
		// Order Processing Service Routes
		router.HandleFunc("/api/orders", CreateOrder).Methods("POST") // Create a new order
		router.HandleFunc("/api/orders/{orderID}", HandleOrderRequest).Methods("GET", "PATCH") // Get, update specific order

		// Review and Rating Service Routes
		router.HandleFunc("/api/products/{productID}/reviews", GetFeedbackHandler).Methods("GET") // Get all reviews for a product
		router.HandleFunc("/api/products/{productID}/reviews", AddFeedbackHandler).Methods("POST") // Submit a new review for a product
	*/

	// Enable CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},                             // Allow all origins
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},  // Allowed methods
		AllowedHeaders:   []string{"Authorization", "Content-Type"}, // Allowed headers
		AllowCredentials: true,                                      // Allow credentials
		Debug:            true,
	})

	handler := c.Handler(router)

	fmt.Println("Listening at port 1000")
	if err := http.ListenAndServe(":1000", handler); err != nil {
		log.Fatal(err)
	}
}
