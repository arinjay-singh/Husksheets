/**
 * @file sheet-toolbar.tsx
 * @brief This file defines the SheetToolbar component, which is a toolbar for the sheet view.
 * @date 06-13-2024
 * @author Arinjay Singh
 */


import SheetInputField from "./sheet-input-field";
import ConditionalSelectField from "./sheet-select-field";

interface ConditionalDropdownProps {
  onClick: () => Promise<void>;
  condition: boolean;
  value: string;
  setValue: (value: string) => void;
  values: string[];
  label: string;
}

interface SheetInputFieldProps {
  textValue: string;
  setTextValue: (value: string) => void;
  buttons: {
    func: () => void;
    color: string;
    label: string;
  }[];
}

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
    condition: hasPublishers,
    value: publisher,
    setValue: setPublisher,
    values: publishers,
    label: publisherLabel,
  } = dropdownProps[0];
  const {
    onClick: handleGetSheets,
    condition: hasSheets,
    value: selectedSheet,
    setValue: setSelectedSheet,
    values: sheets,
    label: sheetLabel,
  } = dropdownProps[1];
  return (
    <div className="flex flex-row space-x-12">
      <SheetInputField
        textValue={typedSheet}
        setTextValue={setTypedSheet}
        buttons={topToolbarButtons}
      />
      <div className="flex flex-row space-x-3 w-1/2">
        <ConditionalSelectField
          onClick={handleGetPublishers}
          condition={hasPublishers}
          value={publisher}
          setValue={setPublisher}
          values={publishers}
          label={publisherLabel}
        />
        <ConditionalSelectField
          onClick={handleGetSheets}
          condition={hasSheets}
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
