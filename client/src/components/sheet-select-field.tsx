/**
 * @file sheet-select-field.tsx
 * @brief This file defines the ConditionalSelectField component, which is a dropdown that is only displayed when a certain condition is met.
 * @date 06-13-2024
 * @author Arinjay Singh
 */



import ConditionalDropdown from "./conditional-dropdown";
import { ToolBarButton } from "./toolbar-button";

type ConditionalSelectFieldProps = {
  onClick: () => void;
  value: string;
  setValue: (value: string) => void;
  values: string[];
  label: string;
};

const ConditionalSelectField = ({
  onClick,
  value,
  setValue,
  values,
  label,
}: ConditionalSelectFieldProps) => {
  return (
    <div className="flex flex-row justify-start items-center">
      <ToolBarButton onClick={onClick} color="red">
        {label}
      </ToolBarButton>
      <ConditionalDropdown
        value={value}
        setValue={setValue}
        values={values}
      />
    </div>
  );
};

export default ConditionalSelectField;
