const express = require('express')
const exphbs = require('express-handlebars').create()
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

// Models
const Thought = require('./models/Thought')
const User = require('./models/User')

// Import Routes
const thoughtsRoutes = require('./routes/thoughtsRoutes')
const authRoutes = require('./routes/authRoutes')

// Import Controller
const ThoughtsController = require('./controllers/ThoughtsController')

// template engine
app.engine('handlebars', exphbs.engine)
app.set('view engine', 'handlebars')

// receber resposta do body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// session middleware
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    }),
)

// flash messages 
app.use(flash())

// public path 
app.use(express.static('public'))

// set sesssion to res 
app.use((req, res, next) => {
    if(req.session.userId) {
        res.locals.session = req.session
    }

    next()
})

//Routes
app.use('/thoughts', thoughtsRoutes)
app.use('/', authRoutes)

app.get('/', ThoughtsController.showThoughts)

conn 
    .sync()
    //.sync({ force: true })
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => console.log(err))