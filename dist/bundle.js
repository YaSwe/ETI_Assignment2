/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/account.js":
/*!************************!*\
  !*** ./src/account.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");


const account = (() => {
    let url = 'http://localhost:1000/api/accounts';

    const createAccount = (accountData) => {
        let request = new XMLHttpRequest();
        request.open('POST', url + "/id");
        
        request.onload = function() {
            if (request.status == 201) {
                window.location.href='login.html';
                return;
            } 
        }
        request.send(JSON.stringify(accountData));
        //dom.displayMessage('signup', 'error');
    }

    const checkLogin = (email, password) => {
        let loginURL = 'http://localhost:1000/api/login';
        let request = new XMLHttpRequest();
        request.open('POST', loginURL);
    
        request.onload = function() {
            // If email and password are found
            if (request.status == 200) {
                let responseData = JSON.parse(this.response);
                console.log(responseData);
                let accountData = responseData.Account;
                let cartData = responseData.Cart;
                localStorage.setItem('accountID', accountData.ID);
                localStorage.setItem('userType', accountData.UserType);
                localStorage.setItem('accountName', accountData.Name);

                // Check for and store active cart information if present
                if (cartData && cartData.ShopCartID) {
                    localStorage.setItem('cartID', cartData.ShopCartID.toString());
                    //localStorage.setItem('numCartItem', cartData.Quantity.toString());
                } else {
                    // Handle the case where there is no active cart
                    localStorage.removeItem('cartID');
                    //localStorage.setItem('numCartItem', '0');
                }

                window.location.href = 'index.html';
                return;
            } 
        }
        request.send(JSON.stringify({ email: email, password: password }));
        // If email and password not found
        //dom.displayLoginError();
    };

    const getAccount = (callback) => {
        let searchURL = url + `/${localStorage.getItem('accountID')}`;
        let request = new XMLHttpRequest();
        request.open('GET', searchURL);

        request.onload = function() {
            let accountData = JSON.parse(this.response);
            callback(accountData);
        }
        request.send();
    }

    const updateAccount = (accountData) => {
        const accountID = localStorage.getItem('accountID');
        let updateURL = url + "/" + accountID;
         
        let request = new XMLHttpRequest();
        request.open('PUT', updateURL);

        request.onload = function() {
            if (request.status == 200) {
                // Display account update success
                //dom.displayMessage('update', 'success');
                return;
            } 
        }
        request.send(JSON.stringify(accountData));
        //dom.displayMessage('update', 'error');
    }

    const deleteAccount = () => {
        const accountID = localStorage.getItem('accountID');
        let deleteURL = url + "/" + accountID;
        
        let request = new XMLHttpRequest();
        request.open('DELETE', deleteURL);

        request.onload = function() {
            if (request.status == 200) {
                // Remove the account ID and user type in local storage
                localStorage.removeItem('accountID');

                // Display account deletion success
                //dom.displayMessage('delete', 'success');
                setTimeout(() => {
                    // 5 second delay and return to login form
                    //dom.displayLoginForm();
                    //dom.userLoggedOut();
                }, 5000);
                return;
            } 
        }
        request.send();
        // Display error
        //dom.displayMessage('delete', 'error');
    }

    return {
        createAccount,
        checkLogin,
        getAccount,
        updateAccount,
        deleteAccount,
    }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (account);



/***/ }),

/***/ "./src/cart.js":
/*!*********************!*\
  !*** ./src/cart.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");


const cart = (() => {
    let cartUrl = 'http://localhost:1000/api/cart';

    const createNewCart = (userID, callback) => {
        fetch(`${cartUrl}/${userID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: userID }) // Make sure your API expects the body in this format
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create new cart');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.ShopCartID) {
                callback(data.ShopCartID.toString());
            } else {
                throw new Error('Invalid cart data');
            }
        })
        .catch(error => console.error('Error creating new cart:', error));
    };

    const addOrUpdateCartItem = (cartID, productID, quantity, name, price, callback) => {
        let itemData = {
            ProductID: parseInt(productID, 10),
            Quantity: quantity,
            Name: name,
            Price: parseFloat(price) 
        };
    
        fetch(`${cartUrl}/${cartID}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to add or update cart item: ${response.statusText}`);
            }
            if (response.status === 204 || response.headers.get("Content-Length") === "0") {
                // If the response is 204 No Content, or if there's no content, don't try to parse it
                return null;
            }
            return response.json(); // Only parse as JSON if response has content
        })
        .then(data => {
            if (data) { // Make sure data exists before logging it
                console.log('Cart item added/updated successfully:', data);
            }
            callback();
        })
        .catch(error => console.error('Error:', error));
    };

    const getCartItems = (cartID, callback) => {
        let url = `${cartUrl}/details/${cartID}`;

        fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error:', error));
    }

    const modifyCartItem = (cartID, productID, newQuantity, callback) => {
        let itemData = {
            Quantity: parseInt(newQuantity, 10)
        };
        
        fetch(`${cartUrl}/${cartID}/modify/${productID}`, { // Make sure this matches the correct endpoint
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to modify cart item: ${response.statusText}`);
            }
            if (response.status === 204 || response.headers.get("Content-Length") === "0") {
                return null;
            }
            return response.json(); 
        })
        .then(data => {
            callback();
        })
        .catch(error => console.error('Error:', error));
    };

    const deleteCartItem = (cartID, productID, callback) => {
        fetch(`${cartUrl}/${cartID}/delete/${productID}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to delete cart item: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                console.log('Cart item deleted successfully:', data);
            }
            callback();
        })
        .catch(error => console.error('Error:', error));
    };


    
    return {
        createNewCart,
        addOrUpdateCartItem,
        getCartItems,
        modifyCartItem,
        deleteCartItem,
    }

})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cart);

/***/ }),

/***/ "./src/category.js":
/*!*************************!*\
  !*** ./src/category.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");


const category = (() => {    
    let url = 'http://localhost:1000/api/categories';

    const getCategories = (callback) => {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        
        request.onload = function() {
            let data = JSON.parse(this.response);
            callback(data);
        }
        request.send();
    }

    const getSelectedCategory = (categoryID, callback) => {
        let categoryUrl = url + `?search=${categoryID}`;
        let request = new XMLHttpRequest();
        request.open('GET', categoryUrl);

        request.onload = function() {
            let data = JSON.parse(this.response);
            callback(data);
        }
        request.send();
    }

    return {
        getCategories,
        getSelectedCategory,
    }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (category);

/***/ }),

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cart__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cart */ "./src/cart.js");


const dom = (() => {
    const isUserLoggedIn = () => {
        const authLinks = document.getElementById('authLinks');
        const logoutLink = document.getElementById('logoutLink');
        const accountLink = document.getElementById('accountLink');

        const isLoggedIn = localStorage.getItem('accountID') !== null;

        if (isLoggedIn) {
            // Hide login and register links
            authLinks.style.display = 'none';

            // Show account and logout links
            logoutLink.style.display = 'flex';
            accountLink.style.display = "flex";
        }
        else {
            authLinks.style.display = 'flex';
            logoutLink.style.display = 'none';
            accountLink.style.display = 'none';
        } 
    }

    const displayAllCategories = (data) => {
        const categoryListings = document.querySelector('.category-listings');
        if (categoryListings) {
            let keys = Object.keys(data.Categories);

            keys.forEach((key) => {
                categoryListings.innerHTML += `
                    <div class="card category" data-link-categoryid="${key}">
                        <img src="assets/${data.Categories[key]["CatImage"]}" data-link-categoryid="${key}">
                        <button class="categoryBtn" data-link-categoryid="${key}">${data.Categories[key]["CatName"]}</button>
                    </div>
                `;
            })
        }
    }

    const displayAllProducts = (data) => {
        const productListings = document.querySelector('.product-listings');

        const createProductBtn =  document.querySelector('.createProductBtn');
        if (localStorage.getItem('userType') == 'user' && createProductBtn) {
            createProductBtn.style.display = 'none';
        } 

        let keys = Object.keys(data.Products);

        if (productListings) {
            keys.forEach((key) => {
                productListings.innerHTML += `
                    <div class="card product" data-link-productID="${key}">
                        <img src="assets/products/${data.Products[key]["ProductImage"]}" data-link-productID="${key}">
                        <div class="product-name">${data.Products[key]["ProductTitle"]}</div>
                        <div class="product-price">$${data.Products[key]["Price"]}</div>
                    </div>
                `;
            })
        }
        else {
            localStorage.setItem('products', null);
        }
    }

    const displayProductDetails = (productData) => {
        const productDetails = document.querySelector('.productDetails-container');
        const productImage = document.querySelector('.main-image');
        const productTitle = document.querySelector('.product-title');
        const productDesc = document.querySelector('.product-description');
        const productPrice = document.querySelector('.price');

        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        const quantityInput = document.querySelector('#quantity-input');
        const increaseQBtn = document.querySelector('.increase-quantity');
        const decreaseQBtn = document.querySelector('.decrease-quantity');
        const createReviewBtn = document.querySelector('.submitCreateFeedback-btn');

        if (productDetails) {
            productImage.src = `assets/products/${productData['ProductImage']}`;
            productTitle.textContent = productData['ProductTitle'];
            productDesc.textContent = productData['ProductDesc'];
            productPrice.textContent = '$' + productData['Price'];

            addToCartBtn.setAttribute('data-productid', productData['ProductID']);
            quantityInput.setAttribute('data-productid', productData['ProductID']);
            increaseQBtn.setAttribute('data-productid', productData['ProductID']);
            decreaseQBtn.setAttribute('data-productid', productData['ProductID']);
            createReviewBtn.setAttribute('data-productid', productData['ProductID']);
        }
        else
        {
            localStorage.setItem('product', null);
        }
    }

    const changeItemQuantity = (action) => {
        let itemQuantityInput = document.querySelector('#quantity-input');
        let itemQuantity = parseInt(itemQuantityInput.value, 10);

        if (action === 'increase') {
            itemQuantity += 1;
        } 
        else if (action === 'decrease' && itemQuantity > 0) {
            itemQuantity -= 1; 
        }

        itemQuantityInput.value = itemQuantity; 
    }

    const updateQuantity = (productId, newQuantity) => {
        _cart__WEBPACK_IMPORTED_MODULE_0__["default"].modifyCartItem(localStorage.getItem('cartID'), productId, newQuantity, () => {
            /*
            if (error) {
                console.error('Error updating cart item:', error);
            } else {
                refreshCartItemDisplay(productId, newQuantity);
            }*/
            populateShoppingCart();
        });
    }
    
    const deleteCartItem = (productId) => {
        _cart__WEBPACK_IMPORTED_MODULE_0__["default"].deleteCartItem(localStorage.getItem('cartID'), productId, (error, data) => {
            if (error) {
                console.error('Error deleting cart item:', error);
            } else {
                console.log('Cart item deleted:', data);
                removeCartItemDisplay(productId);
            }
        });
    }
    
    const populateShoppingCart = () => {
        const cartID = localStorage.getItem('cartID');
        if (!cartID) {
            console.error('No cart found.');
            return;
        }

        _cart__WEBPACK_IMPORTED_MODULE_0__["default"].getCartItems(cartID, (items) => {
            const cartItemsContainer = document.querySelector('.cart-items');
            cartItemsContainer.innerHTML = '';
            items.forEach(item => {
                displayProductInCart(item);
            });
            updateCartSummary(items);
        });
    };

    const displayProductInCart = (item) => {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="assets/products/${item.ProductImage}" alt="${item.ProductTitle}">
            <span>${item.ProductTitle}</span>
            <div class="quantity-section">
                <button class="quantity-btn decrease-quantity" data-productid="${item.ProductID}"><ion-icon name="remove-outline"></ion-icon></button>
                <input type="number" id="quantity-input" value="${item.Quantity}" min="0" data-productid="${item.ProductID}">
                <button class="quantity-btn increase-quantity" data-productid="${item.ProductID}"><ion-icon name="add-outline"></ion-icon></button>
            </div>
            <span class="cart-price">$${item.Price}</span>
            <button class="delCartItemBtn" data-productid="${item.ProductID}"><ion-icon name="close-outline"></ion-icon></button>
        `;
        cartItemsContainer.appendChild(cartItemElement);

        // Reattach event listeners to newly added elements
        attachQuantityUpdateListeners(cartItemElement, item.ProductID);
    }

    const refreshCartItemDisplay = (productId, newQuantity) => {
        // Update the displayed quantity in the cart item
        const itemElement = document.querySelector(`.cart-item[data-productid="${productId}"] input[type="number"]`);
        if (itemElement) {
            itemElement.value = newQuantity;
        }
        updateCartSummary();
    };
    
    const removeCartItemDisplay = (productId) => {
        // Remove the cart item element from the DOM
        const itemElement = document.querySelector(`.cart-item[data-productid="${productId}"]`);
        if (itemElement) {
            itemElement.remove();
        }
        updateCartSummary();
    };
    
    const updateCartSummary = (items) => {
        // Calculate total price and item count
        let total = 0;
        let itemCount = 0;

        items.forEach(item => {
            total += item.Price * item.Quantity;
            itemCount += item.Quantity;
        });

        // Update the total price and item count in the summary section
        const totalPriceElement = document.querySelector('.summary .total-price span:last-child');
        const itemCountElement = document.querySelector('.cart-header p');
        const itemCountElement2 = document.querySelector('.summary-items span');

        if (totalPriceElement && itemCountElement) {
            totalPriceElement.textContent = `$${total.toFixed(2)}`;
            itemCountElement.textContent = `${itemCount} items`;
            itemCountElement2.textContent = `${itemCount} items`;
        }
    };

    const attachQuantityUpdateListeners = (cartItemElement, productID) => {
        const decreaseButton = cartItemElement.querySelector('.decrease-quantity');
        const increaseButton = cartItemElement.querySelector('.increase-quantity');
        const deleteButton = cartItemElement.querySelector('.delCartItemBtn');
        const quantityInput = cartItemElement.querySelector('#quantity-input');
    
        decreaseButton.addEventListener('click', () => {
            const newQuantity = Math.max(0, parseInt(quantityInput.value, 10) - 1);
            if (newQuantity > 0) {
                updateQuantity(productID, newQuantity);
            } else {
                deleteCartItem(productID);
            }
        });
    
        increaseButton.addEventListener('click', () => {
            const newQuantity = parseInt(quantityInput.value, 10) + 1;
            updateQuantity(productID, newQuantity);
        });
    
        deleteButton.addEventListener('click', () => {
            deleteCartItem(productID);
        });
    };

    const displayFeedback = (data) => {
        const reviewListings = document.querySelector('.review-listings');
        if (reviewListings) {
            let keys = Object.keys(data.Feedbacks);

            keys.forEach((key) => {
                reviewListings.innerHTML += `
                    <div class="review-container">
                        <h3 class="review-title">${data.Feedbacks[key]["Comment"]}<span>${data.Feedbacks[key]["AccountName"]}</span></h3>
                        <hr>
                        <p class="review-desc">${data.Feedbacks[key]["Comment"]}</p>
                    </div>
                `;
            })
            
        }
    }

    return {
        isUserLoggedIn,
        displayAllCategories,
        displayAllProducts,
        displayProductDetails,
        changeItemQuantity,
        updateQuantity,
        deleteCartItem,
        populateShoppingCart,
        updateCartSummary,
        displayFeedback,
    }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (dom);

/***/ }),

/***/ "./src/feedback.js":
/*!*************************!*\
  !*** ./src/feedback.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");


document.addEventListener('DOMContentLoaded', () => {
    const feedback = JSON.parse(localStorage.getItem('feedback'));
    if (feedback) {
        _dom__WEBPACK_IMPORTED_MODULE_0__["default"].displayFeedback(feedback);
    }
})

const feedback = (() => {
    let url = 'http://localhost:1000/api/feedback';

    const getFeedback = (productID, callback) => {
        let searchUrl = `${url}/${productID}`; 
        let request = new XMLHttpRequest();
        request.open('GET', searchUrl);
    
        request.onload = function() {
            console.log(this.response)
            // First, check if the response is empty or not a valid JSON before parsing
            if (this.response && this.response.trim() !== '') {
                try {
                    // Try parsing the response. If it's not valid JSON, this will throw an error
                    let data = JSON.parse(this.response);
                    callback(data);
                } catch (e) {
                    // If an error is thrown, log it and optionally handle it
                    console.error("Error parsing JSON response:", e);
                    // Call the callback with null or an appropriate error message
                    callback(null, "Error parsing feedback data");
                }
            } else {
                // If the response is empty or null, handle it as no feedback available
                console.log('No feedback available or empty response.');
                callback(null, "No feedback available or empty response");
            }
        };
    
        request.onerror = function() {
            // Handle network errors
            console.error("Network error occurred");
            callback(null, "Network error");
        };
    
        request.send();
    };

    const createFeedback = (feedbackData) => {
        let request = new XMLHttpRequest();
        request.open('POST', url + "/create");
        
        request.onload = function() {
            if (request.status == 201) {
                return;
            } 
        }
        request.send(JSON.stringify(feedbackData));
        //dom.displayMessage('signup', 'error');
    }

    return {
        getFeedback,
        createFeedback,
    }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (feedback);

/***/ }),

/***/ "./src/handler.js":
/*!************************!*\
  !*** ./src/handler.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");
/* harmony import */ var _account__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./account */ "./src/account.js");
/* harmony import */ var _product__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./product */ "./src/product.js");
/* harmony import */ var _category__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./category */ "./src/category.js");
/* harmony import */ var _feedback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./feedback */ "./src/feedback.js");
/* harmony import */ var _cart__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cart */ "./src/cart.js");







const handler = (() => {

    const handleClicks = () => {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        document.addEventListener('click', (e) => {
            let targetElement = e.target;

            if (targetElement.classList.contains('logoutBtn')) {
                localStorage.removeItem('accountID');
                localStorage.removeItem('userType');
                localStorage.removeItem('accountName');
                window.location.reload();
            }

            if (targetElement.classList.contains('shopBtn')) {
                _product__WEBPACK_IMPORTED_MODULE_2__["default"].getProducts((products) => {
                    localStorage.setItem('products', JSON.stringify(products)); // Save the products in localStorage
                    window.location.href = 'products.html';
                });
            }

            if (targetElement.hasAttribute('data-link-productid')) {
                const productID = e.target.getAttribute('data-link-productid');
                _product__WEBPACK_IMPORTED_MODULE_2__["default"].getSelectedProduct(productID, (productData) => {
                    localStorage.setItem('product', JSON.stringify(productData)); // Save the selected product in localStorage
                });  

                _feedback__WEBPACK_IMPORTED_MODULE_4__["default"].getFeedback(productID, (feedbackData) => {
                    localStorage.setItem('feedback', JSON.stringify(feedbackData));
                })
                window.location.href = 'productDetails.html';
            }

            if (targetElement.hasAttribute('data-link-categoryid')) {
                const categoryID = e.target.getAttribute('data-link-categoryid');
                _category__WEBPACK_IMPORTED_MODULE_3__["default"].getSelectedCategory(categoryID, (products) => {
                    localStorage.setItem('products', JSON.stringify(products)); 
                    window.location.href = 'products.html';
                });
            }

            if (targetElement.getAttribute('id') == 'submitSearch') {
                let searchBarInput = document.querySelector('#search-bar').value;
                _product__WEBPACK_IMPORTED_MODULE_2__["default"].searchProduct(searchBarInput, (products) => {
                    localStorage.setItem('products', JSON.stringify(products)); 
                    window.location.href = 'products.html';
                })
            }

            if (targetElement.classList.contains('cart-link')) {
                const accountID = localStorage.getItem('accountID');
                if (accountID) {
                    const cartID = localStorage.getItem('cartID');
                    if (cartID) {
                        _cart__WEBPACK_IMPORTED_MODULE_5__["default"].getCartItems(cartID, (items) => {
                            // If there are items in the cart, save them and redirect
                            if (items && items.length > 0) {
                                localStorage.setItem('cartItems', JSON.stringify(items));
                                window.location.href = 'shoppingCart.html';
                            } else {
                                window.location.href = 'shoppingCart.html';
                            }
                        });
                    } else {
                        window.location.href = 'shoppingCart.html';
                    }
                } else {
                    window.location.href = 'login.html';
                }
            }

            if (targetElement.classList.contains('createReviewBtn')) {
                if (localStorage.getItem('accountID') == null) {
                    window.location.href = 'login.html';
                }
                else {
                    const modal = document.getElementById("reviewModal");
                    modal.style.display = "block";
                }
            }

            if (targetElement.classList.contains('close-button')) {
                const modal = document.getElementById("reviewModal");
                modal.style.display = "none";
            }

            window.onclick = function(event) {
                const modal = document.getElementById("reviewModal");
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }

            if (targetElement.classList.contains('submitCreateFeedback-btn')) {
                e.preventDefault();
                const productID = e.target.getAttribute('data-productid');
                const accountID = localStorage.getItem('accountID');
                const accountName = localStorage.getItem('accountName');
                const feedbackDescInput = document.querySelector('#reviewDescInput').value;
                let feedbackData = {
                    "AccountID": parseInt(accountID, 10),
                    "AccountName": accountName,
                    "ProductID": parseInt(productID, 10),
                    "Rating": parseInt(5, 10),
                    "Comment": feedbackDescInput
                }
                _feedback__WEBPACK_IMPORTED_MODULE_4__["default"].createFeedback(feedbackData);
                window.location.reload();
            }
        })

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
    
                _account__WEBPACK_IMPORTED_MODULE_1__["default"].checkLogin(email, password);
            })
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const currentDate = new Date().toISOString(); // Get current date in ISO format
                const date = new Date(currentDate);
                const formattedDate = date.toISOString().slice(0, 19).replace('T', ' '); // YYYY-MM-DD HH:MM:SS

                // Create JSON
                let accountData = {
                    "Name": name,
                    "Email": email,
                    "Password": password,
                    "Created At": formattedDate,
                    "UserType": 'user'
                }
                _account__WEBPACK_IMPORTED_MODULE_1__["default"].createAccount(accountData);
            })
        }

        initQuantityControlListeners('.productDetails-container');
        // Shopping Cart page specific event listeners
        if (window.location.pathname.includes('shoppingCart.html')) {
            _dom__WEBPACK_IMPORTED_MODULE_0__["default"].populateShoppingCart();
            initCartPageListeners();
        }

        if (window.location.pathname.includes('productDetails.html')) {
            initProductDetailsListeners();
        }

        if (window.location.pathname.includes('shoppingCart.html')) {
            _dom__WEBPACK_IMPORTED_MODULE_0__["default"].populateShoppingCart();
        }
    }

    const initQuantityControlListeners = (containerSelector) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.addEventListener('click', e => {
            const targetElement = e.target;
            let quantityInput = container.querySelector('#quantity-input');

            if (targetElement.classList.contains('increase-quantity')) {
                quantityInput.value = parseInt(quantityInput.value, 10) + 1;
            } else if (targetElement.classList.contains('decrease-quantity')) {
                quantityInput.value = Math.max(0, parseInt(quantityInput.value, 10) - 1);
            }
        });
    };

    const initCartPageListeners = () => {
        document.querySelectorAll('.cart-item').forEach(item => {
            const decreaseButton = item.querySelector('.decrease-quantity');
            const increaseButton = item.querySelector('.increase-quantity');
            const quantityInput = item.querySelector('input[type=number]'); // Ensure this matches your HTML

            decreaseButton.addEventListener('click', () => {
                quantityInput.value = Math.max(0, parseInt(quantityInput.value, 10) - 1);
            });

            increaseButton.addEventListener('click', () => {
                quantityInput.value = parseInt(quantityInput.value, 10) + 1;
            });
        });
    };

    const initProductDetailsListeners = () => {
        const addToCartButton = document.querySelector('.add-to-cart-btn');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                const productID = addToCartButton.getAttribute('data-productid');
                const quantity = parseInt(document.querySelector('#quantity-input').value, 10);
                const accountID = localStorage.getItem('accountID');
                const price = document.querySelector('.price').textContent;
                const newPrice = price.replace('$', "");
                let name = document.querySelector('.product-title').textContent;
                
                // Check if user is logged in by checking for accountID
                if (!accountID) {
                    // User is not logged in, redirect to login page
                    window.location.href = 'login.html';
                    return;
                }

                let cartID = localStorage.getItem('cartID');
                
                const addProductToCartCallback = () => {
                    _cart__WEBPACK_IMPORTED_MODULE_5__["default"].addOrUpdateCartItem(cartID, productID, quantity, name, newPrice, () => {
                        window.location.href = 'shoppingCart.html';
                    });
                };

                // Proceed only if quantity is more than 0
                if (quantity > 0) {
                    if (!cartID) {
                        _cart__WEBPACK_IMPORTED_MODULE_5__["default"].createNewCart(accountID, (newCartID) => {
                            cartID = newCartID;
                            localStorage.setItem('cartID', cartID);
                            addProductToCartCallback();
                        });
                    } else {
                        addProductToCartCallback();
                    }
                }
            });
        }
    };

    return { handleClicks };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handler);

/***/ }),

/***/ "./src/headerFooter.js":
/*!*****************************!*\
  !*** ./src/headerFooter.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");


const loadHeaderFooter = (() => {
    const loadHeader = () => {
        const headerHTML = `
            <div class="top-nav">
                <a class="logo" href="index.html">
                    <img src="assets/blocks.png" alt="logo">
                    <h2>EcoToy</h2>
                </a>
                <div class="search-container">
                    <ion-icon name="search-outline" id="submitSearch"></ion-icon>
                    <input type="search" id="search-bar" placeholder="Search a product...">
                </div>
                <div class="user-actions">
                    <div id="authLinks">
                        <span><ion-icon name="log-in-outline"></ion-icon><a href="login.html">Login</a></span>
                        <span><ion-icon name="person-add-outline"></ion-icon><a href="register.html">Register</a></span>
                    </div>
                    <span id="accountLink"><ion-icon name="person-outline"></ion-icon><a href="#">Account</a></span>
                    <span id="logoutLink"><ion-icon name="log-out-outline"></ion-icon><a href="#" class="logoutBtn">Logout</a></span>
                    <span class="cart-link"><ion-icon name="basket-outline"></ion-icon>Basket</span>
                </div>
            </div>
            <nav>
                <a class="shopBtn">Shop</a>
                <a href="about.html">About Us</a>
                <a href="contact.html">Contact</a>
            </nav>
        `;

        const headerElement = document.createElement('header');
        headerElement.innerHTML = headerHTML;
        document.body.insertBefore(headerElement, document.body.firstChild);

        _dom__WEBPACK_IMPORTED_MODULE_0__["default"].isUserLoggedIn();
    }

    const loadFooter = () => {
        const footerHTML = `
            <div class="footer-container">
                <div class="footer-column">
                    <h3>Shop</h3>
                    <ul>
                        <li><a href="#">All Products</a></li>
                        <li><a href="#">Best Sellers</a></li>
                        <li><a href="#">New In</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>EcoToy</h3>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>My Account</h3>
                    <ul>
                        <li><a href="#">Login</a></li>
                        <li><a href="#">Orders</a></li>
                        <li><a href="#">Account details</a></li>
                        <li><a href="#">Forgot password</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>General</h3>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                        <li><a href="#">Delivery and Returns</a></li>
                    </ul>
                </div>
                <div class="footer-social-payment">
                    <div class="social-icons">
                        <!-- Use actual icons or images -->
                        <a href="#"><img src="assets/facebook.png" alt="Facebook"></a>
                        <a href="#"><img src="assets/instagram.png" alt="Instagram"></a>
                        <a href="#"><img src="assets/pinterest.png" alt="Pinterest"></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2024 EcoToy. All Rights Reserved | Website by us :3</p>
            </div>
        `;

        const footerElement = document.createElement('footer');
        footerElement.className = "site-footer";
        footerElement.innerHTML = footerHTML;
        document.body.appendChild(footerElement);
    }
   
    return {
        loadHeader,
        loadFooter
    }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (loadHeaderFooter);

/***/ }),

/***/ "./src/product.js":
/*!************************!*\
  !*** ./src/product.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");


document.addEventListener('DOMContentLoaded', () => {
    const products = JSON.parse(localStorage.getItem('products'));
    if (products) {
        _dom__WEBPACK_IMPORTED_MODULE_0__["default"].displayAllProducts(products);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const product = JSON.parse(localStorage.getItem('product'));
    if (product) {
        _dom__WEBPACK_IMPORTED_MODULE_0__["default"].displayProductDetails(product);
    }
})

const product = (() => {    
    let url = 'http://localhost:1000/api/products';

    const getProducts = (callback) => {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        
        request.onload = function() {
            let data = JSON.parse(this.response);
            callback(data);
        }
        request.send();
    }

    const getSelectedProduct = (productID, callback) => {
        let productUrl = url + `/${productID}}`;
        let request = new XMLHttpRequest();
        request.open('GET', productUrl);

        request.onload = function() {
            let productData = JSON.parse(this.response);
            callback(productData);
        }
        request.send();
    }

    const searchProduct = (searchInput, callback) => {
        let searchURL = url + `?search=${searchInput}`;
        let request = new XMLHttpRequest();
        request.open('GET', searchURL);
    
        request.onload = function() {
            let productData = JSON.parse(this.response);
            callback(productData);
        }
        request.send();
    }

    return {
        getProducts,
        getSelectedProduct,
        searchProduct,
    }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (product);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _headerFooter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./headerFooter */ "./src/headerFooter.js");
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./handler */ "./src/handler.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom */ "./src/dom.js");
/* harmony import */ var _category__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./category */ "./src/category.js");





_headerFooter__WEBPACK_IMPORTED_MODULE_0__["default"].loadHeader();
_headerFooter__WEBPACK_IMPORTED_MODULE_0__["default"].loadFooter();

_category__WEBPACK_IMPORTED_MODULE_3__["default"].getCategories((categories) => {
    _dom__WEBPACK_IMPORTED_MODULE_2__["default"].displayAllCategories(categories);
});

_handler__WEBPACK_IMPORTED_MODULE_1__["default"].handleClicks();

if (localStorage.getItem('accountID')) {
    _dom__WEBPACK_IMPORTED_MODULE_2__["default"].isUserLoggedIn();
} 

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsSUFBSSw0Q0FBRztBQUNQIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9hY2NvdW50LmpzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvY2FydC5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2NhdGVnb3J5LmpzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvZmVlZGJhY2suanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9oYW5kbGVyLmpzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvaGVhZGVyRm9vdGVyLmpzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvcHJvZHVjdC5qcyIsIndlYnBhY2s6Ly90ZXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Rlc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Rlc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90ZXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZG9tIGZyb20gJy4vZG9tJztcclxuXHJcbmNvbnN0IGFjY291bnQgPSAoKCkgPT4ge1xyXG4gICAgbGV0IHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEwMDAvYXBpL2FjY291bnRzJztcclxuXHJcbiAgICBjb25zdCBjcmVhdGVBY2NvdW50ID0gKGFjY291bnREYXRhKSA9PiB7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ1BPU1QnLCB1cmwgKyBcIi9pZFwiKTtcclxuICAgICAgICBcclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT0gMjAxKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj0nbG9naW4uaHRtbCc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3Quc2VuZChKU09OLnN0cmluZ2lmeShhY2NvdW50RGF0YSkpO1xyXG4gICAgICAgIC8vZG9tLmRpc3BsYXlNZXNzYWdlKCdzaWdudXAnLCAnZXJyb3InKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGVja0xvZ2luID0gKGVtYWlsLCBwYXNzd29yZCkgPT4ge1xyXG4gICAgICAgIGxldCBsb2dpblVSTCA9ICdodHRwOi8vbG9jYWxob3N0OjEwMDAvYXBpL2xvZ2luJztcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignUE9TVCcsIGxvZ2luVVJMKTtcclxuICAgIFxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIElmIGVtYWlsIGFuZCBwYXNzd29yZCBhcmUgZm91bmRcclxuICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlRGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZURhdGEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFjY291bnREYXRhID0gcmVzcG9uc2VEYXRhLkFjY291bnQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FydERhdGEgPSByZXNwb25zZURhdGEuQ2FydDtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhY2NvdW50SUQnLCBhY2NvdW50RGF0YS5JRCk7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlclR5cGUnLCBhY2NvdW50RGF0YS5Vc2VyVHlwZSk7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYWNjb3VudE5hbWUnLCBhY2NvdW50RGF0YS5OYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgYW5kIHN0b3JlIGFjdGl2ZSBjYXJ0IGluZm9ybWF0aW9uIGlmIHByZXNlbnRcclxuICAgICAgICAgICAgICAgIGlmIChjYXJ0RGF0YSAmJiBjYXJ0RGF0YS5TaG9wQ2FydElEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcnRJRCcsIGNhcnREYXRhLlNob3BDYXJ0SUQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbnVtQ2FydEl0ZW0nLCBjYXJ0RGF0YS5RdWFudGl0eS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZXJlIGlzIG5vIGFjdGl2ZSBjYXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2NhcnRJRCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ251bUNhcnRJdGVtJywgJzAnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdpbmRleC5odG1sJztcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgZW1haWw6IGVtYWlsLCBwYXNzd29yZDogcGFzc3dvcmQgfSkpO1xyXG4gICAgICAgIC8vIElmIGVtYWlsIGFuZCBwYXNzd29yZCBub3QgZm91bmRcclxuICAgICAgICAvL2RvbS5kaXNwbGF5TG9naW5FcnJvcigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBnZXRBY2NvdW50ID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IHNlYXJjaFVSTCA9IHVybCArIGAvJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWNjb3VudElEJyl9YDtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgc2VhcmNoVVJMKTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGFjY291bnREYXRhID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgY2FsbGJhY2soYWNjb3VudERhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB1cGRhdGVBY2NvdW50ID0gKGFjY291bnREYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYWNjb3VudElEID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnRJRCcpO1xyXG4gICAgICAgIGxldCB1cGRhdGVVUkwgPSB1cmwgKyBcIi9cIiArIGFjY291bnRJRDtcclxuICAgICAgICAgXHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ1BVVCcsIHVwZGF0ZVVSTCk7XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgYWNjb3VudCB1cGRhdGUgc3VjY2Vzc1xyXG4gICAgICAgICAgICAgICAgLy9kb20uZGlzcGxheU1lc3NhZ2UoJ3VwZGF0ZScsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3Quc2VuZChKU09OLnN0cmluZ2lmeShhY2NvdW50RGF0YSkpO1xyXG4gICAgICAgIC8vZG9tLmRpc3BsYXlNZXNzYWdlKCd1cGRhdGUnLCAnZXJyb3InKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkZWxldGVBY2NvdW50ID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFjY291bnRJRCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2NvdW50SUQnKTtcclxuICAgICAgICBsZXQgZGVsZXRlVVJMID0gdXJsICsgXCIvXCIgKyBhY2NvdW50SUQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0RFTEVURScsIGRlbGV0ZVVSTCk7XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgYWNjb3VudCBJRCBhbmQgdXNlciB0eXBlIGluIGxvY2FsIHN0b3JhZ2VcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhY2NvdW50SUQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEaXNwbGF5IGFjY291bnQgZGVsZXRpb24gc3VjY2Vzc1xyXG4gICAgICAgICAgICAgICAgLy9kb20uZGlzcGxheU1lc3NhZ2UoJ2RlbGV0ZScsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyA1IHNlY29uZCBkZWxheSBhbmQgcmV0dXJuIHRvIGxvZ2luIGZvcm1cclxuICAgICAgICAgICAgICAgICAgICAvL2RvbS5kaXNwbGF5TG9naW5Gb3JtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kb20udXNlckxvZ2dlZE91dCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgNTAwMCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgICAgIC8vIERpc3BsYXkgZXJyb3JcclxuICAgICAgICAvL2RvbS5kaXNwbGF5TWVzc2FnZSgnZGVsZXRlJywgJ2Vycm9yJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjcmVhdGVBY2NvdW50LFxyXG4gICAgICAgIGNoZWNrTG9naW4sXHJcbiAgICAgICAgZ2V0QWNjb3VudCxcclxuICAgICAgICB1cGRhdGVBY2NvdW50LFxyXG4gICAgICAgIGRlbGV0ZUFjY291bnQsXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhY2NvdW50O1xyXG5cclxuIiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcblxyXG5jb25zdCBjYXJ0ID0gKCgpID0+IHtcclxuICAgIGxldCBjYXJ0VXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTAwMC9hcGkvY2FydCc7XHJcblxyXG4gICAgY29uc3QgY3JlYXRlTmV3Q2FydCA9ICh1c2VySUQsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgZmV0Y2goYCR7Y2FydFVybH0vJHt1c2VySUR9YCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcklEOiB1c2VySUQgfSkgLy8gTWFrZSBzdXJlIHlvdXIgQVBJIGV4cGVjdHMgdGhlIGJvZHkgaW4gdGhpcyBmb3JtYXRcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIG5ldyBjYXJ0Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLlNob3BDYXJ0SUQpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEuU2hvcENhcnRJRC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjYXJ0IGRhdGEnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNyZWF0aW5nIG5ldyBjYXJ0OicsIGVycm9yKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGFkZE9yVXBkYXRlQ2FydEl0ZW0gPSAoY2FydElELCBwcm9kdWN0SUQsIHF1YW50aXR5LCBuYW1lLCBwcmljZSwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICBsZXQgaXRlbURhdGEgPSB7XHJcbiAgICAgICAgICAgIFByb2R1Y3RJRDogcGFyc2VJbnQocHJvZHVjdElELCAxMCksXHJcbiAgICAgICAgICAgIFF1YW50aXR5OiBxdWFudGl0eSxcclxuICAgICAgICAgICAgTmFtZTogbmFtZSxcclxuICAgICAgICAgICAgUHJpY2U6IHBhcnNlRmxvYXQocHJpY2UpIFxyXG4gICAgICAgIH07XHJcbiAgICBcclxuICAgICAgICBmZXRjaChgJHtjYXJ0VXJsfS8ke2NhcnRJRH0vaXRlbXNgLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoaXRlbURhdGEpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGFkZCBvciB1cGRhdGUgY2FydCBpdGVtOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjA0IHx8IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiQ29udGVudC1MZW5ndGhcIikgPT09IFwiMFwiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcmVzcG9uc2UgaXMgMjA0IE5vIENvbnRlbnQsIG9yIGlmIHRoZXJlJ3Mgbm8gY29udGVudCwgZG9uJ3QgdHJ5IHRvIHBhcnNlIGl0XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpOyAvLyBPbmx5IHBhcnNlIGFzIEpTT04gaWYgcmVzcG9uc2UgaGFzIGNvbnRlbnRcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSkgeyAvLyBNYWtlIHN1cmUgZGF0YSBleGlzdHMgYmVmb3JlIGxvZ2dpbmcgaXRcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDYXJ0IGl0ZW0gYWRkZWQvdXBkYXRlZCBzdWNjZXNzZnVsbHk6JywgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcikpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBnZXRDYXJ0SXRlbXMgPSAoY2FydElELCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgIGxldCB1cmwgPSBgJHtjYXJ0VXJsfS9kZXRhaWxzLyR7Y2FydElEfWA7XHJcblxyXG4gICAgICAgIGZldGNoKHVybClcclxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgLnRoZW4oZGF0YSA9PiBjYWxsYmFjayhkYXRhKSlcclxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtb2RpZnlDYXJ0SXRlbSA9IChjYXJ0SUQsIHByb2R1Y3RJRCwgbmV3UXVhbnRpdHksIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IGl0ZW1EYXRhID0ge1xyXG4gICAgICAgICAgICBRdWFudGl0eTogcGFyc2VJbnQobmV3UXVhbnRpdHksIDEwKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZmV0Y2goYCR7Y2FydFVybH0vJHtjYXJ0SUR9L21vZGlmeS8ke3Byb2R1Y3RJRH1gLCB7IC8vIE1ha2Ugc3VyZSB0aGlzIG1hdGNoZXMgdGhlIGNvcnJlY3QgZW5kcG9pbnRcclxuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGl0ZW1EYXRhKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBtb2RpZnkgY2FydCBpdGVtOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjA0IHx8IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiQ29udGVudC1MZW5ndGhcIikgPT09IFwiMFwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpOyBcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGRlbGV0ZUNhcnRJdGVtID0gKGNhcnRJRCwgcHJvZHVjdElELCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgIGZldGNoKGAke2NhcnRVcmx9LyR7Y2FydElEfS9kZWxldGUvJHtwcm9kdWN0SUR9YCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGRlbGV0ZSBjYXJ0IGl0ZW06ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FydCBpdGVtIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5OicsIGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IpKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjcmVhdGVOZXdDYXJ0LFxyXG4gICAgICAgIGFkZE9yVXBkYXRlQ2FydEl0ZW0sXHJcbiAgICAgICAgZ2V0Q2FydEl0ZW1zLFxyXG4gICAgICAgIG1vZGlmeUNhcnRJdGVtLFxyXG4gICAgICAgIGRlbGV0ZUNhcnRJdGVtLFxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNhcnQ7IiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcblxyXG5jb25zdCBjYXRlZ29yeSA9ICgoKSA9PiB7ICAgIFxyXG4gICAgbGV0IHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEwMDAvYXBpL2NhdGVnb3JpZXMnO1xyXG5cclxuICAgIGNvbnN0IGdldENhdGVnb3JpZXMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsKTtcclxuICAgICAgICBcclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBnZXRTZWxlY3RlZENhdGVnb3J5ID0gKGNhdGVnb3J5SUQsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5VXJsID0gdXJsICsgYD9zZWFyY2g9JHtjYXRlZ29yeUlEfWA7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIGNhdGVnb3J5VXJsKTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRDYXRlZ29yaWVzLFxyXG4gICAgICAgIGdldFNlbGVjdGVkQ2F0ZWdvcnksXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYXRlZ29yeTsiLCJpbXBvcnQgY2FydCBmcm9tICcuL2NhcnQnO1xyXG5cclxuY29uc3QgZG9tID0gKCgpID0+IHtcclxuICAgIGNvbnN0IGlzVXNlckxvZ2dlZEluID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGF1dGhMaW5rcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoTGlua3MnKTtcclxuICAgICAgICBjb25zdCBsb2dvdXRMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ291dExpbmsnKTtcclxuICAgICAgICBjb25zdCBhY2NvdW50TGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY2NvdW50TGluaycpO1xyXG5cclxuICAgICAgICBjb25zdCBpc0xvZ2dlZEluID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnRJRCcpICE9PSBudWxsO1xyXG5cclxuICAgICAgICBpZiAoaXNMb2dnZWRJbikge1xyXG4gICAgICAgICAgICAvLyBIaWRlIGxvZ2luIGFuZCByZWdpc3RlciBsaW5rc1xyXG4gICAgICAgICAgICBhdXRoTGlua3Muc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHJcbiAgICAgICAgICAgIC8vIFNob3cgYWNjb3VudCBhbmQgbG9nb3V0IGxpbmtzXHJcbiAgICAgICAgICAgIGxvZ291dExpbmsuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICAgICAgYWNjb3VudExpbmsuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgYXV0aExpbmtzLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgICAgICAgIGxvZ291dExpbmsuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgYWNjb3VudExpbmsuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9IFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRpc3BsYXlBbGxDYXRlZ29yaWVzID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCBjYXRlZ29yeUxpc3RpbmdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGVnb3J5LWxpc3RpbmdzJyk7XHJcbiAgICAgICAgaWYgKGNhdGVnb3J5TGlzdGluZ3MpIHtcclxuICAgICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhLkNhdGVnb3JpZXMpO1xyXG5cclxuICAgICAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5TGlzdGluZ3MuaW5uZXJIVE1MICs9IGBcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBjYXRlZ29yeVwiIGRhdGEtbGluay1jYXRlZ29yeWlkPVwiJHtrZXl9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiYXNzZXRzLyR7ZGF0YS5DYXRlZ29yaWVzW2tleV1bXCJDYXRJbWFnZVwiXX1cIiBkYXRhLWxpbmstY2F0ZWdvcnlpZD1cIiR7a2V5fVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2F0ZWdvcnlCdG5cIiBkYXRhLWxpbmstY2F0ZWdvcnlpZD1cIiR7a2V5fVwiPiR7ZGF0YS5DYXRlZ29yaWVzW2tleV1bXCJDYXROYW1lXCJdfTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGlzcGxheUFsbFByb2R1Y3RzID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCBwcm9kdWN0TGlzdGluZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdC1saXN0aW5ncycpO1xyXG5cclxuICAgICAgICBjb25zdCBjcmVhdGVQcm9kdWN0QnRuID0gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcmVhdGVQcm9kdWN0QnRuJyk7XHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyVHlwZScpID09ICd1c2VyJyAmJiBjcmVhdGVQcm9kdWN0QnRuKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZVByb2R1Y3RCdG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9IFxyXG5cclxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEuUHJvZHVjdHMpO1xyXG5cclxuICAgICAgICBpZiAocHJvZHVjdExpc3RpbmdzKSB7XHJcbiAgICAgICAgICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0TGlzdGluZ3MuaW5uZXJIVE1MICs9IGBcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBwcm9kdWN0XCIgZGF0YS1saW5rLXByb2R1Y3RJRD1cIiR7a2V5fVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cImFzc2V0cy9wcm9kdWN0cy8ke2RhdGEuUHJvZHVjdHNba2V5XVtcIlByb2R1Y3RJbWFnZVwiXX1cIiBkYXRhLWxpbmstcHJvZHVjdElEPVwiJHtrZXl9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9kdWN0LW5hbWVcIj4ke2RhdGEuUHJvZHVjdHNba2V5XVtcIlByb2R1Y3RUaXRsZVwiXX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2R1Y3QtcHJpY2VcIj4kJHtkYXRhLlByb2R1Y3RzW2tleV1bXCJQcmljZVwiXX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJvZHVjdHMnLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGlzcGxheVByb2R1Y3REZXRhaWxzID0gKHByb2R1Y3REYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdERldGFpbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdERldGFpbHMtY29udGFpbmVyJyk7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdEltYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4taW1hZ2UnKTtcclxuICAgICAgICBjb25zdCBwcm9kdWN0VGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdC10aXRsZScpO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3REZXNjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2R1Y3QtZGVzY3JpcHRpb24nKTtcclxuICAgICAgICBjb25zdCBwcm9kdWN0UHJpY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJpY2UnKTtcclxuXHJcbiAgICAgICAgY29uc3QgYWRkVG9DYXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFkZC10by1jYXJ0LWJ0bicpO1xyXG4gICAgICAgIGNvbnN0IHF1YW50aXR5SW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcXVhbnRpdHktaW5wdXQnKTtcclxuICAgICAgICBjb25zdCBpbmNyZWFzZVFCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5jcmVhc2UtcXVhbnRpdHknKTtcclxuICAgICAgICBjb25zdCBkZWNyZWFzZVFCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVjcmVhc2UtcXVhbnRpdHknKTtcclxuICAgICAgICBjb25zdCBjcmVhdGVSZXZpZXdCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3VibWl0Q3JlYXRlRmVlZGJhY2stYnRuJyk7XHJcblxyXG4gICAgICAgIGlmIChwcm9kdWN0RGV0YWlscykge1xyXG4gICAgICAgICAgICBwcm9kdWN0SW1hZ2Uuc3JjID0gYGFzc2V0cy9wcm9kdWN0cy8ke3Byb2R1Y3REYXRhWydQcm9kdWN0SW1hZ2UnXX1gO1xyXG4gICAgICAgICAgICBwcm9kdWN0VGl0bGUudGV4dENvbnRlbnQgPSBwcm9kdWN0RGF0YVsnUHJvZHVjdFRpdGxlJ107XHJcbiAgICAgICAgICAgIHByb2R1Y3REZXNjLnRleHRDb250ZW50ID0gcHJvZHVjdERhdGFbJ1Byb2R1Y3REZXNjJ107XHJcbiAgICAgICAgICAgIHByb2R1Y3RQcmljZS50ZXh0Q29udGVudCA9ICckJyArIHByb2R1Y3REYXRhWydQcmljZSddO1xyXG5cclxuICAgICAgICAgICAgYWRkVG9DYXJ0QnRuLnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9kdWN0aWQnLCBwcm9kdWN0RGF0YVsnUHJvZHVjdElEJ10pO1xyXG4gICAgICAgICAgICBxdWFudGl0eUlucHV0LnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9kdWN0aWQnLCBwcm9kdWN0RGF0YVsnUHJvZHVjdElEJ10pO1xyXG4gICAgICAgICAgICBpbmNyZWFzZVFCdG4uc2V0QXR0cmlidXRlKCdkYXRhLXByb2R1Y3RpZCcsIHByb2R1Y3REYXRhWydQcm9kdWN0SUQnXSk7XHJcbiAgICAgICAgICAgIGRlY3JlYXNlUUJ0bi5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZHVjdGlkJywgcHJvZHVjdERhdGFbJ1Byb2R1Y3RJRCddKTtcclxuICAgICAgICAgICAgY3JlYXRlUmV2aWV3QnRuLnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9kdWN0aWQnLCBwcm9kdWN0RGF0YVsnUHJvZHVjdElEJ10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJvZHVjdCcsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGFuZ2VJdGVtUXVhbnRpdHkgPSAoYWN0aW9uKSA9PiB7XHJcbiAgICAgICAgbGV0IGl0ZW1RdWFudGl0eUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3F1YW50aXR5LWlucHV0Jyk7XHJcbiAgICAgICAgbGV0IGl0ZW1RdWFudGl0eSA9IHBhcnNlSW50KGl0ZW1RdWFudGl0eUlucHV0LnZhbHVlLCAxMCk7XHJcblxyXG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdpbmNyZWFzZScpIHtcclxuICAgICAgICAgICAgaXRlbVF1YW50aXR5ICs9IDE7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBlbHNlIGlmIChhY3Rpb24gPT09ICdkZWNyZWFzZScgJiYgaXRlbVF1YW50aXR5ID4gMCkge1xyXG4gICAgICAgICAgICBpdGVtUXVhbnRpdHkgLT0gMTsgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtUXVhbnRpdHlJbnB1dC52YWx1ZSA9IGl0ZW1RdWFudGl0eTsgXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdXBkYXRlUXVhbnRpdHkgPSAocHJvZHVjdElkLCBuZXdRdWFudGl0eSkgPT4ge1xyXG4gICAgICAgIGNhcnQubW9kaWZ5Q2FydEl0ZW0obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnRJRCcpLCBwcm9kdWN0SWQsIG5ld1F1YW50aXR5LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgdXBkYXRpbmcgY2FydCBpdGVtOicsIGVycm9yKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlZnJlc2hDYXJ0SXRlbURpc3BsYXkocHJvZHVjdElkLCBuZXdRdWFudGl0eSk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICBwb3B1bGF0ZVNob3BwaW5nQ2FydCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCBkZWxldGVDYXJ0SXRlbSA9IChwcm9kdWN0SWQpID0+IHtcclxuICAgICAgICBjYXJ0LmRlbGV0ZUNhcnRJdGVtKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjYXJ0SUQnKSwgcHJvZHVjdElkLCAoZXJyb3IsIGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkZWxldGluZyBjYXJ0IGl0ZW06JywgZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NhcnQgaXRlbSBkZWxldGVkOicsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQ2FydEl0ZW1EaXNwbGF5KHByb2R1Y3RJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgcG9wdWxhdGVTaG9wcGluZ0NhcnQgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2FydElEID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnRJRCcpO1xyXG4gICAgICAgIGlmICghY2FydElEKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05vIGNhcnQgZm91bmQuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhcnQuZ2V0Q2FydEl0ZW1zKGNhcnRJRCwgKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhcnRJdGVtc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0LWl0ZW1zJyk7XHJcbiAgICAgICAgICAgIGNhcnRJdGVtc0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlQcm9kdWN0SW5DYXJ0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdXBkYXRlQ2FydFN1bW1hcnkoaXRlbXMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBkaXNwbGF5UHJvZHVjdEluQ2FydCA9IChpdGVtKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2FydEl0ZW1zQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnQtaXRlbXMnKTtcclxuICAgICAgICBjb25zdCBjYXJ0SXRlbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjYXJ0SXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY2FydC1pdGVtJyk7XHJcbiAgICAgICAgY2FydEl0ZW1FbGVtZW50LmlubmVySFRNTCA9IGBcclxuICAgICAgICAgICAgPGltZyBzcmM9XCJhc3NldHMvcHJvZHVjdHMvJHtpdGVtLlByb2R1Y3RJbWFnZX1cIiBhbHQ9XCIke2l0ZW0uUHJvZHVjdFRpdGxlfVwiPlxyXG4gICAgICAgICAgICA8c3Bhbj4ke2l0ZW0uUHJvZHVjdFRpdGxlfTwvc3Bhbj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInF1YW50aXR5LXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxdWFudGl0eS1idG4gZGVjcmVhc2UtcXVhbnRpdHlcIiBkYXRhLXByb2R1Y3RpZD1cIiR7aXRlbS5Qcm9kdWN0SUR9XCI+PGlvbi1pY29uIG5hbWU9XCJyZW1vdmUtb3V0bGluZVwiPjwvaW9uLWljb24+PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwicXVhbnRpdHktaW5wdXRcIiB2YWx1ZT1cIiR7aXRlbS5RdWFudGl0eX1cIiBtaW49XCIwXCIgZGF0YS1wcm9kdWN0aWQ9XCIke2l0ZW0uUHJvZHVjdElEfVwiPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInF1YW50aXR5LWJ0biBpbmNyZWFzZS1xdWFudGl0eVwiIGRhdGEtcHJvZHVjdGlkPVwiJHtpdGVtLlByb2R1Y3RJRH1cIj48aW9uLWljb24gbmFtZT1cImFkZC1vdXRsaW5lXCI+PC9pb24taWNvbj48L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FydC1wcmljZVwiPiQke2l0ZW0uUHJpY2V9PC9zcGFuPlxyXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZGVsQ2FydEl0ZW1CdG5cIiBkYXRhLXByb2R1Y3RpZD1cIiR7aXRlbS5Qcm9kdWN0SUR9XCI+PGlvbi1pY29uIG5hbWU9XCJjbG9zZS1vdXRsaW5lXCI+PC9pb24taWNvbj48L2J1dHRvbj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIGNhcnRJdGVtc0NvbnRhaW5lci5hcHBlbmRDaGlsZChjYXJ0SXRlbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICAvLyBSZWF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gbmV3bHkgYWRkZWQgZWxlbWVudHNcclxuICAgICAgICBhdHRhY2hRdWFudGl0eVVwZGF0ZUxpc3RlbmVycyhjYXJ0SXRlbUVsZW1lbnQsIGl0ZW0uUHJvZHVjdElEKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZWZyZXNoQ2FydEl0ZW1EaXNwbGF5ID0gKHByb2R1Y3RJZCwgbmV3UXVhbnRpdHkpID0+IHtcclxuICAgICAgICAvLyBVcGRhdGUgdGhlIGRpc3BsYXllZCBxdWFudGl0eSBpbiB0aGUgY2FydCBpdGVtXHJcbiAgICAgICAgY29uc3QgaXRlbUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuY2FydC1pdGVtW2RhdGEtcHJvZHVjdGlkPVwiJHtwcm9kdWN0SWR9XCJdIGlucHV0W3R5cGU9XCJudW1iZXJcIl1gKTtcclxuICAgICAgICBpZiAoaXRlbUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaXRlbUVsZW1lbnQudmFsdWUgPSBuZXdRdWFudGl0eTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXBkYXRlQ2FydFN1bW1hcnkoKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIGNvbnN0IHJlbW92ZUNhcnRJdGVtRGlzcGxheSA9IChwcm9kdWN0SWQpID0+IHtcclxuICAgICAgICAvLyBSZW1vdmUgdGhlIGNhcnQgaXRlbSBlbGVtZW50IGZyb20gdGhlIERPTVxyXG4gICAgICAgIGNvbnN0IGl0ZW1FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmNhcnQtaXRlbVtkYXRhLXByb2R1Y3RpZD1cIiR7cHJvZHVjdElkfVwiXWApO1xyXG4gICAgICAgIGlmIChpdGVtRWxlbWVudCkge1xyXG4gICAgICAgICAgICBpdGVtRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXBkYXRlQ2FydFN1bW1hcnkoKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIGNvbnN0IHVwZGF0ZUNhcnRTdW1tYXJ5ID0gKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRvdGFsIHByaWNlIGFuZCBpdGVtIGNvdW50XHJcbiAgICAgICAgbGV0IHRvdGFsID0gMDtcclxuICAgICAgICBsZXQgaXRlbUNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgdG90YWwgKz0gaXRlbS5QcmljZSAqIGl0ZW0uUXVhbnRpdHk7XHJcbiAgICAgICAgICAgIGl0ZW1Db3VudCArPSBpdGVtLlF1YW50aXR5O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBVcGRhdGUgdGhlIHRvdGFsIHByaWNlIGFuZCBpdGVtIGNvdW50IGluIHRoZSBzdW1tYXJ5IHNlY3Rpb25cclxuICAgICAgICBjb25zdCB0b3RhbFByaWNlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdW1tYXJ5IC50b3RhbC1wcmljZSBzcGFuOmxhc3QtY2hpbGQnKTtcclxuICAgICAgICBjb25zdCBpdGVtQ291bnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnQtaGVhZGVyIHAnKTtcclxuICAgICAgICBjb25zdCBpdGVtQ291bnRFbGVtZW50MiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdW1tYXJ5LWl0ZW1zIHNwYW4nKTtcclxuXHJcbiAgICAgICAgaWYgKHRvdGFsUHJpY2VFbGVtZW50ICYmIGl0ZW1Db3VudEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdG90YWxQcmljZUVsZW1lbnQudGV4dENvbnRlbnQgPSBgJCR7dG90YWwudG9GaXhlZCgyKX1gO1xyXG4gICAgICAgICAgICBpdGVtQ291bnRFbGVtZW50LnRleHRDb250ZW50ID0gYCR7aXRlbUNvdW50fSBpdGVtc2A7XHJcbiAgICAgICAgICAgIGl0ZW1Db3VudEVsZW1lbnQyLnRleHRDb250ZW50ID0gYCR7aXRlbUNvdW50fSBpdGVtc2A7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBhdHRhY2hRdWFudGl0eVVwZGF0ZUxpc3RlbmVycyA9IChjYXJ0SXRlbUVsZW1lbnQsIHByb2R1Y3RJRCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRlY3JlYXNlQnV0dG9uID0gY2FydEl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWNyZWFzZS1xdWFudGl0eScpO1xyXG4gICAgICAgIGNvbnN0IGluY3JlYXNlQnV0dG9uID0gY2FydEl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbmNyZWFzZS1xdWFudGl0eScpO1xyXG4gICAgICAgIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IGNhcnRJdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGVsQ2FydEl0ZW1CdG4nKTtcclxuICAgICAgICBjb25zdCBxdWFudGl0eUlucHV0ID0gY2FydEl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyNxdWFudGl0eS1pbnB1dCcpO1xyXG4gICAgXHJcbiAgICAgICAgZGVjcmVhc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1F1YW50aXR5ID0gTWF0aC5tYXgoMCwgcGFyc2VJbnQocXVhbnRpdHlJbnB1dC52YWx1ZSwgMTApIC0gMSk7XHJcbiAgICAgICAgICAgIGlmIChuZXdRdWFudGl0eSA+IDApIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZVF1YW50aXR5KHByb2R1Y3RJRCwgbmV3UXVhbnRpdHkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlQ2FydEl0ZW0ocHJvZHVjdElEKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICAgICAgaW5jcmVhc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1F1YW50aXR5ID0gcGFyc2VJbnQocXVhbnRpdHlJbnB1dC52YWx1ZSwgMTApICsgMTtcclxuICAgICAgICAgICAgdXBkYXRlUXVhbnRpdHkocHJvZHVjdElELCBuZXdRdWFudGl0eSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICBkZWxldGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRlbGV0ZUNhcnRJdGVtKHByb2R1Y3RJRCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGRpc3BsYXlGZWVkYmFjayA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmV2aWV3TGlzdGluZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmV2aWV3LWxpc3RpbmdzJyk7XHJcbiAgICAgICAgaWYgKHJldmlld0xpc3RpbmdzKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YS5GZWVkYmFja3MpO1xyXG5cclxuICAgICAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldmlld0xpc3RpbmdzLmlubmVySFRNTCArPSBgXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJldmlldy1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzPVwicmV2aWV3LXRpdGxlXCI+JHtkYXRhLkZlZWRiYWNrc1trZXldW1wiQ29tbWVudFwiXX08c3Bhbj4ke2RhdGEuRmVlZGJhY2tzW2tleV1bXCJBY2NvdW50TmFtZVwiXX08L3NwYW4+PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInJldmlldy1kZXNjXCI+JHtkYXRhLkZlZWRiYWNrc1trZXldW1wiQ29tbWVudFwiXX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICBgO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpc1VzZXJMb2dnZWRJbixcclxuICAgICAgICBkaXNwbGF5QWxsQ2F0ZWdvcmllcyxcclxuICAgICAgICBkaXNwbGF5QWxsUHJvZHVjdHMsXHJcbiAgICAgICAgZGlzcGxheVByb2R1Y3REZXRhaWxzLFxyXG4gICAgICAgIGNoYW5nZUl0ZW1RdWFudGl0eSxcclxuICAgICAgICB1cGRhdGVRdWFudGl0eSxcclxuICAgICAgICBkZWxldGVDYXJ0SXRlbSxcclxuICAgICAgICBwb3B1bGF0ZVNob3BwaW5nQ2FydCxcclxuICAgICAgICB1cGRhdGVDYXJ0U3VtbWFyeSxcclxuICAgICAgICBkaXNwbGF5RmVlZGJhY2ssXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkb207IiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgZmVlZGJhY2sgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdmZWVkYmFjaycpKTtcclxuICAgIGlmIChmZWVkYmFjaykge1xyXG4gICAgICAgIGRvbS5kaXNwbGF5RmVlZGJhY2soZmVlZGJhY2spO1xyXG4gICAgfVxyXG59KVxyXG5cclxuY29uc3QgZmVlZGJhY2sgPSAoKCkgPT4ge1xyXG4gICAgbGV0IHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEwMDAvYXBpL2ZlZWRiYWNrJztcclxuXHJcbiAgICBjb25zdCBnZXRGZWVkYmFjayA9IChwcm9kdWN0SUQsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IHNlYXJjaFVybCA9IGAke3VybH0vJHtwcm9kdWN0SUR9YDsgXHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHNlYXJjaFVybCk7XHJcbiAgICBcclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJlc3BvbnNlKVxyXG4gICAgICAgICAgICAvLyBGaXJzdCwgY2hlY2sgaWYgdGhlIHJlc3BvbnNlIGlzIGVtcHR5IG9yIG5vdCBhIHZhbGlkIEpTT04gYmVmb3JlIHBhcnNpbmdcclxuICAgICAgICAgICAgaWYgKHRoaXMucmVzcG9uc2UgJiYgdGhpcy5yZXNwb25zZS50cmltKCkgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRyeSBwYXJzaW5nIHRoZSByZXNwb25zZS4gSWYgaXQncyBub3QgdmFsaWQgSlNPTiwgdGhpcyB3aWxsIHRocm93IGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGFuIGVycm9yIGlzIHRocm93biwgbG9nIGl0IGFuZCBvcHRpb25hbGx5IGhhbmRsZSBpdFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwYXJzaW5nIEpTT04gcmVzcG9uc2U6XCIsIGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIHdpdGggbnVsbCBvciBhbiBhcHByb3ByaWF0ZSBlcnJvciBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgXCJFcnJvciBwYXJzaW5nIGZlZWRiYWNrIGRhdGFcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcmVzcG9uc2UgaXMgZW1wdHkgb3IgbnVsbCwgaGFuZGxlIGl0IGFzIG5vIGZlZWRiYWNrIGF2YWlsYWJsZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGZlZWRiYWNrIGF2YWlsYWJsZSBvciBlbXB0eSByZXNwb25zZS4nKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIFwiTm8gZmVlZGJhY2sgYXZhaWxhYmxlIG9yIGVtcHR5IHJlc3BvbnNlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIFxyXG4gICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBIYW5kbGUgbmV0d29yayBlcnJvcnNcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk5ldHdvcmsgZXJyb3Igb2NjdXJyZWRcIik7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIFwiTmV0d29yayBlcnJvclwiKTtcclxuICAgICAgICB9O1xyXG4gICAgXHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGNyZWF0ZUZlZWRiYWNrID0gKGZlZWRiYWNrRGF0YSkgPT4ge1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdQT1NUJywgdXJsICsgXCIvY3JlYXRlXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PSAyMDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKEpTT04uc3RyaW5naWZ5KGZlZWRiYWNrRGF0YSkpO1xyXG4gICAgICAgIC8vZG9tLmRpc3BsYXlNZXNzYWdlKCdzaWdudXAnLCAnZXJyb3InKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldEZlZWRiYWNrLFxyXG4gICAgICAgIGNyZWF0ZUZlZWRiYWNrLFxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZmVlZGJhY2s7IiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcbmltcG9ydCBhY2NvdW50IGZyb20gJy4vYWNjb3VudCc7XHJcbmltcG9ydCBwcm9kdWN0IGZyb20gJy4vcHJvZHVjdCc7XHJcbmltcG9ydCBjYXRlZ29yeSBmcm9tICcuL2NhdGVnb3J5JztcclxuaW1wb3J0IGZlZWRiYWNrIGZyb20gJy4vZmVlZGJhY2snO1xyXG5pbXBvcnQgY2FydCBmcm9tICcuL2NhcnQnO1xyXG5cclxuY29uc3QgaGFuZGxlciA9ICgoKSA9PiB7XHJcblxyXG4gICAgY29uc3QgaGFuZGxlQ2xpY2tzID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxvZ2luRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbkZvcm0nKTtcclxuICAgICAgICBjb25zdCByZWdpc3RlckZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVnaXN0ZXJGb3JtJyk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRhcmdldEVsZW1lbnQgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbG9nb3V0QnRuJykpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhY2NvdW50SUQnKTtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyVHlwZScpO1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FjY291bnROYW1lJyk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvcEJ0bicpKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0LmdldFByb2R1Y3RzKChwcm9kdWN0cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9kdWN0cycsIEpTT04uc3RyaW5naWZ5KHByb2R1Y3RzKSk7IC8vIFNhdmUgdGhlIHByb2R1Y3RzIGluIGxvY2FsU3RvcmFnZVxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ3Byb2R1Y3RzLmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnZGF0YS1saW5rLXByb2R1Y3RpZCcpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0SUQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGluay1wcm9kdWN0aWQnKTtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3QuZ2V0U2VsZWN0ZWRQcm9kdWN0KHByb2R1Y3RJRCwgKHByb2R1Y3REYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2R1Y3QnLCBKU09OLnN0cmluZ2lmeShwcm9kdWN0RGF0YSkpOyAvLyBTYXZlIHRoZSBzZWxlY3RlZCBwcm9kdWN0IGluIGxvY2FsU3RvcmFnZVxyXG4gICAgICAgICAgICAgICAgfSk7ICBcclxuXHJcbiAgICAgICAgICAgICAgICBmZWVkYmFjay5nZXRGZWVkYmFjayhwcm9kdWN0SUQsIChmZWVkYmFja0RhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZmVlZGJhY2snLCBKU09OLnN0cmluZ2lmeShmZWVkYmFja0RhdGEpKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdwcm9kdWN0RGV0YWlscy5odG1sJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuaGFzQXR0cmlidXRlKCdkYXRhLWxpbmstY2F0ZWdvcnlpZCcpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYXRlZ29yeUlEID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWxpbmstY2F0ZWdvcnlpZCcpO1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnkuZ2V0U2VsZWN0ZWRDYXRlZ29yeShjYXRlZ29yeUlELCAocHJvZHVjdHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJvZHVjdHMnLCBKU09OLnN0cmluZ2lmeShwcm9kdWN0cykpOyBcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdwcm9kdWN0cy5odG1sJztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT0gJ3N1Ym1pdFNlYXJjaCcpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWFyY2hCYXJJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWFyY2gtYmFyJykudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0LnNlYXJjaFByb2R1Y3Qoc2VhcmNoQmFySW5wdXQsIChwcm9kdWN0cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9kdWN0cycsIEpTT04uc3RyaW5naWZ5KHByb2R1Y3RzKSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ3Byb2R1Y3RzLmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjYXJ0LWxpbmsnKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYWNjb3VudElEID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnRJRCcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjY291bnRJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhcnRJRCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjYXJ0SUQnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FydElEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnQuZ2V0Q2FydEl0ZW1zKGNhcnRJRCwgKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgaXRlbXMgaW4gdGhlIGNhcnQsIHNhdmUgdGhlbSBhbmQgcmVkaXJlY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtcyAmJiBpdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcnRJdGVtcycsIEpTT04uc3RyaW5naWZ5KGl0ZW1zKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnc2hvcHBpbmdDYXJ0Lmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdzaG9wcGluZ0NhcnQuaHRtbCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ3Nob3BwaW5nQ2FydC5odG1sJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2xvZ2luLmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NyZWF0ZVJldmlld0J0bicpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnRJRCcpID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdsb2dpbi5odG1sJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXZpZXdNb2RhbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Nsb3NlLWJ1dHRvbicpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmV2aWV3TW9kYWxcIik7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5vbmNsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXZpZXdNb2RhbFwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQgPT0gbW9kYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc3VibWl0Q3JlYXRlRmVlZGJhY2stYnRuJykpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RJRCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1wcm9kdWN0aWQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFjY291bnRJRCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2NvdW50SUQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFjY291bnROYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnROYW1lJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmZWVkYmFja0Rlc2NJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXZpZXdEZXNjSW5wdXQnKS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGxldCBmZWVkYmFja0RhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJBY2NvdW50SURcIjogcGFyc2VJbnQoYWNjb3VudElELCAxMCksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJBY2NvdW50TmFtZVwiOiBhY2NvdW50TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcIlByb2R1Y3RJRFwiOiBwYXJzZUludChwcm9kdWN0SUQsIDEwKSxcclxuICAgICAgICAgICAgICAgICAgICBcIlJhdGluZ1wiOiBwYXJzZUludCg1LCAxMCksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb21tZW50XCI6IGZlZWRiYWNrRGVzY0lucHV0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmZWVkYmFjay5jcmVhdGVGZWVkYmFjayhmZWVkYmFja0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKGxvZ2luRm9ybSkge1xyXG4gICAgICAgICAgICBsb2dpbkZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVtYWlsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luRW1haWwnKS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhc3N3b3JkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luUGFzc3dvcmQnKS52YWx1ZTtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgYWNjb3VudC5jaGVja0xvZ2luKGVtYWlsLCBwYXNzd29yZCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChyZWdpc3RlckZvcm0pIHtcclxuICAgICAgICAgICAgcmVnaXN0ZXJGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlZ2lzdGVyTmFtZScpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZW1haWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVnaXN0ZXJFbWFpbCcpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFzc3dvcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVnaXN0ZXJQYXNzd29yZCcpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7IC8vIEdldCBjdXJyZW50IGRhdGUgaW4gSVNPIGZvcm1hdFxyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGN1cnJlbnREYXRlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBkYXRlLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTkpLnJlcGxhY2UoJ1QnLCAnICcpOyAvLyBZWVlZLU1NLUREIEhIOk1NOlNTXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIEpTT05cclxuICAgICAgICAgICAgICAgIGxldCBhY2NvdW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBcIk5hbWVcIjogbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcIkVtYWlsXCI6IGVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiUGFzc3dvcmRcIjogcGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJDcmVhdGVkIEF0XCI6IGZvcm1hdHRlZERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJVc2VyVHlwZVwiOiAndXNlcidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGFjY291bnQuY3JlYXRlQWNjb3VudChhY2NvdW50RGF0YSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0UXVhbnRpdHlDb250cm9sTGlzdGVuZXJzKCcucHJvZHVjdERldGFpbHMtY29udGFpbmVyJyk7XHJcbiAgICAgICAgLy8gU2hvcHBpbmcgQ2FydCBwYWdlIHNwZWNpZmljIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJ3Nob3BwaW5nQ2FydC5odG1sJykpIHtcclxuICAgICAgICAgICAgZG9tLnBvcHVsYXRlU2hvcHBpbmdDYXJ0KCk7XHJcbiAgICAgICAgICAgIGluaXRDYXJ0UGFnZUxpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygncHJvZHVjdERldGFpbHMuaHRtbCcpKSB7XHJcbiAgICAgICAgICAgIGluaXRQcm9kdWN0RGV0YWlsc0xpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnc2hvcHBpbmdDYXJ0Lmh0bWwnKSkge1xyXG4gICAgICAgICAgICBkb20ucG9wdWxhdGVTaG9wcGluZ0NhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaW5pdFF1YW50aXR5Q29udHJvbExpc3RlbmVycyA9IChjb250YWluZXJTZWxlY3RvcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyU2VsZWN0b3IpO1xyXG4gICAgICAgIGlmICghY29udGFpbmVyKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZS50YXJnZXQ7XHJcbiAgICAgICAgICAgIGxldCBxdWFudGl0eUlucHV0ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNxdWFudGl0eS1pbnB1dCcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmNyZWFzZS1xdWFudGl0eScpKSB7XHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eUlucHV0LnZhbHVlID0gcGFyc2VJbnQocXVhbnRpdHlJbnB1dC52YWx1ZSwgMTApICsgMTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZGVjcmVhc2UtcXVhbnRpdHknKSkge1xyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHlJbnB1dC52YWx1ZSA9IE1hdGgubWF4KDAsIHBhcnNlSW50KHF1YW50aXR5SW5wdXQudmFsdWUsIDEwKSAtIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGluaXRDYXJ0UGFnZUxpc3RlbmVycyA9ICgpID0+IHtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FydC1pdGVtJykuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGVjcmVhc2VCdXR0b24gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5kZWNyZWFzZS1xdWFudGl0eScpO1xyXG4gICAgICAgICAgICBjb25zdCBpbmNyZWFzZUJ1dHRvbiA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmluY3JlYXNlLXF1YW50aXR5Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1YW50aXR5SW5wdXQgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9bnVtYmVyXScpOyAvLyBFbnN1cmUgdGhpcyBtYXRjaGVzIHlvdXIgSFRNTFxyXG5cclxuICAgICAgICAgICAgZGVjcmVhc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eUlucHV0LnZhbHVlID0gTWF0aC5tYXgoMCwgcGFyc2VJbnQocXVhbnRpdHlJbnB1dC52YWx1ZSwgMTApIC0gMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaW5jcmVhc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eUlucHV0LnZhbHVlID0gcGFyc2VJbnQocXVhbnRpdHlJbnB1dC52YWx1ZSwgMTApICsgMTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGluaXRQcm9kdWN0RGV0YWlsc0xpc3RlbmVycyA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBhZGRUb0NhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWRkLXRvLWNhcnQtYnRuJyk7XHJcbiAgICAgICAgaWYgKGFkZFRvQ2FydEJ1dHRvbikge1xyXG4gICAgICAgICAgICBhZGRUb0NhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0SUQgPSBhZGRUb0NhcnRCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXByb2R1Y3RpZCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcXVhbnRpdHkgPSBwYXJzZUludChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcXVhbnRpdHktaW5wdXQnKS52YWx1ZSwgMTApO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYWNjb3VudElEID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnRJRCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJpY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJpY2UnKS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1ByaWNlID0gcHJpY2UucmVwbGFjZSgnJCcsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdC10aXRsZScpLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB1c2VyIGlzIGxvZ2dlZCBpbiBieSBjaGVja2luZyBmb3IgYWNjb3VudElEXHJcbiAgICAgICAgICAgICAgICBpZiAoIWFjY291bnRJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFVzZXIgaXMgbm90IGxvZ2dlZCBpbiwgcmVkaXJlY3QgdG8gbG9naW4gcGFnZVxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2xvZ2luLmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY2FydElEID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnRJRCcpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRQcm9kdWN0VG9DYXJ0Q2FsbGJhY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FydC5hZGRPclVwZGF0ZUNhcnRJdGVtKGNhcnRJRCwgcHJvZHVjdElELCBxdWFudGl0eSwgbmFtZSwgbmV3UHJpY2UsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnc2hvcHBpbmdDYXJ0Lmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBQcm9jZWVkIG9ubHkgaWYgcXVhbnRpdHkgaXMgbW9yZSB0aGFuIDBcclxuICAgICAgICAgICAgICAgIGlmIChxdWFudGl0eSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNhcnRJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0LmNyZWF0ZU5ld0NhcnQoYWNjb3VudElELCAobmV3Q2FydElEKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJ0SUQgPSBuZXdDYXJ0SUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2FydElEJywgY2FydElEKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFByb2R1Y3RUb0NhcnRDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRQcm9kdWN0VG9DYXJ0Q2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHsgaGFuZGxlQ2xpY2tzIH07XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVyOyIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xyXG5cclxuY29uc3QgbG9hZEhlYWRlckZvb3RlciA9ICgoKSA9PiB7XHJcbiAgICBjb25zdCBsb2FkSGVhZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlckhUTUwgPSBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3AtbmF2XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImxvZ29cIiBocmVmPVwiaW5kZXguaHRtbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL2Jsb2Nrcy5wbmdcIiBhbHQ9XCJsb2dvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgyPkVjb1RveTwvaDI+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2VhcmNoLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpb24taWNvbiBuYW1lPVwic2VhcmNoLW91dGxpbmVcIiBpZD1cInN1Ym1pdFNlYXJjaFwiPjwvaW9uLWljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzZWFyY2hcIiBpZD1cInNlYXJjaC1iYXJcIiBwbGFjZWhvbGRlcj1cIlNlYXJjaCBhIHByb2R1Y3QuLi5cIj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXItYWN0aW9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhdXRoTGlua3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PGlvbi1pY29uIG5hbWU9XCJsb2ctaW4tb3V0bGluZVwiPjwvaW9uLWljb24+PGEgaHJlZj1cImxvZ2luLmh0bWxcIj5Mb2dpbjwvYT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPjxpb24taWNvbiBuYW1lPVwicGVyc29uLWFkZC1vdXRsaW5lXCI+PC9pb24taWNvbj48YSBocmVmPVwicmVnaXN0ZXIuaHRtbFwiPlJlZ2lzdGVyPC9hPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImFjY291bnRMaW5rXCI+PGlvbi1pY29uIG5hbWU9XCJwZXJzb24tb3V0bGluZVwiPjwvaW9uLWljb24+PGEgaHJlZj1cIiNcIj5BY2NvdW50PC9hPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImxvZ291dExpbmtcIj48aW9uLWljb24gbmFtZT1cImxvZy1vdXQtb3V0bGluZVwiPjwvaW9uLWljb24+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImxvZ291dEJ0blwiPkxvZ291dDwvYT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjYXJ0LWxpbmtcIj48aW9uLWljb24gbmFtZT1cImJhc2tldC1vdXRsaW5lXCI+PC9pb24taWNvbj5CYXNrZXQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxuYXY+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInNob3BCdG5cIj5TaG9wPC9hPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cImFib3V0Lmh0bWxcIj5BYm91dCBVczwvYT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJjb250YWN0Lmh0bWxcIj5Db250YWN0PC9hPlxyXG4gICAgICAgICAgICA8L25hdj5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaGVhZGVyJyk7XHJcbiAgICAgICAgaGVhZGVyRWxlbWVudC5pbm5lckhUTUwgPSBoZWFkZXJIVE1MO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGhlYWRlckVsZW1lbnQsIGRvY3VtZW50LmJvZHkuZmlyc3RDaGlsZCk7XHJcblxyXG4gICAgICAgIGRvbS5pc1VzZXJMb2dnZWRJbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxvYWRGb290ZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZm9vdGVySFRNTCA9IGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvb3Rlci1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb290ZXItY29sdW1uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgzPlNob3A8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+QWxsIFByb2R1Y3RzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkJlc3QgU2VsbGVyczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5OZXcgSW48L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbHVtblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz5FY29Ub3k8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+SG9tZTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5BYm91dDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5CbG9nPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkNvbnRhY3Q8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbHVtblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz5NeSBBY2NvdW50PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkxvZ2luPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPk9yZGVyczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5BY2NvdW50IGRldGFpbHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+Rm9yZ290IHBhc3N3b3JkPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvb3Rlci1jb2x1bW5cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDM+R2VuZXJhbDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5Qcml2YWN5IFBvbGljeTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5UZXJtcyAmIENvbmRpdGlvbnM8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+RGVsaXZlcnkgYW5kIFJldHVybnM8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLXNvY2lhbC1wYXltZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNvY2lhbC1pY29uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIFVzZSBhY3R1YWwgaWNvbnMgb3IgaW1hZ2VzIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiPjxpbWcgc3JjPVwiYXNzZXRzL2ZhY2Vib29rLnBuZ1wiIGFsdD1cIkZhY2Vib29rXCI+PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiPjxpbWcgc3JjPVwiYXNzZXRzL2luc3RhZ3JhbS5wbmdcIiBhbHQ9XCJJbnN0YWdyYW1cIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCI+PGltZyBzcmM9XCJhc3NldHMvcGludGVyZXN0LnBuZ1wiIGFsdD1cIlBpbnRlcmVzdFwiPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvb3Rlci1ib3R0b21cIj5cclxuICAgICAgICAgICAgICAgIDxwPsKpIDIwMjQgRWNvVG95LiBBbGwgUmlnaHRzIFJlc2VydmVkIHwgV2Vic2l0ZSBieSB1cyA6MzwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY29uc3QgZm9vdGVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvb3RlcicpO1xyXG4gICAgICAgIGZvb3RlckVsZW1lbnQuY2xhc3NOYW1lID0gXCJzaXRlLWZvb3RlclwiO1xyXG4gICAgICAgIGZvb3RlckVsZW1lbnQuaW5uZXJIVE1MID0gZm9vdGVySFRNTDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvb3RlckVsZW1lbnQpO1xyXG4gICAgfVxyXG4gICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbG9hZEhlYWRlcixcclxuICAgICAgICBsb2FkRm9vdGVyXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBsb2FkSGVhZGVyRm9vdGVyOyIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgIGNvbnN0IHByb2R1Y3RzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJvZHVjdHMnKSk7XHJcbiAgICBpZiAocHJvZHVjdHMpIHtcclxuICAgICAgICBkb20uZGlzcGxheUFsbFByb2R1Y3RzKHByb2R1Y3RzKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgcHJvZHVjdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Byb2R1Y3QnKSk7XHJcbiAgICBpZiAocHJvZHVjdCkge1xyXG4gICAgICAgIGRvbS5kaXNwbGF5UHJvZHVjdERldGFpbHMocHJvZHVjdCk7XHJcbiAgICB9XHJcbn0pXHJcblxyXG5jb25zdCBwcm9kdWN0ID0gKCgpID0+IHsgICAgXHJcbiAgICBsZXQgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTAwMC9hcGkvcHJvZHVjdHMnO1xyXG5cclxuICAgIGNvbnN0IGdldFByb2R1Y3RzID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ2V0U2VsZWN0ZWRQcm9kdWN0ID0gKHByb2R1Y3RJRCwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICBsZXQgcHJvZHVjdFVybCA9IHVybCArIGAvJHtwcm9kdWN0SUR9fWA7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHByb2R1Y3RVcmwpO1xyXG5cclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgcHJvZHVjdERhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhwcm9kdWN0RGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNlYXJjaFByb2R1Y3QgPSAoc2VhcmNoSW5wdXQsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IHNlYXJjaFVSTCA9IHVybCArIGA/c2VhcmNoPSR7c2VhcmNoSW5wdXR9YDtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgc2VhcmNoVVJMKTtcclxuICAgIFxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9kdWN0RGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHByb2R1Y3REYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRQcm9kdWN0cyxcclxuICAgICAgICBnZXRTZWxlY3RlZFByb2R1Y3QsXHJcbiAgICAgICAgc2VhcmNoUHJvZHVjdCxcclxuICAgIH1cclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHByb2R1Y3Q7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgbG9hZEhlYWRlckZvb3RlciBmcm9tICcuL2hlYWRlckZvb3Rlcic7XHJcbmltcG9ydCBoYW5kbGVyIGZyb20gJy4vaGFuZGxlcic7XHJcbmltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xyXG5pbXBvcnQgY2F0ZWdvcnkgZnJvbSAnLi9jYXRlZ29yeSc7XHJcblxyXG5sb2FkSGVhZGVyRm9vdGVyLmxvYWRIZWFkZXIoKTtcclxubG9hZEhlYWRlckZvb3Rlci5sb2FkRm9vdGVyKCk7XHJcblxyXG5jYXRlZ29yeS5nZXRDYXRlZ29yaWVzKChjYXRlZ29yaWVzKSA9PiB7XHJcbiAgICBkb20uZGlzcGxheUFsbENhdGVnb3JpZXMoY2F0ZWdvcmllcyk7XHJcbn0pO1xyXG5cclxuaGFuZGxlci5oYW5kbGVDbGlja3MoKTtcclxuXHJcbmlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWNjb3VudElEJykpIHtcclxuICAgIGRvbS5pc1VzZXJMb2dnZWRJbigpO1xyXG59IFxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=