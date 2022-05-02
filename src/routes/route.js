const express = require('express');
const router = express.Router();
//const mongoose = require('mongoose')

const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")

const middleware = require("../middleware/commonMiddleware")

router.post("/login",authorController.login)

router.post("/register",authorController.createAuthor)

router.post("/blogs",middleware.authentication,blogController.createBlogs)

router.get("/getBlogs",middleware.authentication, blogController.getBlogs)

router.put("/blogs/:blogId",middleware.authentication,middleware.authorization, blogController.updateBlog)

router.delete("/blogs/:blogId",middleware.authentication,middleware.authorization, blogController.deleteBlog)

router.delete("/deleteQuery",middleware.authentication, blogController.deleteParams)
module.exports = router;