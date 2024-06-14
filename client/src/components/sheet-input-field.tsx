/**
 * @file sheet-input-field.tsx
 * @brief This file defines the SheetInputField component, which is a text input field for the sheet name.
 * @date 06-13-2024
 * @author Arinjay Singh
 */


import ButtonRow from "./button-row";

const SheetInputField = ({
  textValue,
  setTextValue,
  buttons,
}: {
  textValue: string;
  setTextValue: (value: string) => void;
  buttons: any[];
}) => {
  return (
    <div className="flex flex-row justify-center mb-5 items-center">
      <input        
        type="text"
        placeholder="Sheet Name"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        className="border-2 border-slate-400 text-black mr-2 rounded-xl p-2"
      />
      <ButtonRow buttons={buttons} />
    </div>
  );
};

export default SheetInputField;
