// Get URL parameters
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Fetch location branding data
async function fetchLocationBranding() {
  try {
    const locationId = getURLParameter('location_id');
    if (!locationId) {
      console.error('Location ID not found in URL');
      return;
    }

    const response = await fetch(`https://one.halowifi.com/api/external/location/${locationId}/branding`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'success' && data.location) {
      applyBranding(data.location);
    } else {
      console.error('Failed to fetch location branding:', data.message);
    }
  } catch (error) {
    console.error('Error fetching location branding:', error);
    // Set default values if API call fails
    setDefaultBranding();
  }
}

// Apply branding to the page
function applyBranding(location) {
  // Save branding data to localStorage
  const brandingData = {
    name: location.name || 'Guest WiFi',
    logo_img: location.logo_img || null,
    background_img: location.background_img || null,
    timestamp: Date.now()
  };
  localStorage.setItem('linkbase_branding', JSON.stringify(brandingData));

  // Set location name
  const locationNameElement = document.getElementById('location-name');
  if (locationNameElement) {
    locationNameElement.textContent = brandingData.name;
  }

  // Set logo
  const logoElement = document.querySelector('.logo');
  if (logoElement && brandingData.logo_img) {
    logoElement.src = brandingData.logo_img;
    logoElement.alt = `${brandingData.name} Logo`;
  }

  // Set background image
  if (brandingData.background_img) {
    document.body.style.backgroundImage = `url(${brandingData.background_img})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }
}

// Set default branding if API call fails
function setDefaultBranding() {
  // Save default branding to localStorage
  const defaultBranding = {
    name: 'Guest WiFi',
    logo_img: null,
    background_img: null,
    timestamp: Date.now()
  };
  localStorage.setItem('linkbase_branding', JSON.stringify(defaultBranding));

  const locationNameElement = document.getElementById('location-name');
  if (locationNameElement) {
    locationNameElement.textContent = 'Guest WiFi';
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Validate required URL parameters
  const params = new URLSearchParams(window.location.search);
  if(!(params.has('location_id') && params.has('network_id') && params.has('session_id'))) {
    // Handle malformed URLs by hiding login form and showing error
    document.getElementById('connectBtn').style.display = 'none';
    document.querySelector('.terms').style.display = 'none';
    showMessage('Invalid access link. Please use the correct WiFi login link.', 'error');
    return;
  }
  
  fetchLocationBranding();
});

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  handleLogin();
});

function handleLogin() {
  const fullName = document.getElementById('fullName')?.value;
  const firstName = fullName.split(' ')[0];
  const lastName = fullName.split(' ')[1] || '';
  const email = document.getElementById('email')?.value;
  const countryCodeValue = document.getElementById('countryCode')?.value;
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
  if (!phone || phone.length < 8 || phone.length > 10) {
    showMessage('Please enter a valid phone number (8-10 digits)');
    return;
  }

  // Extract actual country code from unique value
  const actualCountryCode = countryCodeValue.split('-')[0];
  const fullPhoneNumber = actualCountryCode + phone;

  // Show loading state
  const connectBtn = document.getElementById('connectBtn');
  const btnText = connectBtn.querySelector('.btn-text');
  
  connectBtn.classList.add('loading');
  connectBtn.disabled = true;
  btnText.textContent = 'Connecting...';

  // Get URL parameters
  const params = new URLSearchParams(window.location.search);
  
  // Prepare login data
  const loginData = {
    location_id: params.get('location_id'),
    network_id: params.get('network_id'),
    session_id: params.get('session_id'),
    login_app_id: params.get('login_app_id'),
    first_name: firstName,
    last_name: lastName,
    gender: 'male',
    email: email,
    phone: fullPhoneNumber,
    terms_accepted: termsAccepted,
    login_provider: 'linkbase'
  };

  // Make API call to connect user
  fetch(YOUR_APP_API_DOMAIN + LOGIN_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(loginData)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.status === 'success') {
      showSuccessAndRedirect(data.login_url);
    } else {
      showMessage('Connection failed. Please try again.');
      resetConnectButton();
    }
  })
  .catch(error => {
    showMessage('Connection failed. Please check your details and try again.');
    resetConnectButton();
  });
}

function resetConnectButton() {
  const connectBtn = document.getElementById('connectBtn');
  const btnText = connectBtn.querySelector('.btn-text');
  if (connectBtn) {
    connectBtn.classList.remove('loading', 'success');
    connectBtn.disabled = false;
    btnText.textContent = 'Connect to Network';
  }
}

function showSuccessAndRedirect(loginUrl = null) {
  console.log("loginUrl in showSuccessAndRedirect", loginUrl);
  const connectBtn = document.getElementById('connectBtn');
  const btnText = connectBtn.querySelector('.btn-text');

  // Show success state
  connectBtn.classList.remove('loading');
  connectBtn.classList.add('success');
  btnText.textContent = '✓ Details Submitted!';
  
  // Show success message
  showMessage('Details submitted successfully! Connecting to network...', 'success');
  
  // Redirect after 2 seconds
  setTimeout(() => {
    if (loginUrl) {
      window.location.href = loginUrl;
    } else {
      // Redirect to success page with current URL parameters
      const currentParams = window.location.search;
      window.location.href = 'success.html' + currentParams;
    }
  }, 2000);
}

function showMessage(message, type = 'error') {
  // Create or update message element
  let messageElement = document.getElementById('statusMessage');
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.id = 'statusMessage';
    messageElement.className = 'status-message';
    
    // Insert before the button
    const connectBtn = document.getElementById('connectBtn');
    connectBtn.parentNode.insertBefore(messageElement, connectBtn);
  }
  
  // Update styling based on type
  messageElement.className = 'status-message';
  if (type === 'success') {
    messageElement.classList.add('success');
  }
  
  messageElement.textContent = message;
  messageElement.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 5000);
}

// Modal functions
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