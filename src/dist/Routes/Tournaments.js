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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournaRouter = void 0;
const express_1 = require("express");
const Auth_1 = require("../middleware/Auth");
const userDB_1 = require("../db/userDB");
const orgDB_1 = require("../db/orgDB");
const tournaDB_1 = require("../db/tournaDB");
const mongoose_1 = __importDefault(require("mongoose"));
const TournaRouter = (0, express_1.Router)();
exports.TournaRouter = TournaRouter;
TournaRouter.get("/", Auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const id = req.id;
        const userResponse = yield userDB_1.UserModel.findOne({ _id: id });
        // Get the array of tournament IDs
        if (userResponse) {
            const tournamentIds = userResponse.tournaments || {};
            // Fetch all tournaments where `_id` is in the user's tournament array
            const tournaments = yield tournaDB_1.tournaModel.find({ _id: { $in: tournamentIds } });
            res.json({
                message: "Hi, welcome to TOrg dear user... HERE ARE YOUR TOURNAMENTS and FIXTURES:-:- ",
                tournaments
            });
            return;
        }
        // Check if the organizer exists
        const orgResponse = yield orgDB_1.OrgModel.findOne({ _id: id });
        if (orgResponse) {
            const tournament = req.body.title;
            const response = yield tournaDB_1.tournaModel.findOne({
                title: tournament
            });
            const tid = req.body.tid;
            const FixtureArray = yield tournaDB_1.fixtureModel.find({
                tournaId: tid
            });
            res.json({
                message: "Hi, welcome to TOrg dear Organiser... You can create a tournament now:- ...",
                response,
                //@ts-ignore
                FixtureArray,
            });
            return;
        }
        // If neither user nor organizer is found
        res.status(404).json({
            message: "User or Organizer not found",
        });
        return;
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        // Pass error to Express error handler
    }
}));
TournaRouter.post("/addTourna", Auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, time, stadium, date, fixture, result, stage } = req.body;
    //@ts-ignore
    const orgId = req.id;
    // Create the tournament
    const tournament = yield tournaDB_1.tournaModel.create({ title, Organiser: orgId });
    // Create the fixture and link it to the tournament
    const newFixture = yield tournaDB_1.fixtureModel.create({
        time,
        stadium,
        date,
        fixture,
        result,
        stage,
        tournaId: tournament._id.toString()
    });
    // Update the tournament to include the fixture reference
    tournament.fixtures.push(newFixture._id);
    yield tournament.save(); // Save the updated tournament
    res.json({
        message: "Tournament and Fixture added successfully",
        tournament,
    });
}));
TournaRouter.post("/addFix", Auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, time, stadium, date, fixture, result, stage } = req.body;
    // Create the tournament
    const tournament = yield tournaDB_1.tournaModel.findOne({ title });
    // Create the fixture and link it to the tournament
    const newFixture = yield tournaDB_1.fixtureModel.create({
        time,
        stadium,
        date,
        fixture,
        result,
        stage,
        //@ts-ignore
        tournaId: tournament._id
    });
    // Update the tournament to include the fixture reference
    //@ts-ignore
    tournament.fixtures.push(newFixture._id);
    //@ts-ignore
    yield tournament.save();
    res.json({
        message: "Tournament and Fixture added successfully",
        tournament,
    });
}));
TournaRouter.post("/join", Auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const tournaId = new mongoose_1.default.Types.ObjectId(req.body.tournaId);
    // Check if the user exists
    const userResponse = yield userDB_1.UserModel.findOne({ _id: id });
    if (userResponse) {
        if (tournaId) {
            yield userDB_1.UserModel.updateOne({ username: userResponse.username }, { $push: { tournaments: tournaId } });
        }
        else {
            res.json({
                message: "No tournament found."
            });
            return;
        }
        res.json({
            message: `You have joined the tournament ${userResponse.tournaments[0]._id.toString()}`
        });
    }
    else {
        res.json({
            message: "No user found."
        });
    }
}));
