import dom from './dom';

const category = (() => {    
    let url = 'http://localhost:1000/api/categories';

    const getCategories = (callback) => {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        
        request.onload = function() {
            let data = JSON.parse(this.response);
            callback(data);
        }
        request.send();
    }

    const getSelectedCategory = (categoryID, callback) => {
        let categoryUrl = url + `?search=${categoryID}`;
        let request = new XMLHttpRequest();
        request.open('GET', categoryUrl);

        request.onload = function() {
            let data = JSON.parse(this.response);
            callback(data);
        }
        request.send();
    }

    return {
        getCategories,
        getSelectedCategory,
    }
})();

export default category;