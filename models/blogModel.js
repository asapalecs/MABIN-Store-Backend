const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
        unique:true,
    },
    numViews:{
        type: Number,
        default: 0,
    },
    isLiked:{
        type: Boolean,
        default:false,
    },
    isDisliked:{
        type: Boolean,
        default:false,
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    dislikes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    image: {
        type: String,
        defalut:"https://images.unsplash.com/photo-1526566762798-8fac9c07aa98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=804&q=80",
    },
    author:{
        type: String,
        default:"Admin",
    },
},{
    toJSON: {
        virtuals: true,
    }, 
    toObject: {
        virtuals: true,
    },
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);