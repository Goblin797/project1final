const AuthorModel = require("../module/authorModel")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

const createAuthor = async (req, res) => {
    try {

        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };


        const validatePassword = (password) => {
            return String(password)
                .match(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
                );
        };

        const validateName = (name) => { //can also use type string
            return String(name)
                .match(
                    /^[a-zA-Z]/
                );
        };

        const validatetitle=(title)=>{
            return ["Mr","Mrs","Miss"].indexOf(title)!=-1
        }
        const data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "author details not given" })//details is given or not
        }

        if (!data.fname)
            return res.status(400).send({ status: false, msg: "first name is missing" })
        if (!validateName(data.fname)) {
            return res.status(400).send({ status: false, msg: "first name must contain alpabet and number" })//title validation
        }

        if (!data.lname)
            return res.status(400).send({status:false,msg:"last name is missing"})
        if (!validateName(data.lname)) {
            return res.status(400).send({ status: false, msg: "last name must contain alpabet and number" })//title validation
        }

        if(!data.title){
            return res.status(400).send({status:false,msg:"title is required"})
        }else{
            if(!validatetitle(data.title)){
                return res.status(400).send({status:false,msg:"title should be among Mr,Mrs and Miss"})
            }
        }

        if (!data.email)
            return res.status(400).send({status:false,msg:"email is missing"})

        if (!validateEmail(data.email)) {
            return res.status(400).send({ status: false, msg: "Invaild E-mail id " })//email validation
        }

        if (!data.password)
            return res.status(400).send({ status: false, msg: "password is missing" })

        if (data.password.length < 8)
            return res.status(400).send({ msg: "password length must be minimum of 8 character" })

        if (!validatePassword(data.password)) {
            return res.status(400).send({ status: false, msg: "password should contain atleast one number,one special character and one capital letter" })//password validation
        }//password validation
        
        const hashPassword = await bcrypt.hash(data.password, 10)
        data.password = hashPassword

        const email = await AuthorModel.findOne({ email: data.email })//email exist or not
        if (!email) {
            const author = await AuthorModel.create(data)
            return res.status(201).send({status:true, data: author})
        }
        res.status(400).send({ status:false,msg: "email already exist" })
    }
    catch (err) {
        res.status(500).send({ status:false,error: err.message })
    }
}

//login controller

const login = async function (req, res) {
    try {
        const data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status:false,msg: "cannot be empty" })//details is given or not
        }

        let email = req.body.email
        let password = req.body.password
        if (!email)
            return res.status(400).send({ status:fasle,msg: "email is missing" })

        if (!password)
            return res.status(400).send({ status:false,msg: "password not given" })


        const match = await AuthorModel.findOne({ email: email })//verification

        if (!match)
            return res.status(401).send({ status:false,msg: "email does not match" })

        let p = await bcrypt.compare(password, match.password)
        if (!p)
            return res.status(401).send({ status:false,msg: "invalid password" })
        const token = jwt.sign(
            {
                authorId: match._id,
                iat:Math.floor(Date.now()/1000),
                exp:Math.floor(Date.now()/1000)+10*60*60 //login successfully give the token
            },
            "group11" //secret key
        )
        res.cookie('jwt',token)
        res.setHeader("x-api-key", token)
        res.status(200).send({ status: true,message:'author login successful', data: token })
    }
    catch (err) {
        res.status(500).send({status:false, error: err.message })
    }
}

module.exports = { createAuthor, login }


