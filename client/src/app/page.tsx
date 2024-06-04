/**
 * @file page.tsx
 * @brief The main page of the application.
 * @version 1.0
 * @date 06-01-2024
 * @author Arinjay Singh
 */

"use client";

import type { NextPage } from "next";
import Spreadsheet from "../components/spreadsheet";
import {ProtectedRoute} from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";

// home page component
const Home: NextPage = () => {
  // get the logout function from the auth context
  const { logout } = useAuth();

  // render the home page
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-lg">
          <div className="flex flex-row-reverse">
            <button
              onClick={logout}
              className="bg-red-500 text-white rounded-xl p-2 ml-2 hover:shadow-md"
            >
              Logout
            </button>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-black text-center">
            HuskSheets
          </h1>
          <Spreadsheet />
        </div>
      </div>
    </ProtectedRoute>
  );
};

// export the home page component as the default export
export default Home;
