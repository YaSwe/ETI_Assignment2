import cart from './cart';

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
        cart.modifyCartItem(localStorage.getItem('cartID'), productId, newQuantity, () => {
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
        cart.deleteCartItem(localStorage.getItem('cartID'), productId, (error, data) => {
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

        cart.getCartItems(cartID, (items) => {
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

export default dom;