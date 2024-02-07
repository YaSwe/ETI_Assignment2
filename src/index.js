import loadHeaderFooter from './headerFooter';
import handler from './handler';
import dom from './dom';
import category from './category';

loadHeaderFooter.loadHeader();
loadHeaderFooter.loadFooter();

category.getCategories((categories) => {
    dom.displayAllCategories(categories);
});

handler.handleClicks();

if (localStorage.getItem('accountID')) {
    dom.isUserLoggedIn();
} 

