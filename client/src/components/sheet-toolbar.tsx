/**
 * @file sheet-toolbar.tsx
 * @brief This file defines the SheetToolbar component, which is a toolbar for the sheet view.
 * @date 06-13-2024
 * @author Arinjay Singh
 */

import SheetInputField from "./sheet-input-field";
import ConditionalSelectField from "./sheet-select-field";

/**
 * @author Arinjay Singh
 */
interface ConditionalDropdownProps {
  onClick: () => Promise<void>;
  value: string;
  setValue: (value: string) => void;
  values: string[];
  label: string;
}

/**
 * @author Arinjay Singh
 */
interface SheetInputFieldProps {
  textValue: string;
  setTextValue: (value: string) => void;
  buttons: {
    func: () => void;
    color: string;
    label: string;
  }[];
}

/**
 * @author Arinjay Singh
 */
const SheetToolbar = ({
  textFieldProps,
  dropdownProps,
}: {
  textFieldProps: SheetInputFieldProps;
  dropdownProps: ConditionalDropdownProps[];
}) => {
  const {
    textValue: typedSheet,
    setTextValue: setTypedSheet,
    buttons: topToolbarButtons,
  } = textFieldProps;
  const {
    onClick: handleGetPublishers,
    value: publisher,
    setValue: setPublisher,
    values: publishers,
    label: publisherLabel,
  } = dropdownProps[0];
  const {
    onClick: handleGetSheets,
    value: selectedSheet,
    setValue: setSelectedSheet,
    values: sheets,
    label: sheetLabel,
  } = dropdownProps[1];
  /**
   * @author Arinjay Singh
   */
  return (
    <div className="flex flex-row space-x-32 justify-center items-start">
      <SheetInputField
        textValue={typedSheet}
        setTextValue={setTypedSheet}
        buttons={topToolbarButtons}
      />
      <div className="flex flex-row justify-center space-x-3 pb-1">
        <ConditionalSelectField
          onClick={handleGetPublishers}
          value={publisher}
          setValue={setPublisher}
          values={publishers}
          label={publisherLabel}
        />
        <ConditionalSelectField
          onClick={handleGetSheets}
          value={selectedSheet}
          setValue={setSelectedSheet}
          values={sheets}
          label={sheetLabel}
        />
      </div>
    </div>
  );
};

export default SheetToolbar;
