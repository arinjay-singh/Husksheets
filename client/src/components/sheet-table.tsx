/**
 * @file sheet-table.tsx
 * @brief This file defines the SheetTable component, which is a table that can be used to display data in a spreadsheet format.
 * @date 06-13-2024
 * @author Arinjay Singh
 */

const SheetTable = ({
  data,
  addRow,
  addColumn,
  onChange,
  onExecute,
}: {
  data: any[];
  addRow: () => void;
  addColumn: () => void;
  onChange: (r: number, c: number, v: string) => void;
  onExecute: (r: number, c: number, v: string | null) => void;
}) => {
  return (
    <div className="relative flex-grow flex-col">
      <div className="flex flex-row">
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray-400 bg-slate-100"></th>
              {data[0].map((_: any, colIndex: number) => (
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
                {row.map((cell: string, colIndex: number) => (
                  <td key={colIndex} className="border border-gray-400">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) =>
                        onChange(rowIndex, colIndex, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onExecute(
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
  );
};

export default SheetTable;
