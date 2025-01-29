export interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
export function Checkbox(checkboxProps: CheckboxProps) {
  return (
    <label
      htmlFor={checkboxProps.id}
      className="flex cursor-pointer items-start gap-4"
    >
      <div className="flex items-center">
        &#8203;
        <input
          type="checkbox"
          className="size-4 rounded border-gray-300"
          checked={checkboxProps.checked}
          onChange={(event) => checkboxProps.onChange(event.target.checked)}
          id={checkboxProps.id}
        />
      </div>

      <div>
        <strong className="font-medium text-gray-900">
          {checkboxProps.label}
        </strong>
      </div>
    </label>
  );
}
