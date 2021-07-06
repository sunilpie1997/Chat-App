const mongoose=require("mongoose");
const Schema = mongoose.Schema;


const userSchema=new Schema({
    
    googleId:{
        type:String,
        required:true,
        maxlength:[50,"max length supported for googleId is 50"],

    },
    fullName:{
        type:String,
        required:true,
        maxlength:[50,"max length supported for fullName is 50"],

    },

    email:{
        type:String,
        maxlength:[50,"max length supported for email is 50"],
        unique:true,
        required:true,
        index:{unique:true},

    },

    photoUrl:{
        type:String,
        required:false,
        maxlength:[100,"max length supported for fullName is 100"],

    },

    lastAccess: {
        type:Date,
        required:false
    },

    friendIds : [
        {
            type:Schema.Types.ObjectId,
            ref:'userSchema'
        }
    ]
    // friendIds : {
    //     type : [Schema.Types.ObjectId],
    //     ref:'userSchema',
    //     default:[]
    // }
});

module.exports=mongoose.model('User',userSchema);