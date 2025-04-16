"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnRouter = void 0;
const express_1 = require("express");
const Auth_1 = require("../middleware/Auth");
const orgDB_1 = require("../db/orgDB");
const userDB_1 = require("../db/userDB");
const Anncs_1 = require("../db/Anncs");
const tournaDB_1 = require("../db/tournaDB");
const AnnRouter = (0, express_1.Router)();
exports.AnnRouter = AnnRouter;
AnnRouter.post("/", Auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, tournaId } = req.body; // ✅ Correctly Extract Message
        //@ts-ignore
        const OrgId = req.id;
        const Org = yield orgDB_1.OrgModel.findOne({ _id: OrgId });
        if (Org) {
            const username = Org.username;
            console.log(username);
        }
        else {
            console.log("Organizer not found");
        }
        if (!message) {
            res.status(400).json({ error: "❌ Message is required!" });
            return;
        }
        const result = yield Anncs_1.AnnModel.create({
            OrgId: OrgId,
            Content: message,
            Tournament: tournaId,
        });
        res.json({ success: true, message: "✅ Announcement sent successfully!", result });
    }
    catch (error) {
        console.error("❌ Error in announcements:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
AnnRouter.get("/", Auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //@ts-ignore
    const id = req.id;
    //@ts-ignore
    console.log("Extracted ID:", req.id);
    const tourna = yield tournaDB_1.tournaModel.findOne({ Organiser: id });
    if (tourna) {
        const anns = yield Anncs_1.AnnModel.find({
            Tournament: tourna._id
        });
        res.json({ anns });
        return;
    }
    const User = yield userDB_1.UserModel.findOne({
        _id: id
    });
    console.log(User);
    //@ts-ignore
    if (((_a = User.tournaments) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        //@ts-ignore
        console.log("User tournaments:", User.tournaments);
        const anns = yield Anncs_1.AnnModel.findOne({
            //@ts-ignore
            Tournament: User.tournaments[0]._id.toString(),
        });
        res.json({ anns });
    }
    else {
        console.log("No tournaments found for this user");
        res.json({
            anns: []
        });
    }
}));
