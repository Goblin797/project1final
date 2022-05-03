const BlogModel = require('../module/blogModel')
const AuthorModel = require("../module/authorModel")
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { listenerCount } = require('../module/authorModel')

const createBlogs = async function (req, res) {   //create the Blog
    try {
        const validateField = (field) => {
            return String(field)
                .match(
                    /^[a-zA-Z][a-zA-Z][a-zA-Z]/
                );
        };
        
        const data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({status:false, msg: "Blog details not given" })//details is given or not
        }
        if (!data.title) {
            return res.status(400).send({status:false, msg: "title not given" })
        }
        if (!validateField(data.title)) {
            return res.status(400).send({status:false, status: false, msg: "Invaild title" })//title validation
        }


        if (!data.body)
            return res.status(400).send({ status:false,msg: "body not given" })
        if (!validateField(data.body)) {
                return res.status(400).send({status:false, status: false, msg: "Invaild body" })//title validation
            }
        // if (!data.authorId)
        //     return res.status(400).send({ msg: "authorId not given" })
        if (!data.category)
            return res.status(400).send({status:false, msg: "category not given" })
        if (!validateField(data.category)) {
                return res.status(400).send({status:false, status: false, msg: "Invaild category" })//title validation
            }

        if(data.tags){  //if tags is given 
            if(Array.isArray(data.tags)){//check if tags is of type Array
            const t = data.tags.filter((e)=>e.length!=0)//tags=["","bus","train",""]
            data.tags=t //t=["bus","train"]
            }
            else{
                return res.status(400).send({status:false,msg:"please provide array for tags"})
            }
        }
        if(data.subcategory){
            if(Array.isArray(data.subcategory)){
            const t = data.subcategory.filter((e)=>e.length!=0)
            data.subcategory=t
            }
            else{
                return res.status(400).send({status:false,msg:"please provide array for subcategory"})
            }
        }

        if(data.isPublished==true){
            data.publishedAt=new Date()
            console.log("data.publishedAt")
        }
        // let isValidauthorID = mongoose.Types.ObjectId.isValid(data.authorId);
        // if (!isValidauthorID) {
        //     return res.status(400).send({ status: false, msg: "Author Id is Not Valid" });
        // }

        // const id = await AuthorModel.findById(data.authorId)
        // if (!id)
        //     return res.status(404).send({ msg: "authorId not found" })

        let token = req.headers['x-Api-Key'] || req.headers['x-api-key']
      
          
        let decodedtoken = jwt.verify(token, "group11")
        data.authorId = decodedtoken.authorId

        const reEntry = await BlogModel.findOne({ title: data.title, authorId: data.authorId })
        if (reEntry) {
            return res.status(400).send({ status:false,msg: `you have a blog of title ${data.title}` })
        }
        const blog = await BlogModel.create(data)
        return res.status(201).send({status:true,message:'new blog successfully created', data: blog })
    } 
    catch (err) {
        res.status(500).send({status:false, error: err.message })
    }

}


const getBlogs = async function (req, res) {  //get blog using filter query params
    try {
        const authorId = req.query.authorId;
        const category = req.query.category;
        const tags = req.query.tags;
        const subcategory = req.query.subcategory;
        const obj = {
            isDeleted: false,
            isPublished: true,

        };
        if (category)
            obj.category = category;
        if (authorId)
            obj.authorId = authorId;
        if (tags)
            obj.tags = tags;
        if (subcategory)
            obj.subcategory = subcategory;

        if (obj.authorId) {
            let isValidauthorID = mongoose.Types.ObjectId.isValid(obj.authorId);//check if objectId is objectid
            if (!isValidauthorID) {
                return res.status(400).send({ status: false, msg: "Author Id is Not Valid" });
            }

            const id = await AuthorModel.findById(obj.authorId)//check id exist in author model
            if (!id)
                return res.status(404).send({status:false, msg: "authorId dont exist" })
        }

        const data = await BlogModel.find(obj);
        if (data.length == 0) {
            return res.status(404).send({ status: false, msg: "Blogs not found" });
        }
        res.status(200).send({ status: true,message:"blog list", data: data });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

const updateBlog = async (req, res) => { //update blog
    try {
        const blogId = req.params.blogId
        // let data = req.body


        // // let isValidblogID = mongoose.Types.ObjectId.isValid(blogId);
        // // if (!isValidblogID) {
        // //     return res.status(400).send({ status: false, msg: "Blog Id is Not Valid" });
        // }
        const blog = await BlogModel.findOne({ _id: blogId, isDeleted: false }) //blog will contain only 1 doc
        //beacuse blog id is unique

        if (!blog)
            return res.status(404).send({status:false, msg: "no records found!!!" })

        if (blog.isPublished == true) {
            return res.status(404).send({status:false, msg: "blog already published" })
        }

        if (req.body.title) {
            blog.title = req.body.title
        }
        if (req.body.body) {
            blog.body = req.body.body
        }
        if (req.body.tags) {
            let temp1 = blog.tags
            temp1.push(req.body.tags) //adding tags 
            blog.tags = temp1
        }
        if (req.body.subcategory) {
            let temp2 = blog.subcategory
            temp2.push(req.body.subcategory)//adding subcategory
            blog.subcategory = temp2
        }

        blog.publishedAt = new Date()
        blog.isPublished = true
        blog.save()
        console.log(blog)
        res.status(200).send({status:true,message:"blog is successfully updated",data: blog })

    }
    catch (err) {
        res.status(500).send({status:false, error: err.message })
    }
}

const deleteBlog = async (req, res) => {
    try {
        // const id = req.params.blogId
        // if (!id)
        //     return res.status(404).send({ msg: "give the blogId " })

        // let isValidblogID = mongoose.Types.ObjectId.isValid(id);
        // if (!isValidblogID) {
        //     return res.status(400).send({ status: false, msg: "Blog Id is Not Valid" });
        // }

        const blog = await BlogModel.findById(req.params.blogId)
        if (blog.length==0)
            return res.status(404).send({ msg: "blogId dont exist" })

        if (blog.isDeleted == false) {
            blog.isDeleted = true
            blog.deletedAt = new Date()
            blog.save()
            return res.status(200).send({status:true,message:'blog deleted successfully', data: blog })
        }

        return res.status(404).send({ status:false,msg: "dont exist deleted" })
    }

    catch (err) {
        res.status(500).send({ status:false,error: err.message })
    }


}

const deleteParams = async (req, res) => {
    try {

        let token = req.headers['x-Api-Key'] || req.headers['x-api-key']
        if (!token) {
            return res.status(400).send({ status: false, msg: "token must be present" });
        }

        let decodedtoken = jwt.verify(token, "group11")
        if (!decodedtoken) {
            return res.status(401).send({ status: false, msg: "token is invalid" });
        }
        
        if(!req.query.authorId && !req.query.category && !req.query.tags && !req.query.subcategory){
            return res.status(400).send({status:false,msg:"what to delete is not given"})
        }

        const obj = {}     //obj is condition for find

        if (req.query.authorId) {
            if (req.query.authorId != decodedtoken.authorId) {
                return res.status(401).send({ status:false,msg: "unauthorized access" })
            }
            //obj.authorId = req.query.authorId
        }
        if (req.query.category) {
            obj.category = req.query.category
        }
        if (req.query.tags) {
            obj.tags = req.query.tags
        }
        if (req.query.subcategory) {
            obj.subcategory = req.query.subcategory
        }
        obj.isPublished = false //unpublished
        obj.isDeleted = false //not deleted
        obj.authorId = decodedtoken.authorId
        console.log(obj)

        const data = await BlogModel.updateMany(obj, { $set: { isDeleted: true, deletedAt: new Date() } })

        if (data.matchedCount == 0)
            return res.status(404).send({ status: false, msg: "blog not found" })


        res.status(200).send({ status: true, data: "blog(s) deleted Successfull " + data.matchedCount + " documents" })

    }
    catch (err) {
        res.status(500).send({ status:false,error: err.message })
    }
}

module.exports = { createBlogs, getBlogs, updateBlog, deleteBlog, deleteParams }

// const deleteBlogs = async (req, res) => {

//     try {
//         req.query.isDeleted =false;
//         console.log(req.query)
//         let date = new Date()
//         const data = await BlogModel.updateMany(req.query, { $set: { isDeleted: true ,deletedAt:date} })

//         if(data.matchedCount==0)
//         return res.status(404).send({ status: false, msg: "blog not found" })


//         res.status(200).send({ status: true,data:"finally deleted Successfull " +data.matchedCount+" documents" })
//     }
//     catch (err) {
//         res.send({ msg: err.message })
//     }


// }


// const getBlogs = async (req, res) => {
//     try {
//         const blog = await BlogModel.find({ isDeleted: false, isPublished: true })
//         if (Object.keys(blog) != 0)
//             return res.status(200).send({ msg: blog })

//         return res.status(400).send({ msg: "nothing found" })
//     }
//     catch (err) {
//         res.status(500).send({ error: err.message })
//     }
// }
// const getFilterBlogs = async (req, res) => {
//     try {

//         const obj = {}
//         obj.authorId = req.query.authorId
//         obj.category = req.query.category
//         obj.tags = req.query.tags
//         obj.subcategory = req.query.subcategory
//         obj.isDeleted = false     //deleted doc should not come
//         console.log(obj)

//         Object.keys(obj).forEach(key => {
//             if (obj[key] == undefined) {
//                 delete obj[key]
//             }
//         })

//         if (obj.authorId) {
//             const id = await AuthorModel.findById(obj.authorId)
//             if (!id)
//                 return res.status(404).send({ msg: "authorId is invalid" })
//         }

//         const filterBlog = await BlogModel.find(obj)
//         console.log(obj)
//         return res.send({ msg: filterBlog })
//     }
//     catch (err) {
//         res.status(500).send({ error: err.message })
//     }
// }

        // Object.keys(obj).forEach(key => {  //undefined value remove
        //     if (obj[key] == undefined) {
        //         delete obj[key]
        //     }
        // })

        // if (obj.authorId != undefined) {


        //     let isValidauthorID = mongoose.Types.ObjectId.isValid(obj.authorId);
        //     if (!isValidauthorID) {
        //         return res.status(400).send({ status: false, msg: "Author Id is Not Valid" });
        //     }

        //     if (obj.authorId) {
        //         const id = await AuthorModel.findById(req.query.authorId)
        //         if (!id)
        //             return res.status(404).send({ msg: "authorId dont exist" })
        //     }
        // }

        // const blog = await BlogModel.find(obj)
        // if (Object.keys(blog) == 0) {
        //     return res.status(404).send({ msg: "no records exist" })
        // }
        // for (let i = 0; i < blog.length; i++) {
        //     blog[i].isDeleted = true
        //     blog[i].deletedAt = new Date()
        //     blog[i].save()
        // }