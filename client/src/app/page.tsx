/**
 * @file page.tsx
 * @brief The main page of the application.
 * @version 1.0
 * @date 06-01-2024
 * @author Arinjay Singh
 */

'use client';

import type { NextPage } from 'next'
import Spreadsheet from '../components/spreadsheet'

const Home: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-black text-center">HuskSheets</h1>
        <Spreadsheet />
      </div>
    </div>
  )
}

export default Home;