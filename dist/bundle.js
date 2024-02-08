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
                    localStorage.setItem('CartID', cartData.ShopCartID.toString());
                    localStorage.setItem('NumCartItem', cartData.Quantity.toString());
                } else {
                    // Handle the case where there is no active cart
                    localStorage.removeItem('CartID');
                    localStorage.setItem('NumCartItem', '0');
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


document.addEventListener('DOMContentLoaded', () => {
    const recentlyAddedProduct = JSON.parse(localStorage.getItem('recentlyAddedProduct'));
    if (recentlyAddedProduct) {
        _dom__WEBPACK_IMPORTED_MODULE_0__["default"].displayProductInCart(recentlyAddedProduct);
        localStorage.removeItem('recentlyAddedProduct');
    }
});

const cart = (() => {







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
/* harmony import */ var _account__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./account */ "./src/account.js");
/* harmony import */ var _category__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./category */ "./src/category.js");



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
        if (localStorage.getItem('userType') == 'user') {
            document.querySelector('.createProductBtn').style.display = 'none';
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


        if (productDetails) {
            productImage.src = `assets/products/${productData['ProductImage']}`;
            productTitle.textContent = productData['ProductTitle'];
            productDesc.textContent = productData['ProductDesc'];
            productPrice.textContent = '$' + productData['Price'];

            addToCartBtn.setAttribute('data-productid', productData['ProductID']);

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

    function updateQuantity(productId, newQuantity) {
        cartApi.modifyCartItem(localStorage.getItem('CartID'), productId, newQuantity, (error, data) => {
            if (error) {
                console.error('Error updating cart item:', error);
            } else {
                console.log('Cart item updated:', data);
                //window.location.reload(); 
            }
        });
    }
    
    function deleteCartItem(productId) {
        cartApi.deleteCartItem(localStorage.getItem('CartID'), productId, (error, data) => {
            if (error) {
                console.error('Error deleting cart item:', error);
            } else {
                console.log('Cart item deleted:', data);
                window.location.reload(); 
            }
        });
    }

    const displayProductInCart = (productData) => {
        const cartItemsContainer = document.querySelector('.cart-items');
        const productElement = document.createElement('div');
        productElement.className = 'cart-item';
        productElement.innerHTML = `
            <img src="${productData.productImage}" alt="${productData.productName}">
            <span>${productData.productName}</span>
            <div class="quantity-section">
                <button class="quantity-btn decrease-quantity"><ion-icon class="decrease-quantity" name="remove-outline"></ion-icon></button>
                <input type="number" id="quantity-input" value="${productData.quantity}" min="0">
                <button class="quantity-btn increase-quantity"><ion-icon class="increase-quantity" name="add-outline"></ion-icon></button>
            </div>
            <span class="cart-price">€${productData.productPrice}</span>
            <button class="delCartItemBtn"><ion-icon name="close-outline"></ion-icon></button>
        `;
        cartItemsContainer.appendChild(productElement);
    }

    return {
        isUserLoggedIn,
        displayAllCategories,
        displayAllProducts,
        displayProductDetails,
        changeItemQuantity,
        updateQuantity,
        deleteCartItem,
        displayProductInCart,
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

            if (targetElement.classList.contains('increase-quantity')) {
                _dom__WEBPACK_IMPORTED_MODULE_0__["default"].changeItemQuantity('increase');
            }

            if (targetElement.classList.contains('decrease-quantity')) {
                _dom__WEBPACK_IMPORTED_MODULE_0__["default"].changeItemQuantity('decrease');
            }
            
            if (targetElement.classList.contains('add-to-cart-btn')) {
                const productID = e.target.getAttribute('data-productid');
                const quantityInput = document.querySelector('#quantity-input');
                const quantity = parseInt(quantityInput.value, 10);

                if (quantity > 0) {
                    const productData = {
                        // Assuming you have functions or ways to get these details
                        productId: getCurrentProductId(),
                        productName: getProductName(),
                        productPrice: getProductPrice(),
                        productImage: getProductImage(),
                        quantity: quantity
                    };
                    localStorage.setItem('recentlyAddedProduct', JSON.stringify(productData));

                    _cart__WEBPACK_IMPORTED_MODULE_4__["default"].addOrUpdateCartItem(localStorage.getItem('CartID'), productID, quantity, (error, data) => {
                        if (error) {
                            console.error('Error adding item to cart:', error);
                        } else {
                            window.location.href = 'shoppingcart.html';
                        }
                    });
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

        document.querySelectorAll('.cart-item').forEach((item, index) => {
            const decreaseQuantityButton = item.querySelector('.decrease-quantity');
            const increaseQuantityButton = item.querySelector('.increase-quantity');
            const deleteButton = item.querySelector('.delCartItemBtn');
            const quantityInput = item.querySelector('input[type=number]');
            const productId = item.dataset.productId; 
    
            decreaseQuantityButton.addEventListener('click', () => {
                _dom__WEBPACK_IMPORTED_MODULE_0__["default"].updateQuantity(productId, Math.max(0, parseInt(quantityInput.value, 10) - 1)); 
            });
    
            increaseQuantityButton.addEventListener('click', () => {
                _dom__WEBPACK_IMPORTED_MODULE_0__["default"].updateQuantity(productId, parseInt(quantityInput.value, 10) + 1);
            });
    
            deleteButton.addEventListener('click', () => {
                _dom__WEBPACK_IMPORTED_MODULE_0__["default"].deleteCartItem(productId);
            });
        });
    }

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
                    <span><ion-icon name="basket-outline"></ion-icon><a href="#">Basket</a></span>
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGlEQUFRO0FBQ1IsSUFBSSw0Q0FBRztBQUNQLENBQUM7QUFDRDtBQUNBLGdEQUFPO0FBQ1A7QUFDQTtBQUNBLElBQUksNENBQUc7QUFDUDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9hY2NvdW50LmpzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvY2FydC5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2NhdGVnb3J5LmpzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvaGFuZGxlci5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2hlYWRlckZvb3Rlci5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL3Byb2R1Y3QuanMiLCJ3ZWJwYWNrOi8vdGVzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90ZXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdGVzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Rlc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcblxyXG5jb25zdCBhY2NvdW50ID0gKCgpID0+IHtcclxuICAgIGxldCB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMDAwL2FwaS9hY2NvdW50cyc7XHJcblxyXG4gICAgY29uc3QgY3JlYXRlQWNjb3VudCA9IChhY2NvdW50RGF0YSkgPT4ge1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdQT1NUJywgdXJsICsgXCIvaWRcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09IDIwMSkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9J2xvZ2luLmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoSlNPTi5zdHJpbmdpZnkoYWNjb3VudERhdGEpKTtcclxuICAgICAgICAvL2RvbS5kaXNwbGF5TWVzc2FnZSgnc2lnbnVwJywgJ2Vycm9yJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2hlY2tMb2dpbiA9IChlbWFpbCwgcGFzc3dvcmQpID0+IHtcclxuICAgICAgICBsZXQgbG9naW5VUkwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMDAwL2FwaS9sb2dpbic7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ1BPU1QnLCBsb2dpblVSTCk7XHJcbiAgICBcclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBJZiBlbWFpbCBhbmQgcGFzc3dvcmQgYXJlIGZvdW5kXHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZURhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2VEYXRhKTtcclxuICAgICAgICAgICAgICAgIGxldCBhY2NvdW50RGF0YSA9IHJlc3BvbnNlRGF0YS5BY2NvdW50O1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhcnREYXRhID0gcmVzcG9uc2VEYXRhLkNhcnQ7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYWNjb3VudElEJywgYWNjb3VudERhdGEuSUQpO1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJUeXBlJywgYWNjb3VudERhdGEuVXNlclR5cGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGZvciBhbmQgc3RvcmUgYWN0aXZlIGNhcnQgaW5mb3JtYXRpb24gaWYgcHJlc2VudFxyXG4gICAgICAgICAgICAgICAgaWYgKGNhcnREYXRhICYmIGNhcnREYXRhLlNob3BDYXJ0SUQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQ2FydElEJywgY2FydERhdGEuU2hvcENhcnRJRC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnTnVtQ2FydEl0ZW0nLCBjYXJ0RGF0YS5RdWFudGl0eS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZXJlIGlzIG5vIGFjdGl2ZSBjYXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ0NhcnRJRCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdOdW1DYXJ0SXRlbScsICcwJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnaW5kZXguaHRtbCc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3Quc2VuZChKU09OLnN0cmluZ2lmeSh7IGVtYWlsOiBlbWFpbCwgcGFzc3dvcmQ6IHBhc3N3b3JkIH0pKTtcclxuICAgICAgICAvLyBJZiBlbWFpbCBhbmQgcGFzc3dvcmQgbm90IGZvdW5kXHJcbiAgICAgICAgLy9kb20uZGlzcGxheUxvZ2luRXJyb3IoKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgZ2V0QWNjb3VudCA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgIGxldCBzZWFyY2hVUkwgPSB1cmwgKyBgLyR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnRJRCcpfWA7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHNlYXJjaFVSTCk7XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBhY2NvdW50RGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGFjY291bnREYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdXBkYXRlQWNjb3VudCA9IChhY2NvdW50RGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFjY291bnRJRCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2NvdW50SUQnKTtcclxuICAgICAgICBsZXQgdXBkYXRlVVJMID0gdXJsICsgXCIvXCIgKyBhY2NvdW50SUQ7XHJcbiAgICAgICAgIFxyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdQVVQnLCB1cGRhdGVVUkwpO1xyXG5cclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBEaXNwbGF5IGFjY291bnQgdXBkYXRlIHN1Y2Nlc3NcclxuICAgICAgICAgICAgICAgIC8vZG9tLmRpc3BsYXlNZXNzYWdlKCd1cGRhdGUnLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoSlNPTi5zdHJpbmdpZnkoYWNjb3VudERhdGEpKTtcclxuICAgICAgICAvL2RvbS5kaXNwbGF5TWVzc2FnZSgndXBkYXRlJywgJ2Vycm9yJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGVsZXRlQWNjb3VudCA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBhY2NvdW50SUQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWNjb3VudElEJyk7XHJcbiAgICAgICAgbGV0IGRlbGV0ZVVSTCA9IHVybCArIFwiL1wiICsgYWNjb3VudElEO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdERUxFVEUnLCBkZWxldGVVUkwpO1xyXG5cclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGFjY291bnQgSUQgYW5kIHVzZXIgdHlwZSBpbiBsb2NhbCBzdG9yYWdlXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYWNjb3VudElEJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRGlzcGxheSBhY2NvdW50IGRlbGV0aW9uIHN1Y2Nlc3NcclxuICAgICAgICAgICAgICAgIC8vZG9tLmRpc3BsYXlNZXNzYWdlKCdkZWxldGUnLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gNSBzZWNvbmQgZGVsYXkgYW5kIHJldHVybiB0byBsb2dpbiBmb3JtXHJcbiAgICAgICAgICAgICAgICAgICAgLy9kb20uZGlzcGxheUxvZ2luRm9ybSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZG9tLnVzZXJMb2dnZWRPdXQoKTtcclxuICAgICAgICAgICAgICAgIH0sIDUwMDApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgICAgICAvLyBEaXNwbGF5IGVycm9yXHJcbiAgICAgICAgLy9kb20uZGlzcGxheU1lc3NhZ2UoJ2RlbGV0ZScsICdlcnJvcicpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY3JlYXRlQWNjb3VudCxcclxuICAgICAgICBjaGVja0xvZ2luLFxyXG4gICAgICAgIGdldEFjY291bnQsXHJcbiAgICAgICAgdXBkYXRlQWNjb3VudCxcclxuICAgICAgICBkZWxldGVBY2NvdW50LFxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYWNjb3VudDtcclxuXHJcbiIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgIGNvbnN0IHJlY2VudGx5QWRkZWRQcm9kdWN0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVjZW50bHlBZGRlZFByb2R1Y3QnKSk7XHJcbiAgICBpZiAocmVjZW50bHlBZGRlZFByb2R1Y3QpIHtcclxuICAgICAgICBkb20uZGlzcGxheVByb2R1Y3RJbkNhcnQocmVjZW50bHlBZGRlZFByb2R1Y3QpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdyZWNlbnRseUFkZGVkUHJvZHVjdCcpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmNvbnN0IGNhcnQgPSAoKCkgPT4ge1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNhcnQ7IiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcblxyXG5jb25zdCBjYXRlZ29yeSA9ICgoKSA9PiB7ICAgIFxyXG4gICAgbGV0IHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEwMDAvYXBpL2NhdGVnb3JpZXMnO1xyXG5cclxuICAgIGNvbnN0IGdldENhdGVnb3JpZXMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsKTtcclxuICAgICAgICBcclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBnZXRTZWxlY3RlZENhdGVnb3J5ID0gKGNhdGVnb3J5SUQsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5VXJsID0gdXJsICsgYD9zZWFyY2g9JHtjYXRlZ29yeUlEfWA7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIGNhdGVnb3J5VXJsKTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRDYXRlZ29yaWVzLFxyXG4gICAgICAgIGdldFNlbGVjdGVkQ2F0ZWdvcnksXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYXRlZ29yeTsiLCJpbXBvcnQgYWNjb3VudCBmcm9tICcuL2FjY291bnQnO1xyXG5pbXBvcnQgY2F0ZWdvcnkgZnJvbSAnLi9jYXRlZ29yeSc7XHJcblxyXG5jb25zdCBkb20gPSAoKCkgPT4ge1xyXG4gICAgY29uc3QgaXNVc2VyTG9nZ2VkSW4gPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYXV0aExpbmtzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGhMaW5rcycpO1xyXG4gICAgICAgIGNvbnN0IGxvZ291dExpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9nb3V0TGluaycpO1xyXG4gICAgICAgIGNvbnN0IGFjY291bnRMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjY291bnRMaW5rJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGlzTG9nZ2VkSW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWNjb3VudElEJykgIT09IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChpc0xvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgIC8vIEhpZGUgbG9naW4gYW5kIHJlZ2lzdGVyIGxpbmtzXHJcbiAgICAgICAgICAgIGF1dGhMaW5rcy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cclxuICAgICAgICAgICAgLy8gU2hvdyBhY2NvdW50IGFuZCBsb2dvdXQgbGlua3NcclxuICAgICAgICAgICAgbG9nb3V0TGluay5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgICAgICAgICBhY2NvdW50TGluay5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhdXRoTGlua3Muc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICAgICAgbG9nb3V0TGluay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBhY2NvdW50TGluay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH0gXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGlzcGxheUFsbENhdGVnb3JpZXMgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNhdGVnb3J5TGlzdGluZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnktbGlzdGluZ3MnKTtcclxuICAgICAgICBpZiAoY2F0ZWdvcnlMaXN0aW5ncykge1xyXG4gICAgICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEuQ2F0ZWdvcmllcyk7XHJcblxyXG4gICAgICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnlMaXN0aW5ncy5pbm5lckhUTUwgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGNhdGVnb3J5XCIgZGF0YS1saW5rLWNhdGVnb3J5aWQ9XCIke2tleX1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCJhc3NldHMvJHtkYXRhLkNhdGVnb3JpZXNba2V5XVtcIkNhdEltYWdlXCJdfVwiIGRhdGEtbGluay1jYXRlZ29yeWlkPVwiJHtrZXl9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjYXRlZ29yeUJ0blwiIGRhdGEtbGluay1jYXRlZ29yeWlkPVwiJHtrZXl9XCI+JHtkYXRhLkNhdGVnb3JpZXNba2V5XVtcIkNhdE5hbWVcIl19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICBgO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkaXNwbGF5QWxsUHJvZHVjdHMgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RMaXN0aW5ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0LWxpc3RpbmdzJyk7XHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyVHlwZScpID09ICd1c2VyJykge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3JlYXRlUHJvZHVjdEJ0bicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YS5Qcm9kdWN0cyk7XHJcblxyXG4gICAgICAgIGlmIChwcm9kdWN0TGlzdGluZ3MpIHtcclxuICAgICAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RMaXN0aW5ncy5pbm5lckhUTUwgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIHByb2R1Y3RcIiBkYXRhLWxpbmstcHJvZHVjdElEPVwiJHtrZXl9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL3Byb2R1Y3RzLyR7ZGF0YS5Qcm9kdWN0c1trZXldW1wiUHJvZHVjdEltYWdlXCJdfVwiIGRhdGEtbGluay1wcm9kdWN0SUQ9XCIke2tleX1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2R1Y3QtbmFtZVwiPiR7ZGF0YS5Qcm9kdWN0c1trZXldW1wiUHJvZHVjdFRpdGxlXCJdfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZHVjdC1wcmljZVwiPiQke2RhdGEuUHJvZHVjdHNba2V5XVtcIlByaWNlXCJdfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9kdWN0cycsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkaXNwbGF5UHJvZHVjdERldGFpbHMgPSAocHJvZHVjdERhdGEpID0+IHtcclxuICAgICAgICBjb25zdCBwcm9kdWN0RGV0YWlscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0RGV0YWlscy1jb250YWluZXInKTtcclxuICAgICAgICBjb25zdCBwcm9kdWN0SW1hZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbi1pbWFnZScpO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0LXRpdGxlJyk7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdERlc2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdC1kZXNjcmlwdGlvbicpO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RQcmljZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmljZScpO1xyXG4gICAgICAgIGNvbnN0IGFkZFRvQ2FydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZGQtdG8tY2FydC1idG4nKTtcclxuXHJcblxyXG4gICAgICAgIGlmIChwcm9kdWN0RGV0YWlscykge1xyXG4gICAgICAgICAgICBwcm9kdWN0SW1hZ2Uuc3JjID0gYGFzc2V0cy9wcm9kdWN0cy8ke3Byb2R1Y3REYXRhWydQcm9kdWN0SW1hZ2UnXX1gO1xyXG4gICAgICAgICAgICBwcm9kdWN0VGl0bGUudGV4dENvbnRlbnQgPSBwcm9kdWN0RGF0YVsnUHJvZHVjdFRpdGxlJ107XHJcbiAgICAgICAgICAgIHByb2R1Y3REZXNjLnRleHRDb250ZW50ID0gcHJvZHVjdERhdGFbJ1Byb2R1Y3REZXNjJ107XHJcbiAgICAgICAgICAgIHByb2R1Y3RQcmljZS50ZXh0Q29udGVudCA9ICckJyArIHByb2R1Y3REYXRhWydQcmljZSddO1xyXG5cclxuICAgICAgICAgICAgYWRkVG9DYXJ0QnRuLnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9kdWN0aWQnLCBwcm9kdWN0RGF0YVsnUHJvZHVjdElEJ10pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2R1Y3QnLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2hhbmdlSXRlbVF1YW50aXR5ID0gKGFjdGlvbikgPT4ge1xyXG4gICAgICAgIGxldCBpdGVtUXVhbnRpdHlJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNxdWFudGl0eS1pbnB1dCcpO1xyXG4gICAgICAgIGxldCBpdGVtUXVhbnRpdHkgPSBwYXJzZUludChpdGVtUXVhbnRpdHlJbnB1dC52YWx1ZSwgMTApO1xyXG5cclxuICAgICAgICBpZiAoYWN0aW9uID09PSAnaW5jcmVhc2UnKSB7XHJcbiAgICAgICAgICAgIGl0ZW1RdWFudGl0eSArPSAxO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgZWxzZSBpZiAoYWN0aW9uID09PSAnZGVjcmVhc2UnICYmIGl0ZW1RdWFudGl0eSA+IDApIHtcclxuICAgICAgICAgICAgaXRlbVF1YW50aXR5IC09IDE7IFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXRlbVF1YW50aXR5SW5wdXQudmFsdWUgPSBpdGVtUXVhbnRpdHk7IFxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVF1YW50aXR5KHByb2R1Y3RJZCwgbmV3UXVhbnRpdHkpIHtcclxuICAgICAgICBjYXJ0QXBpLm1vZGlmeUNhcnRJdGVtKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdDYXJ0SUQnKSwgcHJvZHVjdElkLCBuZXdRdWFudGl0eSwgKGVycm9yLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgdXBkYXRpbmcgY2FydCBpdGVtOicsIGVycm9yKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDYXJ0IGl0ZW0gdXBkYXRlZDonLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIC8vd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBkZWxldGVDYXJ0SXRlbShwcm9kdWN0SWQpIHtcclxuICAgICAgICBjYXJ0QXBpLmRlbGV0ZUNhcnRJdGVtKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdDYXJ0SUQnKSwgcHJvZHVjdElkLCAoZXJyb3IsIGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkZWxldGluZyBjYXJ0IGl0ZW06JywgZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NhcnQgaXRlbSBkZWxldGVkOicsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRpc3BsYXlQcm9kdWN0SW5DYXJ0ID0gKHByb2R1Y3REYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2FydEl0ZW1zQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnQtaXRlbXMnKTtcclxuICAgICAgICBjb25zdCBwcm9kdWN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHByb2R1Y3RFbGVtZW50LmNsYXNzTmFtZSA9ICdjYXJ0LWl0ZW0nO1xyXG4gICAgICAgIHByb2R1Y3RFbGVtZW50LmlubmVySFRNTCA9IGBcclxuICAgICAgICAgICAgPGltZyBzcmM9XCIke3Byb2R1Y3REYXRhLnByb2R1Y3RJbWFnZX1cIiBhbHQ9XCIke3Byb2R1Y3REYXRhLnByb2R1Y3ROYW1lfVwiPlxyXG4gICAgICAgICAgICA8c3Bhbj4ke3Byb2R1Y3REYXRhLnByb2R1Y3ROYW1lfTwvc3Bhbj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInF1YW50aXR5LXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxdWFudGl0eS1idG4gZGVjcmVhc2UtcXVhbnRpdHlcIj48aW9uLWljb24gY2xhc3M9XCJkZWNyZWFzZS1xdWFudGl0eVwiIG5hbWU9XCJyZW1vdmUtb3V0bGluZVwiPjwvaW9uLWljb24+PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwicXVhbnRpdHktaW5wdXRcIiB2YWx1ZT1cIiR7cHJvZHVjdERhdGEucXVhbnRpdHl9XCIgbWluPVwiMFwiPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInF1YW50aXR5LWJ0biBpbmNyZWFzZS1xdWFudGl0eVwiPjxpb24taWNvbiBjbGFzcz1cImluY3JlYXNlLXF1YW50aXR5XCIgbmFtZT1cImFkZC1vdXRsaW5lXCI+PC9pb24taWNvbj48L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FydC1wcmljZVwiPuKCrCR7cHJvZHVjdERhdGEucHJvZHVjdFByaWNlfTwvc3Bhbj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImRlbENhcnRJdGVtQnRuXCI+PGlvbi1pY29uIG5hbWU9XCJjbG9zZS1vdXRsaW5lXCI+PC9pb24taWNvbj48L2J1dHRvbj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIGNhcnRJdGVtc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwcm9kdWN0RWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpc1VzZXJMb2dnZWRJbixcclxuICAgICAgICBkaXNwbGF5QWxsQ2F0ZWdvcmllcyxcclxuICAgICAgICBkaXNwbGF5QWxsUHJvZHVjdHMsXHJcbiAgICAgICAgZGlzcGxheVByb2R1Y3REZXRhaWxzLFxyXG4gICAgICAgIGNoYW5nZUl0ZW1RdWFudGl0eSxcclxuICAgICAgICB1cGRhdGVRdWFudGl0eSxcclxuICAgICAgICBkZWxldGVDYXJ0SXRlbSxcclxuICAgICAgICBkaXNwbGF5UHJvZHVjdEluQ2FydCxcclxuICAgIH1cclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRvbTsiLCJpbXBvcnQgZG9tIGZyb20gJy4vZG9tJztcclxuaW1wb3J0IGFjY291bnQgZnJvbSAnLi9hY2NvdW50JztcclxuaW1wb3J0IHByb2R1Y3QgZnJvbSAnLi9wcm9kdWN0JztcclxuaW1wb3J0IGNhdGVnb3J5IGZyb20gJy4vY2F0ZWdvcnknO1xyXG5pbXBvcnQgY2FydCBmcm9tICcuL2NhcnQnO1xyXG5cclxuY29uc3QgaGFuZGxlciA9ICgoKSA9PiB7XHJcblxyXG4gICAgY29uc3QgaGFuZGxlQ2xpY2tzID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxvZ2luRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbkZvcm0nKTtcclxuICAgICAgICBjb25zdCByZWdpc3RlckZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVnaXN0ZXJGb3JtJyk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRhcmdldEVsZW1lbnQgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbG9nb3V0QnRuJykpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhY2NvdW50SUQnKTtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyVHlwZScpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3BCdG4nKSkge1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdC5nZXRQcm9kdWN0cygocHJvZHVjdHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJvZHVjdHMnLCBKU09OLnN0cmluZ2lmeShwcm9kdWN0cykpOyAvLyBTYXZlIHRoZSBwcm9kdWN0cyBpbiBsb2NhbFN0b3JhZ2VcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdwcm9kdWN0cy5odG1sJztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGluay1wcm9kdWN0aWQnKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjdElEID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWxpbmstcHJvZHVjdGlkJyk7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0LmdldFNlbGVjdGVkUHJvZHVjdChwcm9kdWN0SUQsIChwcm9kdWN0RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9kdWN0JywgSlNPTi5zdHJpbmdpZnkocHJvZHVjdERhdGEpKTsgLy8gU2F2ZSB0aGUgc2VsZWN0ZWQgcHJvZHVjdCBpbiBsb2NhbFN0b3JhZ2VcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdwcm9kdWN0RGV0YWlscy5odG1sJztcclxuICAgICAgICAgICAgICAgIH0pOyAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnZGF0YS1saW5rLWNhdGVnb3J5aWQnKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlJRCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1saW5rLWNhdGVnb3J5aWQnKTtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5LmdldFNlbGVjdGVkQ2F0ZWdvcnkoY2F0ZWdvcnlJRCwgKHByb2R1Y3RzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2R1Y3RzJywgSlNPTi5zdHJpbmdpZnkocHJvZHVjdHMpKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAncHJvZHVjdHMuaHRtbCc7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpID09ICdzdWJtaXRTZWFyY2gnKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VhcmNoQmFySW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2VhcmNoLWJhcicpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdC5zZWFyY2hQcm9kdWN0KHNlYXJjaEJhcklucHV0LCAocHJvZHVjdHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJvZHVjdHMnLCBKU09OLnN0cmluZ2lmeShwcm9kdWN0cykpOyBcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdwcm9kdWN0cy5odG1sJztcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaW5jcmVhc2UtcXVhbnRpdHknKSkge1xyXG4gICAgICAgICAgICAgICAgZG9tLmNoYW5nZUl0ZW1RdWFudGl0eSgnaW5jcmVhc2UnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkZWNyZWFzZS1xdWFudGl0eScpKSB7XHJcbiAgICAgICAgICAgICAgICBkb20uY2hhbmdlSXRlbVF1YW50aXR5KCdkZWNyZWFzZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FkZC10by1jYXJ0LWJ0bicpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0SUQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZHVjdGlkJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBxdWFudGl0eUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3F1YW50aXR5LWlucHV0Jyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBxdWFudGl0eSA9IHBhcnNlSW50KHF1YW50aXR5SW5wdXQudmFsdWUsIDEwKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocXVhbnRpdHkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjdERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzc3VtaW5nIHlvdSBoYXZlIGZ1bmN0aW9ucyBvciB3YXlzIHRvIGdldCB0aGVzZSBkZXRhaWxzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RJZDogZ2V0Q3VycmVudFByb2R1Y3RJZCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0TmFtZTogZ2V0UHJvZHVjdE5hbWUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdFByaWNlOiBnZXRQcm9kdWN0UHJpY2UoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdEltYWdlOiBnZXRQcm9kdWN0SW1hZ2UoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IHF1YW50aXR5XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVjZW50bHlBZGRlZFByb2R1Y3QnLCBKU09OLnN0cmluZ2lmeShwcm9kdWN0RGF0YSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXJ0LmFkZE9yVXBkYXRlQ2FydEl0ZW0obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0NhcnRJRCcpLCBwcm9kdWN0SUQsIHF1YW50aXR5LCAoZXJyb3IsIGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBhZGRpbmcgaXRlbSB0byBjYXJ0OicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ3Nob3BwaW5nY2FydC5odG1sJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChsb2dpbkZvcm0pIHtcclxuICAgICAgICAgICAgbG9naW5Gb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbWFpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbkVtYWlsJykudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXNzd29yZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpblBhc3N3b3JkJykudmFsdWU7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIGFjY291bnQuY2hlY2tMb2dpbihlbWFpbCwgcGFzc3dvcmQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAocmVnaXN0ZXJGb3JtKSB7XHJcbiAgICAgICAgICAgIHJlZ2lzdGVyRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWdpc3Rlck5hbWUnKS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVtYWlsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlZ2lzdGVyRW1haWwnKS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhc3N3b3JkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlZ2lzdGVyUGFzc3dvcmQnKS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpOyAvLyBHZXQgY3VycmVudCBkYXRlIGluIElTTyBmb3JtYXRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShjdXJyZW50RGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDE5KS5yZXBsYWNlKCdUJywgJyAnKTsgLy8gWVlZWS1NTS1ERCBISDpNTTpTU1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBKU09OXHJcbiAgICAgICAgICAgICAgICBsZXQgYWNjb3VudERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJOYW1lXCI6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJFbWFpbFwiOiBlbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICBcIlBhc3N3b3JkXCI6IHBhc3N3b3JkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQ3JlYXRlZCBBdFwiOiBmb3JtYXR0ZWREYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVXNlclR5cGVcIjogJ3VzZXInXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhY2NvdW50LmNyZWF0ZUFjY291bnQoYWNjb3VudERhdGEpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcnQtaXRlbScpLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlY3JlYXNlUXVhbnRpdHlCdXR0b24gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5kZWNyZWFzZS1xdWFudGl0eScpO1xyXG4gICAgICAgICAgICBjb25zdCBpbmNyZWFzZVF1YW50aXR5QnV0dG9uID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuaW5jcmVhc2UtcXVhbnRpdHknKTtcclxuICAgICAgICAgICAgY29uc3QgZGVsZXRlQnV0dG9uID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZGVsQ2FydEl0ZW1CdG4nKTtcclxuICAgICAgICAgICAgY29uc3QgcXVhbnRpdHlJbnB1dCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1udW1iZXJdJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RJZCA9IGl0ZW0uZGF0YXNldC5wcm9kdWN0SWQ7IFxyXG4gICAgXHJcbiAgICAgICAgICAgIGRlY3JlYXNlUXVhbnRpdHlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkb20udXBkYXRlUXVhbnRpdHkocHJvZHVjdElkLCBNYXRoLm1heCgwLCBwYXJzZUludChxdWFudGl0eUlucHV0LnZhbHVlLCAxMCkgLSAxKSk7IFxyXG4gICAgICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgICAgICBpbmNyZWFzZVF1YW50aXR5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZG9tLnVwZGF0ZVF1YW50aXR5KHByb2R1Y3RJZCwgcGFyc2VJbnQocXVhbnRpdHlJbnB1dC52YWx1ZSwgMTApICsgMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRvbS5kZWxldGVDYXJ0SXRlbShwcm9kdWN0SWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geyBoYW5kbGVDbGlja3MgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGhhbmRsZXI7IiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcblxyXG5jb25zdCBsb2FkSGVhZGVyRm9vdGVyID0gKCgpID0+IHtcclxuICAgIGNvbnN0IGxvYWRIZWFkZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGVhZGVySFRNTCA9IGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvcC1uYXZcIj5cclxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibG9nb1wiIGhyZWY9XCJpbmRleC5odG1sXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCJhc3NldHMvYmxvY2tzLnBuZ1wiIGFsdD1cImxvZ29cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDI+RWNvVG95PC9oMj5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZWFyY2gtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlvbi1pY29uIG5hbWU9XCJzZWFyY2gtb3V0bGluZVwiIGlkPVwic3VibWl0U2VhcmNoXCI+PC9pb24taWNvbj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInNlYXJjaFwiIGlkPVwic2VhcmNoLWJhclwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoIGEgcHJvZHVjdC4uLlwiPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlci1hY3Rpb25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImF1dGhMaW5rc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48aW9uLWljb24gbmFtZT1cImxvZy1pbi1vdXRsaW5lXCI+PC9pb24taWNvbj48YSBocmVmPVwibG9naW4uaHRtbFwiPkxvZ2luPC9hPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PGlvbi1pY29uIG5hbWU9XCJwZXJzb24tYWRkLW91dGxpbmVcIj48L2lvbi1pY29uPjxhIGhyZWY9XCJyZWdpc3Rlci5odG1sXCI+UmVnaXN0ZXI8L2E+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwiYWNjb3VudExpbmtcIj48aW9uLWljb24gbmFtZT1cInBlcnNvbi1vdXRsaW5lXCI+PC9pb24taWNvbj48YSBocmVmPVwiI1wiPkFjY291bnQ8L2E+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwibG9nb3V0TGlua1wiPjxpb24taWNvbiBuYW1lPVwibG9nLW91dC1vdXRsaW5lXCI+PC9pb24taWNvbj48YSBocmVmPVwiI1wiIGNsYXNzPVwibG9nb3V0QnRuXCI+TG9nb3V0PC9hPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj48aW9uLWljb24gbmFtZT1cImJhc2tldC1vdXRsaW5lXCI+PC9pb24taWNvbj48YSBocmVmPVwiI1wiPkJhc2tldDwvYT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxuYXY+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInNob3BCdG5cIj5TaG9wPC9hPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNmZWVkYmFja1wiPkZlZWRiYWNrPC9hPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNjb250YWN0XCI+Q29udGFjdDwvYT5cclxuICAgICAgICAgICAgPC9uYXY+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY29uc3QgaGVhZGVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hlYWRlcicpO1xyXG4gICAgICAgIGhlYWRlckVsZW1lbnQuaW5uZXJIVE1MID0gaGVhZGVySFRNTDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShoZWFkZXJFbGVtZW50LCBkb2N1bWVudC5ib2R5LmZpcnN0Q2hpbGQpO1xyXG5cclxuICAgICAgICBkb20uaXNVc2VyTG9nZ2VkSW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2FkRm9vdGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZvb3RlckhUTUwgPSBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb290ZXItY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbHVtblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz5TaG9wPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkFsbCBQcm9kdWN0czwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5CZXN0IFNlbGxlcnM8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+TmV3IEluPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvb3Rlci1jb2x1bW5cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDM+RW5jaGFudGVkIFBsYW5ldDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5Ib21lPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkFib3V0PC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkJsb2c8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+Q29udGFjdDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb290ZXItY29sdW1uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgzPk15IEFjY291bnQ8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+TG9naW48L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+T3JkZXJzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkFjY291bnQgZGV0YWlsczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5Gb3Jnb3QgcGFzc3dvcmQ8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbHVtblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz5HZW5lcmFsPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPlByaXZhY3kgUG9saWN5PC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPlRlcm1zICYgQ29uZGl0aW9uczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5EZWxpdmVyeSBhbmQgUmV0dXJuczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb290ZXItc29jaWFsLXBheW1lbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic29jaWFsLWljb25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gVXNlIGFjdHVhbCBpY29ucyBvciBpbWFnZXMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCI+PGltZyBzcmM9XCJhc3NldHMvZmFjZWJvb2sucG5nXCIgYWx0PVwiRmFjZWJvb2tcIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCI+PGltZyBzcmM9XCJhc3NldHMvaW5zdGFncmFtLnBuZ1wiIGFsdD1cIkluc3RhZ3JhbVwiPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIj48aW1nIHNyYz1cImFzc2V0cy9waW50ZXJlc3QucG5nXCIgYWx0PVwiUGludGVyZXN0XCI+PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLWJvdHRvbVwiPlxyXG4gICAgICAgICAgICAgICAgPHA+wqkgMjAyNCBFY29Ub3kuIEFsbCBSaWdodHMgUmVzZXJ2ZWQgfCBXZWJzaXRlIGJ5IHVzIDozPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjb25zdCBmb290ZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9vdGVyJyk7XHJcbiAgICAgICAgZm9vdGVyRWxlbWVudC5jbGFzc05hbWUgPSBcInNpdGUtZm9vdGVyXCI7XHJcbiAgICAgICAgZm9vdGVyRWxlbWVudC5pbm5lckhUTUwgPSBmb290ZXJIVE1MO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9vdGVyRWxlbWVudCk7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsb2FkSGVhZGVyLFxyXG4gICAgICAgIGxvYWRGb290ZXJcclxuICAgIH1cclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGxvYWRIZWFkZXJGb290ZXI7IiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgcHJvZHVjdHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcm9kdWN0cycpKTtcclxuICAgIGlmIChwcm9kdWN0cykge1xyXG4gICAgICAgIGRvbS5kaXNwbGF5QWxsUHJvZHVjdHMocHJvZHVjdHMpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBwcm9kdWN0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJvZHVjdCcpKTtcclxuICAgIGlmIChwcm9kdWN0KSB7XHJcbiAgICAgICAgZG9tLmRpc3BsYXlQcm9kdWN0RGV0YWlscyhwcm9kdWN0KTtcclxuICAgIH1cclxufSlcclxuXHJcbmNvbnN0IHByb2R1Y3QgPSAoKCkgPT4geyAgICBcclxuICAgIGxldCB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMDAwL2FwaS9wcm9kdWN0cyc7XHJcblxyXG4gICAgY29uc3QgZ2V0UHJvZHVjdHMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsKTtcclxuICAgICAgICBcclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBnZXRTZWxlY3RlZFByb2R1Y3QgPSAocHJvZHVjdElELCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgIGxldCBwcm9kdWN0VXJsID0gdXJsICsgYC8ke3Byb2R1Y3RJRH19YDtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgcHJvZHVjdFVybCk7XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9kdWN0RGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHByb2R1Y3REYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2VhcmNoUHJvZHVjdCA9IChzZWFyY2hJbnB1dCwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICBsZXQgc2VhcmNoVVJMID0gdXJsICsgYD9zZWFyY2g9JHtzZWFyY2hJbnB1dH1gO1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCBzZWFyY2hVUkwpO1xyXG4gICAgXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IHByb2R1Y3REYXRhID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgY2FsbGJhY2socHJvZHVjdERhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFByb2R1Y3RzLFxyXG4gICAgICAgIGdldFNlbGVjdGVkUHJvZHVjdCxcclxuICAgICAgICBzZWFyY2hQcm9kdWN0LFxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJvZHVjdDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBsb2FkSGVhZGVyRm9vdGVyIGZyb20gJy4vaGVhZGVyRm9vdGVyJztcclxuaW1wb3J0IGhhbmRsZXIgZnJvbSAnLi9oYW5kbGVyJztcclxuaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcbmltcG9ydCBjYXRlZ29yeSBmcm9tICcuL2NhdGVnb3J5JztcclxuXHJcbmxvYWRIZWFkZXJGb290ZXIubG9hZEhlYWRlcigpO1xyXG5sb2FkSGVhZGVyRm9vdGVyLmxvYWRGb290ZXIoKTtcclxuXHJcbmNhdGVnb3J5LmdldENhdGVnb3JpZXMoKGNhdGVnb3JpZXMpID0+IHtcclxuICAgIGRvbS5kaXNwbGF5QWxsQ2F0ZWdvcmllcyhjYXRlZ29yaWVzKTtcclxufSk7XHJcblxyXG5oYW5kbGVyLmhhbmRsZUNsaWNrcygpO1xyXG5cclxuaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2NvdW50SUQnKSkge1xyXG4gICAgZG9tLmlzVXNlckxvZ2dlZEluKCk7XHJcbn0gXHJcblxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=