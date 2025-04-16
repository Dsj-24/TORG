import { Router } from "express";
import { Auth } from "../middleware/Auth";
import { OrgModel } from "../db/orgDB";
import { UserModel } from "../db/userDB";
import { Request, Response, NextFunction } from "express";
import { AnnModel } from "../db/Anncs";
import { tournaModel } from "../db/tournaDB";
const AnnRouter = Router();
import mongoose from "mongoose";
AnnRouter.post("/", Auth, async (req: Request, res: Response): Promise<void> => {

    try {
        const { message, tournaId } = req.body;  // ✅ Correctly Extract Message

        //@ts-ignore
        const OrgId = req.id;
        const Org = await OrgModel.findOne({ _id: OrgId });

        if (Org) {
            const username = Org.username;
            console.log(username);
        } else {
            console.log("Organizer not found");
        }

        if (!message) {
            res.status(400).json({ error: "❌ Message is required!" });
            return;
        }

        const result = await AnnModel.create({
            OrgId: OrgId,
            Content: message,
            Tournament: tournaId,
        })

        res.json({ success: true, message: "✅ Announcement sent successfully!", result });
    } catch (error) {
        console.error("❌ Error in announcements:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

AnnRouter.get("/", Auth, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    //@ts-ignore
    console.log("Extracted ID:", req.id);
    const tourna = await tournaModel.findOne({ Organiser: id });

    if (tourna) {
        const anns = await AnnModel.find({
            Tournament: tourna._id
        });
        res.json({ anns }); return
    }

    const User = await UserModel.findOne({
        _id: id
    })
    console.log(User);
    //@ts-ignore
    if (User.tournaments?.length > 0) {
        //@ts-ignore
        console.log("User tournaments:", User.tournaments);
        const anns = await AnnModel.findOne({
            //@ts-ignore
            Tournament: User.tournaments[0]._id.toString(),
        });
        res.json({ anns });
    } else {
        console.log("No tournaments found for this user");
        res.json({
            anns: []

        });
    }
});

export { AnnRouter }





