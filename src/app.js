require('dotenv').config()
const express = require('express');
const path = require('path')
const app = express();
require('./db/connection')
const register = require('./models/register')
const hbs = require('hbs');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 8000;

const staticpath = path.join(__dirname, "../public");
const viewspath = path.join(__dirname, '../templates/views')
const partialpath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs');
app.set("views", viewspath);
app.use(express.static(staticpath));
hbs.registerPartials(partialpath);

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// console.log(process.env.SECRET_KEY);

app.get('/', (req, res) => {
    res.render("index");
})

app.get('/register', (req, res) => {
    res.render("register");
})

app.get('/login', (req, res) => {
    res.render("login");
})

//create new user in db
app.post('/register', async (req, res) => {
    try {
        const first = req.body.firstname;
        const last = req.body.lastname;
        const email = req.body.email;
        const age = req.body.age;
        const phone = req.body.phone;
        const password = req.body.password;
        const gender = req.body.gender;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerEmp = new register({
                firstname: first,
                lastname: last,
                email: email,
                gender: gender,
                phone: phone,
                age: age,
                password: password,
                confirmpassword: cpassword
            })

            //token authentication
            console.log("the sucess part" + registerEmp);

            const token = await registerEmp.generateAuthToken(); //func in register.js
            console.log("the token part" + token);

             //employeeschema.pre() is middleware which execute here
            const create = await registerEmp.save();
            res.status(201).render("index");
            //console.log(create);
        } else {
            res.status(404).send("PASSWORD MUST MATCH");
        }
    } catch (err) {
        res.status(404).send(err);
    }
})

// login check
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const useremail = await register.findOne({ email: email });
        
        const isMatch = bcrypt.compare(password, useremail.password);

        // login ussing token
        const token = await useremail.generateAuthToken(); 
        console.log("the token part " + token);

        if ( isMatch) {
            res.status(201).render("index");
        } else {
            res.send("password is wrong");
        }
    } catch (err) {
        res.status(404).send("Either password or email idis wrong");
    }
})

// const bcrypt = require('bcryptjs');

// const securePass = async (password) => {
//     const passHash= await bcrypt.hash(password, 10);
//     console.log(passHash);

//     const passMatch= await bcrypt.compare(password, passHash);
//     console.log(passMatch);
// }
// securePass('456')


// const jwt = require('jsonwebtoken');

// const createtoken = async () => {
//     const tooken = await jwt.sign({ _id: "61f0cf659e52630928a694a3" }, "mynameismihirdineshjainyoutube",{
//         expiresIn:"2 seconds"
//     });
//     console.log(tooken);

//     const userVer = await jwt.verify(tooken, "mynameismihirdineshjainyoutube");
//     console.log(userVer);
// }

// createtoken()


app.listen(port, () => {
    console.log(`port no ${port} active`);
})