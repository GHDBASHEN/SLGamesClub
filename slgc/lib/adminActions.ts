'use server';

import { connectDB } from "./db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

// Security Check: Ensure the requester is an Admin
async function checkAdminAuth() {
  const session = await getServerSession();
  if (!session || !session.user?.email) throw new Error("Unauthorized");
  
  await connectDB();
  const currentUser = await User.findOne({ email: session.user.email });
  
  if (currentUser?.role !== "admin") throw new Error("Forbidden: Admins only");
  return currentUser;
}

// Action: Update a user's role
export async function updateUserRole(userId: string, newRole: string) {
  try {
    await checkAdminAuth();
    
    const validRoles = ["user", "editor", "moderator", "sponsor", "admin"];
    if (!validRoles.includes(newRole)) throw new Error("Invalid Role");

    await User.findByIdAndUpdate(userId, { role: newRole });
    revalidatePath('/admin'); // Refresh the admin dashboard
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update role" };
  }
}