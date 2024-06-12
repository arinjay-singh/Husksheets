/**
 * @file spreadsheet.tsx
 * @brief A simple spreadsheet component that allows users to add rows and columns, and delete rows and columns.
 * @version 1.0
 * @date 06-01-2024
 * @author Arinjay Singh
 */

import React, { useState, useEffect } from "react";
import { parseEquation } from "../functions/sheet-equations";
import {
  useCreateSheet,
  useDeleteSheet,
  useGetSheets,
} from "@/app/api/api/sheets";
import { useGetPublishers } from "@/app/api/api/register";
import { useAuth } from "@/context/auth-context";
import { Parser } from "@/functions/sheet-functions";
import { saveArrayAsCSV } from "@/functions/save-csv";
import { ToolBarButton } from "@/components/toolbar-button";
import { useUpdate } from "@/app/api/api/update";

// spreadsheet component
const Spreadsheet: React.FC = () => {
  // state variables for the data and raw data of the spreadsheet
  // data represents the displayed data in the spreadsheet
  const [data, setData] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  // raw data represents the data behind the displayed data in the spreadsheet
  // (this includes data such as the equation behind a cell's value)
  const [rawData, setRawData] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  // state variable to prevent reloading from resetting the data
  const [isClient, setIsClient] = useState(false);

  // load the data from local storage when the component mounts
  useEffect(() => {
    // set isClient to true when the component mounts
    setIsClient(true);
    // retrieve the display data from local storage
    const displayData = localStorage.getItem("displaySpreadsheetData");
    // retrieve the raw data from local storage
    const rawData = localStorage.getItem("spreadsheetData");
    // if the display data exists, set the data state to the display data
    if (displayData) setData(JSON.parse(displayData));
    // if the raw data exists, set the raw data state to the raw data
    if (rawData) setRawData(JSON.parse(rawData));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // save the data to local storage when the data state changes
  // dependencies: rawData and isClient
  useEffect(() => {
    // if client is false, return
    if (!isClient) return;
    // store the data in local storage
    localStorage.setItem("spreadsheetData", JSON.stringify(rawData));
    localStorage.setItem("displaySpreadsheetData", JSON.stringify(data));
  }, [data, rawData, isClient]);

  // handle input change in the spreadsheet
  const handleInputChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    // switch out the new value in the display data
    const displayData = data.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? value : cell
      )
    );
    // set the display data state
    setData(displayData);
    // switch out the new value in the raw data
    const equationData = rawData.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? value : cell
      )
    );
    // update the raw data state
    setRawData(equationData);
  };

  // handle 'enter' key press for a cell
  const executeCell = (
    rowIndex: number,
    colIndex: number,
    value: string | null
  ) => {
    // if the value is null, alert the user and return
    if (value === null) {
      alert("Cannot execute empty cell");
      return;
    }

    let equationResult: string | null = null;
    let functionResult: string | null = null;

    // parse function
    try {
      functionResult = new Parser(data, value).parse();
    } catch (e) {
      equationResult = parseEquation(data, value);
    }

    // create a display data variable
    let displayData: string[][];
    // if the equation result exists, set the display data to the equation result
    // otherwise, set the display data to the parsed value
    displayData = data.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === rowIndex && cIdx === colIndex) {
          if (functionResult !== null) return functionResult;
          if (equationResult ) return equationResult;
          return value;
        }
        return cell;
      })
    );

    // cascading updates for the results of equation data dependent on the current cell
    let current = displayData;
    displayData = displayData.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === rowIndex && cIdx === colIndex) return cell;
        else {
          if (rawData[rIdx][cIdx].includes("$")) {
            let equationResult: string | null = null;
            let functionResult: string | null = null;
            try {
              functionResult = new Parser(current, rawData[rIdx][cIdx]).parse();
            } catch (e) {
              equationResult = parseEquation(current, rawData[rIdx][cIdx]);
            }
            if (equationResult) {
              current[rIdx][cIdx] = equationResult;
              return equationResult;
            } else if (functionResult) {
              current[rIdx][cIdx] = functionResult;
              return functionResult;
            }
          }
          return cell;
        }
      })
    );
    // set the display data state
    setData(displayData);
    // update the local storage of the display data
    localStorage.setItem("displaySpreadsheetData", JSON.stringify(displayData));
  };

  // add a row to the spreadsheet
  const addRow = () => {
    setData([...data, Array(data[0].length).fill("")]);
    setRawData([...rawData, Array(data[0].length).fill("")]);
  };
  // add a column to the spreadsheet
  const addColumn = () => {
    setData(data.map((row) => [...row, ""]));
    setRawData(rawData.map((row) => [...row, ""]));
  };

  // GET SHEETS
  const { getSheets } = useGetSheets();
  const [sheets, setSheets] = useState<string[]>([]);
  const [hasSheets, setHasSheets] = useState<boolean>(false);
  const handleGetSheets = async () => {
    try {
      for (let i = 0; i < publishers.length; i++) {
        if (publishers[i] === publisher) {
          const sheets = await getSheets(publishers[i]);
          setSheets(sheets);
          setHasSheets(true);
        }
      }
    } catch (error) {
      console.error("Error retrieving sheets:", error);
      alert("Error retrieving sheets. See console for details.");
    }
  };
  const [selectedSheet, setSelectedSheet] = useState<string>("");

  const { createSheet } = useCreateSheet();
  const { auth } = useAuth();
  const username = auth?.username;
  const [sheet, setSheet] = useState("");
  const handleCreateSheet = async () => {
    try {
      // Call getSheets with the publisher state
      if (sheet && username) {
        await createSheet(username, sheet);
        setSheet(sheet);
      }
    } catch (error) {
      console.error("Error creating sheet:", error);
      alert("Error creating sheet. See console for details.");
    }
  };
  const { deleteSheet } = useDeleteSheet();
  const handleDeleteSheet = async () => {
    try {
      // Call deleteSheets with the publisher state
      await deleteSheet(sheet);
    } catch (error) {
      console.error("Error deleting sheets:", error);
      alert("Error deleting sheets. See console for details.");
    }
  };

  // GET PUBLISHERS
  const [publishers, setPublishers] = useState<string[]>([]);
  const [hasPublishers, setHasPublishers] = useState<boolean>(false);
  const { getPublishers } = useGetPublishers();
  const handleGetPublishers = async () => {
    let publishers = getPublishers();
    publishers.then((publisherData: string[]) => {
      setPublishers(publisherData);
      setHasPublishers(true);
      localStorage.setItem("publishers", JSON.stringify(publisherData));
      alert("Publishers retrieved successfully");
    });
  };
  const [publisher, setPublisher] = useState<string>("");

  // BOTTOM TOOLBAR FUNCTIONS
  const handleDeleteRow = () => {
    if (data.length > 1) {
      setData(data.slice(0, -1));
      setRawData(rawData.slice(0, -1));
    }
  };
  const handleDeleteColumn = () => {
    if (data[0].length > 1) setData(data.map((row) => row.slice(0, -1)));
    setRawData(rawData.map((row) => row.slice(0, -1)));
  };
  const handleResetSheet = () => {
    setData([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setRawData([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
  };

  const payload = localStorage.getItem("spreadsheetData");
  const { updatePublished } = useUpdate();
  const handleUpdate = async () => {
    try {
      const isOwner = (username == publisher);
      if (sheet && username && payload) {
        await updatePublished(username, sheet, payload, isOwner);
        console.log("Data updated successfully:");
      }
    } catch (error) {
      console.error("Failed to update  data:")
    }
  }
  const handleDownloadCSV = () => saveArrayAsCSV(data);
  const bottomToolbarButtons = [
    { func: handleResetSheet, color: "red", label: "Reset Sheet" },
    { func: handleDeleteRow, color: "red", label: "Delete Row" },
    { func: handleDeleteColumn, color: "red", label: "Delete Column" },
    { func: handleDownloadCSV, color: "green", label: "Download CSV" },
    {func: handleUpdate, color: "green", label: "Save"},
  ];

  // render the spreadsheet component
  return (
    <div className="p-4 flex-col">
      {/* buttons in toolbar */}
      <div className="flex flex-row jutify-center">
        <div className="flex flex-col items-center my-3 space-y-3 w-1/2">
          <input
            type="text"
            value={sheet}
            onChange={(e) => setSheet(e.target.value)}
            className="border-2 border-black text-black mr-2 rounded-xl p-2"
          />
          <div className="flex flex-row">
            <ToolBarButton onClick={handleCreateSheet} color="red">
              Create Sheet
            </ToolBarButton>
            <ToolBarButton onClick={handleDeleteSheet} color="red">
              Delete Sheet
            </ToolBarButton>
          </div>
        </div>
        <div className="flex flex-col my-3 space-y-3 w-1/2">
          <div className="flex flex-row justify-center">
            <ToolBarButton onClick={handleGetPublishers} color="red">
              Get Publishers
            </ToolBarButton>
            {hasPublishers ? (
              <select
                id="pub-dropdown"
                value={publisher}
                onChange={(e) => {
                  setPublisher(e.target.value);
                }}
                className="border-2 border-black text-black mx-3 rounded-xl p-2 w-1/4"
              >
                <option>None</option>
                {publishers.map((pub) => (
                  <option key={pub} value={pub} className="text-black">
                    {pub}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
          <div className="flex flex-row justify-center">
            <ToolBarButton onClick={handleGetSheets} color="red">
              Get Sheets
            </ToolBarButton>
            {hasSheets ? (
              <select
                id="sheet-dropdown"
                value={selectedSheet}
                onChange={(e) => setSelectedSheet(e.target.value)}
                className="border-2 border-black text-black mx-3 rounded-xl p-2 w-1/4"
              >
                {sheets.map((ss) => (
                  <option key={ss} value={ss} className="text-black">
                    {ss}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        </div>
      </div>
      {/* render the spreadsheet */}
      <div className="relative flex-grow flex-col">
        <div className="flex flex-row">
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                <th className="border border-gray-400 bg-slate-100"></th>
                {data[0].map((_, colIndex) => (
                  <th
                    key={colIndex}
                    className="border border-gray-400 text-black font-semibold bg-slate-100"
                  >
                    {String.fromCharCode(65 + colIndex)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className=" text-black font-semibold px-2 border-b border-gray-400 bg-slate-100">
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="border border-gray-400">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          handleInputChange(rowIndex, colIndex, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            executeCell(
                              rowIndex,
                              colIndex,
                              (e.target as HTMLInputElement).value
                            );
                          }
                        }}
                        className="w-full text-black p-2"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* buttons to add rows and columns */}
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
          <div className="p-5" />
        </div>
      </div>
      {/* buttons for bottom toolbar */}
      <div className=" flex flex-row justify-evenly pt-3 items-stretch">
        {bottomToolbarButtons.map(({ func, color, label }) => (
          <ToolBarButton onClick={func} color={color} key={label}>
            {label}
          </ToolBarButton>
        ))}
      </div>
    </div>
  );
};

// export the spreadsheet component as the default export
export default Spreadsheet;
