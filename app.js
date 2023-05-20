const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const User = require('./models/User');
const bcrypt = require('bcrypt');
const projectController = require('./controllers/project.controller');
const voteController = require('./controllers/vote.controller');
const google = require('./googleAuth');
const calendar = google.calendar('v3');

require('./passport-config')(passport);

const MONGO_URI = 'mongodb://mongodb:27017/Auth';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set('strictQuery', true);

mongoose.connection.on('error', (err) => {
  console.error('Erreur connexion mongo:', err);
});

mongoose.connection.once('open', () => {
  console.log('Tu es connecter a MongoDB');
});


app.get('/events', (req, res) => {
  const oauth2Client = new google.auth.OAuth2();

  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      res.status(500).send(err);
      return;
    }
    const events = response.data.items;
    if (events.length) {
      res.status(200).send(events);
    } else {
      res.status(404).send('No upcoming events found.');
    }
  });
});


// Configuration CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuration des sessions
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ url: MONGO_URI, collection: 'sessions' }),
  })
);

// Configuration du middleware connect-flash
app.use(flash());

// Middleware de Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes pour la gestion des utilisateurs
app.post('/register', async (req, res) => {
const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json(newUser); // Renvoie l'utilisateur nouvellement créé
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }

});

app.post('/login', (req, res, next) => {
passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ status: 'error', code: 'unauthorized' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json(user);
});
 })(req, res, next);
});

// Routes pour la gestion des projets
app.get('/projects', projectController.project_all);
app.get('/projects/:id', projectController.project_details);
app.post('/projects', projectController.project_create);
app.put('/projects/:id', projectController.project_update);
app.delete('/projects/:id', projectController.project_delete);

// Route pour la gestion des votes
app.post('/projects/:projectId/vote', voteController.vote);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
