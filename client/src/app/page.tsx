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
  const { register } = useRegister();
  const { getPublishers } = useGetPublishers();
  const { getSheets } = useGetSheets();
  const [publisher, setPublisher] = useState('');
  const handleGetSheets = async () => {
    try {
      // Call getSheets with the publisher state
      await getSheets(publisher);
    } catch (error) {
      console.error('Error retrieving sheets:', error);
      alert('Error retrieving sheets. See console for details.');
    }
  };
  const { createSheet } = useCreateSheet();
  const [sheet, setSheet] = useState('');
  const handleCreateSheet = async () => {
    try {
      // Call getSheets with the publisher state
      await createSheet(sheet);
    } catch (error) {
      console.error('Error creating sheet:', error);
      alert('Error creating sheet. See console for details.');
    }
  };
  const { deleteSheet } = useDeleteSheet();
  const handleDeleteSheet = async () => {
    try {
      // Call deleteSheets with the publisher state
      await deleteSheet(sheet);
    } catch (error) {
      console.error('Error deleting sheets:', error);
      alert('Error deleting sheets. See console for details.');
    }
  };

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
                className="bg-red-500 text-white rounded-xl p-2 ml-2 hover:shadow-md"
            >
              Register
            </button>
            <button
                onClick={getPublishers}
                className="bg-red-500 text-white rounded-xl p-2 ml-2 hover:shadow-md"
            >
              getPublishers
            </button>


            <div>
              <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
              />
              <button
                  onClick={handleGetSheets}
                  className="bg-red-500 text-white rounded-xl p-2 ml-2 hover:shadow-md">
                Get Sheets
              </button>
            </div>
            <div>
              <input
                  type="text"
                  value={sheet}
                  onChange={(e) => setSheet(e.target.value)}
              />
              <button
                  onClick={handleCreateSheet}
                  className="bg-red-500 text-white rounded-xl p-2 ml-2 hover:shadow-md">
                Create Sheet
              </button>
            </div>
             <div>
              <input
                  type="text"
                  value={sheet}
                  onChange={(e) => setSheet(e.target.value)}
              />
              <button
                  onClick={handleDeleteSheet}
                  className="bg-red-500 text-white rounded-xl p-2 ml-2 hover:shadow-md">
                Delete Sheet
              </button>
            </div>

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
