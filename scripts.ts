// Get references to the elements
const popupForm = document.getElementById('popupForm');
const moreButton = document.getElementById('moreButton');
const closePopupButton = document.getElementById('closePopup');

// Check if elements exist before adding event listeners
if (moreButton && popupForm && closePopupButton) {
    // Function to show the popup form
    const showPopupForm = () => {
        popupForm.classList.remove('hidden');
    };

    // Function to hide the popup form
    const hidePopupForm = () => {
        popupForm.classList.add('hidden');
    };

    // Add event listener to the "More" button
    moreButton.addEventListener('click', showPopupForm);

    // Add event listener to the close button inside the popup form
    closePopupButton.addEventListener('click', hidePopupForm);
}
