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
exports.ProfileRouter = void 0;
const express_1 = require("express");
const Auth_1 = require("../middleware/Auth");
const userDB_1 = require("../db/userDB");
const orgDB_1 = require("../db/orgDB");
const ProfileRouter = (0, express_1.Router)();
exports.ProfileRouter = ProfileRouter;
ProfileRouter.get("/", Auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const id = req.id;
        // Check if the user exists
        const userResponse = yield userDB_1.UserModel.findOne({ _id: id });
        if (userResponse) {
            res.json({
                username: userResponse.username,
                message: `Hi, welcome to TOrg dear ${userResponse.username}`,
            });
            return;
        }
        // Check if the organizer exists
        const orgResponse = yield orgDB_1.OrgModel.findOne({ _id: id });
        if (orgResponse) {
            res.json({
                username: orgResponse.username,
                message: `Hi, welcome to TOrg dear ${orgResponse.username}`,
            });
            return;
        }
        res.status(404).json({
            message: "User or Organizer not found",
        });
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
