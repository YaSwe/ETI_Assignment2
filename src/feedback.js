import dom from './dom';

document.addEventListener('DOMContentLoaded', () => {
    const feedback = JSON.parse(localStorage.getItem('feedback'));
    if (feedback) {
        dom.displayFeedback(feedback);
    }
})

const feedback = (() => {
    let url = 'http://localhost:1000/api/feedback';

    const getFeedback = (productID, callback) => {
        let searchUrl = `${url}/${productID}`; 
        let request = new XMLHttpRequest();
        request.open('GET', searchUrl);
    
        request.onload = function() {
            console.log(this.response)
            // First, check if the response is empty or not a valid JSON before parsing
            if (this.response && this.response.trim() !== '') {
                try {
                    // Try parsing the response. If it's not valid JSON, this will throw an error
                    let data = JSON.parse(this.response);
                    callback(data);
                } catch (e) {
                    // If an error is thrown, log it and optionally handle it
                    console.error("Error parsing JSON response:", e);
                    // Call the callback with null or an appropriate error message
                    callback(null, "Error parsing feedback data");
                }
            } else {
                // If the response is empty or null, handle it as no feedback available
                console.log('No feedback available or empty response.');
                callback(null, "No feedback available or empty response");
            }
        };
    
        request.onerror = function() {
            // Handle network errors
            console.error("Network error occurred");
            callback(null, "Network error");
        };
    
        request.send();
    };

    const createFeedback = (feedbackData) => {
        let request = new XMLHttpRequest();
        request.open('POST', url + "/create");
        
        request.onload = function() {
            if (request.status == 201) {
                return;
            } 
        }
        request.send(JSON.stringify(feedbackData));
        //dom.displayMessage('signup', 'error');
    }

    return {
        getFeedback,
        createFeedback,
    }
})();

export default feedback;