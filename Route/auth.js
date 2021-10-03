const express = require('express');

const router = express.Router();

require('../Database/DatabaseConnection');
const User = require('../Model/UserSchema');
const LoginUser = require('../Model/AdminSchema');

// router.get('/',(req,res) => {
//     res.send("hello world from the server!!");
// })

router.post('/register', async (req,res) => {
    console.log(req.body);
    // res.json({message : req.body});
    const {name, email, phone, destination, qualification, address, percentage} = req.body;
    //  validation
    if(!name || !email || !phone || !destination || !qualification || !address || !percentage)
    {
        return res.status(422).json({error: "Please Fill the filed properly!!"});

    }

    try {

       const userExist = await User.findOne({email:email});

        if(userExist)
        {
            return res.status(422).json({error: "You Are Already Registered!!!"});
            
        }

        const user = new User({name, email, phone, destination, qualification, address, percentage});

        const userRegister = await user.save();
        if(userRegister)
        {
            res.status(201).json({message: "user registration successfull!!"});

        }
        
    } catch (error) {
        console.log(error);
    }
})

//login route

router.post('/', async (req,res) => {
    // console.log(req.body);
    try {
        const {username, password} =req.body;

        if(!username || !password)
        {
            return res.status(400).json({error:"Please fill the data!!"});

        }

        const userLogin = await LoginUser.findOne({username:username});
        console.log(userLogin);

        
    } catch (error) {
        console.log(error);
    }

})



//change login credential
router.post('/changelogin', async (req,res) => {
    try {
        const {username, password,user_id} =req.body;

        if(!username || !password)
        {
            return res.status(400).json({error:"Please fill the data!!"});

        }
        const checkuser_id = await LoginUser.findOne({user_id:user_id});
        console.log("data from change login\n" + checkuser_id);
        
        if(checkuser_id)
        {
            LoginUser.updateOne({user_id:checkuser_id.user_id},{password:password, username:username}, (err,result) =>{
                if(err){
                    return res.status(400).json({error:"Error occured while updating!!"});
                }else{
                    console.log("Password update successfull !!");
                    return res.status(400).json({error:"Update successfull!!"});
    
                    
                }
            })
        }else{
            return res.status(400).json({error:"User_id Doesnot exist!!"});

        }
     
        
    } catch (error) {
        console.log("Change Login error :" + error);
    }
})

module.exports = router;