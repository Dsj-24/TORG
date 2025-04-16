import mongoose, { model } from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const User = new Schema({
    username : {type:String, unique:true},
    password : String,
    tournaments:[{type:ObjectId,ref:'Tournament'}]
})

const UserModel = mongoose.model("users",User);

export {UserModel};
