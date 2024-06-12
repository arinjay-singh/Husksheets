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
    <button onClick={onClick} className={`bg-${color}-500 text-white rounded-xl p-2 ml-2 hover:shadow-md`}>
      {children}
    </button>
  );
};
