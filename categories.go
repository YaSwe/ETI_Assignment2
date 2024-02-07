package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"io"
	"net/http"
)

type Category struct {
	CategoryID int    `json:"CategoryID"`
	CatName    string `json:"CatName"`
	CatDesc    string `json:"CatDesc"`
	CatImage   string `json:"CatImage"`
}

func HandleCategoryRequest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	categoryID := params["categoryID"]

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}

	if r.Method == "POST" {
		var data Category

		if err := json.Unmarshal(body, &data); err == nil {
			insertCategory(data)
			w.WriteHeader(http.StatusCreated)
		} else {
			fmt.Println(err)
		}
	} else if r.Method == "PUT" {
		var data Category
		if err := json.Unmarshal(body, &data); err == nil {
			if _, ok := isCategoryExist(categoryID); ok {
				updateCategory(categoryID, data)
				w.WriteHeader(http.StatusOK)
			} else {
				w.WriteHeader(http.StatusNotFound)
				fmt.Fprintf(w, "Category ID does not exist")
			}
		} else {
			fmt.Println(err)
		}

	} else if val, ok := isCategoryExist(categoryID); ok {

		if r.Method == "DELETE" {
			delCategory(categoryID)

		} else {
			json.NewEncoder(w).Encode(val)
		}
	} else {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "Invalid Category ID")
	}
}

func SearchCategory(w http.ResponseWriter, r *http.Request) {
	querystringmap := r.URL.Query()
	searchQuery := querystringmap.Get("search")

	if value := searchQuery; len(value) > 0 {
		results, found := searchById(searchQuery)
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
		categoriesWrapper := struct {
			Categories map[string]Category `json:"Categories"`
		}{getCategories()}
		json.NewEncoder(w).Encode(categoriesWrapper)
		return
	}
}

func isCategoryExist(id string) (Category, bool) {
	var c Category

	result := db.QueryRow("SELECT * FROM category WHERE CategoryID=?", id)
	err := result.Scan(&id, &c.CatName, &c.CatDesc, &c.CatImage)
	if err == sql.ErrNoRows {
		return c, false
	}

	return c, true
}

func getCategories() map[string]Category {
	results, err := db.Query("SELECT * FROM category")
	if err != nil {
		panic(err.Error())
	}

	var categories map[string]Category = map[string]Category{}

	for results.Next() {
		var c Category
		var id string

		err := results.Scan(&id, &c.CatName, &c.CatDesc, &c.CatImage)
		if err != nil {
			panic(err.Error())
		}
		categories[id] = c
	}

	return categories
}

func insertCategory(c Category) {
	_, err := db.Exec(
		`INSERT INTO category (CatName, CatDesc, CatImage)
		VALUES (?, ?, ?)`, c.CatName, c.CatDesc, c.CatImage)
	if err != nil {
		panic(err.Error())
	}
}

func updateCategory(id string, c Category) {
	_, err := db.Exec(
		"UPDATE category SET CatName=?, CatDesc=?, CatImage=? WHERE CategoryID=?", c.CatName, c.CatDesc, c.CatImage, id)
	if err != nil {
		panic(err.Error())
	}
}

func delCategory(id string) (int64, error) {
	result, err := db.Exec("DELETE from category WHERE CategoryID=?", id)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}

func searchById(categoryID string) (map[string]Product, bool) {
	results, err := db.Query("SELECT p.* FROM CatProduct cp INNER JOIN products p ON cp.ProductID=p.ProductID WHERE cp.CategoryID=? ORDER BY p.ProductTitle asc", categoryID)
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
