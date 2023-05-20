const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(	 
"127222647756-l6n7p1le8muepatkuitv56625k9sblbf.apps.googleusercontent.com",
"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",
"http://localhost:3000/auth/google/callback"

);

google.options({ auth: oauth2Client });

module.exports = google;
