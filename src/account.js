import dom from './dom';

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
                localStorage.setItem('accountName', accountData.Name);

                // Check for and store active cart information if present
                if (cartData && cartData.ShopCartID) {
                    localStorage.setItem('cartID', cartData.ShopCartID.toString());
                    //localStorage.setItem('numCartItem', cartData.Quantity.toString());
                } else {
                    // Handle the case where there is no active cart
                    localStorage.removeItem('cartID');
                    //localStorage.setItem('numCartItem', '0');
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

export default account;

