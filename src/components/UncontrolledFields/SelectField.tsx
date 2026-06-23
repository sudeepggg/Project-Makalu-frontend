interface SelectOption {
  label: string;
  value: string | number;
}

interface Props {
  label: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SelectField = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  disabled,
}: Props) => {
  return (
    <div>
      <label className="form-label">{label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-field ${className ?? ""}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
