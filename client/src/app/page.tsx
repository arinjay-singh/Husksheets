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
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { useRegister } from "./api/api/register";
import { ToolBarButton } from "@/components/toolbar-button";

/**
 * @author Arinjay Singh
 */
const Home: NextPage = () => {
  const { logout } = useAuth();
  /**
   * API service calls.
   * @author: Nicholas O'Sullivan
   */
  const { register } = useRegister();

  /**
   * @author Arinjay Singh
   */
  // render the home page
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-lg min-h-screen w-screen">
          <div className="flex flex-row-reverse mr-10">
            <ToolBarButton onClick={logout} color="red">
              Logout
            </ToolBarButton>
            <ToolBarButton onClick={register} color="green">
              Register
            </ToolBarButton>
          </div>
          <h1 className="text-4xl font-bold mt-2 mb-5 text-black text-center">
            HuskSheets
          </h1>
          <Spreadsheet />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Home;
