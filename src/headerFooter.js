import dom from './dom';

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

        dom.isUserLoggedIn();
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

export default loadHeaderFooter;