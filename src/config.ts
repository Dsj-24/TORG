import dotenv from 'dotenv'


dotenv.config();

export const config={
dbURL: process.env.DB_URL || "default",
JWTS: process.env.JWT_SECRET || "default"
}