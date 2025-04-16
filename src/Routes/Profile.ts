import { Router } from "express";
import { Auth } from "../middleware/Auth";
import { UserModel } from "../db/userDB";
import { OrgModel } from "../db/orgDB";
import { Request, Response, NextFunction } from "express";

const ProfileRouter = Router();

ProfileRouter.get("/", Auth, async (req: Request, res: Response): Promise<void> => {
    try {
        //@ts-ignore
        const id = req.id;

        // Check if the user exists
        const userResponse = await UserModel.findOne({ _id: id });
        if (userResponse) {
            res.json({
                username: userResponse.username,
                message: `Hi, welcome to TOrg dear ${userResponse.username}`,
            });
            return;
        }

        // Check if the organizer exists
        const orgResponse = await OrgModel.findOne({ _id: id });
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

    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});
export { ProfileRouter };
