// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Get the container and notification elements
    const imageContainer = document.getElementById('image-container');
    const notification = document.getElementById('copy-notification');

    // Make sure the container exists before adding a listener
    if (imageContainer) {
        imageContainer.addEventListener('click', (event) => {
            // Check if the clicked element is an <img> tag
            if (event.target.tagName === 'IMG') {
                const clickedImage = event.target;
                
                // Construct the full HTML <img> tag as a string
                const imageUrl = clickedImage.src;
                const imageTag = `<img src="${imageUrl}">`;

                // Use the modern Clipboard API to copy the text
                navigator.clipboard.writeText(imageTag).then(() => {
                    // On success, show the notification
                    showNotification();
                }).catch(err => {
                    // Log an error if copying fails
                    console.error('failed to copy image tag: ', err);
                });
            }
        });
    }

    // Function to display the notification for a few seconds
    function showNotification() {
        // Add the 'show' class to make it visible
        notification.classList.add('show');

        // Set a timer to remove the 'show' class after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000); // 3000 milliseconds = 3 seconds
    }
});