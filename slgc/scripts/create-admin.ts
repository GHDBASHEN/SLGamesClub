import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';



// Handling __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is not defined in .env.local");
    process.exit(1);
}

const args = process.argv.slice(2);

if (args.length < 3) {
    console.error("Usage: npm run create-admin -- \"Name\" \"Email\" \"Password\"");
    process.exit(1);
}

const [name, email, password] = args;

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log("Connected to DB");

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log(`User found: ${existingUser.name} (${existingUser.email})`);
            console.log("Updating role to ADMIN and resetting password...");

            const hashedPassword = await bcrypt.hash(password, 10);
            existingUser.role = 'admin';
            existingUser.password = hashedPassword;
            existingUser.isVerified = true;
            await existingUser.save();

            console.log("✅ User promoted to ADMIN successfully!");
        } else {
            console.log("User not found. Creating new ADMIN account...");

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });

            await newUser.save();
            console.log("✅ Admin account created successfully!");
        }

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

createAdmin();
