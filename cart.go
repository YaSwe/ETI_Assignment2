package main

import (
	//"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
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

func GetCart(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	cartID := params["cartID"]

	results, found := GetCartItems(cartID)
	if !found {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "No product found")
	} else {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(struct {
			Products map[string]Product `json:"Products"`
		}{results})
	}
}

func AddNewCart(w http.ResponseWriter, r *http.Request) {
	//params := mux.Vars(r)
	//userID := params["userID"]

}

func AddExistingCart(w http.ResponseWriter, r *http.Request) {

}

func ModifyCartItems(w http.ResponseWriter, r *http.Request) {

}

func GetCartItems(cartID string) (map[string]Product, bool) {
	results, err := db.Query(`SELECT sc.*, (sc.Price*sc.Quantity) AS Total, p.Quantity AS pQuan, p.ProductImage
		FROM ShopCartItem sc INNER JOIN product p ON sc.ProductID = p.ProductID WHERE ShopCartID=?`, cartID)
	if err != nil {
		panic(err.Error())
	}

	var products map[string]Product = map[string]Product{}

	for results.Next() {
		var p Product
		var id string

		err := results.Scan(&id, &p.ProductTitle, &p.ProductDesc, &p.ProductImage, &p.Price, &p.Quantity)
		if err != nil {
			panic(err.Error())
		}
		products[id] = p
	}

	if len(products) == 0 {
		return products, false
	}
	return products, true
}
