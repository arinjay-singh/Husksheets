/**
 * @file conditional-dropdown.tsx
 * @brief This file defines the ConditionalDropdown component, which is a dropdown that is only displayed when a certain condition is met.
 * @date 06-13-2024
 * @author Arinjay Singh
 */

const ConditionalDropdown = ({
  condition,
  value,
  setValue,
  values,
}: {
  condition: boolean;
  value: string;
  setValue: (value: string) => void;
  values: string[];
}) => {
  return (
    <div>
      {condition ? (
        <select
          id="pub-dropdown"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className="border-2 border-slate-400 text-black mx-3 rounded-xl p-2"
        >
          <option>None</option>
          {values.map((pub) => (
            <option key={pub} value={pub} className="text-black">
              {pub}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
};

export default ConditionalDropdown;
