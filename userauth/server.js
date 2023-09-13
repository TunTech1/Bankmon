if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}



// Importing libraries that we installed using npm
const express = require ("express")
const ejs = require ("ejs")
const bodyParser = require ("body-parser")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")

initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )

const users = []

app.set("view engine', 'ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('./monumental'))
app.use(express.static('./dash'))



// Configuring the register post functionality
app.post("/login", passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true
}))

// Configuring the register post functionality
app.post("/register", async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = ({
            id: Date.now().toString(),
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            last_name: req.body.last_name,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            nationality: req.body.nationality,
            phone: req.body.phone,
            email: req.body.email,
            dob: req.body.dob,
            gender: req.body.gender,
            employstatus: req.body.employstatus,
            accttype: req.body.accttype,
            currency: req.body.currency,
            pinnumber: req.body.pinnumber,
            password: hashedPassword,
            nokname: req.body.nokname,
            nokaddress: req.body.nokaddress,
            nokrelationship: req.body.nokrelationship,
            nokphone: req.body.nokphone,
            nokemail: req.body.nokemail,

        })
        users.push(user);
        console.log(users);
        res.redirect("/login")

    } catch (e) {
        console.log(e);
        res.redirect("/register")

    }
})


// Routes

app.get('/dashboard', (req, res) => {
    res.render("dashboard.html");
});


app.get('/index', (req, res) => {
    res.render("index.ejs", 
    { 
        first_name: req.body.first_name,
        id: req.body.id,
        accttype: req.body.accttype,
        currency: req.body.currency,    
    });
});

app.get('/login', (req, res) => {
    res.render("login.ejs");
});

app.get('/register', (req, res) => {
    res.render("register.ejs");
});
// End Routes



 app.listen(3000)