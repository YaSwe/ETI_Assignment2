import dom from './dom';

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

export default cart;