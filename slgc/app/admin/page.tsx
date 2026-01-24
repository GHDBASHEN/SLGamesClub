import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { updateUserRole } from "@/lib/adminActions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  // 1. Protect the Page
  const session = await getServerSession();
  if (!session) redirect("/login");

  await connectDB();
  const currentUser = await User.findOne({ email: session.user?.email });
  if (currentUser?.role !== 'admin') redirect("/");

  // 2. Fetch All Users
  const users = await User.find().sort({ createdAt: -1 });

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">User Role Management</h1>
        <p className="text-gray-400 mb-8">Assign roles to control platform access.</p>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-gray-400 text-sm uppercase font-bold">Total Users</h3>
            <p className="text-3xl font-bold text-white mt-2">{users.length}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-sky-400 text-sm uppercase font-bold">Admins</h3>
            <p className="text-3xl font-bold text-white mt-2">{users.filter(u => u.role === 'admin').length}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-orange-400 text-sm uppercase font-bold">Moderators</h3>
            <p className="text-3xl font-bold text-white mt-2">{users.filter(u => u.role === 'moderator').length}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-indigo-400 text-sm uppercase font-bold">Editors</h3>
            <p className="text-3xl font-bold text-white mt-2">{users.filter(u => u.role === 'editor').length}</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-5 font-medium">User Details</th>
                <th className="p-5 font-medium">Current Role</th>
                <th className="p-5 font-medium">Assign New Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                        className="w-10 h-10 rounded-full bg-gray-700"
                        alt={user.name}
                      />
                      <div>
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${user.role === 'admin' ? 'bg-red-900/30 text-red-200 border-red-800' : ''}
                      ${user.role === 'moderator' ? 'bg-orange-900/30 text-orange-200 border-orange-800' : ''}
                      ${user.role === 'editor' ? 'bg-blue-900/30 text-blue-200 border-blue-800' : ''}
                      ${user.role === 'sponsor' ? 'bg-green-900/30 text-green-200 border-green-800' : ''}
                      ${user.role === 'user' ? 'bg-gray-800 text-gray-300 border-gray-700' : ''}
                    `}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>

                  <td className="p-5">
                    <form action={async (formData) => {
                      'use server';
                      await updateUserRole(user._id.toString(), formData.get('role') as string);
                    }}>
                      <div className="flex items-center gap-2">
                        <select
                          name="role"
                          defaultValue={user.role}
                          className="bg-gray-950 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                        >
                          <option value="user">User</option>
                          <option value="editor">Editor</option>
                          <option value="moderator">Moderator</option>
                          <option value="sponsor">Sponsor</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}