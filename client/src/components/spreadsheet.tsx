/**
 * @file spreadsheet.tsx
 * @brief A simple spreadsheet component that allows users to add rows and columns, and delete rows and columns.
 * @version 1.0
 * @date 06-01-2024
 * @author Arinjay Singh
 */

import { useState, useEffect, useRef } from "react";
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
  formatChanges,
  parseLatestUpdates,
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
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);
  const [rawData, setRawData] = useState<string[][]>([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);

  const [changes, setChanges] = useState<
    { row: number; col: number; value: string }[]
  >([]);

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
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [typedSheet, setTypedSheet] = useState("");
  const [sheets, setSheets] = useState<string[]>([]);
  const [isLoadingInData, setIsLoadingInData] = useState(false);
  const [isSpreadsheetLoaded, setIsSpreadsheetLoaded] =
    useState<boolean>(false);
  const [publishedUpdatesId, setPublishedUpdatesId] = useState(0);
  const publishUpdatesIdRef = useRef(publishedUpdatesId);
  const [subscriptionUpdatesId, setSubscriptionUpdatesId] = useState<number>(0);
  const subscriptionUpdatesIdRef = useRef(subscriptionUpdatesId);

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

  /** COMPUTE RAW DATA ON LOAD, update displayed SS data
   * @author: Nicholas O'Sullivan
   */
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
      console.log(isSpreadsheetLoaded);
    }
  }, [rawData]);

  /** updates sent to server when user makes changes to the loaded spreadsheet.
   * @author: Nicholas O'Sullivan
   */
  useEffect(() => {
    console.log(isSpreadsheetLoaded);
    if (isSpreadsheetLoaded) {
      handleUpdate(); // Call handleUpdate
    }
  }, [changes]);
  /**
   * retrieve updates from the server every 1-2 seconds.
   */
  useEffect(() => {
    console.log("fetching updates:");

    if (isSpreadsheetLoaded) {
      // Define a function to fetch updates
      const fetchUpdates = async () => {
        try {
          await handleGetUpdates(); // Call your function to fetch updates
        } catch (error) {
          console.error("Failed to fetch updates:", error);
        }
      };
      // interval to call fetchUpdates every 1 second
      const interval = setInterval(fetchUpdates, 3000);
      return () => clearInterval(interval);
    }
  }, [isSpreadsheetLoaded]);

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

    //set changes made since last handleUpdate
    setChanges((prevChanges) => [
      ...prevChanges,
      { row: rowIndex, col: colIndex, value },
    ]);
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
      if (typeof window !== "undefined") {
        localStorage.setItem("publishers", JSON.stringify(publisherData));
      }
      alert("Publishers retrieved successfully");
    });
  };

  /* UPDATE API BUTTON HANDLERS */

  /** handle Updating the sheet: call updatePublished (if user=publisher),or updateSubscription(if user!=publisher),
   * @author: Nicholas O'Sullivan
   */
  const handleUpdate = async () => {
    try {
      const isOwner = username === publisher;
      console.log(isOwner);
      if (typedSheet && username && changes.length > 0) {
        const payload = formatChanges(changes);
        console.log(payload);
        await updatePublished(username, typedSheet, payload, isOwner);
        console.log("Data updated successfully:");
        setChanges([]); //empty the changes array
      }
    } catch (error) {
      console.error("Failed to update data:");
    }
  };

  /** handle loading a sheet by pulling the OFFICIAL changes from the publisher,
   *  loads w/(ID=0) then sets latest ID from pull
   * @author: Nicholas O'Sullivan
   */
  const handleLoadingSheet = async () => {
    if (username === undefined) return;
    try {
      const payloadAndId = await getUpdatesForSubscription(
        username,
        typedSheet,
        0
      );
      const payload = payloadAndId[0];
      const id = payloadAndId[1];
      setIsLoadingInData(true);
      setRawData(parseLatestUpdates(payload.join("")));
      subscriptionUpdatesIdRef.current = id;
      setIsSpreadsheetLoaded(true);
    } catch (error) {
      console.error("Failed to load sheet");
    }
  };

  // Assuming publishedUpdatesId needs to be updated based on some condition

  /** handle getting updates for the loaded sheet:
   * getUpdatesForPublished (if user=publisher): allows the Publisher to see the Subscribers new changes
   * or getUpdatesForSubscription(if user!=publisher): which allows the Subscriber to see the publisher's new changes)
   *
   * call using the version ID of the latest pull (publishedUpdatesId or subscriptionUpdatesID),
   * to only recieve the latest changes from the server.
   * @author: Nicholas O'Sullivan
   */
  const handleGetUpdates = async () => {
    if (username === undefined) return;
    try {
      if (publisher !== "" && selectedSheet !== "") {
        if (username == publisher) {
          const payloadAndId = await getUpdatesForPublished(
            username,
            typedSheet,
            publishedUpdatesId
          );
          const updatedPayload = payloadAndId[0].join("");
          const id = parseInt(payloadAndId[1][0], 10);

          console.log("payload", payloadAndId);
          console.log("retrieved id", id);
          console.log("client stored id", publishUpdatesIdRef.current);
          if (id !== null && id > publishUpdatesIdRef.current) {
            console.log("Setting newPublishedUpdatesId to:", id);
            setPublishedUpdatesId(id);
            publishUpdatesIdRef.current = id;
            console.log("lets see what it sets", publishUpdatesIdRef.current);
            setIsLoadingInData(true);
            console.log("update payload", updatedPayload);
            console.log("raw data", rawData);
            const parsedChanges = parseLatestUpdates(
              convertToPayload(rawData) + updatedPayload
            );
            setRawData(parsedChanges);
            console.log("final parsed changes", parsedChanges);
          }
        } else {
          const payloadAndId = await getUpdatesForSubscription(
            username,
            typedSheet,
            subscriptionUpdatesId
          );
          const updatedPayload = payloadAndId[0].join("");
          const id = parseInt(payloadAndId[1][0], 10);
          if (id != null && id > subscriptionUpdatesIdRef.current) {
            setIsLoadingInData(true);
            setSubscriptionUpdatesId(id);
            subscriptionUpdatesIdRef.current = id;
            const parsedChanges = parseLatestUpdates(
              convertToPayload(rawData) + updatedPayload
            );
            setRawData(parsedChanges);
          }
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
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]);
    setRawData([
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
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
    //   { func: handleUpdate, color: "green", label: "Save" },
    { func: handleCreateSheet, color: "green", label: "Create" },
    { func: handleDeleteSheet, color: "red", label: "Delete" },
    { func: handleLoadingSheet, color: "blue", label: "Load" },
  ];
  const conditonalDropdowns = [
    {
      onClick: handleGetPublishers,
      value: publisher,
      setValue: setPublisher,
      values: publishers,
      label: "Get Publishers",
    },
    {
      onClick: handleGetSheets,
      value: selectedSheet,
      setValue: setSelectedSheet,
      values: sheets,
      label: "Get Sheets",
    },
  ];
  const textFieldProps = {
    textValue: typedSheet,
    setTextValue: setTypedSheet,
    buttons: topToolbarButtons,
  };

  /* RENDER SPREADSHEET */
  return (
    <div className="p-4 flex flex-col">
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
      <div className=" pt-3">
        <ButtonRow buttons={bottomToolbarButtons} />
      </div>
    </div>
  );
};

export default Spreadsheet;
