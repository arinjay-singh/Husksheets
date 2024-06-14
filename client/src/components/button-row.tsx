/**
 * @file button-row.tsx
 * @brief This file defines the ButtonRow component, which is a row of buttons that can be used in the toolbar.
 * @date 06-13-2024
 * @author Arinjay Singh
 */


import { ToolBarButton } from "./toolbar-button";

interface ButtonRowProps {
  buttons: { func: () => void; color: string; label: string }[];
}

const ButtonRow = ({ buttons }: ButtonRowProps) => {
  return (
    <div className=" flex flex-row justify-evenly items-stretch">
      {buttons.map(({ func, color, label }) => (
        <ToolBarButton onClick={func} color={color} key={label}>
          {label}
        </ToolBarButton>
      ))}
    </div>
  );
};

export default ButtonRow;
