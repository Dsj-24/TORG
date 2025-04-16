import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FixtureSchema = new mongoose.Schema({
    tournaId:{type:ObjectId,required:true, ref:"Tournament"},
    fixture: String,
    date: String,  // You might want to use Date type instead
    time: String,  // Consider using Date with only time
    stadium: String,
    result: String,
    stage: String
});

const TournamentSchema = new mongoose.Schema({
    title: {type:String,unique:true},
    fixtures: [{ type:ObjectId, ref: 'Fixture' }]  ,
    Organiser:{type:ObjectId ,ref:'organisers',required:true},// Array of fixtures
    Announcements:[{type:ObjectId,ref:"Announcements"}]
});

const tournaModel = mongoose.model('Tournament', TournamentSchema);
const fixtureModel = mongoose.model('Fixture', FixtureSchema);

export{tournaModel,fixtureModel};
