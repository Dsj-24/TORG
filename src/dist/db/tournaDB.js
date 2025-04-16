"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixtureModel = exports.tournaModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.ObjectId;
const FixtureSchema = new mongoose_1.default.Schema({
    tournaId: { type: ObjectId, required: true, ref: "Tournament" },
    fixture: String,
    date: String, // You might want to use Date type instead
    time: String, // Consider using Date with only time
    stadium: String,
    result: String,
    stage: String
});
const TournamentSchema = new mongoose_1.default.Schema({
    title: { type: String, unique: true },
    fixtures: [{ type: ObjectId, ref: 'Fixture' }],
    Organiser: { type: ObjectId, ref: 'organisers', required: true }, // Array of fixtures
    Announcements: [{ type: ObjectId, ref: "Announcements" }]
});
const tournaModel = mongoose_1.default.model('Tournament', TournamentSchema);
exports.tournaModel = tournaModel;
const fixtureModel = mongoose_1.default.model('Fixture', FixtureSchema);
exports.fixtureModel = fixtureModel;
