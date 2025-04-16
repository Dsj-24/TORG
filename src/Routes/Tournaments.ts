import { Router } from "express";
import { Auth } from "../middleware/Auth";
import { UserModel } from "../db/userDB";
import { OrgModel } from "../db/orgDB";
import { Request, Response, NextFunction } from "express";
import { fixtureModel, tournaModel } from "../db/tournaDB";
import mongoose from "mongoose";

const TournaRouter = Router();

TournaRouter.get("/", Auth, async (req: Request, res: Response): Promise<void> => {
    try {
        //@ts-ignore
        const id = req.id;
        const userResponse = await UserModel.findOne({ _id: id });

        // Get the array of tournament IDs
        if (userResponse) {
            const tournamentIds = userResponse.tournaments || {};

            // Fetch all tournaments where `_id` is in the user's tournament array
            const tournaments = await tournaModel.find({ _id: { $in: tournamentIds } });

            res.json({
                message: "Hi, welcome to TOrg dear user... HERE ARE YOUR TOURNAMENTS and FIXTURES:-:- ",
                tournaments
            });
            return;
        }

        // Check if the organizer exists
        const orgResponse = await OrgModel.findOne({ _id: id });

        if (orgResponse) {

            const tournament = req.body.title;
            const response = await tournaModel.findOne({
                title: tournament
            })

            const tid = req.body.tid;
            const FixtureArray = await fixtureModel.find({
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

    } catch (error) {
        console.error("Error fetching profile:", error);
        // Pass error to Express error handler
    }
});

TournaRouter.post("/addTourna", Auth, async (req, res) => {
    const { title, time, stadium, date, fixture, result, stage } = req.body;
    //@ts-ignore
    const orgId = req.id;

    // Create the tournament
    const tournament = await tournaModel.create({ title, Organiser: orgId });

    // Create the fixture and link it to the tournament
    const newFixture = await fixtureModel.create({
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
    await tournament.save(); // Save the updated tournament

    res.json({
        message: "Tournament and Fixture added successfully",
        tournament,
    });
});

TournaRouter.post("/addFix", Auth, async (req, res) => {
    const { title, time, stadium, date, fixture, result, stage } = req.body;

    // Create the tournament
    const tournament = await tournaModel.findOne({ title });

    // Create the fixture and link it to the tournament
    const newFixture = await fixtureModel.create({
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
    await tournament.save();

    res.json({
        message: "Tournament and Fixture added successfully",
        tournament,

    });

});

TournaRouter.post("/join", Auth, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const tournaId = new mongoose.Types.ObjectId(req.body.tournaId);
    // Check if the user exists
    const userResponse = await UserModel.findOne({ _id: id });
    if (userResponse) {
        if (tournaId) {
            await UserModel.updateOne(
                { username: userResponse.username },
                { $push: { tournaments: tournaId } }
            );
        }
        else {
            res.json({
                message: "No tournament found."
            }); return
        }

        res.json({
            message: `You have joined the tournament ${userResponse.tournaments[0]._id.toString()}`
        })
    }

    else {
        res.json({
            message: "No user found."
        })
    }
});

export { TournaRouter };
