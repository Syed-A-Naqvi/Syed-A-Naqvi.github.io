// EmailJS integration for contact form
(function() {
    // Initialize EmailJS with your public key
    // You'll need to sign up at https://www.emailjs.com/ to get your keys
    // emailjs.init("YOUR_PUBLIC_KEY");
    
    // Throttle function to prevent multiple rapid submissions (anti-DDOS)
    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return func(...args);
        };
    }
    
    // Form submission handler
    function handleFormSubmit(event) {
        event.preventDefault();
        
        // Get the form element that was actually submitted
        const form = event.target;
        
        // Change button text to indicate sending
        const submitButton = form.querySelector('.submit-btn');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Get form data
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const organization = form.querySelector('#organization').value;
        const message = form.querySelector('#message').value;
        
        // Prepare template parameters (these match the template variables in EmailJS)
        const templateParams = {
            form_name: name,
            form_email: email,
            form_organization: organization,
            form_message: message,
            form_time: new Date().toLocaleString()
        };

        // Send the email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Show success message
                showNotification('Your message has been sent successfully!', 'success');
                
                // Reset form
                form.reset();
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                
                // Show error message
                showNotification('Failed to send message. Please try again later.', 'error');
            })
            .finally(function() {
                // Reset button text
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
    }
    
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
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }
    
    // Throttled event handler - limit to one submission every 3 seconds
    const throttledHandler = throttle(handleFormSubmit, 3000);
    
    // Add event listeners to both forms (desktop and mobile)
    document.addEventListener('DOMContentLoaded', function() {
        const desktopForm = document.querySelector('.contact-form.desktop');
        const mobileForm = document.querySelector('.contact-form.mobile');

        desktopForm.reset();
        mobileForm.reset();

        if (desktopForm) {
            desktopForm.addEventListener('submit', throttledHandler);
        }
        
        if (mobileForm) {
            mobileForm.addEventListener('submit', throttledHandler);
        }
    });
})();