const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const axios = require('axios');

const JWT_SECRET = "JaiShreeKrishna";

let users = [];
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});



app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(u => u.username == username);
    if(user){
         res.status(403).send({
            message : 'you are already signed up. Please Sign In now.'
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

    
    let foundUser = null;
    for(let i = 0; i < users.length; i++) {
        if(users[i].username == username && users[i].password == password) {
           foundUser = users[i];
        }
    }

    if(!foundUser) {
        res.status(403).send({
            message: "Invalid Username or Password"
        });
    }
    else {
        const token = jwt.sign({
            username : foundUser.username
        }, JWT_SECRET);

        res.header("token", token);
        foundUser.token = token;
        
        res.send({
            token: token
        });
    }
})


const auth = (req, res, next) => {
    const token = req.headers.token;

    const decodedUser = jwt.verify(token, JWT_SECRET);

    if(decodedUser.username) {
        req.username = decodedUser.username;
        next();

    }
    else {
        res.status(403).json({
            error: "You are not signed in, Please sign in."
        })
    }
    
}



app.post('/me', auth, (req, res) => {
    const currentUser = req.username;
   let foundUser = null;

   for (let i = 0; i < users.length; i++) {
        if(users[i].username == currentUser) {
            foundUser = users[i];
        }
   }

   if(!foundUser) {
        res.status(403).json({
            message: "Something went wrong!"
        }
        );
   }
   else {
    res.send({
                username: foundUser.username,
                password: foundUser.password
            });
   };

}
);

   //GET Requests

app.get('/signup', (req, res) => {
    res.send({
        users: users
    })
});


            

        


app.listen(3000);