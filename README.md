# Linkbase Captive Portal Login - Linkbase Integration

A modern, responsive captive portal login application built for Linkbase Platform specifically designed for Linkbase requirements. Features simple form-based authentication without OTP verification.

## Features

- **Simple Form Authentication**: Direct login using phone number submission
- **International Support**: 200+ country codes supported
- **Responsive Design**: Mobile-first design with modern UI/UX
- **Instant Access**: Users gain network access immediately upon form submission
- **Legal Compliance**: Terms of Service and Privacy Policy modals
- **Error Handling**: Comprehensive error states and user feedback
- **API Integration**: Seamless integration with Linkbase backend
- **Linkbase Customized**: Built specifically for Linkbase network requirements

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: jQuery 3.6.0
- **Styling**: Custom CSS with gradient backgrounds and modern components
- **Icons**: SVG icons and emoji feedback
- **Fonts**: Google Fonts (Inter)

## Project Structure

```
src/
├── index.html          # Main login page
├── success.html        # Success page after authentication
├── failed.html         # Error page for failed attempts
└── assets/
    ├── style.css       # Main stylesheet
    ├── js/
    │   ├── main.js     # Core application logic
    │   ├── config.js   # Configuration settings
    │   └── jquery-3.5.0.min.js
    └── images/
        ├── single-pixel.png
        └── touring-talkies-logo1.webp
```

## Configuration

### Environment Variables

Edit `src/assets/js/config.js` to customize:

```javascript
const YOUR_APP_API_DOMAIN = "https://one.Linkbase.com";
const LOGIN_API_ENDPOINT = "/api/external-network-logins/email-login-trigger";
const USER_BANDWIDTH_LIMIT = 10; // Mbps
const USER_SESSION_TIMEOUT = 10; // Minutes
```

### URL Parameters

The application expects these URL parameters for proper operation:

- `location_id`: Linkbase location identifier
- `network_id`: Network identifier
- `session_id`: User session identifier
- `login_app_id`: Login application identifier

## Usage

### Development

1. Serve the `src/` directory using any web server
2. Navigate to `index.html` with required URL parameters
3. Test with any valid phone number - no OTP verification required

### Production Deployment

1. Configure API endpoints in `config.js`
2. Update branding assets and logos for Linkbase
3. Deploy to web server with HTTPS support
4. Integrate with Linkbase captive portal infrastructure
5. Configure for Linkbase network requirements

## Authentication Flow

1. **Phone Entry**: User enters phone number with country code
2. **Terms Agreement**: User accepts Terms of Service and Privacy Policy
3. **Form Submission**: User submits the form
4. **Instant Authentication**: System processes the request immediately
5. **Network Access**: User gains internet access without verification delay

## Linkbase Integration

This application is specifically configured for Linkbase network requirements:
- No OTP verification required
- Direct access upon form submission
- Streamlined user experience for faster network access

## API Integration

The application integrates with Linkbase's authentication API:

- **Endpoint**: `/api/external-network-logins/email-login-trigger`
- **Method**: POST
- **Payload**: Phone number, session details, user agreement
- **Response**: Login URL or error message

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Features

- Phone number validation
- Form-based authentication
- Session timeout management
- Bandwidth limiting
- CSRF protection ready
- Input sanitization
- Terms of Service compliance

## License

Powered by Linkbase. All rights reserved.

## Support

For technical support or customization requests, contact the Linkbase development team.
