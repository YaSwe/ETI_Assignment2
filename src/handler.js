import dom from './dom';
import account from './account';
import product from './product';
import category from './category';
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
                    window.location.href = 'productDetails.html';
                });  
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

            if (targetElement.classList.contains('increase-quantity')) {
                dom.changeItemQuantity('increase');
            }

            if (targetElement.classList.contains('decrease-quantity')) {
                dom.changeItemQuantity('decrease');
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

                    cart.addOrUpdateCartItem(localStorage.getItem('CartID'), productID, quantity, (error, data) => {
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

        document.querySelectorAll('.cart-item').forEach((item, index) => {
            const decreaseQuantityButton = item.querySelector('.decrease-quantity');
            const increaseQuantityButton = item.querySelector('.increase-quantity');
            const deleteButton = item.querySelector('.delCartItemBtn');
            const quantityInput = item.querySelector('input[type=number]');
            const productId = item.dataset.productId; 
    
            decreaseQuantityButton.addEventListener('click', () => {
                dom.updateQuantity(productId, Math.max(0, parseInt(quantityInput.value, 10) - 1)); 
            });
    
            increaseQuantityButton.addEventListener('click', () => {
                dom.updateQuantity(productId, parseInt(quantityInput.value, 10) + 1);
            });
    
            deleteButton.addEventListener('click', () => {
                dom.deleteCartItem(productId);
            });
        });
    }

    return { handleClicks };
})();

export default handler;