const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const JWT_SECRET = "JaiShreeKrishna";

let users = [];
app.use(express.json());


app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(u => u.username == username);
    if(user){
         res.status(403).send({
            message : 'you are already logged in. Please Sign In now.'
        })
    }
    else {
       users.push({
            username : username,
            password : password
        });


        res.send({
            message: "You're signed up bruhh"
        });
    }
       
    }
);


app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    
    const user = users.find(u => u.username == username && password == password);
   
    
    if(user) {
        
        const token = jwt.sign({
            username: user.username
        }, JWT_SECRET);
        
        user.token = token;

        res.header("token", token);
    }
    else {
        res.status(403).send({
            message: "Invalid Username or Password"
    });
    }
})


const auth = (req, res, next) => {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.username == decodedData.username);
    if(user.token == token) {
        next();
    }
    else {
        res.send({
            message: "You're not logged in, let's log in first"
        })
    }
}



app.post('/me', auth, (req, res) => {
    const token = req.headers.token;

    const decodedData = jwt.verify(token, JWT_SECRET);

    if(decodedData) {
        const user = users.find(u => u.username == decodedData.username);
        if(user) {
            res.send({
                username: user.username,
                password: user.password
            })
        }
        else {
            res.status(403).send({
                error: "You're not signed in"
            })
        }
    }
    else {
        res.status(403).send({
            error: 'you are a pirate, Get off my website now!'
        })
    }
});
app.listen(3000);