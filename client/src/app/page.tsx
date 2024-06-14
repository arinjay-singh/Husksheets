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
import { useRegister } from "./api/api/register";
import { useGetPublishers } from "./api/api/register";
import { useGetSheets } from "./api/api/sheets";
import { useCreateSheet } from "./api/api/sheets";
import { useDeleteSheet } from "./api/api/sheets";

import {useState} from "react";

// home page component
const Home: NextPage = () => {
  // get the logout function from the auth context
  const { logout } = useAuth();

  /**
   * API service calls.
   * @author: Nicholas O'Sullivan
   */
  const { register } = useRegister();

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
            <button
                onClick={register}
                className="bg-green-500 text-white rounded-xl p-2 ml-2 hover:shadow-md"
            >
              Register
            </button>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-black text-center">
            HuskSheets
          </h1>
          <Spreadsheet/>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// export the home page component as the default export
export default Home;
