import dom from './dom';

document.addEventListener('DOMContentLoaded', () => {
    const products = JSON.parse(localStorage.getItem('products'));
    if (products) {
        dom.displayAllProducts(products);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const product = JSON.parse(localStorage.getItem('product'));
    if (product) {
        dom.displayProductDetails(product);
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

export default product;