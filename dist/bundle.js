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
        request.open('POST', url);
        
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
        let loginURL = url;
        let request = new XMLHttpRequest();
        request.open('POST', loginURL);
    
        request.onload = function() {
            // If email and password are found
            if (request.status == 200) {
                let accountData = JSON.parse(this.response);
                localStorage.setItem('accountID', accountData.id);
                localStorage.setItem('userType', accountData.userType);
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

        if (productDetails) {
            productImage.src = `assets/products/${productData['ProductImage']}`;
            productTitle.textContent = productData['ProductTitle'];
            productDesc.textContent = productData['ProductDesc'];
            productPrice.textContent = '$' + productData['Price'];
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

    return {
        isUserLoggedIn,
        displayAllCategories,
        displayAllProducts,
        displayProductDetails,
        changeItemQuantity,
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
                    "User Type": 'user'
                }
                _account__WEBPACK_IMPORTED_MODULE_1__["default"].createAccount(accountData);
            })
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQSxpREFBUTtBQUNSLElBQUksNENBQUc7QUFDUCxDQUFDO0FBQ0Q7QUFDQSxnREFBTztBQUNQO0FBQ0E7QUFDQSxJQUFJLDRDQUFHO0FBQ1A7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Rlc3QvLi9zcmMvYWNjb3VudC5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2NhdGVnb3J5LmpzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvaGFuZGxlci5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2hlYWRlckZvb3Rlci5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL3Byb2R1Y3QuanMiLCJ3ZWJwYWNrOi8vdGVzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90ZXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdGVzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Rlc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcblxyXG5jb25zdCBhY2NvdW50ID0gKCgpID0+IHtcclxuICAgIGxldCB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMDAwL2FwaS9hY2NvdW50cyc7XHJcblxyXG4gICAgY29uc3QgY3JlYXRlQWNjb3VudCA9IChhY2NvdW50RGF0YSkgPT4ge1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdQT1NUJywgdXJsKTtcclxuICAgICAgICBcclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT0gMjAxKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj0nbG9naW4uaHRtbCc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3Quc2VuZChKU09OLnN0cmluZ2lmeShhY2NvdW50RGF0YSkpO1xyXG4gICAgICAgIC8vZG9tLmRpc3BsYXlNZXNzYWdlKCdzaWdudXAnLCAnZXJyb3InKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGVja0xvZ2luID0gKGVtYWlsLCBwYXNzd29yZCkgPT4ge1xyXG4gICAgICAgIGxldCBsb2dpblVSTCA9IHVybDtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignUE9TVCcsIGxvZ2luVVJMKTtcclxuICAgIFxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIElmIGVtYWlsIGFuZCBwYXNzd29yZCBhcmUgZm91bmRcclxuICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFjY291bnREYXRhID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhY2NvdW50SUQnLCBhY2NvdW50RGF0YS5pZCk7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlclR5cGUnLCBhY2NvdW50RGF0YS51c2VyVHlwZSk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdpbmRleC5odG1sJztcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgZW1haWw6IGVtYWlsLCBwYXNzd29yZDogcGFzc3dvcmQgfSkpO1xyXG4gICAgICAgIC8vIElmIGVtYWlsIGFuZCBwYXNzd29yZCBub3QgZm91bmRcclxuICAgICAgICAvL2RvbS5kaXNwbGF5TG9naW5FcnJvcigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBnZXRBY2NvdW50ID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IHNlYXJjaFVSTCA9IHVybCArIGAvJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWNjb3VudElEJyl9YDtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgc2VhcmNoVVJMKTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGFjY291bnREYXRhID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgY2FsbGJhY2soYWNjb3VudERhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB1cGRhdGVBY2NvdW50ID0gKGFjY291bnREYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYWNjb3VudElEID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnRJRCcpO1xyXG4gICAgICAgIGxldCB1cGRhdGVVUkwgPSB1cmwgKyBcIi9cIiArIGFjY291bnRJRDtcclxuICAgICAgICAgXHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ1BVVCcsIHVwZGF0ZVVSTCk7XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgYWNjb3VudCB1cGRhdGUgc3VjY2Vzc1xyXG4gICAgICAgICAgICAgICAgLy9kb20uZGlzcGxheU1lc3NhZ2UoJ3VwZGF0ZScsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3Quc2VuZChKU09OLnN0cmluZ2lmeShhY2NvdW50RGF0YSkpO1xyXG4gICAgICAgIC8vZG9tLmRpc3BsYXlNZXNzYWdlKCd1cGRhdGUnLCAnZXJyb3InKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkZWxldGVBY2NvdW50ID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFjY291bnRJRCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2NvdW50SUQnKTtcclxuICAgICAgICBsZXQgZGVsZXRlVVJMID0gdXJsICsgXCIvXCIgKyBhY2NvdW50SUQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0RFTEVURScsIGRlbGV0ZVVSTCk7XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgYWNjb3VudCBJRCBhbmQgdXNlciB0eXBlIGluIGxvY2FsIHN0b3JhZ2VcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhY2NvdW50SUQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEaXNwbGF5IGFjY291bnQgZGVsZXRpb24gc3VjY2Vzc1xyXG4gICAgICAgICAgICAgICAgLy9kb20uZGlzcGxheU1lc3NhZ2UoJ2RlbGV0ZScsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyA1IHNlY29uZCBkZWxheSBhbmQgcmV0dXJuIHRvIGxvZ2luIGZvcm1cclxuICAgICAgICAgICAgICAgICAgICAvL2RvbS5kaXNwbGF5TG9naW5Gb3JtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kb20udXNlckxvZ2dlZE91dCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgNTAwMCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgICAgIC8vIERpc3BsYXkgZXJyb3JcclxuICAgICAgICAvL2RvbS5kaXNwbGF5TWVzc2FnZSgnZGVsZXRlJywgJ2Vycm9yJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjcmVhdGVBY2NvdW50LFxyXG4gICAgICAgIGNoZWNrTG9naW4sXHJcbiAgICAgICAgZ2V0QWNjb3VudCxcclxuICAgICAgICB1cGRhdGVBY2NvdW50LFxyXG4gICAgICAgIGRlbGV0ZUFjY291bnQsXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhY2NvdW50O1xyXG5cclxuIiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcblxyXG5jb25zdCBjYXRlZ29yeSA9ICgoKSA9PiB7ICAgIFxyXG4gICAgbGV0IHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEwMDAvYXBpL2NhdGVnb3JpZXMnO1xyXG5cclxuICAgIGNvbnN0IGdldENhdGVnb3JpZXMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsKTtcclxuICAgICAgICBcclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBnZXRTZWxlY3RlZENhdGVnb3J5ID0gKGNhdGVnb3J5SUQsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5VXJsID0gdXJsICsgYD9zZWFyY2g9JHtjYXRlZ29yeUlEfWA7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIGNhdGVnb3J5VXJsKTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRDYXRlZ29yaWVzLFxyXG4gICAgICAgIGdldFNlbGVjdGVkQ2F0ZWdvcnksXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYXRlZ29yeTsiLCJpbXBvcnQgYWNjb3VudCBmcm9tICcuL2FjY291bnQnO1xyXG5pbXBvcnQgY2F0ZWdvcnkgZnJvbSAnLi9jYXRlZ29yeSc7XHJcblxyXG5jb25zdCBkb20gPSAoKCkgPT4ge1xyXG4gICAgY29uc3QgaXNVc2VyTG9nZ2VkSW4gPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYXV0aExpbmtzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGhMaW5rcycpO1xyXG4gICAgICAgIGNvbnN0IGxvZ291dExpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9nb3V0TGluaycpO1xyXG4gICAgICAgIGNvbnN0IGFjY291bnRMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjY291bnRMaW5rJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGlzTG9nZ2VkSW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWNjb3VudElEJykgIT09IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChpc0xvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgIC8vIEhpZGUgbG9naW4gYW5kIHJlZ2lzdGVyIGxpbmtzXHJcbiAgICAgICAgICAgIGF1dGhMaW5rcy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cclxuICAgICAgICAgICAgLy8gU2hvdyBhY2NvdW50IGFuZCBsb2dvdXQgbGlua3NcclxuICAgICAgICAgICAgbG9nb3V0TGluay5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgICAgICAgICBhY2NvdW50TGluay5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhdXRoTGlua3Muc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICAgICAgbG9nb3V0TGluay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBhY2NvdW50TGluay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH0gXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGlzcGxheUFsbENhdGVnb3JpZXMgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNhdGVnb3J5TGlzdGluZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnktbGlzdGluZ3MnKTtcclxuICAgICAgICBpZiAoY2F0ZWdvcnlMaXN0aW5ncykge1xyXG4gICAgICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEuQ2F0ZWdvcmllcyk7XHJcblxyXG4gICAgICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnlMaXN0aW5ncy5pbm5lckhUTUwgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGNhdGVnb3J5XCIgZGF0YS1saW5rLWNhdGVnb3J5aWQ9XCIke2tleX1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCJhc3NldHMvJHtkYXRhLkNhdGVnb3JpZXNba2V5XVtcIkNhdEltYWdlXCJdfVwiIGRhdGEtbGluay1jYXRlZ29yeWlkPVwiJHtrZXl9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjYXRlZ29yeUJ0blwiIGRhdGEtbGluay1jYXRlZ29yeWlkPVwiJHtrZXl9XCI+JHtkYXRhLkNhdGVnb3JpZXNba2V5XVtcIkNhdE5hbWVcIl19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICBgO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkaXNwbGF5QWxsUHJvZHVjdHMgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RMaXN0aW5ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0LWxpc3RpbmdzJyk7XHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyVHlwZScpID09ICd1c2VyJykge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3JlYXRlUHJvZHVjdEJ0bicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YS5Qcm9kdWN0cyk7XHJcblxyXG4gICAgICAgIGlmIChwcm9kdWN0TGlzdGluZ3MpIHtcclxuICAgICAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RMaXN0aW5ncy5pbm5lckhUTUwgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIHByb2R1Y3RcIiBkYXRhLWxpbmstcHJvZHVjdElEPVwiJHtrZXl9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL3Byb2R1Y3RzLyR7ZGF0YS5Qcm9kdWN0c1trZXldW1wiUHJvZHVjdEltYWdlXCJdfVwiIGRhdGEtbGluay1wcm9kdWN0SUQ9XCIke2tleX1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2R1Y3QtbmFtZVwiPiR7ZGF0YS5Qcm9kdWN0c1trZXldW1wiUHJvZHVjdFRpdGxlXCJdfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZHVjdC1wcmljZVwiPiQke2RhdGEuUHJvZHVjdHNba2V5XVtcIlByaWNlXCJdfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9kdWN0cycsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkaXNwbGF5UHJvZHVjdERldGFpbHMgPSAocHJvZHVjdERhdGEpID0+IHtcclxuICAgICAgICBjb25zdCBwcm9kdWN0RGV0YWlscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0RGV0YWlscy1jb250YWluZXInKTtcclxuICAgICAgICBjb25zdCBwcm9kdWN0SW1hZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbi1pbWFnZScpO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0LXRpdGxlJyk7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdERlc2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdC1kZXNjcmlwdGlvbicpO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RQcmljZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmljZScpO1xyXG5cclxuICAgICAgICBpZiAocHJvZHVjdERldGFpbHMpIHtcclxuICAgICAgICAgICAgcHJvZHVjdEltYWdlLnNyYyA9IGBhc3NldHMvcHJvZHVjdHMvJHtwcm9kdWN0RGF0YVsnUHJvZHVjdEltYWdlJ119YDtcclxuICAgICAgICAgICAgcHJvZHVjdFRpdGxlLnRleHRDb250ZW50ID0gcHJvZHVjdERhdGFbJ1Byb2R1Y3RUaXRsZSddO1xyXG4gICAgICAgICAgICBwcm9kdWN0RGVzYy50ZXh0Q29udGVudCA9IHByb2R1Y3REYXRhWydQcm9kdWN0RGVzYyddO1xyXG4gICAgICAgICAgICBwcm9kdWN0UHJpY2UudGV4dENvbnRlbnQgPSAnJCcgKyBwcm9kdWN0RGF0YVsnUHJpY2UnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2R1Y3QnLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2hhbmdlSXRlbVF1YW50aXR5ID0gKGFjdGlvbikgPT4ge1xyXG4gICAgICAgIGxldCBpdGVtUXVhbnRpdHlJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNxdWFudGl0eS1pbnB1dCcpO1xyXG4gICAgICAgIGxldCBpdGVtUXVhbnRpdHkgPSBwYXJzZUludChpdGVtUXVhbnRpdHlJbnB1dC52YWx1ZSwgMTApO1xyXG5cclxuICAgICAgICBpZiAoYWN0aW9uID09PSAnaW5jcmVhc2UnKSB7XHJcbiAgICAgICAgICAgIGl0ZW1RdWFudGl0eSArPSAxO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgZWxzZSBpZiAoYWN0aW9uID09PSAnZGVjcmVhc2UnICYmIGl0ZW1RdWFudGl0eSA+IDApIHtcclxuICAgICAgICAgICAgaXRlbVF1YW50aXR5IC09IDE7IFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXRlbVF1YW50aXR5SW5wdXQudmFsdWUgPSBpdGVtUXVhbnRpdHk7IFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNVc2VyTG9nZ2VkSW4sXHJcbiAgICAgICAgZGlzcGxheUFsbENhdGVnb3JpZXMsXHJcbiAgICAgICAgZGlzcGxheUFsbFByb2R1Y3RzLFxyXG4gICAgICAgIGRpc3BsYXlQcm9kdWN0RGV0YWlscyxcclxuICAgICAgICBjaGFuZ2VJdGVtUXVhbnRpdHksXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkb207IiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XHJcbmltcG9ydCBhY2NvdW50IGZyb20gJy4vYWNjb3VudCc7XHJcbmltcG9ydCBwcm9kdWN0IGZyb20gJy4vcHJvZHVjdCc7XHJcbmltcG9ydCBjYXRlZ29yeSBmcm9tICcuL2NhdGVnb3J5JztcclxuXHJcbmNvbnN0IGhhbmRsZXIgPSAoKCkgPT4ge1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZUNsaWNrcyA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBsb2dpbkZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5Gb3JtJyk7XHJcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlZ2lzdGVyRm9ybScpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRFbGVtZW50ID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2xvZ291dEJ0bicpKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYWNjb3VudElEJyk7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlclR5cGUnKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG9wQnRuJykpIHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3QuZ2V0UHJvZHVjdHMoKHByb2R1Y3RzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2R1Y3RzJywgSlNPTi5zdHJpbmdpZnkocHJvZHVjdHMpKTsgLy8gU2F2ZSB0aGUgcHJvZHVjdHMgaW4gbG9jYWxTdG9yYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAncHJvZHVjdHMuaHRtbCc7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuaGFzQXR0cmlidXRlKCdkYXRhLWxpbmstcHJvZHVjdGlkJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RJRCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1saW5rLXByb2R1Y3RpZCcpO1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdC5nZXRTZWxlY3RlZFByb2R1Y3QocHJvZHVjdElELCAocHJvZHVjdERhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJvZHVjdCcsIEpTT04uc3RyaW5naWZ5KHByb2R1Y3REYXRhKSk7IC8vIFNhdmUgdGhlIHNlbGVjdGVkIHByb2R1Y3QgaW4gbG9jYWxTdG9yYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAncHJvZHVjdERldGFpbHMuaHRtbCc7XHJcbiAgICAgICAgICAgICAgICB9KTsgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGluay1jYXRlZ29yeWlkJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhdGVnb3J5SUQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGluay1jYXRlZ29yeWlkJyk7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeS5nZXRTZWxlY3RlZENhdGVnb3J5KGNhdGVnb3J5SUQsIChwcm9kdWN0cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9kdWN0cycsIEpTT04uc3RyaW5naWZ5KHByb2R1Y3RzKSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ3Byb2R1Y3RzLmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSA9PSAnc3VibWl0U2VhcmNoJykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlYXJjaEJhcklucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NlYXJjaC1iYXInKS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3Quc2VhcmNoUHJvZHVjdChzZWFyY2hCYXJJbnB1dCwgKHByb2R1Y3RzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2R1Y3RzJywgSlNPTi5zdHJpbmdpZnkocHJvZHVjdHMpKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAncHJvZHVjdHMuaHRtbCc7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2luY3JlYXNlLXF1YW50aXR5JykpIHtcclxuICAgICAgICAgICAgICAgIGRvbS5jaGFuZ2VJdGVtUXVhbnRpdHkoJ2luY3JlYXNlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZGVjcmVhc2UtcXVhbnRpdHknKSkge1xyXG4gICAgICAgICAgICAgICAgZG9tLmNoYW5nZUl0ZW1RdWFudGl0eSgnZGVjcmVhc2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChsb2dpbkZvcm0pIHtcclxuICAgICAgICAgICAgbG9naW5Gb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbWFpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbkVtYWlsJykudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXNzd29yZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpblBhc3N3b3JkJykudmFsdWU7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIGFjY291bnQuY2hlY2tMb2dpbihlbWFpbCwgcGFzc3dvcmQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAocmVnaXN0ZXJGb3JtKSB7XHJcbiAgICAgICAgICAgIHJlZ2lzdGVyRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWdpc3Rlck5hbWUnKS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVtYWlsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlZ2lzdGVyRW1haWwnKS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhc3N3b3JkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlZ2lzdGVyUGFzc3dvcmQnKS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpOyAvLyBHZXQgY3VycmVudCBkYXRlIGluIElTTyBmb3JtYXRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShjdXJyZW50RGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDE5KS5yZXBsYWNlKCdUJywgJyAnKTsgLy8gWVlZWS1NTS1ERCBISDpNTTpTU1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBKU09OXHJcbiAgICAgICAgICAgICAgICBsZXQgYWNjb3VudERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJOYW1lXCI6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJFbWFpbFwiOiBlbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICBcIlBhc3N3b3JkXCI6IHBhc3N3b3JkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQ3JlYXRlZCBBdFwiOiBmb3JtYXR0ZWREYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVXNlciBUeXBlXCI6ICd1c2VyJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYWNjb3VudC5jcmVhdGVBY2NvdW50KGFjY291bnREYXRhKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsgaGFuZGxlQ2xpY2tzIH07XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVyOyIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xyXG5cclxuY29uc3QgbG9hZEhlYWRlckZvb3RlciA9ICgoKSA9PiB7XHJcbiAgICBjb25zdCBsb2FkSGVhZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlckhUTUwgPSBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3AtbmF2XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImxvZ29cIiBocmVmPVwiaW5kZXguaHRtbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL2Jsb2Nrcy5wbmdcIiBhbHQ9XCJsb2dvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgyPkVjb1RveTwvaDI+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2VhcmNoLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpb24taWNvbiBuYW1lPVwic2VhcmNoLW91dGxpbmVcIiBpZD1cInN1Ym1pdFNlYXJjaFwiPjwvaW9uLWljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzZWFyY2hcIiBpZD1cInNlYXJjaC1iYXJcIiBwbGFjZWhvbGRlcj1cIlNlYXJjaCBhIHByb2R1Y3QuLi5cIj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXItYWN0aW9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhdXRoTGlua3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PGlvbi1pY29uIG5hbWU9XCJsb2ctaW4tb3V0bGluZVwiPjwvaW9uLWljb24+PGEgaHJlZj1cImxvZ2luLmh0bWxcIj5Mb2dpbjwvYT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPjxpb24taWNvbiBuYW1lPVwicGVyc29uLWFkZC1vdXRsaW5lXCI+PC9pb24taWNvbj48YSBocmVmPVwicmVnaXN0ZXIuaHRtbFwiPlJlZ2lzdGVyPC9hPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImFjY291bnRMaW5rXCI+PGlvbi1pY29uIG5hbWU9XCJwZXJzb24tb3V0bGluZVwiPjwvaW9uLWljb24+PGEgaHJlZj1cIiNcIj5BY2NvdW50PC9hPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImxvZ291dExpbmtcIj48aW9uLWljb24gbmFtZT1cImxvZy1vdXQtb3V0bGluZVwiPjwvaW9uLWljb24+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImxvZ291dEJ0blwiPkxvZ291dDwvYT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+PGlvbi1pY29uIG5hbWU9XCJiYXNrZXQtb3V0bGluZVwiPjwvaW9uLWljb24+PGEgaHJlZj1cIiNcIj5CYXNrZXQ8L2E+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8bmF2PlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJzaG9wQnRuXCI+U2hvcDwvYT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjZmVlZGJhY2tcIj5GZWVkYmFjazwvYT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjY29udGFjdFwiPkNvbnRhY3Q8L2E+XHJcbiAgICAgICAgICAgIDwvbmF2PlxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgICAgIGNvbnN0IGhlYWRlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoZWFkZXInKTtcclxuICAgICAgICBoZWFkZXJFbGVtZW50LmlubmVySFRNTCA9IGhlYWRlckhUTUw7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoaGVhZGVyRWxlbWVudCwgZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKTtcclxuXHJcbiAgICAgICAgZG9tLmlzVXNlckxvZ2dlZEluKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbG9hZEZvb3RlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBmb290ZXJIVE1MID0gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvb3Rlci1jb2x1bW5cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDM+U2hvcDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5BbGwgUHJvZHVjdHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+QmVzdCBTZWxsZXJzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPk5ldyBJbjwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb290ZXItY29sdW1uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgzPkVuY2hhbnRlZCBQbGFuZXQ8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+SG9tZTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5BYm91dDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5CbG9nPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkNvbnRhY3Q8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbHVtblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz5NeSBBY2NvdW50PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkxvZ2luPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPk9yZGVyczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5BY2NvdW50IGRldGFpbHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+Rm9yZ290IHBhc3N3b3JkPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvb3Rlci1jb2x1bW5cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDM+R2VuZXJhbDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5Qcml2YWN5IFBvbGljeTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5UZXJtcyAmIENvbmRpdGlvbnM8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+RGVsaXZlcnkgYW5kIFJldHVybnM8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLXNvY2lhbC1wYXltZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNvY2lhbC1pY29uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIFVzZSBhY3R1YWwgaWNvbnMgb3IgaW1hZ2VzIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiPjxpbWcgc3JjPVwiYXNzZXRzL2ZhY2Vib29rLnBuZ1wiIGFsdD1cIkZhY2Vib29rXCI+PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiPjxpbWcgc3JjPVwiYXNzZXRzL2luc3RhZ3JhbS5wbmdcIiBhbHQ9XCJJbnN0YWdyYW1cIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCI+PGltZyBzcmM9XCJhc3NldHMvcGludGVyZXN0LnBuZ1wiIGFsdD1cIlBpbnRlcmVzdFwiPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvb3Rlci1ib3R0b21cIj5cclxuICAgICAgICAgICAgICAgIDxwPsKpIDIwMjQgRWNvVG95LiBBbGwgUmlnaHRzIFJlc2VydmVkIHwgV2Vic2l0ZSBieSB1cyA6MzwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY29uc3QgZm9vdGVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvb3RlcicpO1xyXG4gICAgICAgIGZvb3RlckVsZW1lbnQuY2xhc3NOYW1lID0gXCJzaXRlLWZvb3RlclwiO1xyXG4gICAgICAgIGZvb3RlckVsZW1lbnQuaW5uZXJIVE1MID0gZm9vdGVySFRNTDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvb3RlckVsZW1lbnQpO1xyXG4gICAgfVxyXG4gICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbG9hZEhlYWRlcixcclxuICAgICAgICBsb2FkRm9vdGVyXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBsb2FkSGVhZGVyRm9vdGVyOyIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgIGNvbnN0IHByb2R1Y3RzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJvZHVjdHMnKSk7XHJcbiAgICBpZiAocHJvZHVjdHMpIHtcclxuICAgICAgICBkb20uZGlzcGxheUFsbFByb2R1Y3RzKHByb2R1Y3RzKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgcHJvZHVjdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Byb2R1Y3QnKSk7XHJcbiAgICBpZiAocHJvZHVjdCkge1xyXG4gICAgICAgIGRvbS5kaXNwbGF5UHJvZHVjdERldGFpbHMocHJvZHVjdCk7XHJcbiAgICB9XHJcbn0pXHJcblxyXG5jb25zdCBwcm9kdWN0ID0gKCgpID0+IHsgICAgXHJcbiAgICBsZXQgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTAwMC9hcGkvcHJvZHVjdHMnO1xyXG5cclxuICAgIGNvbnN0IGdldFByb2R1Y3RzID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ2V0U2VsZWN0ZWRQcm9kdWN0ID0gKHByb2R1Y3RJRCwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICBsZXQgcHJvZHVjdFVybCA9IHVybCArIGAvJHtwcm9kdWN0SUR9fWA7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHByb2R1Y3RVcmwpO1xyXG5cclxuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgcHJvZHVjdERhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhwcm9kdWN0RGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNlYXJjaFByb2R1Y3QgPSAoc2VhcmNoSW5wdXQsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgbGV0IHNlYXJjaFVSTCA9IHVybCArIGA/c2VhcmNoPSR7c2VhcmNoSW5wdXR9YDtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgc2VhcmNoVVJMKTtcclxuICAgIFxyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9kdWN0RGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHByb2R1Y3REYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRQcm9kdWN0cyxcclxuICAgICAgICBnZXRTZWxlY3RlZFByb2R1Y3QsXHJcbiAgICAgICAgc2VhcmNoUHJvZHVjdCxcclxuICAgIH1cclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHByb2R1Y3Q7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgbG9hZEhlYWRlckZvb3RlciBmcm9tICcuL2hlYWRlckZvb3Rlcic7XHJcbmltcG9ydCBoYW5kbGVyIGZyb20gJy4vaGFuZGxlcic7XHJcbmltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xyXG5pbXBvcnQgY2F0ZWdvcnkgZnJvbSAnLi9jYXRlZ29yeSc7XHJcblxyXG5sb2FkSGVhZGVyRm9vdGVyLmxvYWRIZWFkZXIoKTtcclxubG9hZEhlYWRlckZvb3Rlci5sb2FkRm9vdGVyKCk7XHJcblxyXG5jYXRlZ29yeS5nZXRDYXRlZ29yaWVzKChjYXRlZ29yaWVzKSA9PiB7XHJcbiAgICBkb20uZGlzcGxheUFsbENhdGVnb3JpZXMoY2F0ZWdvcmllcyk7XHJcbn0pO1xyXG5cclxuaGFuZGxlci5oYW5kbGVDbGlja3MoKTtcclxuXHJcbmlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWNjb3VudElEJykpIHtcclxuICAgIGRvbS5pc1VzZXJMb2dnZWRJbigpO1xyXG59IFxyXG5cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9