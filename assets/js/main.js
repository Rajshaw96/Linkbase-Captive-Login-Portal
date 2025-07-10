document.addEventListener('DOMContentLoaded', function() {
    // Modal triggers
    document.getElementById('tosModalTitle')?.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('tos');
    });

    document.getElementById('privacyModalTitle')?.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('privacy');
    });

    // Checkbox and button logic
    const termsCheckbox = document.getElementById('terms');
    const connectBtn = document.getElementById('connectBtn');

    if (termsCheckbox && connectBtn) {
        termsCheckbox.addEventListener('change', function() {
            connectBtn.disabled = !this.checked;
        });
    }

    // Form submission
    document.getElementById('loginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Initialize form button state
    if (connectBtn) {
        connectBtn.disabled = true;
    }
});

function openModal(type) {  
    const modalId = type === 'tos' ? 'tosModal' : 'privacyModal';
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(type) {
    const modalId = type === 'tos' ? 'tosModal' : 'privacyModal';
    document.getElementById(modalId).style.display = 'none';
}

function handleLogin() {
    const fullName = document.getElementById('fullName')?.value;
    const email = document.getElementById('email')?.value;
    const countryCode = document.getElementById('countryCode')?.value;
    const phone = document.getElementById('phone')?.value;
    const termsAccepted = document.getElementById('terms')?.checked;

    // Validate required fields
    if (!fullName || !email || !phone) {
        showMessage('Please fill in all required fields');
        return;
    }

    if (!termsAccepted) {
        showMessage('Please accept the Terms of Service and Privacy Policy');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address');
        return;
    }

    // Validate phone number
    if (!phone || phone.length < 10) {
        showMessage('Please enter a valid phone number');
        return;
    }

    const fullPhone = countryCode + phone;
    const connectBtn = document.getElementById('connectBtn');
    
    if (connectBtn) {
        connectBtn.textContent = 'Connecting...';
        connectBtn.disabled = true;
    }

    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    
    // Prepare login data
    const loginData = {
        location_id: params.get('location_id'),
        network_id: params.get('network_id'),
        session_id: params.get('session_id'),
        login_app_id: params.get('login_app_id'),
        full_name: fullName,
        email: email,
        phone: fullPhone,
        terms_accepted: termsAccepted,
        session_timeout: USER_SESSION_TIMEOUT || 3600,
        bandwidth: USER_BANDWIDTH_LIMIT || 10
    };

    // Make API call to connect user
    $.ajax({
        url: YOUR_APP_API_DOMAIN + LOGIN_API_ENDPOINT,
        method: 'POST',
        data: loginData,
        success: function(response) {
            if(response.status === 'success') {
                showSuccessAndRedirect(response.login_url);
            } else {
                showMessage('Connection failed. Please try again.');
                resetConnectButton();
            }
        },
        error: function(response) {
            showMessage('Connection failed. Please check your details and try again.');
            resetConnectButton();
        }
    });
}

function resetConnectButton() {
    const connectBtn = document.getElementById('connectBtn');
    if (connectBtn) {
        connectBtn.textContent = 'Connect to Network';
        connectBtn.disabled = false;
    }
}

function showSuccessAndRedirect(loginUrl = null) {
    // Show success message
    showMessage('Successfully connected to the network!');
    
    // Show redirect URL if provided
    if (loginUrl) {
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = loginUrl;
        }, 2000);
    } else {
        // Redirect to a default page or show success
        setTimeout(() => {
            window.location.href = 'success.html';
        }, 2000);
    }
}

function showMessage(message) {
    // Create or update message element
    let messageElement = document.getElementById('statusMessage');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'statusMessage';
        messageElement.className = 'status-message';
        document.querySelector('.card').appendChild(messageElement);
    }
    
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Legacy support for any remaining references
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        var openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(function(modal) {
            modal.classList.remove('show');
        });
        document.body.style.overflow = 'auto';
    }
});

$(document).ready(function() {
    // Get location assets
    var url = window.location.href;
    var params = new URLSearchParams(url.split('?')[1]);
    $('#page_url').text(url);
    
    // IMPORTANT: Required URL parameters for HaloWiFi integration
    if(!(params.has('location_id') && params.has('network_id') && params.has('session_id'))) {
        // Handle malformed URLs by hiding login form and showing error
        $('#connectBtn').hide();
        $('.terms').addClass('hidden');
        $('#loginRequestMalformed').removeClass('hidden');
        $('#page_url').show();
    } else {
        // Load location assets
        $.ajax({
            url: YOUR_APP_API_DOMAIN + '/api/external/location/' + params.get('location_id') + '/assets',
            method: 'GET',
            success: function(response) {
                if(response.status === 'success') {
                    var assets = response.data;
                    if(assets.logo_img) {
                        localStorage.setItem('logo_img', YOUR_APP_API_DOMAIN + '/' + assets.logo_img);
                        $('.logo').attr('src', localStorage.getItem('logo_img'));
                        $('.logo').show();
                    }
                }
            },
            error: function(response) {
                console.log('Failed to load location assets');
            }
        });
    }
});