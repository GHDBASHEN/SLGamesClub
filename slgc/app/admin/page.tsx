import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { updateUserRole } from "@/lib/adminActions";

export default async function AdminDashboard() {
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 });

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">User Role Management</h1>

      <div className="bg-gray-900 rounded-lg border border-gray-800">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400 text-sm">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Current Role</th>
              <th className="p-4">Assign Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="p-4">
                  <div className="font-bold">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs uppercase font-bold
                    ${user.role === 'admin' ? 'bg-red-900 text-red-200' : ''}
                    ${user.role === 'moderator' ? 'bg-orange-900 text-orange-200' : ''}
                    ${user.role === 'editor' ? 'bg-blue-900 text-blue-200' : ''}
                    ${user.role === 'sponsor' ? 'bg-green-900 text-green-200' : ''}
                    ${user.role === 'user' ? 'bg-gray-700 text-gray-300' : ''}
                  `}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  {/* Role Switcher Form */}
                  <form action={async (formData) => {
                    'use server';
                    await updateUserRole(user._id.toString(), formData.get('role') as string);
                  }}>
                    <div className="flex gap-2">
                      <select 
                        name="role" 
                        defaultValue={user.role}
                        className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm focus:border-indigo-500"
                      >
                        <option value="user">User</option>
                        <option value="editor">Editor</option>
                        <option value="moderator">Moderator</option>
                        <option value="sponsor">Sponsor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button type="submit" className="bg-indigo-600 px-3 py-1 rounded text-xs hover:bg-indigo-500">
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
  );
}