//Settings
const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express()
const jwt = require('jsonwebtoken');
const port = 3002

const cors = require('cors');
const { json } = require('body-parser');
const { response } = require('express');

const secretKey = '3zyN-7_RYoJlni1VnO-AIse4yv!.BLwXO_4bYL?Ts6WtByfSnvdJbHS0kYRXZIMK!kwDT2JR.5aeKtACeyJhbGczI1NiIsInR5cCI6pXVCJ9.eyJ1c2VybmFtZaWF0IjoxNjI0MjYxOTQzfQ.692KUxkepYuJBjx_3uNCdVM';
const adminEmail = 'pavlik.morozov701@gmail.com';

let responseStatus = 200
let responseText = ''

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


function checkExsistUserId(newUserId, email, users){

    let userIdExsist = false,
        userEmailExist = false;

        for(let i = 0; i < users.length; i++){
        
            if (newUserId == users[i].id){
                
                userIdExsist = true
                break
    
            }
            if(email == users[i].email){
                userEmailExist = true
            }
        }

    return [userIdExsist, userEmailExist]
}


const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};


function userListFilter(){

    function currentUserFilter(user){
        if(user.status != 'admin'){
            delete user.password;
            delete user.status;
            return user;
        };
    }

    const listUsers = fs.readFileSync('./user.json')
    const filteredListUsers = JSON.parse(listUsers).users.filter(currentUserFilter)
    
    return filteredListUsers;
}


//Get request handler
app.get('/', authenticateJWT, (req, res) => {
    
    filteredListUsers = userListFilter();

    res.status(200).send(filteredListUsers);
})


//Get profile data

app.get('/profile', (req, res)=>{
    const listUsers = JSON.parse(fs.readFileSync('./user.json'));
    const { user_id } = 
    for(let i = 0; i < listUsers.users.length; i++){

    }
})

//Post request handler
app.post('/create', (req, res ) => {
    
    const listUsers = JSON.parse(fs.readFileSync('./user.json'))
    
    userExsits = checkExsistUserId(req.body.id, req.body.email, listUsers.users)
    
    if(userExsits[0] === true){
        responseText = 'User with ID exsist. Please, choose another ID.' 
    } else if(userExsits[1] == true){
        responseText = 'User with email exsist. Please, choose another email.'
    }else{
        req.body.status = 'user'; 
        listUsers.users.push(req.body);
        let data = JSON.stringify(listUsers);
        fs.writeFileSync('./user.json', data);
        responseStatus = 201;
        responseText = 'Successfully user register.';
    }
    
    res.status(responseStatus).send({"answer":responseText});
})

//Auth Post request handler

app.post('/login', (req, res)=>{
    
    let responseStatus = 401,
        responseText = 'Authorization failed. Please, check email or password.'

    let access_token = '';
    
    const { email, password } = req.body;
    const listUsers = JSON.parse(fs.readFileSync('./user.json'));
    let currentUser = [];
    for(let i = 1; i < listUsers.users.length; i++){
        
        if(listUsers.users[i].email == email && listUsers.users[i].password == password){
            user_id = listUsers.users[i].id
            access_token = jwt.sign({ id:listUsers.users[i].id, name:listUsers.users[i].name }, secretKey)
            responseStatus = 200;
            responseText = 'Successfully authorization.'
            break;
        }
    }
    res.status(responseStatus).send({ answer: responseText, access_token: access_token, user_id: user_id });
})

//Patch request handler
app.patch('/update', (req, res) => {
    const listUsers = JSON.parse(fs.readFileSync('./user.json'))
    const { oldData, newData } = req.body

    responseText = 'Error. Update does not available. User with ID exsist. Please, choose another ID.';


    for(let i = 0; i < listUsers.users.length; i++){
        if(listUsers.users[i].id == oldData.id){
            listUsers.users.splice(i, 1)

            const exists = checkExsistUserId(newData.id, listUsers.users);

            if(exists == false){
                listUsers.users.push(newData)
                responseText = 'Successfuly update.'
                break
            }else{
                listUsers.users.push(oldData);
            }
            
        }
    }

    let data = JSON.stringify(listUsers);
    fs.writeFileSync('./user.json', data);
    res.status(responseStatus).send({"answer":responseText});
})


//Delete request handler
app.delete('/delete', (req, res) => {
    
    const listUsers = JSON.parse(fs.readFileSync('./user.json'))
    const { id } = req.query

    responseText = 'User with this ID not exists.'
    responseStatus = 200
    for(let i = 0; i < listUsers.users.length; i++){
        
        if(id == listUsers.users[i].id){
            
            listUsers.users.splice(i, 1);

            responseText = 'Successfuly deleted.'
        

            let data = JSON.stringify(listUsers);
            fs.writeFileSync('./user.json', data);
            break
        
        }
    }

    res.status(responseStatus).send({"answer":responseText});
})



// Start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

