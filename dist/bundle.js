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

                // Check for and store active cart information if present
                if (cartData && cartData.ShopCartID) {
                    localStorage.setItem('cartID', cartData.ShopCartID.toString());
                    localStorage.setItem('numCartItem', cartData.Quantity.toString());
                } else {
                    // Handle the case where there is no active cart
                    localStorage.removeItem('cartID');
                    localStorage.setItem('numCartItem', '0');
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
            if (data) { 
                console.log('Cart item modified successfully:', data);
            }
            callback();
            _dom__WEBPACK_IMPORTED_MODULE_0__["default"].updateCartSummary();
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
            _dom__WEBPACK_IMPORTED_MODULE_0__["default"].updateCartSummary(); 
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

        if (productDetails) {
            productImage.src = `assets/products/${productData['ProductImage']}`;
            productTitle.textContent = productData['ProductTitle'];
            productDesc.textContent = productData['ProductDesc'];
            productPrice.textContent = '$' + productData['Price'];

            addToCartBtn.setAttribute('data-productid', productData['ProductID']);
            quantityInput.setAttribute('data-productid', productData['ProductID']);
            increaseQBtn.setAttribute('data-productid', productData['ProductID']);
            decreaseQBtn.setAttribute('data-productid', productData['ProductID']);

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
        _cart__WEBPACK_IMPORTED_MODULE_0__["default"].modifyCartItem(localStorage.getItem('cartID'), productId, newQuantity, (error, data) => {
            if (error) {
                console.error('Error updating cart item:', error);
            } else {
                refreshCartItemDisplay(productId, newQuantity);
            }
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
            <span class="cart-price">€${item.Price}</span>
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

        if (totalPriceElement && itemCountElement) {
            totalPriceElement.textContent = `€${total.toFixed(2)}`;
            itemCountElement.textContent = `${itemCount} items`;
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
    }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (dom);

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
/* harmony import */ var _cart__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cart */ "./src/cart.js");






const handler = (() => {

    const handleClicks = () => {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        document.addEventListener('click', (e) => {
            let targetElement = e.target;

            if (targetElement.classList.contains('logoutBtn')) {
                localStorage.removeItem('accountID');
                localStorage.removeItem('userType');
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
                    window.location.href = 'productDetails.html';
                });  
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
                        _cart__WEBPACK_IMPORTED_MODULE_4__["default"].getCartItems(cartID, (items) => {
                            // If there are items in the cart, save them and redirect
                            if (items && items.length > 0) {
                                localStorage.setItem('cartItems', JSON.stringify(items));
                                window.location.href = 'shoppingCart.html';
                            } else {
                                console.log('No items found in cart.');
                            }
                        });
                    } else {
                        console.log('No cart found for the user.');
                    }
                } else {
                    window.location.href = 'login.html';
                }
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
                    _cart__WEBPACK_IMPORTED_MODULE_4__["default"].addOrUpdateCartItem(cartID, productID, quantity, name, newPrice, () => {
                        window.location.href = 'shoppingCart.html';
                    });
                };

                // Proceed only if quantity is more than 0
                if (quantity > 0) {
                    if (!cartID) {
                        _cart__WEBPACK_IMPORTED_MODULE_4__["default"].createNewCart(accountID, (newCartID) => {
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
                <a href="#feedback">Feedback</a>
                <a href="#contact">Contact</a>
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
                    <h3>Enchanted Planet</h3>
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHFEQUFnQjtBQUNoQjtBQUNBLGlEQUFRO0FBQ1IsSUFBSSw0Q0FBRztBQUNQLENBQUM7QUFDRDtBQUNBLGdEQUFPO0FBQ1A7QUFDQTtBQUNBLElBQUksNENBQUc7QUFDUCIsInNvdXJjZXMiOlsid2VicGFjazovL3Rlc3QvLi9zcmMvYWNjb3VudC5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2NhcnQuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9jYXRlZ29yeS5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2RvbS5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2hhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9oZWFkZXJGb290ZXIuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9wcm9kdWN0LmpzIiwid2VicGFjazovL3Rlc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGVzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdGVzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3Rlc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xyXG5cclxuY29uc3QgYWNjb3VudCA9ICgoKSA9PiB7XHJcbiAgICBsZXQgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTAwMC9hcGkvYWNjb3VudHMnO1xyXG5cclxuICAgIGNvbnN0IGNyZWF0ZUFjY291bnQgPSAoYWNjb3VudERhdGEpID0+IHtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignUE9TVCcsIHVybCArIFwiL2lkXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PSAyMDEpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPSdsb2dpbi5odG1sJztcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKEpTT04uc3RyaW5naWZ5KGFjY291bnREYXRhKSk7XHJcbiAgICAgICAgLy9kb20uZGlzcGxheU1lc3NhZ2UoJ3NpZ251cCcsICdlcnJvcicpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNoZWNrTG9naW4gPSAoZW1haWwsIHBhc3N3b3JkKSA9PiB7XHJcbiAgICAgICAgbGV0IGxvZ2luVVJMID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTAwMC9hcGkvbG9naW4nO1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdQT1NUJywgbG9naW5VUkwpO1xyXG4gICAgXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gSWYgZW1haWwgYW5kIHBhc3N3b3JkIGFyZSBmb3VuZFxyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VEYXRhID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWNjb3VudERhdGEgPSByZXNwb25zZURhdGEuQWNjb3VudDtcclxuICAgICAgICAgICAgICAgIGxldCBjYXJ0RGF0YSA9IHJlc3BvbnNlRGF0YS5DYXJ0O1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2FjY291bnRJRCcsIGFjY291bnREYXRhLklEKTtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyVHlwZScsIGFjY291bnREYXRhLlVzZXJUeXBlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgYW5kIHN0b3JlIGFjdGl2ZSBjYXJ0IGluZm9ybWF0aW9uIGlmIHByZXNlbnRcclxuICAgICAgICAgICAgICAgIGlmIChjYXJ0RGF0YSAmJiBjYXJ0RGF0YS5TaG9wQ2FydElEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcnRJRCcsIGNhcnREYXRhLlNob3BDYXJ0SUQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ251bUNhcnRJdGVtJywgY2FydERhdGEuUXVhbnRpdHkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGVyZSBpcyBubyBhY3RpdmUgY2FydFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdjYXJ0SUQnKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbnVtQ2FydEl0ZW0nLCAnMCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2luZGV4Lmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBlbWFpbDogZW1haWwsIHBhc3N3b3JkOiBwYXNzd29yZCB9KSk7XHJcbiAgICAgICAgLy8gSWYgZW1haWwgYW5kIHBhc3N3b3JkIG5vdCBmb3VuZFxyXG4gICAgICAgIC8vZG9tLmRpc3BsYXlMb2dpbkVycm9yKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGdldEFjY291bnQgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICBsZXQgc2VhcmNoVVJMID0gdXJsICsgYC8ke2xvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2NvdW50SUQnKX1gO1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCBzZWFyY2hVUkwpO1xyXG5cclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgYWNjb3VudERhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhhY2NvdW50RGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHVwZGF0ZUFjY291bnQgPSAoYWNjb3VudERhdGEpID0+IHtcclxuICAgICAgICBjb25zdCBhY2NvdW50SUQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWNjb3VudElEJyk7XHJcbiAgICAgICAgbGV0IHVwZGF0ZVVSTCA9IHVybCArIFwiL1wiICsgYWNjb3VudElEO1xyXG4gICAgICAgICBcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignUFVUJywgdXBkYXRlVVJMKTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gRGlzcGxheSBhY2NvdW50IHVwZGF0ZSBzdWNjZXNzXHJcbiAgICAgICAgICAgICAgICAvL2RvbS5kaXNwbGF5TWVzc2FnZSgndXBkYXRlJywgJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKEpTT04uc3RyaW5naWZ5KGFjY291bnREYXRhKSk7XHJcbiAgICAgICAgLy9kb20uZGlzcGxheU1lc3NhZ2UoJ3VwZGF0ZScsICdlcnJvcicpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRlbGV0ZUFjY291bnQgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYWNjb3VudElEID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnRJRCcpO1xyXG4gICAgICAgIGxldCBkZWxldGVVUkwgPSB1cmwgKyBcIi9cIiArIGFjY291bnRJRDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignREVMRVRFJywgZGVsZXRlVVJMKTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBhY2NvdW50IElEIGFuZCB1c2VyIHR5cGUgaW4gbG9jYWwgc3RvcmFnZVxyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FjY291bnRJRCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgYWNjb3VudCBkZWxldGlvbiBzdWNjZXNzXHJcbiAgICAgICAgICAgICAgICAvL2RvbS5kaXNwbGF5TWVzc2FnZSgnZGVsZXRlJywgJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIDUgc2Vjb25kIGRlbGF5IGFuZCByZXR1cm4gdG8gbG9naW4gZm9ybVxyXG4gICAgICAgICAgICAgICAgICAgIC8vZG9tLmRpc3BsYXlMb2dpbkZvcm0oKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2RvbS51c2VyTG9nZ2VkT3V0KCk7XHJcbiAgICAgICAgICAgICAgICB9LCA1MDAwKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICAgICAgLy8gRGlzcGxheSBlcnJvclxyXG4gICAgICAgIC8vZG9tLmRpc3BsYXlNZXNzYWdlKCdkZWxldGUnLCAnZXJyb3InKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZUFjY291bnQsXHJcbiAgICAgICAgY2hlY2tMb2dpbixcclxuICAgICAgICBnZXRBY2NvdW50LFxyXG4gICAgICAgIHVwZGF0ZUFjY291bnQsXHJcbiAgICAgICAgZGVsZXRlQWNjb3VudCxcclxuICAgIH1cclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFjY291bnQ7XHJcblxyXG4iLCJpbXBvcnQgZG9tIGZyb20gJy4vZG9tJztcclxuXHJcbmNvbnN0IGNhcnQgPSAoKCkgPT4ge1xyXG4gICAgbGV0IGNhcnRVcmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMDAwL2FwaS9jYXJ0JztcclxuXHJcbiAgICBjb25zdCBjcmVhdGVOZXdDYXJ0ID0gKHVzZXJJRCwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICBmZXRjaChgJHtjYXJ0VXJsfS8ke3VzZXJJRH1gLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1c2VySUQ6IHVzZXJJRCB9KSAvLyBNYWtlIHN1cmUgeW91ciBBUEkgZXhwZWN0cyB0aGUgYm9keSBpbiB0aGlzIGZvcm1hdFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgbmV3IGNhcnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuU2hvcENhcnRJRCkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YS5TaG9wQ2FydElELnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNhcnQgZGF0YScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3IgY3JlYXRpbmcgbmV3IGNhcnQ6JywgZXJyb3IpKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgYWRkT3JVcGRhdGVDYXJ0SXRlbSA9IChjYXJ0SUQsIHByb2R1Y3RJRCwgcXVhbnRpdHksIG5hbWUsIHByaWNlLCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgIGxldCBpdGVtRGF0YSA9IHtcclxuICAgICAgICAgICAgUHJvZHVjdElEOiBwYXJzZUludChwcm9kdWN0SUQsIDEwKSxcclxuICAgICAgICAgICAgUXVhbnRpdHk6IHF1YW50aXR5LFxyXG4gICAgICAgICAgICBOYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICBQcmljZTogcGFyc2VGbG9hdChwcmljZSkgXHJcbiAgICAgICAgfTtcclxuICAgIFxyXG4gICAgICAgIGZldGNoKGAke2NhcnRVcmx9LyR7Y2FydElEfS9pdGVtc2AsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShpdGVtRGF0YSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gYWRkIG9yIHVwZGF0ZSBjYXJ0IGl0ZW06ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDQgfHwgcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJDb250ZW50LUxlbmd0aFwiKSA9PT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSByZXNwb25zZSBpcyAyMDQgTm8gQ29udGVudCwgb3IgaWYgdGhlcmUncyBubyBjb250ZW50LCBkb24ndCB0cnkgdG8gcGFyc2UgaXRcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7IC8vIE9ubHkgcGFyc2UgYXMgSlNPTiBpZiByZXNwb25zZSBoYXMgY29udGVudFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7IC8vIE1ha2Ugc3VyZSBkYXRhIGV4aXN0cyBiZWZvcmUgbG9nZ2luZyBpdFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NhcnQgaXRlbSBhZGRlZC91cGRhdGVkIHN1Y2Nlc3NmdWxseTonLCBkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGdldENhcnRJdGVtcyA9IChjYXJ0SUQsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IHVybCA9IGAke2NhcnRVcmx9L2RldGFpbHMvJHtjYXJ0SUR9YDtcclxuXHJcbiAgICAgICAgZmV0Y2godXJsKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgICAgICAudGhlbihkYXRhID0+IGNhbGxiYWNrKGRhdGEpKVxyXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcikpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vZGlmeUNhcnRJdGVtID0gKGNhcnRJRCwgcHJvZHVjdElELCBuZXdRdWFudGl0eSwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICBsZXQgaXRlbURhdGEgPSB7XHJcbiAgICAgICAgICAgIFF1YW50aXR5OiBwYXJzZUludChuZXdRdWFudGl0eSwgMTApXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBmZXRjaChgJHtjYXJ0VXJsfS8ke2NhcnRJRH0vbW9kaWZ5LyR7cHJvZHVjdElEfWAsIHsgLy8gTWFrZSBzdXJlIHRoaXMgbWF0Y2hlcyB0aGUgY29ycmVjdCBlbmRwb2ludFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoaXRlbURhdGEpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIG1vZGlmeSBjYXJ0IGl0ZW06ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDQgfHwgcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJDb250ZW50LUxlbmd0aFwiKSA9PT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7IFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7IFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NhcnQgaXRlbSBtb2RpZmllZCBzdWNjZXNzZnVsbHk6JywgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgZG9tLnVwZGF0ZUNhcnRTdW1tYXJ5KCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IpKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgZGVsZXRlQ2FydEl0ZW0gPSAoY2FydElELCBwcm9kdWN0SUQsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgZmV0Y2goYCR7Y2FydFVybH0vJHtjYXJ0SUR9L2RlbGV0ZS8ke3Byb2R1Y3RJRH1gLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURSdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZGVsZXRlIGNhcnQgaXRlbTogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDYXJ0IGl0ZW0gZGVsZXRlZCBzdWNjZXNzZnVsbHk6JywgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgZG9tLnVwZGF0ZUNhcnRTdW1tYXJ5KCk7IFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY3JlYXRlTmV3Q2FydCxcclxuICAgICAgICBhZGRPclVwZGF0ZUNhcnRJdGVtLFxyXG4gICAgICAgIGdldENhcnRJdGVtcyxcclxuICAgICAgICBtb2RpZnlDYXJ0SXRlbSxcclxuICAgICAgICBkZWxldGVDYXJ0SXRlbSxcclxuICAgIH1cclxuXHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYXJ0OyIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xyXG5cclxuY29uc3QgY2F0ZWdvcnkgPSAoKCkgPT4geyAgICBcclxuICAgIGxldCB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMDAwL2FwaS9jYXRlZ29yaWVzJztcclxuXHJcbiAgICBjb25zdCBnZXRDYXRlZ29yaWVzID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ2V0U2VsZWN0ZWRDYXRlZ29yeSA9IChjYXRlZ29yeUlELCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgIGxldCBjYXRlZ29yeVVybCA9IHVybCArIGA/c2VhcmNoPSR7Y2F0ZWdvcnlJRH1gO1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCBjYXRlZ29yeVVybCk7XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0Q2F0ZWdvcmllcyxcclxuICAgICAgICBnZXRTZWxlY3RlZENhdGVnb3J5LFxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2F0ZWdvcnk7IiwiaW1wb3J0IGNhcnQgZnJvbSAnLi9jYXJ0JztcclxuXHJcbmNvbnN0IGRvbSA9ICgoKSA9PiB7XHJcbiAgICBjb25zdCBpc1VzZXJMb2dnZWRJbiA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBhdXRoTGlua3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aExpbmtzJyk7XHJcbiAgICAgICAgY29uc3QgbG9nb3V0TGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dvdXRMaW5rJyk7XHJcbiAgICAgICAgY29uc3QgYWNjb3VudExpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWNjb3VudExpbmsnKTtcclxuXHJcbiAgICAgICAgY29uc3QgaXNMb2dnZWRJbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2NvdW50SUQnKSAhPT0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKGlzTG9nZ2VkSW4pIHtcclxuICAgICAgICAgICAgLy8gSGlkZSBsb2dpbiBhbmQgcmVnaXN0ZXIgbGlua3NcclxuICAgICAgICAgICAgYXV0aExpbmtzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblxyXG4gICAgICAgICAgICAvLyBTaG93IGFjY291bnQgYW5kIGxvZ291dCBsaW5rc1xyXG4gICAgICAgICAgICBsb2dvdXRMaW5rLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgICAgICAgIGFjY291bnRMaW5rLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGF1dGhMaW5rcy5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgICAgICAgICBsb2dvdXRMaW5rLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIGFjY291bnRMaW5rLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfSBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkaXNwbGF5QWxsQ2F0ZWdvcmllcyA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2F0ZWdvcnlMaXN0aW5ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yeS1saXN0aW5ncycpO1xyXG4gICAgICAgIGlmIChjYXRlZ29yeUxpc3RpbmdzKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YS5DYXRlZ29yaWVzKTtcclxuXHJcbiAgICAgICAgICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeUxpc3RpbmdzLmlubmVySFRNTCArPSBgXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgY2F0ZWdvcnlcIiBkYXRhLWxpbmstY2F0ZWdvcnlpZD1cIiR7a2V5fVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cImFzc2V0cy8ke2RhdGEuQ2F0ZWdvcmllc1trZXldW1wiQ2F0SW1hZ2VcIl19XCIgZGF0YS1saW5rLWNhdGVnb3J5aWQ9XCIke2tleX1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNhdGVnb3J5QnRuXCIgZGF0YS1saW5rLWNhdGVnb3J5aWQ9XCIke2tleX1cIj4ke2RhdGEuQ2F0ZWdvcmllc1trZXldW1wiQ2F0TmFtZVwiXX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRpc3BsYXlBbGxQcm9kdWN0cyA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdExpc3RpbmdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2R1Y3QtbGlzdGluZ3MnKTtcclxuXHJcbiAgICAgICAgY29uc3QgY3JlYXRlUHJvZHVjdEJ0biA9ICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3JlYXRlUHJvZHVjdEJ0bicpO1xyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlclR5cGUnKSA9PSAndXNlcicgJiYgY3JlYXRlUHJvZHVjdEJ0bikge1xyXG4gICAgICAgICAgICBjcmVhdGVQcm9kdWN0QnRuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfSBcclxuXHJcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhLlByb2R1Y3RzKTtcclxuXHJcbiAgICAgICAgaWYgKHByb2R1Y3RMaXN0aW5ncykge1xyXG4gICAgICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdExpc3RpbmdzLmlubmVySFRNTCArPSBgXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgcHJvZHVjdFwiIGRhdGEtbGluay1wcm9kdWN0SUQ9XCIke2tleX1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCJhc3NldHMvcHJvZHVjdHMvJHtkYXRhLlByb2R1Y3RzW2tleV1bXCJQcm9kdWN0SW1hZ2VcIl19XCIgZGF0YS1saW5rLXByb2R1Y3RJRD1cIiR7a2V5fVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZHVjdC1uYW1lXCI+JHtkYXRhLlByb2R1Y3RzW2tleV1bXCJQcm9kdWN0VGl0bGVcIl19PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9kdWN0LXByaWNlXCI+JCR7ZGF0YS5Qcm9kdWN0c1trZXldW1wiUHJpY2VcIl19PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICBgO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2R1Y3RzJywgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRpc3BsYXlQcm9kdWN0RGV0YWlscyA9IChwcm9kdWN0RGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3REZXRhaWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2R1Y3REZXRhaWxzLWNvbnRhaW5lcicpO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RJbWFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLWltYWdlJyk7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdFRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2R1Y3QtdGl0bGUnKTtcclxuICAgICAgICBjb25zdCBwcm9kdWN0RGVzYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0LWRlc2NyaXB0aW9uJyk7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdFByaWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByaWNlJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGFkZFRvQ2FydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZGQtdG8tY2FydC1idG4nKTtcclxuICAgICAgICBjb25zdCBxdWFudGl0eUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3F1YW50aXR5LWlucHV0Jyk7XHJcbiAgICAgICAgY29uc3QgaW5jcmVhc2VRQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmluY3JlYXNlLXF1YW50aXR5Jyk7XHJcbiAgICAgICAgY29uc3QgZGVjcmVhc2VRQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlY3JlYXNlLXF1YW50aXR5Jyk7XHJcblxyXG4gICAgICAgIGlmIChwcm9kdWN0RGV0YWlscykge1xyXG4gICAgICAgICAgICBwcm9kdWN0SW1hZ2Uuc3JjID0gYGFzc2V0cy9wcm9kdWN0cy8ke3Byb2R1Y3REYXRhWydQcm9kdWN0SW1hZ2UnXX1gO1xyXG4gICAgICAgICAgICBwcm9kdWN0VGl0bGUudGV4dENvbnRlbnQgPSBwcm9kdWN0RGF0YVsnUHJvZHVjdFRpdGxlJ107XHJcbiAgICAgICAgICAgIHByb2R1Y3REZXNjLnRleHRDb250ZW50ID0gcHJvZHVjdERhdGFbJ1Byb2R1Y3REZXNjJ107XHJcbiAgICAgICAgICAgIHByb2R1Y3RQcmljZS50ZXh0Q29udGVudCA9ICckJyArIHByb2R1Y3REYXRhWydQcmljZSddO1xyXG5cclxuICAgICAgICAgICAgYWRkVG9DYXJ0QnRuLnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9kdWN0aWQnLCBwcm9kdWN0RGF0YVsnUHJvZHVjdElEJ10pO1xyXG4gICAgICAgICAgICBxdWFudGl0eUlucHV0LnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9kdWN0aWQnLCBwcm9kdWN0RGF0YVsnUHJvZHVjdElEJ10pO1xyXG4gICAgICAgICAgICBpbmNyZWFzZVFCdG4uc2V0QXR0cmlidXRlKCdkYXRhLXByb2R1Y3RpZCcsIHByb2R1Y3REYXRhWydQcm9kdWN0SUQnXSk7XHJcbiAgICAgICAgICAgIGRlY3JlYXNlUUJ0bi5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZHVjdGlkJywgcHJvZHVjdERhdGFbJ1Byb2R1Y3RJRCddKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9kdWN0JywgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNoYW5nZUl0ZW1RdWFudGl0eSA9IChhY3Rpb24pID0+IHtcclxuICAgICAgICBsZXQgaXRlbVF1YW50aXR5SW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcXVhbnRpdHktaW5wdXQnKTtcclxuICAgICAgICBsZXQgaXRlbVF1YW50aXR5ID0gcGFyc2VJbnQoaXRlbVF1YW50aXR5SW5wdXQudmFsdWUsIDEwKTtcclxuXHJcbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ2luY3JlYXNlJykge1xyXG4gICAgICAgICAgICBpdGVtUXVhbnRpdHkgKz0gMTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGVsc2UgaWYgKGFjdGlvbiA9PT0gJ2RlY3JlYXNlJyAmJiBpdGVtUXVhbnRpdHkgPiAwKSB7XHJcbiAgICAgICAgICAgIGl0ZW1RdWFudGl0eSAtPSAxOyBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW1RdWFudGl0eUlucHV0LnZhbHVlID0gaXRlbVF1YW50aXR5OyBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB1cGRhdGVRdWFudGl0eSA9IChwcm9kdWN0SWQsIG5ld1F1YW50aXR5KSA9PiB7XHJcbiAgICAgICAgY2FydC5tb2RpZnlDYXJ0SXRlbShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydElEJyksIHByb2R1Y3RJZCwgbmV3UXVhbnRpdHksIChlcnJvciwgZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nIGNhcnQgaXRlbTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWZyZXNoQ2FydEl0ZW1EaXNwbGF5KHByb2R1Y3RJZCwgbmV3UXVhbnRpdHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0IGRlbGV0ZUNhcnRJdGVtID0gKHByb2R1Y3RJZCkgPT4ge1xyXG4gICAgICAgIGNhcnQuZGVsZXRlQ2FydEl0ZW0obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnRJRCcpLCBwcm9kdWN0SWQsIChlcnJvciwgZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGRlbGV0aW5nIGNhcnQgaXRlbTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FydCBpdGVtIGRlbGV0ZWQ6JywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVDYXJ0SXRlbURpc3BsYXkocHJvZHVjdElkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBvcHVsYXRlU2hvcHBpbmdDYXJ0ID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNhcnRJRCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjYXJ0SUQnKTtcclxuICAgICAgICBpZiAoIWNhcnRJRCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdObyBjYXJ0IGZvdW5kLicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYXJ0LmdldENhcnRJdGVtcyhjYXJ0SUQsIChpdGVtcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYXJ0SXRlbXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydC1pdGVtcycpO1xyXG4gICAgICAgICAgICBjYXJ0SXRlbXNDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5UHJvZHVjdEluQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHVwZGF0ZUNhcnRTdW1tYXJ5KGl0ZW1zKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgZGlzcGxheVByb2R1Y3RJbkNhcnQgPSAoaXRlbSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNhcnRJdGVtc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0LWl0ZW1zJyk7XHJcbiAgICAgICAgY29uc3QgY2FydEl0ZW1FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY2FydEl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NhcnQtaXRlbScpO1xyXG4gICAgICAgIGNhcnRJdGVtRWxlbWVudC5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL3Byb2R1Y3RzLyR7aXRlbS5Qcm9kdWN0SW1hZ2V9XCIgYWx0PVwiJHtpdGVtLlByb2R1Y3RUaXRsZX1cIj5cclxuICAgICAgICAgICAgPHNwYW4+JHtpdGVtLlByb2R1Y3RUaXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJxdWFudGl0eS1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicXVhbnRpdHktYnRuIGRlY3JlYXNlLXF1YW50aXR5XCIgZGF0YS1wcm9kdWN0aWQ9XCIke2l0ZW0uUHJvZHVjdElEfVwiPjxpb24taWNvbiBuYW1lPVwicmVtb3ZlLW91dGxpbmVcIj48L2lvbi1pY29uPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cInF1YW50aXR5LWlucHV0XCIgdmFsdWU9XCIke2l0ZW0uUXVhbnRpdHl9XCIgbWluPVwiMFwiIGRhdGEtcHJvZHVjdGlkPVwiJHtpdGVtLlByb2R1Y3RJRH1cIj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxdWFudGl0eS1idG4gaW5jcmVhc2UtcXVhbnRpdHlcIiBkYXRhLXByb2R1Y3RpZD1cIiR7aXRlbS5Qcm9kdWN0SUR9XCI+PGlvbi1pY29uIG5hbWU9XCJhZGQtb3V0bGluZVwiPjwvaW9uLWljb24+PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcnQtcHJpY2VcIj7igqwke2l0ZW0uUHJpY2V9PC9zcGFuPlxyXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZGVsQ2FydEl0ZW1CdG5cIiBkYXRhLXByb2R1Y3RpZD1cIiR7aXRlbS5Qcm9kdWN0SUR9XCI+PGlvbi1pY29uIG5hbWU9XCJjbG9zZS1vdXRsaW5lXCI+PC9pb24taWNvbj48L2J1dHRvbj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIGNhcnRJdGVtc0NvbnRhaW5lci5hcHBlbmRDaGlsZChjYXJ0SXRlbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICAvLyBSZWF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gbmV3bHkgYWRkZWQgZWxlbWVudHNcclxuICAgICAgICBhdHRhY2hRdWFudGl0eVVwZGF0ZUxpc3RlbmVycyhjYXJ0SXRlbUVsZW1lbnQsIGl0ZW0uUHJvZHVjdElEKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZWZyZXNoQ2FydEl0ZW1EaXNwbGF5ID0gKHByb2R1Y3RJZCwgbmV3UXVhbnRpdHkpID0+IHtcclxuICAgICAgICAvLyBVcGRhdGUgdGhlIGRpc3BsYXllZCBxdWFudGl0eSBpbiB0aGUgY2FydCBpdGVtXHJcbiAgICAgICAgY29uc3QgaXRlbUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuY2FydC1pdGVtW2RhdGEtcHJvZHVjdGlkPVwiJHtwcm9kdWN0SWR9XCJdIGlucHV0W3R5cGU9XCJudW1iZXJcIl1gKTtcclxuICAgICAgICBpZiAoaXRlbUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaXRlbUVsZW1lbnQudmFsdWUgPSBuZXdRdWFudGl0eTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXBkYXRlQ2FydFN1bW1hcnkoKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIGNvbnN0IHJlbW92ZUNhcnRJdGVtRGlzcGxheSA9IChwcm9kdWN0SWQpID0+IHtcclxuICAgICAgICAvLyBSZW1vdmUgdGhlIGNhcnQgaXRlbSBlbGVtZW50IGZyb20gdGhlIERPTVxyXG4gICAgICAgIGNvbnN0IGl0ZW1FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmNhcnQtaXRlbVtkYXRhLXByb2R1Y3RpZD1cIiR7cHJvZHVjdElkfVwiXWApO1xyXG4gICAgICAgIGlmIChpdGVtRWxlbWVudCkge1xyXG4gICAgICAgICAgICBpdGVtRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXBkYXRlQ2FydFN1bW1hcnkoKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIGNvbnN0IHVwZGF0ZUNhcnRTdW1tYXJ5ID0gKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRvdGFsIHByaWNlIGFuZCBpdGVtIGNvdW50XHJcbiAgICAgICAgbGV0IHRvdGFsID0gMDtcclxuICAgICAgICBsZXQgaXRlbUNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgdG90YWwgKz0gaXRlbS5QcmljZSAqIGl0ZW0uUXVhbnRpdHk7XHJcbiAgICAgICAgICAgIGl0ZW1Db3VudCArPSBpdGVtLlF1YW50aXR5O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBVcGRhdGUgdGhlIHRvdGFsIHByaWNlIGFuZCBpdGVtIGNvdW50IGluIHRoZSBzdW1tYXJ5IHNlY3Rpb25cclxuICAgICAgICBjb25zdCB0b3RhbFByaWNlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdW1tYXJ5IC50b3RhbC1wcmljZSBzcGFuOmxhc3QtY2hpbGQnKTtcclxuICAgICAgICBjb25zdCBpdGVtQ291bnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnQtaGVhZGVyIHAnKTtcclxuXHJcbiAgICAgICAgaWYgKHRvdGFsUHJpY2VFbGVtZW50ICYmIGl0ZW1Db3VudEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdG90YWxQcmljZUVsZW1lbnQudGV4dENvbnRlbnQgPSBg4oKsJHt0b3RhbC50b0ZpeGVkKDIpfWA7XHJcbiAgICAgICAgICAgIGl0ZW1Db3VudEVsZW1lbnQudGV4dENvbnRlbnQgPSBgJHtpdGVtQ291bnR9IGl0ZW1zYDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGF0dGFjaFF1YW50aXR5VXBkYXRlTGlzdGVuZXJzID0gKGNhcnRJdGVtRWxlbWVudCwgcHJvZHVjdElEKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGVjcmVhc2VCdXR0b24gPSBjYXJ0SXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRlY3JlYXNlLXF1YW50aXR5Jyk7XHJcbiAgICAgICAgY29uc3QgaW5jcmVhc2VCdXR0b24gPSBjYXJ0SXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmluY3JlYXNlLXF1YW50aXR5Jyk7XHJcbiAgICAgICAgY29uc3QgZGVsZXRlQnV0dG9uID0gY2FydEl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWxDYXJ0SXRlbUJ0bicpO1xyXG4gICAgICAgIGNvbnN0IHF1YW50aXR5SW5wdXQgPSBjYXJ0SXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignI3F1YW50aXR5LWlucHV0Jyk7XHJcbiAgICBcclxuICAgICAgICBkZWNyZWFzZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3UXVhbnRpdHkgPSBNYXRoLm1heCgwLCBwYXJzZUludChxdWFudGl0eUlucHV0LnZhbHVlLCAxMCkgLSAxKTtcclxuICAgICAgICAgICAgaWYgKG5ld1F1YW50aXR5ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlUXVhbnRpdHkocHJvZHVjdElELCBuZXdRdWFudGl0eSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGVDYXJ0SXRlbShwcm9kdWN0SUQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICBpbmNyZWFzZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3UXVhbnRpdHkgPSBwYXJzZUludChxdWFudGl0eUlucHV0LnZhbHVlLCAxMCkgKyAxO1xyXG4gICAgICAgICAgICB1cGRhdGVRdWFudGl0eShwcm9kdWN0SUQsIG5ld1F1YW50aXR5KTtcclxuICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgIGRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgZGVsZXRlQ2FydEl0ZW0ocHJvZHVjdElEKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpc1VzZXJMb2dnZWRJbixcclxuICAgICAgICBkaXNwbGF5QWxsQ2F0ZWdvcmllcyxcclxuICAgICAgICBkaXNwbGF5QWxsUHJvZHVjdHMsXHJcbiAgICAgICAgZGlzcGxheVByb2R1Y3REZXRhaWxzLFxyXG4gICAgICAgIGNoYW5nZUl0ZW1RdWFudGl0eSxcclxuICAgICAgICB1cGRhdGVRdWFudGl0eSxcclxuICAgICAgICBkZWxldGVDYXJ0SXRlbSxcclxuICAgICAgICBwb3B1bGF0ZVNob3BwaW5nQ2FydCxcclxuICAgICAgICB1cGRhdGVDYXJ0U3VtbWFyeSxcclxuICAgIH1cclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRvbTsiLCJpbXBvcnQgZG9tIGZyb20gJy4vZG9tJztcclxuaW1wb3J0IGFjY291bnQgZnJvbSAnLi9hY2NvdW50JztcclxuaW1wb3J0IHByb2R1Y3QgZnJvbSAnLi9wcm9kdWN0JztcclxuaW1wb3J0IGNhdGVnb3J5IGZyb20gJy4vY2F0ZWdvcnknO1xyXG5pbXBvcnQgY2FydCBmcm9tICcuL2NhcnQnO1xyXG5cclxuY29uc3QgaGFuZGxlciA9ICgoKSA9PiB7XHJcblxyXG4gICAgY29uc3QgaGFuZGxlQ2xpY2tzID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxvZ2luRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbkZvcm0nKTtcclxuICAgICAgICBjb25zdCByZWdpc3RlckZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVnaXN0ZXJGb3JtJyk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRhcmdldEVsZW1lbnQgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbG9nb3V0QnRuJykpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhY2NvdW50SUQnKTtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyVHlwZScpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3BCdG4nKSkge1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdC5nZXRQcm9kdWN0cygocHJvZHVjdHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJvZHVjdHMnLCBKU09OLnN0cmluZ2lmeShwcm9kdWN0cykpOyAvLyBTYXZlIHRoZSBwcm9kdWN0cyBpbiBsb2NhbFN0b3JhZ2VcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdwcm9kdWN0cy5odG1sJztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGluay1wcm9kdWN0aWQnKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjdElEID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWxpbmstcHJvZHVjdGlkJyk7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0LmdldFNlbGVjdGVkUHJvZHVjdChwcm9kdWN0SUQsIChwcm9kdWN0RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9kdWN0JywgSlNPTi5zdHJpbmdpZnkocHJvZHVjdERhdGEpKTsgLy8gU2F2ZSB0aGUgc2VsZWN0ZWQgcHJvZHVjdCBpbiBsb2NhbFN0b3JhZ2VcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdwcm9kdWN0RGV0YWlscy5odG1sJztcclxuICAgICAgICAgICAgICAgIH0pOyAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnZGF0YS1saW5rLWNhdGVnb3J5aWQnKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlJRCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1saW5rLWNhdGVnb3J5aWQnKTtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5LmdldFNlbGVjdGVkQ2F0ZWdvcnkoY2F0ZWdvcnlJRCwgKHByb2R1Y3RzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2R1Y3RzJywgSlNPTi5zdHJpbmdpZnkocHJvZHVjdHMpKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAncHJvZHVjdHMuaHRtbCc7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpID09ICdzdWJtaXRTZWFyY2gnKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VhcmNoQmFySW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2VhcmNoLWJhcicpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdC5zZWFyY2hQcm9kdWN0KHNlYXJjaEJhcklucHV0LCAocHJvZHVjdHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJvZHVjdHMnLCBKU09OLnN0cmluZ2lmeShwcm9kdWN0cykpOyBcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdwcm9kdWN0cy5odG1sJztcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY2FydC1saW5rJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFjY291bnRJRCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2NvdW50SUQnKTtcclxuICAgICAgICAgICAgICAgIGlmIChhY2NvdW50SUQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXJ0SUQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydElEJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhcnRJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0LmdldENhcnRJdGVtcyhjYXJ0SUQsIChpdGVtcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIGl0ZW1zIGluIHRoZSBjYXJ0LCBzYXZlIHRoZW0gYW5kIHJlZGlyZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbXMgJiYgaXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYXJ0SXRlbXMnLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ3Nob3BwaW5nQ2FydC5odG1sJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGl0ZW1zIGZvdW5kIGluIGNhcnQuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBjYXJ0IGZvdW5kIGZvciB0aGUgdXNlci4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2xvZ2luLmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKGxvZ2luRm9ybSkge1xyXG4gICAgICAgICAgICBsb2dpbkZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVtYWlsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luRW1haWwnKS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhc3N3b3JkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luUGFzc3dvcmQnKS52YWx1ZTtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgYWNjb3VudC5jaGVja0xvZ2luKGVtYWlsLCBwYXNzd29yZCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChyZWdpc3RlckZvcm0pIHtcclxuICAgICAgICAgICAgcmVnaXN0ZXJGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlZ2lzdGVyTmFtZScpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZW1haWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVnaXN0ZXJFbWFpbCcpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFzc3dvcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVnaXN0ZXJQYXNzd29yZCcpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7IC8vIEdldCBjdXJyZW50IGRhdGUgaW4gSVNPIGZvcm1hdFxyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGN1cnJlbnREYXRlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBkYXRlLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTkpLnJlcGxhY2UoJ1QnLCAnICcpOyAvLyBZWVlZLU1NLUREIEhIOk1NOlNTXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIEpTT05cclxuICAgICAgICAgICAgICAgIGxldCBhY2NvdW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBcIk5hbWVcIjogbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcIkVtYWlsXCI6IGVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiUGFzc3dvcmRcIjogcGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJDcmVhdGVkIEF0XCI6IGZvcm1hdHRlZERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJVc2VyVHlwZVwiOiAndXNlcidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGFjY291bnQuY3JlYXRlQWNjb3VudChhY2NvdW50RGF0YSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0UXVhbnRpdHlDb250cm9sTGlzdGVuZXJzKCcucHJvZHVjdERldGFpbHMtY29udGFpbmVyJyk7XHJcbiAgICAgICAgLy8gU2hvcHBpbmcgQ2FydCBwYWdlIHNwZWNpZmljIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJ3Nob3BwaW5nQ2FydC5odG1sJykpIHtcclxuICAgICAgICAgICAgZG9tLnBvcHVsYXRlU2hvcHBpbmdDYXJ0KCk7XHJcbiAgICAgICAgICAgIGluaXRDYXJ0UGFnZUxpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygncHJvZHVjdERldGFpbHMuaHRtbCcpKSB7XHJcbiAgICAgICAgICAgIGluaXRQcm9kdWN0RGV0YWlsc0xpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnc2hvcHBpbmdDYXJ0Lmh0bWwnKSkge1xyXG4gICAgICAgICAgICBkb20ucG9wdWxhdGVTaG9wcGluZ0NhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaW5pdFF1YW50aXR5Q29udHJvbExpc3RlbmVycyA9IChjb250YWluZXJTZWxlY3RvcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyU2VsZWN0b3IpO1xyXG4gICAgICAgIGlmICghY29udGFpbmVyKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZS50YXJnZXQ7XHJcbiAgICAgICAgICAgIGxldCBxdWFudGl0eUlucHV0ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNxdWFudGl0eS1pbnB1dCcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmNyZWFzZS1xdWFudGl0eScpKSB7XHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eUlucHV0LnZhbHVlID0gcGFyc2VJbnQocXVhbnRpdHlJbnB1dC52YWx1ZSwgMTApICsgMTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZGVjcmVhc2UtcXVhbnRpdHknKSkge1xyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHlJbnB1dC52YWx1ZSA9IE1hdGgubWF4KDAsIHBhcnNlSW50KHF1YW50aXR5SW5wdXQudmFsdWUsIDEwKSAtIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGluaXRDYXJ0UGFnZUxpc3RlbmVycyA9ICgpID0+IHtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FydC1pdGVtJykuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGVjcmVhc2VCdXR0b24gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5kZWNyZWFzZS1xdWFudGl0eScpO1xyXG4gICAgICAgICAgICBjb25zdCBpbmNyZWFzZUJ1dHRvbiA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmluY3JlYXNlLXF1YW50aXR5Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1YW50aXR5SW5wdXQgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9bnVtYmVyXScpOyAvLyBFbnN1cmUgdGhpcyBtYXRjaGVzIHlvdXIgSFRNTFxyXG5cclxuICAgICAgICAgICAgZGVjcmVhc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eUlucHV0LnZhbHVlID0gTWF0aC5tYXgoMCwgcGFyc2VJbnQocXVhbnRpdHlJbnB1dC52YWx1ZSwgMTApIC0gMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaW5jcmVhc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eUlucHV0LnZhbHVlID0gcGFyc2VJbnQocXVhbnRpdHlJbnB1dC52YWx1ZSwgMTApICsgMTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGluaXRQcm9kdWN0RGV0YWlsc0xpc3RlbmVycyA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBhZGRUb0NhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWRkLXRvLWNhcnQtYnRuJyk7XHJcbiAgICAgICAgaWYgKGFkZFRvQ2FydEJ1dHRvbikge1xyXG4gICAgICAgICAgICBhZGRUb0NhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0SUQgPSBhZGRUb0NhcnRCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXByb2R1Y3RpZCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcXVhbnRpdHkgPSBwYXJzZUludChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcXVhbnRpdHktaW5wdXQnKS52YWx1ZSwgMTApO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYWNjb3VudElEID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnRJRCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJpY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJpY2UnKS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1ByaWNlID0gcHJpY2UucmVwbGFjZSgnJCcsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdC10aXRsZScpLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB1c2VyIGlzIGxvZ2dlZCBpbiBieSBjaGVja2luZyBmb3IgYWNjb3VudElEXHJcbiAgICAgICAgICAgICAgICBpZiAoIWFjY291bnRJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFVzZXIgaXMgbm90IGxvZ2dlZCBpbiwgcmVkaXJlY3QgdG8gbG9naW4gcGFnZVxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2xvZ2luLmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY2FydElEID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnRJRCcpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRQcm9kdWN0VG9DYXJ0Q2FsbGJhY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FydC5hZGRPclVwZGF0ZUNhcnRJdGVtKGNhcnRJRCwgcHJvZHVjdElELCBxdWFudGl0eSwgbmFtZSwgbmV3UHJpY2UsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnc2hvcHBpbmdDYXJ0Lmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBQcm9jZWVkIG9ubHkgaWYgcXVhbnRpdHkgaXMgbW9yZSB0aGFuIDBcclxuICAgICAgICAgICAgICAgIGlmIChxdWFudGl0eSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNhcnRJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0LmNyZWF0ZU5ld0NhcnQoYWNjb3VudElELCAobmV3Q2FydElEKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJ0SUQgPSBuZXdDYXJ0SUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2FydElEJywgY2FydElEKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFByb2R1Y3RUb0NhcnRDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRQcm9kdWN0VG9DYXJ0Q2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHsgaGFuZGxlQ2xpY2tzIH07XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVyOyIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xyXG5cclxuY29uc3QgbG9hZEhlYWRlckZvb3RlciA9ICgoKSA9PiB7XHJcbiAgICBjb25zdCBsb2FkSGVhZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlckhUTUwgPSBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3AtbmF2XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImxvZ29cIiBocmVmPVwiaW5kZXguaHRtbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL2Jsb2Nrcy5wbmdcIiBhbHQ9XCJsb2dvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgyPkVjb1RveTwvaDI+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2VhcmNoLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpb24taWNvbiBuYW1lPVwic2VhcmNoLW91dGxpbmVcIiBpZD1cInN1Ym1pdFNlYXJjaFwiPjwvaW9uLWljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzZWFyY2hcIiBpZD1cInNlYXJjaC1iYXJcIiBwbGFjZWhvbGRlcj1cIlNlYXJjaCBhIHByb2R1Y3QuLi5cIj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXItYWN0aW9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhdXRoTGlua3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PGlvbi1pY29uIG5hbWU9XCJsb2ctaW4tb3V0bGluZVwiPjwvaW9uLWljb24+PGEgaHJlZj1cImxvZ2luLmh0bWxcIj5Mb2dpbjwvYT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPjxpb24taWNvbiBuYW1lPVwicGVyc29uLWFkZC1vdXRsaW5lXCI+PC9pb24taWNvbj48YSBocmVmPVwicmVnaXN0ZXIuaHRtbFwiPlJlZ2lzdGVyPC9hPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImFjY291bnRMaW5rXCI+PGlvbi1pY29uIG5hbWU9XCJwZXJzb24tb3V0bGluZVwiPjwvaW9uLWljb24+PGEgaHJlZj1cIiNcIj5BY2NvdW50PC9hPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImxvZ291dExpbmtcIj48aW9uLWljb24gbmFtZT1cImxvZy1vdXQtb3V0bGluZVwiPjwvaW9uLWljb24+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImxvZ291dEJ0blwiPkxvZ291dDwvYT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjYXJ0LWxpbmtcIj48aW9uLWljb24gbmFtZT1cImJhc2tldC1vdXRsaW5lXCI+PC9pb24taWNvbj5CYXNrZXQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxuYXY+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInNob3BCdG5cIj5TaG9wPC9hPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNmZWVkYmFja1wiPkZlZWRiYWNrPC9hPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNjb250YWN0XCI+Q29udGFjdDwvYT5cclxuICAgICAgICAgICAgPC9uYXY+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY29uc3QgaGVhZGVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hlYWRlcicpO1xyXG4gICAgICAgIGhlYWRlckVsZW1lbnQuaW5uZXJIVE1MID0gaGVhZGVySFRNTDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShoZWFkZXJFbGVtZW50LCBkb2N1bWVudC5ib2R5LmZpcnN0Q2hpbGQpO1xyXG5cclxuICAgICAgICBkb20uaXNVc2VyTG9nZ2VkSW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2FkRm9vdGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZvb3RlckhUTUwgPSBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb290ZXItY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbHVtblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz5TaG9wPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkFsbCBQcm9kdWN0czwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5CZXN0IFNlbGxlcnM8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+TmV3IEluPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvb3Rlci1jb2x1bW5cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDM+RW5jaGFudGVkIFBsYW5ldDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5Ib21lPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkFib3V0PC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkJsb2c8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+Q29udGFjdDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb290ZXItY29sdW1uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgzPk15IEFjY291bnQ8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+TG9naW48L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+T3JkZXJzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkFjY291bnQgZGV0YWlsczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5Gb3Jnb3QgcGFzc3dvcmQ8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbHVtblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz5HZW5lcmFsPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPlByaXZhY3kgUG9saWN5PC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPlRlcm1zICYgQ29uZGl0aW9uczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5EZWxpdmVyeSBhbmQgUmV0dXJuczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb290ZXItc29jaWFsLXBheW1lbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic29jaWFsLWljb25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gVXNlIGFjdHVhbCBpY29ucyBvciBpbWFnZXMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCI+PGltZyBzcmM9XCJhc3NldHMvZmFjZWJvb2sucG5nXCIgYWx0PVwiRmFjZWJvb2tcIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCI+PGltZyBzcmM9XCJhc3NldHMvaW5zdGFncmFtLnBuZ1wiIGFsdD1cIkluc3RhZ3JhbVwiPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIj48aW1nIHNyYz1cImFzc2V0cy9waW50ZXJlc3QucG5nXCIgYWx0PVwiUGludGVyZXN0XCI+PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLWJvdHRvbVwiPlxyXG4gICAgICAgICAgICAgICAgPHA+wqkgMjAyNCBFY29Ub3kuIEFsbCBSaWdodHMgUmVzZXJ2ZWQgfCBXZWJzaXRlIGJ5IHVzIDozPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjb25zdCBmb290ZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9vdGVyJyk7XHJcbiAgICAgICAgZm9vdGVyRWxlbWVudC5jbGFzc05hbWUgPSBcInNpdGUtZm9vdGVyXCI7XHJcbiAgICAgICAgZm9vdGVyRWxlbWVudC5pbm5lckhUTUwgPSBmb290ZXJIVE1MO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9vdGVyRWxlbWVudCk7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsb2FkSGVhZGVyLFxyXG4gICAgICAgIGxvYWRGb290ZXJcclxuICAgIH1cclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGxvYWRIZWFkZXJGb290ZXI7IiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgcHJvZHVjdHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcm9kdWN0cycpKTtcclxuICAgIGlmIChwcm9kdWN0cykge1xyXG4gICAgICAgIGRvbS5kaXNwbGF5QWxsUHJvZHVjdHMocHJvZHVjdHMpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBwcm9kdWN0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJvZHVjdCcpKTtcclxuICAgIGlmIChwcm9kdWN0KSB7XHJcbiAgICAgICAgZG9tLmRpc3BsYXlQcm9kdWN0RGV0YWlscyhwcm9kdWN0KTtcclxuICAgIH1cclxufSlcclxuXHJcbmNvbnN0IHByb2R1Y3QgPSAoKCkgPT4geyAgICBcclxuICAgIGxldCB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMDAwL2FwaS9wcm9kdWN0cyc7XHJcblxyXG4gICAgY29uc3QgZ2V0UHJvZHVjdHMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsKTtcclxuICAgICAgICBcclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBnZXRTZWxlY3RlZFByb2R1Y3QgPSAocHJvZHVjdElELCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgIGxldCBwcm9kdWN0VXJsID0gdXJsICsgYC8ke3Byb2R1Y3RJRH19YDtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgcHJvZHVjdFVybCk7XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9kdWN0RGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHByb2R1Y3REYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2VhcmNoUHJvZHVjdCA9IChzZWFyY2hJbnB1dCwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICBsZXQgc2VhcmNoVVJMID0gdXJsICsgYD9zZWFyY2g9JHtzZWFyY2hJbnB1dH1gO1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCBzZWFyY2hVUkwpO1xyXG4gICAgXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IHByb2R1Y3REYXRhID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgY2FsbGJhY2socHJvZHVjdERhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFByb2R1Y3RzLFxyXG4gICAgICAgIGdldFNlbGVjdGVkUHJvZHVjdCxcclxuICAgICAgICBzZWFyY2hQcm9kdWN0LFxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJvZHVjdDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBsb2FkSGVhZGVyRm9vdGVyIGZyb20gJy4vaGVhZGVyRm9vdGVyJztcclxuaW1wb3J0IGhhbmRsZXIgZnJvbSAnLi9oYW5kbGVyJztcclxuaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcbmltcG9ydCBjYXRlZ29yeSBmcm9tICcuL2NhdGVnb3J5JztcclxuXHJcbmxvYWRIZWFkZXJGb290ZXIubG9hZEhlYWRlcigpO1xyXG5sb2FkSGVhZGVyRm9vdGVyLmxvYWRGb290ZXIoKTtcclxuXHJcbmNhdGVnb3J5LmdldENhdGVnb3JpZXMoKGNhdGVnb3JpZXMpID0+IHtcclxuICAgIGRvbS5kaXNwbGF5QWxsQ2F0ZWdvcmllcyhjYXRlZ29yaWVzKTtcclxufSk7XHJcblxyXG5oYW5kbGVyLmhhbmRsZUNsaWNrcygpO1xyXG5cclxuaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2NvdW50SUQnKSkge1xyXG4gICAgZG9tLmlzVXNlckxvZ2dlZEluKCk7XHJcbn0gXHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==