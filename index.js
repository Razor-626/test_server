//Settings
const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express()
const port = 3002

const cors = require('cors');
const { json } = require('body-parser');
const { response } = require('express');

let responseStatus = 200
let responseText = ''

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


function checkExsistUserId(newUserId, users){

    let userExsist = false;

        for(let i = 0; i < users.length; i++){
        
            if (newUserId == users[i].id){
                
                userExsist = true
                break
    
            }
        }

    return userExsist
}


//Get request handler
app.get('/', (req, res) => {
    const listUsers = fs.readFileSync('./user.json')
    res.status(200).send(listUsers)
})


//Post request handler
app.post('/create', (req, res ) => {
    
    const listUsers = JSON.parse(fs.readFileSync('./user.json'))
    
    userExsits = checkExsistUserId(req.body.id, listUsers.users)
    
    if(userExsits === true){
        responseText = 'User with ID exsist. Please, choose another ID.' 
    }else{ 
        listUsers.users.push(req.body);
        let data = JSON.stringify(listUsers);
        fs.writeFileSync('./user.json', data);
        responseStatus = 201
        responseText = 'Successfully user register.'
    }
    
    res.status(responseStatus).send({"answer":responseText});
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

