import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

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

console.log("--- MongoDB Connection Test ---");
console.log("Attempting to connect to MongoDB URI...");

if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is not defined in .env.local");
    process.exit(1);
}

// Masked URI for logging
const maskedURI = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
console.log(`URI: ${maskedURI}`);

async function testConnection() {
    try {
        await mongoose.connect(MONGODB_URI as string, {
            serverSelectionTimeoutMS: 5000, // Fail fast after 5 seconds
        });
        console.log("✅ SUCCESS: Successfully connected to MongoDB Atlas!");
        console.log("Your IP address is correctly whitelisted.");
        await mongoose.connection.close();
        process.exit(0);
    } catch (error: any) {
        console.error("\n❌ CONNECTION FAILED");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);

        if (error.name === 'MongooseServerSelectionError') {
            console.log("\n⚠️  DIAGNOSIS: IP Whitelist Issue");
            console.log("This specific error almost always means your current IP address is blocked by MongoDB Atlas.");
            console.log("Action: Go to MongoDB Atlas -> Network Access -> Add IP Address -> Add Current IP Address.");
        }
        process.exit(1);
    }
}

testConnection();
