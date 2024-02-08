import dom from './dom';
import account from './account';
import product from './product';
import category from './category';
import feedback from './feedback';
import cart from './cart';

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
                product.getProducts((products) => {
                    localStorage.setItem('products', JSON.stringify(products)); // Save the products in localStorage
                    window.location.href = 'products.html';
                });
            }

            if (targetElement.hasAttribute('data-link-productid')) {
                const productID = e.target.getAttribute('data-link-productid');
                product.getSelectedProduct(productID, (productData) => {
                    localStorage.setItem('product', JSON.stringify(productData)); // Save the selected product in localStorage
                });  

                feedback.getFeedback(productID, (feedbackData) => {
                    localStorage.setItem('feedback', JSON.stringify(feedbackData));
                })
                window.location.href = 'productDetails.html';
            }

            if (targetElement.hasAttribute('data-link-categoryid')) {
                const categoryID = e.target.getAttribute('data-link-categoryid');
                category.getSelectedCategory(categoryID, (products) => {
                    localStorage.setItem('products', JSON.stringify(products)); 
                    window.location.href = 'products.html';
                });
            }

            if (targetElement.getAttribute('id') == 'submitSearch') {
                let searchBarInput = document.querySelector('#search-bar').value;
                product.searchProduct(searchBarInput, (products) => {
                    localStorage.setItem('products', JSON.stringify(products)); 
                    window.location.href = 'products.html';
                })
            }

            if (targetElement.classList.contains('cart-link')) {
                const accountID = localStorage.getItem('accountID');
                if (accountID) {
                    const cartID = localStorage.getItem('cartID');
                    if (cartID) {
                        cart.getCartItems(cartID, (items) => {
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
                feedback.createFeedback(feedbackData);
                window.location.reload();
            }
        })

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
    
                account.checkLogin(email, password);
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
                account.createAccount(accountData);
            })
        }

        initQuantityControlListeners('.productDetails-container');
        // Shopping Cart page specific event listeners
        if (window.location.pathname.includes('shoppingCart.html')) {
            dom.populateShoppingCart();
            initCartPageListeners();
        }

        if (window.location.pathname.includes('productDetails.html')) {
            initProductDetailsListeners();
        }

        if (window.location.pathname.includes('shoppingCart.html')) {
            dom.populateShoppingCart();
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
                    cart.addOrUpdateCartItem(cartID, productID, quantity, name, newPrice, () => {
                        window.location.href = 'shoppingCart.html';
                    });
                };

                // Proceed only if quantity is more than 0
                if (quantity > 0) {
                    if (!cartID) {
                        cart.createNewCart(accountID, (newCartID) => {
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

export default handler;