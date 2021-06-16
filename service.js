function checkExsistUserId(req, users){

    userExsist = false
    const newUserId = req.body.id

    for(let i = 0; i < users.length; i++){
        
        if (newUserId == users[i].id){
            
            userExsist = true
            break

        }
    }

    return userExsist
}