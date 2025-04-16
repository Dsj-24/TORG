import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AnnSchema = new Schema({
  OrgId:{type:ObjectId,ref:"organisers"},
  Content:String,
  Tournament:{type:ObjectId,ref:'Tournament'},
  time: { type: Date, default: Date.now } 
})

const AnnModel = mongoose.model("Announcements",AnnSchema);
export{AnnModel};
