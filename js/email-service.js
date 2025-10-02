const EmailService = ( function() {

    // Initialize EmailJS using public key obtained at https://www.emailjs.com
    emailjs.init({
        publicKey: "j7kRXnEO4MT7_iPZt",
        // Do not allow headless browsers
        blockHeadless: true,
        // blockList: {
        //   // Block the suspended emails
        //   list: ['foo@emailjs.com', 'bar@emailjs.com'],
        //   // The variable contains the email address
        //   watchVariable: 'userEmail',
        // },
        limitRate: {
          // Set the limit rate for the application
          id: 'portfolio',
          // Allow 1 request per 10s
          throttle: 20000,
        }
    });

    // Current Form Submission
    let currentForm = null;

    // Create a notification element to show success/error messages
    function showNotification(message, type) {
        // Remove any existing notification
        const existingNotification = document.querySelector('.form-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.textContent = message;
        
        // Insert notification after the form
        const form = document.querySelector('.contact-form.desktop').style.display !== 'none' 
            ? document.querySelector('.contact-form.desktop')
            : document.querySelector('.contact-form.mobile');
        
        form.parentNode.insertBefore(notification, form.nextSibling);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    return {

        // exposing showNotification feature for public use
        showNotification: showNotification,

        // Form submission handler
        handleFormSubmit: function(event) {

            // preventing default event behavior
            event.preventDefault();

            // setting current form
            currentForm = event.target;

            // Adding overlay to the screen
            const body = document.body;
            body.style.pointerEvents = 'none';
            const overlay = document.createElement('div');
            overlay.classList.add('captcha-overlay');
            body.insertBefore(overlay,body.firstChild);

            // adding captcha modal to the overlay
            const captchaModal = document.createElement('div');
            captchaModal.classList.add('captcha-modal');
            captchaModal.classList.add('g-recaptcha');
            captchaModal.setAttribute('data-sitekey', '6LdMdNorAAAAABVhIAkfJ52V0E5RoXUwoh5twHaR');
            captchaModal.setAttribute('data-callback', 'onCaptchaSuccess');
            captchaModal.setAttribute('data-error-callback', 'onCaptchaError');
            overlay.appendChild(captchaModal);

        },

        // processing form submission after captcha success
        processFormSubmission: function(token) {

            // getting the current form contents
            const form = currentForm;
            if (!form) return;

            // resetting form contents to prevent potential duplicate submission errors
            currentForm = null;

            // changing submit button text to indicate pending submission
            const submitButton = form.querySelector('.submit-btn');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = "Sending...";
            submitButton.disabled = true;
            
            // preparing email template parameters using form data
            const templateParams = {
                form_name: form.querySelector('#name'),
                form_email: form.querySelector('#email'),
                form_organization: form.querySelector('#organization'),
                form_message: form.querySelector('#message'),
                'g-recaptcha-response': token
            }

            // sending email using EmailJS
            emailjs.send('service_ye7wo3e', 'template_ucv1r5w', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showNotification('Your message has been sent successfully!', 'success');
                    form.reset();
                })
                .catch(function(error) {
                    console.log('FAILED...', error);
                    showNotification('Failed to send message. Please try again later.', 'error');
                })
                .finally(function() {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        },

        removeCaptcha: function() {
            // Remove overlay and enable body interaction again
            const captchaOverlay = document.querySelector('.captcha-overlay');
            if (captchaOverlay) {
                captchaOverlay.remove();
            }
            document.body.style.pointerEvents = 'auto';
        }
    }

})();


window.onCaptchaSuccess = function(token) {

    // removing captcha making body interactible again
    EmailService.removeCaptcha();

    // processing submissiong request using captcha token
    // EmailService.processFormSubmission(token);

};

window.onCaptchaError = function() {

    // removing captcha making body interactible again
    EmailService.removeCaptcha();

    // Showing captcha error notification
    EmailService.showNotification('Captcha verification failed. Please try again.', 'error');

};

// EmailJS integration for contact form
// Add event listeners to both forms (desktop and mobile)
document.addEventListener('DOMContentLoaded', function() {
    
    const desktopForm = document.querySelector('.contact-form.desktop');
    const mobileForm = document.querySelector('.contact-form.mobile');
    
    desktopForm.reset();
    mobileForm.reset();
    
    if (desktopForm) {
        desktopForm.addEventListener('submit', EmailService.handleFormSubmit);
    }
    
    if (mobileForm) {
        mobileForm.addEventListener('submit', EmailService.handleFormSubmit);
    }

});