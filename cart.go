package main

import (
	//"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

type ShopCart struct {
	ShopCartID  int     `json:"ShopCartID"`
	ID          int     `json:"ID"`
	Quantity    int     `json:"Quantity"`
	SubTotal    float64 `json:"SubTotal"`
	Total       float64 `json:"Total"`
	DateCreated string  `json:"DateCreated"`
}

type ShopCartItem struct {
	ShopCartID int     `json:"ShopCartID"`
	ProductID  int     `json:"ProductID"`
	Name       string  `json:"Name"`
	Price      float64 `json:"Price"`
	Quantity   int     `json:"Quantity"`
}

func AddNewCart(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID := params["userID"]

	result, err := db.Exec("INSERT INTO ShopCart (ID) VALUES (?)", userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	newCartID, err := result.LastInsertId()
	if err != nil {
		http.Error(w, "Failed to retrieve new cart ID", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]int64{"ShopCartID": newCartID})
}

func AddOrUpdateCartItem(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	cartID := params["cartID"]

	var item ShopCartItem
	err := json.NewDecoder(r.Body).Decode(&item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if the item is already in the cart
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM ShopCartItem WHERE ShopCartID=? AND ProductID=?)", cartID, item.ProductID).Scan(&exists)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if exists {
		// Update the existing item
		_, err = db.Exec("UPDATE ShopCartItem SET Quantity = Quantity + ? WHERE ShopCartID = ? AND ProductID = ?", item.Quantity, cartID, item.ProductID)
	} else {
		// Add a new item
		_, err = db.Exec("INSERT INTO ShopCartItem (ShopCartID, ProductID, Name, Price, Quantity) VALUES (?, ?, ?, ?, ?)", cartID, item.ProductID, item.Name, item.Price, item.Quantity)
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func ModifyCartItem(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	cartID := params["cartID"]
	productID := params["productID"]
	var item ShopCartItem
	err := json.NewDecoder(r.Body).Decode(&item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	_, err = db.Exec("UPDATE ShopCartItem SET Quantity=? WHERE ShopCartID=? AND ProductID=?", item.Quantity, cartID, productID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"message": "Cart item updated successfully"})
}

func DeleteCartItem(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	cartID := params["cartID"]
	productID := params["productID"]

	_, err := db.Exec("DELETE FROM ShopCartItem WHERE ShopCartID = ? AND ProductID = ?", cartID, productID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Item removed successfully")
}

func GetCartItems(cartID string) ([]Product, bool) {
	query := `
        SELECT p.ProductID, p.ProductTitle, p.ProductDesc, p.ProductImage, p.Price, sci.Quantity 
        FROM ShopCartItem sci
        JOIN Products p ON sci.ProductID = p.ProductID
        WHERE sci.ShopCartID = ?`

	rows, err := db.Query(query, cartID)
	if err != nil {
		log.Printf("Could not get cart items: %v", err)
		return nil, false
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		err := rows.Scan(&p.ProductID, &p.ProductTitle, &p.ProductDesc, &p.ProductImage, &p.Price, &p.Quantity)
		if err != nil {
			log.Printf("Could not scan product: %v", err)
			return nil, false
		}
		products = append(products, p)
	}

	return products, len(products) > 0
}

func GetCartHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	cartID := params["cartID"]

	products, found := GetCartItems(cartID)
	if !found {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintln(w, "No products found in cart")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(products)
}
