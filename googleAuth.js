const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(	 
"**********************************************************************",
"*********************************************************************",
"http://localhost:3000/auth/google/callback"

);

google.options({ auth: oauth2Client });

module.exports = google;
