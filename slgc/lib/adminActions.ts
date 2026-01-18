'use server';

import { connectDB } from "./db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

// Authorization Check
async function checkAdminAuth() {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    await connectDB();
    const currentUser = await User.findOne({ email: session.user?.email });

    // Only Admins can change roles
    if (currentUser?.role !== "admin") throw new Error("Forbidden");
}

// Update User Role
export async function updateUserRole(userId: string, newRole: string) {
    await checkAdminAuth();

    const validRoles = ["user", "editor", "moderator", "sponsor", "admin"];
    if (!validRoles.includes(newRole)) throw new Error("Invalid Role");

    await User.findByIdAndUpdate(userId, { role: newRole });
    revalidatePath('/admin');
}
