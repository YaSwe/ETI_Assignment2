package main

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"log"
	"net/http"
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
	router.HandleFunc("/api/accounts/{accountID}", HandleAccountRequest).Methods("GET", "POST", "PUT", "DELETE")
	router.HandleFunc("/api/login", LoginUser).Methods("POST")

	// Shopping Cart Service Routes
	router.HandleFunc("/api/cart/{userID}", AddNewCart).Methods("POST")
	router.HandleFunc("/api/cart/{cartID}/items", AddOrUpdateCartItem).Methods("POST")
	router.HandleFunc("/api/cart/{cartID}/modify/{productID}", ModifyCartItem).Methods("PUT")
	router.HandleFunc("/api/cart/{cartID}/delete/{productID}", DeleteCartItem).Methods("DELETE")
	router.HandleFunc("/api/cart/details/{cartID}", GetCartHandler).Methods("GET")

	// Feedback Service Routes
	router.HandleFunc("/api/feedback/create", AddFeedbackHandler).Methods("POST")
	router.HandleFunc("/api/feedback/{productID}", GetFeedbackHandler).Methods("GET")

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
