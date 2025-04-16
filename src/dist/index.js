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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const userDB_1 = require("./db/userDB");
const orgDB_1 = require("./db/orgDB");
const config_1 = require("./config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Profile_1 = require("./Routes/Profile");
const Tournaments_1 = require("./Routes/Tournaments");
const Announcements_1 = require("./Routes/Announcements");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/profile", Profile_1.ProfileRouter);
app.use("/tourna", Tournaments_1.TournaRouter);
app.use("/announcements", Announcements_1.AnnRouter);
mongoose_1.default.connect("mongodb+srv://DSJ_24:EWQAEIBCSfwfZQmb@cluster0.komlz.mongodb.net/TORG");
const UserProfileSchema = zod_1.z.object({
    username: zod_1.z.string().min(5),
    password: zod_1.z.string().min(8).max(20),
});
const OrgProfileSchema = zod_1.z.object({
    username: zod_1.z.string().min(5),
    password: zod_1.z.string().min(8).max(20),
});
app.get("/", (req, res) => {
    console.log("Server started.");
    res.json({
        message: "HAHA WELCOME."
    });
});
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Type = req.query.type;
    console.log(req.query.type);
    if (Type == "organiser") {
        const parsedSuccess = OrgProfileSchema.safeParse(req.body);
        console.log(parsedSuccess);
        if (!parsedSuccess.success) {
            res.json({
                message: "Invalid format!",
            });
            return;
        }
        const username = req.body.username;
        const password = req.body.password;
        yield orgDB_1.OrgModel.create({
            username: username,
            password: password
        });
        console.log("Org here.");
        res.json({
            message: "Signed Up"
        });
        return;
    }
    else {
        const { success } = UserProfileSchema.safeParse(req.body);
        if (!success) {
            res.json({
                message: "Invalid format!",
            });
            return;
        }
        const username = req.body.username;
        const password = req.body.password;
        yield userDB_1.UserModel.create({
            username: username,
            password: password
        });
        console.log("User here.");
        res.json({
            message: "Signed Up"
        });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Type = req.query.type;
    console.log(req.query.type);
    if (Type == "organiser") {
        const parsedSuccess = OrgProfileSchema.safeParse(req.body);
        console.log(parsedSuccess);
        if (!parsedSuccess.success) {
            res.json({
                message: "Invalid format!",
            });
            return;
        }
        console.log("Org Sign In here.");
        const username = req.body.username;
        const password = req.body.password;
        const result = yield orgDB_1.OrgModel.findOne({
            username: username,
            password: password
        });
        if (result) {
            const token = jsonwebtoken_1.default.sign({ id: result._id.toString() }, config_1.config.JWTS);
            res.json({
                token
            });
            return;
        }
        else {
            res.json({
                message: " Invalid Credentials! "
            });
            return;
        }
    }
    else {
        const parsedSuccess = UserProfileSchema.safeParse(req.body);
        console.log(parsedSuccess);
        if (!parsedSuccess.success) {
            res.json({
                message: "Invalid format!",
            });
            return;
        }
        console.log("User Sign In here.");
        const username = req.body.username;
        const password = req.body.password;
        const result = yield userDB_1.UserModel.findOne({
            username: username,
            password: password
        });
        if (result) {
            const token = jsonwebtoken_1.default.sign({ id: result._id.toString() }, config_1.config.JWTS);
            res.json({
                token
            });
            return;
        }
        else {
            res.json({
                message: " Invalid Credentials! "
            });
            return;
        }
    }
}));
app.listen(5374, () => {
    console.log("Server running on port 5374");
});
