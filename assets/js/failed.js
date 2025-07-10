// Load branding data from localStorage
function loadBrandingFromStorage() {
    try {
        const brandingData = localStorage.getItem('linkbase_branding');
        if (brandingData) {
            const branding = JSON.parse(brandingData);
            applyBranding(branding);
        } else {
            console.warn('No branding data found in localStorage');
            setDefaultBranding();
        }
    } catch (error) {
        console.error('Error loading branding from localStorage:', error);
        setDefaultBranding();
    }
}

// Apply branding to the page
function applyBranding(branding) {
    // Set location name
    const locationNameElement = document.getElementById('location-name');
    if (locationNameElement) {
        locationNameElement.textContent = branding.name || 'Guest WiFi';
    }

    // Set logo
    const logoElement = document.querySelector('.logo');
    if (logoElement && branding.logo_img) {
        logoElement.src = branding.logo_img;
        logoElement.alt = `${branding.name} Logo`;
    }

    // Set background image
    if (branding.background_img) {
        document.body.style.backgroundImage = `url(${branding.background_img})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }
}

// Set default branding if localStorage is empty
function setDefaultBranding() {
    const locationNameElement = document.getElementById('location-name');
    if (locationNameElement) {
        locationNameElement.textContent = 'Guest WiFi';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadBrandingFromStorage();
});

// Get uamip and uam port from url and set Try Again button to redirect to the login page
var login_ip = window.location.search.split('login_ip=')[1];
login_ip = login_ip ? login_ip.split('&')[0] : '';
var login_port = window.location.search.split('login_port=')[1];
login_port = login_port ? login_port.split('&')[0] : '';
var url = 'http://'+login_ip+':'+login_port+"/prelogin";

document.getElementById('tryAgainBtn').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = url;
}); 