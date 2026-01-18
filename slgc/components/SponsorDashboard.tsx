// components/SponsorDashboard.tsx
import { useSession } from "next-auth/react";

export default function SponsorDashboard() {
    const { data: session } = useSession();

    // If role is NOT sponsor or admin, hide this entire component
    if (session?.user?.role !== 'sponsor' && session?.user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl mb-6">
            <h2 className="text-xl font-bold text-green-400 mb-2">Sponsor Panel</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                Upload Banner Ad
            </button>
        </div>
    );
}