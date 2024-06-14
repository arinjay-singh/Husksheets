/**
 * @file toolbar-button.tsx
 * @brief This file defines the ToolBarButton component, which is a button that can be used in the toolbar.
 * @date 06-13-2024
 * @author Arinjay Singh
 */

export const ToolBarButton = ({
  children,
  onClick,
  color,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-${color}-500 text-white rounded-xl p-2 ml-2 hover:shadow-md`}
    >
      {children}
    </button>
  );
};
