const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema( {
    title:{
        type:String,
        required:"title is required",
        trim:true
    
    },
    body:{
        type:String,
        required:"body is required",
        trim:true
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Author"
    },
    tags:{
        type: [String],
        trim:true
    },
    category:{
        type:String,
        required:"category is required",
        trim:true
    },
    subcategory:{
        type:[String]
    },
    deletedAt:{
        type:Date
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    publishedAt:Date,
    isPublished:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

module.exports = mongoose.model('Blog',blogSchema) //blogs