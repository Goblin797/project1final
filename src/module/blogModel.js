const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema( {
    title:{
        type:String,
        required:true
    
    },
    body:{
        type:String,
        required:true
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
        required:true,
        enum: ["technology","entertainment","life style","food","fashion"]
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