"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading session data...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600">You must log in to access this page.</p>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" }); // Redirect to the home page after signing out
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {session.user?.name || session.user?.email}!
      </h1>
      <button onClick={() => router.push('/projects/')}>Create Project</button>
      <p className="text-gray-600 mb-6">You are successfully logged in.</p>

      {/* Sign-out button */}
      <button
        onClick={handleSignOut}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all"
      >
        Sign Out
      </button>
    </div>
  );
}

