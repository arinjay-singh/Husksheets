/**
 * @file spreadsheet.tsx
 * @brief A simple spreadsheet component that allows users to add rows and columns, and delete rows and columns.
 * @version 1.0
 * @date 06-01-2024
 * @author Arinjay Singh
 */

import React, { useState, useEffect } from "react";
import { parseOperation } from "../functions/sheet-equations";

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

  // load the data from local storage when the component mounts
  useEffect(() => {
    // get the raw JSON data from local storage
    const rawJSONData = localStorage.getItem("spreadsheetData");

    // if the raw JSON data exists, parse it and set the data state
    if (rawJSONData) {
      // parse the raw JSON data and set the data state
      const parsedData = JSON.parse(rawJSONData);

      // derive the display data from the parsed data by
      // executing any operations in the cells
      const displayData = parsedData.map((row: string[]) =>
        row.map((cell: string) => {
          const operationResult = parseOperationString(cell);
          return operationResult ? operationResult : cell;
        })
      );

      // set the display data state
      setData(displayData);
    }
  }, []);

  // save the data to local storage when the data state changes
  // dependencies: rawData
  useEffect(() => {
    localStorage.setItem("spreadsheetData", JSON.stringify(rawData));
  }, [rawData]);

  // handle input change in the spreadsheet
  const handleInputChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    // check if the value is an operation string
    const operationResult = parseOperation(value);

    // adjust the display value based on the operation result
    const displayValue = operationResult ? operationResult : value;

    // switch out the display value with the result if the cell is an operation
    const displayData = data.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? displayValue : cell
      )
    );

    // set the display data state
    setData(displayData);

    // create the raw data
    // if the value is an operation, set the raw data to the operation string
    const behindDisplayData = rawData.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? value : cell
      )
    );

    // update the raw data state
    setRawData(behindDisplayData);
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
          <div className="p-5" />
        </div>
      </div>
      <div className=" flex items-center pt-3">
        <button
          onClick={() =>
            setData([
              ["", "", ""],
              ["", "", ""],
              ["", "", ""],
            ])
          }
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
            if (data[0].length > 1)
              setData(data.map((row) => row.slice(0, -1)));
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
