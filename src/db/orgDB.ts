import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Organiser = new Schema({
    username : {type:String, unique:true},
    password : String,
    tournaments: [{type:ObjectId,ref:'Tournament'}]
})

const OrgModel = mongoose.model("organisers",Organiser);

export {OrgModel};