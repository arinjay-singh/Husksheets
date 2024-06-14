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
  condition: boolean;
  value: string;
  setValue: (value: string) => void;
  values: string[];
  label: string;
};

const ConditionalSelectField = ({
  onClick,
  condition,
  value,
  setValue,
  values,
  label,
}: ConditionalSelectFieldProps) => {
  return (
    <div className="flex flex-col justify-start space-y-2 items-center">
      <ToolBarButton onClick={onClick} color="red">
        {label}
      </ToolBarButton>
      <ConditionalDropdown
        condition={condition}
        value={value}
        setValue={setValue}
        values={values}
      />
    </div>
  );
};

export default ConditionalSelectField;
