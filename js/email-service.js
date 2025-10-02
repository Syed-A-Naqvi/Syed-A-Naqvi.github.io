const EmailService = ( function() {

    // Initialize EmailJS using public key obtained at https://www.emailjs.com
    emailjs.init({
        publicKey: "stUVVv-xHXQzteGtb",
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
          throttle: 30000,
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
        const desktopForm = document.querySelector('.contact-form.desktop');
        const mobileForm = document.querySelector('.contact-form.mobile');
        const form = window.getComputedStyle(desktopForm).display === 'none' 
            ? mobileForm
            : desktopForm;
        
        form.parentNode.insertBefore(notification, form.nextSibling);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 4000);
    };

    return {

        // exposing showNotification feature for public use
        showNotification: showNotification,

        // Form submission handler
        handleFormSubmit: function(event) {

            // preventing default event behavior
            event.preventDefault();

            // setting current form
            currentForm = event.target;

            // display captcha and disable main content interaction
            document.querySelector('.container').style.pointerEvents = 'none';
            document.querySelector('.captcha-overlay').style.display = 'block';
            document.querySelector('.captcha-modal').style.display = 'block';

        },

        // processing form submission after captcha success
        processFormSubmission: function(token) {

            // getting current form contents and resetting currentForm element
            if (!currentForm) {
                showNotification('Captcha triggered without a form submission.', 'error');
                return;
            }
            const form = currentForm;
            currentForm = null;

            // changing submit button text to indicate pending submission
            const submitButton = form.querySelector('.submit-btn');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = "Sending...";
            submitButton.disabled = true;
            
            // preparing email template parameters using form data
            const templateParams = {
                form_name: form.querySelector('#name').value,
                form_email: form.querySelector('#email').value,
                form_organization: form.querySelector('#organization').value,
                form_message: form.querySelector('#message').value,
                'g-recaptcha-response': token
            }

            // // sending email using EmailJS
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
            
            setTimeout(() => {
                // Hide/reset captcha and enable body interaction again
                document.querySelector('.captcha-overlay').style.display = 'none';
                document.querySelector('.captcha-modal').style.display = 'none';
                document.querySelector('.container').style.pointerEvents = 'auto';
                grecaptcha.reset(); 
            }, 1500);


        }
    }

})();


window.onCaptchaSuccess = function(token) {

    // removing captcha making body interactible again
    EmailService.removeCaptcha();

    // processing submissiong request using captcha token
    EmailService.processFormSubmission(token);

};

window.onCaptchaError = function() {

    // removing captcha making body interactible again
    EmailService.removeCaptcha();

    // Showing captcha error notification
    EmailService.showNotification('Captcha encountered errors. Please try again later.', 'error');

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