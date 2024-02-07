import account from './account';
import category from './category';

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

export default dom;