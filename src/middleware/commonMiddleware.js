const jwt = require("jsonwebtoken");
const BlogModel = require('../module/blogModel')

const secret = process.env.JWT_SECRET || "group11"


//Decode Token function
const decodeToken = (token) => {
    
    return jwt.verify(token, secret, (err, data) => {
        if (err)
            return null
        else
            return data
    })
}

const authentication = async function (req, res, next) {
    try
    {
    let token = req.headers['x-Api-Key'] || req.headers['x-api-key']
    
    
    if (!token) {
        return res.status(403).send({ status: false, msg: "token must be present" });
    }
  
        let decoded = decodeToken(token)
        if (!decoded) {
            return res.status(403).send({ status: false, msg: "token is invalid" });
        }
        req.authorId=decoded.authorId
        next();
    }
    catch (err) {
            res.status(500).send({ status: false, error: err.message })

        }
}

module.exports = { authentication }