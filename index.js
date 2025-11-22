const express = require('express');
const app = express();

let users = [];
app.use(express.json());


function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let token = "";
    for (let i = 0; i < 32; i++) {
        // use a simple function here
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}
let tokenSignup = "";

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(u => u.username == username);
        
    

    if(users.length === 0 || user.username != username) {
         users.push({
                username: username,
                password: password
            })
            res.json({
                message: "You are signed up"
            })
    }
    else {
            res.status(403).send({
                message: "You have already signed up, Please sign in."
            })
    }
      
});

app.get("/signup", (req, res) => {
    res.send(users);
})

app.delete("/signup", (req, res) => {
    users.pop();
    res.json({
        message: "Object Deleted Successfully"
    })
})
app.post('/signin', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(function(u) {
        if(u.username == username && u.password == password) return true;
        else return false;
    })
    if(user) {
        tokenSignup = generateToken();
    
        user.token = tokenSignup;
        res.json({
            message : tokenSignup
        })

    }
    else {
        res.status(403).send({
            message: "Invalid Username or Password"
        })
    }
})

app.listen(3000);