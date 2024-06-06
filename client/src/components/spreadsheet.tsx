/**
 * @file spreadsheet.tsx
 * @brief A simple spreadsheet component that allows users to add rows and columns, and delete rows and columns.
 * @version 1.0
 * @date 06-01-2024
 * @author Arinjay Singh
 */

import React, { useState, useEffect } from "react";
import { parseEquation, parseFunction } from "../functions/sheet-equations";
import { parseCellReferences } from "../functions/cell-referencing";

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
    // parse for a possible function in the value
    let parsedValue = parseFunction(data, value);
    let equationResult;
    if (!parsedValue) {
      // parse the cell references in the value
      parsedValue = parseCellReferences(data, value);
      // parse the equation in the value
      equationResult = parseEquation(parsedValue);
    }
    // create a display data variable
    let displayData: string[][];
    // if the equation result exists, set the display data to the equation result
    // otherwise, set the display data to the parsed value
    if (equationResult) {
      displayData = data.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          rIdx === rowIndex && cIdx === colIndex ? equationResult : cell
        )
      );
    } else {
      displayData = data.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          rIdx === rowIndex && cIdx === colIndex ? parsedValue : cell
        )
      );
    }
    // cascading updates for the results of equation data dependent on the current cell
    let current = displayData;
    displayData = displayData.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === rowIndex && cIdx === colIndex) return cell;
        else {
          if (rawData[rIdx][cIdx].includes("$")) {
            let newParsedValue = parseFunction(current, rawData[rIdx][cIdx]);
            if (newParsedValue) {
              return newParsedValue;
            }
            newParsedValue = parseCellReferences(
              current,
              rawData[rIdx][cIdx]
            );
            const newEquationResult = parseEquation(newParsedValue);
            current[rIdx][cIdx] = newEquationResult;
            return newEquationResult;
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
  };
  // add a column to the spreadsheet
  const addColumn = () => {
    setData(data.map((row) => [...row, ""]));
  };


  // render the spreadsheet component
  return (
    <div className="p-4 flex-col">
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
      <div className=" flex items-center pt-3">
        <button
          onClick={() => {
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
          }}
          className="bg-red-500 text-white rounded-xl p-2 hover:shadow-md"
        >
          Reset
        </button>
        <button
          onClick={() => {
            if (data.length > 1) {
              setData(data.slice(0, -1));
              setRawData(rawData.slice(0, -1));
            }
          }}
          className="bg-red-500 text-white rounded-xl p-2 ml-2 hover:shadow-md"
        >
          Delete Row
        </button>
        <button
          onClick={() => {
            if (data[0].length > 1)
              setData(data.map((row) => row.slice(0, -1)));
            setRawData(rawData.map((row) => row.slice(0, -1)));
          }}
          className="bg-red-500 text-white rounded-xl p-2 ml-2 hover:shadow-md"
        >
          Delete Column
        </button>
      </div>
    </div>
  );
};

// export the spreadsheet component as the default export
export default Spreadsheet;
