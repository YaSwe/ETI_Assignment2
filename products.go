package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"net/http"
)

type Product struct {
	ProductID    int     `json:"ProductID"`
	ProductTitle string  `json:"ProductTitle"`
	ProductDesc  string  `json:"ProductDesc"`
	ProductImage string  `json:"ProductImage"`
	Price        float64 `json:"Price"`
	Quantity     int     `json:"Quantity"`
}

func HandleProductRequest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	productID := params["productID"]

	if val, ok := isProductExist(productID); ok {
		json.NewEncoder(w).Encode(val)
	} else {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "Invalid Product ID")
	}
}

func SearchProducts(w http.ResponseWriter, r *http.Request) {
	querystringmap := r.URL.Query()
	searchQuery := querystringmap.Get("search")

	if value := searchQuery; len(value) > 0 {
		results, found := searchByTitleAndDesc(searchQuery)
		if !found {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintf(w, "No product found")
		} else {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(struct {
				Products map[string]Product `json:"Products"`
			}{results})
		}
	} else {
		productsWrapper := struct {
			Products map[string]Product `json:"Products"`
		}{getProducts()}
		json.NewEncoder(w).Encode(productsWrapper)
		return
	}
}

func GetCategory(w http.ResponseWriter, r *http.Request) map[string]Product {
	params := mux.Vars(r)
	categoryID := params["categoryID"]

	results, err := db.Query("SELECT p.* FROM CatProduct cp INNER JOIN product p ON cp.ProductID=p.ProductID WHERE cp.CategoryID=? ORDER BY p.ProductTitle asc", categoryID)
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

	return products
}

func isProductExist(id string) (Product, bool) {
	var p Product

	result := db.QueryRow("SELECT * FROM products WHERE ProductID=?", id)
	err := result.Scan(&id, &p.ProductTitle, &p.ProductDesc, &p.ProductImage, &p.Price, &p.Quantity)
	if err == sql.ErrNoRows {
		return p, false
	}

	return p, true
}

func getProducts() map[string]Product {
	results, err := db.Query("SELECT * FROM products")
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

	return products
}

func searchByTitleAndDesc(query string) (map[string]Product, bool) {
	results, err := db.Query("SELECT * FROM products WHERE LOWER(ProductTitle) LIKE LOWER(?) OR LOWER(ProductDesc) LIKE LOWER(?)", "%"+query+"%", "%"+query+"%")
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
