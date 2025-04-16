"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.ObjectId;
const AnnSchema = new Schema({
    OrgId: { type: ObjectId, ref: "organisers" },
    Content: String,
    Tournament: { type: ObjectId, ref: 'Tournament' },
    time: { type: Date, default: Date.now }
});
const AnnModel = mongoose_1.default.model("Announcements", AnnSchema);
exports.AnnModel = AnnModel;
