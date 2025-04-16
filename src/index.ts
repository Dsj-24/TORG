import express from 'express';
import cors from 'cors';
import { z } from 'zod'
import mongoose from 'mongoose';
import { UserModel } from './db/userDB';
import { OrgModel } from './db/orgDB';
import { config } from "./config";
import jwt from 'jsonwebtoken';
import { ProfileRouter } from './Routes/Profile';
import { TournaRouter } from './Routes/Tournaments';
import { AnnRouter } from './Routes/Announcements';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import path from 'path';




const app = express();

app.use(cors());
app.use(express.json());
app.use("/profile", ProfileRouter)
app.use("/tourna", TournaRouter)
app.use("/announcements",AnnRouter)

mongoose.connect("mongodb+srv://DSJ_24:EWQAEIBCSfwfZQmb@cluster0.komlz.mongodb.net/TORG");

const UserProfileSchema = z.object({
    username: z.string().min(5),
    password: z.string().min(8).max(20),
})

const OrgProfileSchema = z.object({
    username: z.string().min(5),
    password: z.string().min(8).max(20),
})



app.get("/", (req, res) => {
    console.log("Server started.");
    res.json({
        message:"HAHA WELCOME."
    })
})

app.post("/signup", async (req, res) => {
    const Type = req.query.type;
    console.log(req.query.type)

    if (Type == "organiser") {
        const parsedSuccess = OrgProfileSchema.safeParse(req.body);
        console.log(parsedSuccess)
        if (!parsedSuccess.success) {
            res.json({
                message: "Invalid format!",
            })
            return
        }

        const username = req.body.username;
        const password = req.body.password;

        await OrgModel.create({
            username: username,
            password: password
        })

        console.log("Org here.");

        res.json({
            message: "Signed Up"
        })

        return
    }
    else {
        const { success } = UserProfileSchema.safeParse(req.body);
        if (!success) {
            res.json({
                message: "Invalid format!",
            })
            return
        }

        const username = req.body.username;
        const password = req.body.password;

        await UserModel.create({
            username: username,
            password: password
        })

        console.log("User here.")

        res.json({
            message: "Signed Up"
        })
    }



})


app.post("/signin", async (req, res) => {
    const Type = req.query.type;
    console.log(req.query.type);

    if (Type == "organiser") {
        const parsedSuccess = OrgProfileSchema.safeParse(req.body);
        console.log(parsedSuccess)
        if (!parsedSuccess.success) {
            res.json({
                message: "Invalid format!",
            })
            return
        }

        console.log("Org Sign In here.");

        const username = req.body.username;
        const password = req.body.password;

        const result = await OrgModel.findOne({
            username: username,
            password: password
        })

        if (result) {
            const token = jwt.sign({ id: result._id.toString() }, config.JWTS);
            res.json({
                token
            })
            return;
        }
        else {
            res.json({
                message: " Invalid Credentials! "
            })
            return
        }

    }
    else {
        const parsedSuccess = UserProfileSchema.safeParse(req.body);
        console.log(parsedSuccess)
        if (!parsedSuccess.success) {
            res.json({
                message: "Invalid format!",
            })
            return
        }

        console.log("User Sign In here.");

        const username = req.body.username;
        const password = req.body.password;

        const result = await UserModel.findOne({
            username: username,
            password: password
        })

        if (result) {
            const token = jwt.sign({ id: result._id.toString() }, config.JWTS);
            res.json({
                token
            })
            return
        }
        else {
            res.json({
                message: " Invalid Credentials! "
            })
            return
        }
    }
})

app.listen(5374, () => {
    console.log("Server running on port 5374");
});









