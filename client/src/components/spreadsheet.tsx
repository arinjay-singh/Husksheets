/**
 * @file spreadsheet.tsx
 * @brief A simple spreadsheet component that allows users to add rows and columns, and delete rows and columns.
 * @version 1.0
 * @date 06-01-2024
 * @author Arinjay Singh
 */

import { useState, useEffect } from "react";
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
import {
  useGetUpdatesForPublished,
  useGetUpdatesForSubscription,
  useUpdate,
} from "@/app/api/api/update";
import {
  convertToPayload,
  parseServerPayload,
} from "@/functions/parse-payload";
import parseCopy from "@/functions/copy";
import SheetTable from "./sheet-table";
import ButtonRow from "./button-row";
import SheetToolbar from "./sheet-toolbar";

const Spreadsheet: React.FC = () => {
  /* USER AUTHENTICATION CONTEXT */
  const { auth } = useAuth();
  const username = auth?.username;

  /* SHEET DISPLAY AND RAW DATA */
  const [data, setData] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [rawData, setRawData] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  /* API CALLS */
  const { getPublishers } = useGetPublishers();
  const { getUpdatesForSubscription } = useGetUpdatesForSubscription();
  const { getUpdatesForPublished } = useGetUpdatesForPublished();
  const { updatePublished } = useUpdate();
  const { deleteSheet } = useDeleteSheet();
  const { getSheets } = useGetSheets();
  const { createSheet } = useCreateSheet();

  /* STATE VARIABLES */
  const [isClient, setIsClient] = useState(false);
  const [publisher, setPublisher] = useState<string>("");
  const [publishers, setPublishers] = useState<string[]>([]);
  const [hasPublishers, setHasPublishers] = useState<boolean>(false);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [typedSheet, setTypedSheet] = useState("");
  const [sheets, setSheets] = useState<string[]>([]);
  const [hasSheets, setHasSheets] = useState<boolean>(false);
  const [isLoadingInData, setIsLoadingInData] = useState(false);

  /* INITIAL DATA LOAD FROM LOCAL STORAGE */
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const displayData = localStorage.getItem("displaySpreadsheetData");
      const rawData = localStorage.getItem("spreadsheetData");
      if (displayData) setData(JSON.parse(displayData));
      if (rawData) setRawData(JSON.parse(rawData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* SAVE DATA TO LOCAL STORAGE ON CHANGE */
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return;
    localStorage.setItem("spreadsheetData", JSON.stringify(rawData));
    localStorage.setItem("displaySpreadsheetData", JSON.stringify(data));
  }, [data, rawData, isClient]);

  /* COMPUTE RAW DATA ON LOAD */
  useEffect(() => {
    if (isLoadingInData) {
      const updateDisplayData = () => {
        const newData = rawData.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            try {
              return new Parser(rawData, cell).parse();
            } catch (e) {
              return parseEquation(rawData, cell) || cell;
            }
          })
        );
        setData(newData);
      };
      updateDisplayData();
      setIsLoadingInData(false);
    }
  }, [rawData]);

  /* CELL INPUT CHANGE HANDLER */
  const handleInputChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const displayData = data.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? value : cell
      )
    );
    setData(displayData);
    const equationData = rawData.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? value : cell
      )
    );
    setRawData(equationData);
  };

  /* EXECUTE CELL HANDLER */
  const executeCell = (
    rowIndex: number,
    colIndex: number,
    value: string | null
  ) => {
    if (value === null) {
      alert("Cannot execute empty cell");
      return;
    }
    // parse cell for equation or function
    let equationResult: string | null = null;
    let functionResult: string | null = null;
    try {
      functionResult = new Parser(data, value).parse();
    } catch (e) {
      equationResult = parseEquation(data, value);
    }
    let copyResult = parseCopy(data, value, [rowIndex, colIndex]);
    if (copyResult) {
      console.log("copying");
      let copiedRawData = rawData.map((row) => [...row]);
      copyResult[2].forEach((coord) => {
        copiedRawData[coord[0]][coord[1]] = copyResult[0];
      });
      setRawData(copiedRawData);
    }
    // update display data with new value
    let displayData: string[][];
    displayData = data.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (
          copyResult &&
          copyResult[2].some((coord) => coord[0] === rIdx && coord[1] === cIdx)
        ) {
          return copyResult[1];
        }
        if (rIdx === rowIndex && cIdx === colIndex) {
          if (copyResult) return copyResult[1];
          if (functionResult !== null) return functionResult;
          if (equationResult) return equationResult;
          return value;
        }
        return cell;
      })
    );
    // cascading updates for equations dependent on current cell
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
    setData(displayData);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "displaySpreadsheetData",
        JSON.stringify(displayData)
      );
    }
  };

  /* CREATE AND DELETE SHEET API BUTTON HANDLERS */
  const handleCreateSheet = async () => {
    try {
      if (typedSheet && username) {
        await createSheet(username, typedSheet);
        setTypedSheet(typedSheet);
      }
    } catch (error) {
      console.error("Error creating sheet:", error);
      alert("Error creating sheet. See console for details.");
    }
  };
  const handleDeleteSheet = async () => {
    try {
      await deleteSheet(typedSheet);
    } catch (error) {
      console.error("Error deleting sheets:", error);
      alert("Error deleting sheets. See console for details.");
    }
  };

  /* GET SHEETS AND PUBLISHERS API BUTTON HANDLERS */
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
  const handleGetPublishers = async () => {
    let publishers = getPublishers();
    publishers.then((publisherData: string[]) => {
      setPublishers(publisherData);
      setHasPublishers(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("publishers", JSON.stringify(publisherData));
      }
      alert("Publishers retrieved successfully");
    });
  };

  /* UPDATE API BUTTON HANDLERS */
  const handleUpdate = async () => {
    const payload = rawData;
    try {
      const isOwner = username == publisher;
      if (typedSheet && username && payload) {
        console.log(payload);
        const parsedPayload = convertToPayload(payload);
        await updatePublished(username, typedSheet, parsedPayload, isOwner);
        console.log("Data updated successfully:");
      }
    } catch (error) {
      console.error("Failed to update data:");
    }
  };
  const handleGetUpdates = async () => {
    if (username === undefined) return;
    try {
      if (publisher !== "" && selectedSheet !== "") {
        if (username == publisher) {
          const updatedPayload = await getUpdatesForSubscription(
            username,
            typedSheet,
            0
          );
          setIsLoadingInData(true);
          setRawData(parseServerPayload(updatedPayload));
        } else {
          const updatedPayload = await getUpdatesForPublished(
            username,
            typedSheet,
            0
          );
          setIsLoadingInData(true);
          setRawData(parseServerPayload(updatedPayload));
        }
      }
    } catch (error) {
      console.error("Failed to load updates");
    }
  };

  /* LOCAL CHANGE BUTTON HANDLERS */
  const addRow = () => {
    setData([...data, Array(data[0].length).fill("")]);
    setRawData([...rawData, Array(data[0].length).fill("")]);
  };
  const handleDeleteRow = () => {
    if (data.length > 1) {
      setData(data.slice(0, -1));
      setRawData(rawData.slice(0, -1));
    }
  };
  const addColumn = () => {
    setData(data.map((row) => [...row, ""]));
    setRawData(rawData.map((row) => [...row, ""]));
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
  const handleDownloadCSV = () => saveArrayAsCSV(data);

  /* SPREADSHEET DATA */
  const bottomToolbarButtons = [
    { func: handleDownloadCSV, color: "green", label: "Download CSV" },
    { func: handleResetSheet, color: "red", label: "Reset Sheet" },
    { func: handleDeleteRow, color: "red", label: "Delete Row" },
    { func: handleDeleteColumn, color: "red", label: "Delete Column" },
  ];
  const topToolbarButtons = [
    { func: handleUpdate, color: "green", label: "Save" },
    { func: handleCreateSheet, color: "green", label: "Create" },
    { func: handleDeleteSheet, color: "red", label: "Delete" },
    { func: handleGetUpdates, color: "blue", label: "Load" },
  ];
  const conditonalDropdowns = [
    {
      onClick: handleGetPublishers,
      condition: hasPublishers,
      value: publisher,
      setValue: setPublisher,
      values: publishers,
      label: "Get Publishers"
    },
    {
      onClick: handleGetSheets,
      condition: hasSheets,
      value: selectedSheet,
      setValue: setSelectedSheet,
      values: sheets,
      label: "Get Sheets"
    },
  ];
  const textFieldProps = {
    textValue: typedSheet,
    setTextValue: setTypedSheet,
    buttons: topToolbarButtons,
  };

  /* RENDER SPREADSHEET */
  return (
    <div className="p-4 flex-col">
      {/* Toolbar (API Calls to Server) */}
      <SheetToolbar
        textFieldProps={textFieldProps}
        dropdownProps={conditonalDropdowns}
      />
      {/* Spreadsheet Table */}
      <SheetTable
        data={data}
        onChange={handleInputChange}
        onExecute={executeCell}
        addRow={addRow}
        addColumn={addColumn}
      />
      {/* Local Change Control Buttons */}
      <ButtonRow buttons={bottomToolbarButtons} />
    </div>
  );
};

export default Spreadsheet;
