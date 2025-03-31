/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project


document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const name = encodeURIComponent(document.getElementById('name').value);
    const email = encodeURIComponent(document.getElementById('email').value);
    const phone = encodeURIComponent(document.getElementById('phone').value);
    const message = encodeURIComponent(document.getElementById('message').value);

    // Create the WhatsApp message
    const whatsappMessage = `Name: ${name}%0AEmail: ${email}%0APhone: ${phone}%0AMessage: ${message}`;
    const whatsappNumber = '2348142695808'; // Your WhatsApp number in international format
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    // Redirect to WhatsApp with the message
    window.location.href = whatsappURL;

    // Clear the form fields
    document.getElementById('contactForm').reset();

    // Optionally, display a success message
    document.getElementById('submitSuccessMessage').classList.remove('d-none');
    document.getElementById('submitErrorMessage').classList.add('d-none');
});

 document.addEventListener("DOMContentLoaded", function() {
        const heroVideo = document.getElementById('heroVideo');
        
        // Make sure video is loaded before starting
        heroVideo.addEventListener('loadeddata', function() {
            console.log("Video loaded successfully");
        });
        
        // Handle any errors
        heroVideo.addEventListener('error', function(e) {
            console.error("Error loading video:", e);
        });
    });



