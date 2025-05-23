"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.ObjectId;
const Organiser = new Schema({
    username: { type: String, unique: true },
    password: String,
    tournaments: [{ type: ObjectId, ref: 'Tournament' }]
});
const OrgModel = mongoose_1.default.model("organisers", Organiser);
exports.OrgModel = OrgModel;
