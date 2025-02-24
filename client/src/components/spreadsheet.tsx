/**
 * @file spreadsheet.tsx
 * @brief A simple spreadsheet component that allows users to add rows and columns, and delete rows and columns.
 * @version 1.0
 * @date 06-01-2024
 * @author Arinjay Singh
 */

import {useState, useEffect, useRef} from "react";
import {
    useCreateSheet,
    useDeleteSheet,
    useGetSheets,
} from "@/app/api/api/sheets";
import {useGetPublishers} from "@/app/api/api/register";
import {useAuth} from "@/context/auth-context";
import {FunctionParser} from "@/functions/sheet-functions";
import {OperationParser} from "@/functions/sheet-operations";
import {saveArrayAsCSV} from "@/functions/save-csv";
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

/**
 * @author Arinjay Singh
 */
const Spreadsheet: React.FC = () => {
    /**
     * @author Arinjay Singh
     */
    /* USER AUTHENTICATION CONTEXT */
    const {auth, setAuthData} = useAuth();
    const username = auth?.username;

    /**
     * @author Arinjay Singh
     */
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

    /**
     * @author: Nicholas O'Sullivan
     */
    const [changes, setChanges] = useState<
        { row: number; col: number; value: string }[]
    >([]);

    /**
     * @author Arinjay Singh
     */
    /* API CALLS */
    const {getPublishers} = useGetPublishers();
    const {getUpdatesForSubscription} = useGetUpdatesForSubscription();
    const {getUpdatesForPublished} = useGetUpdatesForPublished();
    const {updatePublished} = useUpdate();
    const {deleteSheet} = useDeleteSheet();
    const {getSheets} = useGetSheets();
    const {createSheet} = useCreateSheet();

    //handle command line arguments on startup
    //@author: Nicholas O'Sullivan
    const publisherName = process.env.NEXT_PUBLIC_PUBLISHER;
    let basePublisherName = ""
    if (publisherName) {
        basePublisherName = publisherName;
        console.log("used diff publishername:", publisherName)
    }

    const sheetName = process.env.NEXT_PUBLIC_SHEET;
    let baseSheetName = ""
    if (sheetName) {
        baseSheetName = sheetName;
        console.log("used diff sheet name:", sheetName)
    }

    const authUsername = auth?.username;
    const authPassword = auth?.password;

// Check if auth data is already set and only set it if it's not
    const userName = process.env.NEXT_PUBLIC_NAME || "";
    const userPassword = process.env.NEXT_PUBLIC_PASSWORD || "";

    useEffect(() => {
        // Only update the state if the environment variables are different from the current auth values
        if (auth?.username !== userName || auth?.password !== userPassword) {
            // Log values for debugging
            if (userName) {
                console.log("used diff username:", userName);
            }
            if (userPassword) {
                console.log("used diff password :", userPassword);
            }

            // Only set auth context data if both values are provided
            if (userName && userPassword) {
                setAuthData({username: userName, password: userPassword});
            }
        }
    }, [auth, userName, userPassword, setAuthData]);

    //   useEffect(() => {
    //     if (!(auth?.username && auth?.password)) {
    //         const userName = process.env.NEXT_PUBLIC_NAME;
    //         let baseUserName = ""
    //         if (userName) {
    //             baseUserName = userName;
    //             console.log("used diff username:", userName)
    //             // set auth context username to baseusername
    //         }
    //         const userPassword = process.env.NEXT_PUBLIC_PASSWORD;
    //         let baseUserPassword = ""
    //         if (userPassword) {
    //             baseUserPassword = userPassword;
    //             console.log("used diff password :", userPassword)
    //             // set auth context password to baseuserpassword
    //         }
    //         if (baseUserName && baseUserPassword) {
    //             setAuthData({ username: baseUserName, password: baseUserPassword });
    //         }
    //     }
    // }, [auth, setAuthData]);

    /**
     * @author Arinjay Singh
     */
    /* STATE VARIABLES */
    const [isClient, setIsClient] = useState(false);
    const [publisher, setPublisher] = useState<string>(basePublisherName);
    const [publishers, setPublishers] = useState<string[]>([]);
    const [selectedSheet, setSelectedSheet] = useState<string>(baseSheetName);
    const [typedSheet, setTypedSheet] = useState(baseSheetName);
    const typedSheetRef = useRef<string>(typedSheet);
    const [sheets, setSheets] = useState<string[]>([]);
    const [isLoadingInData, setIsLoadingInData] = useState(false);
    const [isSpreadsheetLoaded, setIsSpreadsheetLoaded] =
        useState<boolean>(false);
    const [publishedUpdatesId, setPublishedUpdatesId] = useState(0);
    const publishUpdatesIdRef = useRef(publishedUpdatesId);
    const [subscriptionUpdatesId, setSubscriptionUpdatesId] = useState<number>(0);
    const subscriptionUpdatesIdRef = useRef(subscriptionUpdatesId);
    const [stopFetching, setStopFetching] = useState(false);

    useEffect(() => {
        typedSheetRef.current = typedSheet;
    }, [typedSheet]);

    /**
     * @author Arinjay Singh
     */
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

    /**
     * @author Arinjay Singh
     */
    /* SAVE DATA TO LOCAL STORAGE ON CHANGE */
    useEffect(() => {
        if (!isClient || typeof window === "undefined") return;
        localStorage.setItem("spreadsheetData", JSON.stringify(rawData));
        localStorage.setItem("displaySpreadsheetData", JSON.stringify(data));
    }, [data, rawData, isClient]);

    /** COMPUTE RAW DATA ON LOAD, update displayed SS data
     * @author: Nicholas O'Sullivan
     * @author: Arinjay Singh
     */
    useEffect(() => {
        if (isLoadingInData) {
            const updateDisplayData = () => {
                let current = rawData;
                let newData = rawData.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                        let equationResult: string | null = null;
                        let functionResult: string | null = null;
                        try {
                            functionResult = new FunctionParser(
                                current,
                                rawData[rIdx][cIdx]
                            ).parse();
                        } catch (e) {
                        }
                        try {
                            equationResult = new OperationParser(
                                current,
                                rawData[rIdx][cIdx]
                            ).parse();
                        } catch (e) {
                        }
                        if (equationResult !== null) {
                            current[rIdx][cIdx] = equationResult;
                            return equationResult;
                        } else if (functionResult !== null) {
                            current[rIdx][cIdx] = functionResult;
                            return functionResult;
                        }
                        return cell;
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
    }, [changes, stopFetching, isSpreadsheetLoaded]);

    /**
     * retrieve updates from the server every 1-2 seconds.
     * @author Nicholas O'Sullivan
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
            const interval = setInterval(fetchUpdates, 2000);
            return () => clearInterval(interval);
        }
    }, [isSpreadsheetLoaded]);

    /**
     * @author Arinjay Singh
     */
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
            {row: rowIndex, col: colIndex, value},
        ]);
    };

    /**
     * @author Arinjay Singh
     */
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
            functionResult = new FunctionParser(data, value).parse();
        } catch (e) {
        }
        try {
            equationResult = new OperationParser(data, value).parse();
        } catch (e) {
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
                    if (equationResult !== null) return equationResult;
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
                    console.log('rawdata', rawData);
                    let val = rawData[rIdx][cIdx].toString();
                    if (val.includes("$")) {
                        let equationResult: string | null = null;
                        let functionResult: string | null = null;
                        try {
                            functionResult = new FunctionParser(
                                current,
                                val
                            ).parse();
                        } catch (e) {
                        }
                        try {
                            equationResult = new OperationParser(
                                current,
                                val
                            ).parse();
                        } catch (e) {
                        }
                        if (equationResult !== null) {
                            current[rIdx][cIdx] = equationResult;
                            return equationResult;
                        } else if (functionResult !== null) {
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

    /**
     * @author Arinjay Singh
     */
    /* CREATE AND DELETE SHEET API BUTTON HANDLERS */
    const handleCreateSheet = async () => {
        try {
            if (typedSheetRef.current && username) {
                await createSheet(username, typedSheetRef.current);
                setTypedSheet(typedSheetRef.current);
            }
        } catch (error) {
            console.error("Error creating sheet:", error);
            alert("Error creating sheet. See console for details.");
        }
    };

    /**
     * @author Arinjay Singh
     */
    const handleDeleteSheet = async () => {
        try {
            await deleteSheet(typedSheetRef.current);
        } catch (error) {
            console.error("Error deleting sheets:", error);
            alert("Error deleting sheets. See console for details.");
        }
    };

    /**
     * @author Arinjay Singh
     */
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
    /**
     * @author Arinjay Singh
     */
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
            if (typedSheetRef.current && username && changes.length > 0) {
                const payload = formatChanges(changes) + "\n";
                console.log("payload to server:", payload);
                await updatePublished(
                    publisher,
                    typedSheetRef.current,
                    payload,
                    isOwner
                );
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
                typedSheetRef.current,
                0
            );
            const payload = payloadAndId[0];
            const id = payloadAndId[1];
            setIsLoadingInData(true);
            setRawData(parseLatestUpdates(payload.join("")));
            subscriptionUpdatesIdRef.current = id;
            setIsSpreadsheetLoaded(true);
            setStopFetching(true);
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
                console.log(publisher);
                if (username == publisher) {
                    const payloadAndId = await getUpdatesForPublished(
                        username,
                        typedSheetRef.current,
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
                        publisher,
                        typedSheetRef.current,
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

    /**
     * @author Arinjay Singh
     */
    /* LOCAL CHANGE BUTTON HANDLERS */
    const addRow = () => {
        setData([...data, Array(data[0].length).fill("")]);
        setRawData([...rawData, Array(data[0].length).fill("")]);
    };
    /**
     * @author Arinjay Singh
     */
    const handleDeleteRow = () => {
        if (data.length > 1) {
            setData(data.slice(0, -1));
            setRawData(rawData.slice(0, -1));
        }
    };
    /**
     * @author Arinjay Singh
     */
    const addColumn = () => {
        setData(data.map((row) => [...row, ""]));
        setRawData(rawData.map((row) => [...row, ""]));
    };
    /**
     * @author Arinjay Singh
     */
    const handleDeleteColumn = () => {
        if (data[0].length > 1) setData(data.map((row) => row.slice(0, -1)));
        setRawData(rawData.map((row) => row.slice(0, -1)));
    };
    /**
     * @author Arinjay Singh
     */
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
    /**
     * @author Arinjay Singh
     */
    const handleDownloadCSV = () => saveArrayAsCSV(data);

    /**
     * @author Arinjay Singh
     */
    /* SPREADSHEET DATA */
    const bottomToolbarButtons = [
        {func: handleDownloadCSV, color: "green", label: "Download CSV"},
        {func: handleResetSheet, color: "red", label: "Reset Sheet"},
        {func: handleDeleteRow, color: "red", label: "Delete Row"},
        {func: handleDeleteColumn, color: "red", label: "Delete Column"},
    ];
    const topToolbarButtons = [
        //   { func: handleUpdate, color: "green", label: "Save" },
        {func: handleCreateSheet, color: "green", label: "Create"},
        {func: handleDeleteSheet, color: "red", label: "Delete"},
        {func: handleLoadingSheet, color: "blue", label: "Load"},
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

    /**
     * @author Arinjay Singh
     */
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
                <ButtonRow buttons={bottomToolbarButtons}/>
            </div>
        </div>
    );
};

export default Spreadsheet;
