/**
 * @file spreadsheet.tsx
 * @brief A simple spreadsheet component that allows users to add rows and columns, and delete rows and columns.
 * @version 1.0
 * @date 06-01-2024
 * @author Arinjay Singh
 */

import React, { useState, useEffect } from "react";
import { parseOperationString } from "../functions/sheet-equations";

const Spreadsheet: React.FC = () => {
  const [data, setData] = useState<string[][]>([["","",""],["","",""],["","",""]]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem("spreadsheetData");
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("spreadsheetData", JSON.stringify(data));
  }, [data, isClient]);

  const handleInputChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const operationResult = parseOperationString(value);
    value = operationResult ? operationResult : value;

    const newData = data.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? value : cell
      )
    );
    setData(newData);
  };

  const addRow = () => {
    setData([...data, Array(data[0].length).fill("")]);
  };

  const addColumn = () => {
    setData(data.map((row) => [...row, ""]));
  };

  return (
    <div className="p-4 flex-col">
      <div className="relative flex-grow flex-col">
        <div className="flex flex-row">
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="border border-gray-400">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          handleInputChange(rowIndex, colIndex, e.target.value)
                        }
                        className="w-full text-black p-2"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addColumn}
            className="bg-gray-300 text-black rounded-full p-3 flex items-center justify-center self-stretch ml-2 hover:shadow-md"
          >
            +
          </button>
        </div>
        <div className=" w-full mt-2 flex flex-row">
          <button
            onClick={addRow}
            className="w-full bg-gray-300 text-black rounded-full p-2 hover:shadow-md"
          >
            +
          </button>
          <div className="p-5"/>
        </div>
      </div>
      <div className=" flex items-center pt-3">
        <button
          onClick={() => setData([[""]])}
          className="bg-red-500 text-white rounded-xl p-2 hover:shadow-md"
        >
          Reset
        </button>
        <button
            onClick={() => {
                if (data.length > 1) setData(data.slice(0, -1));
            }}
            className="bg-red-500 text-white rounded-xl p-2 ml-2 hover:shadow-md"
        >
            Delete Row
        </button>
        <button
            onClick={() => {
                if (data[0].length > 1) setData(data.map(row => row.slice(0, -1)));
            }}
            className="bg-red-500 text-white rounded-xl p-2 ml-2 hover:shadow-md"
        >
            Delete Column
        </button>
      </div>
    </div>
  );
};



export default Spreadsheet;
