import dom from './dom';

document.addEventListener('DOMContentLoaded', () => {
    const recentlyAddedProduct = JSON.parse(localStorage.getItem('recentlyAddedProduct'));
    if (recentlyAddedProduct) {
        dom.displayProductInCart(recentlyAddedProduct);
        localStorage.removeItem('recentlyAddedProduct');
    }
});

const cart = (() => {







})();

export default cart;