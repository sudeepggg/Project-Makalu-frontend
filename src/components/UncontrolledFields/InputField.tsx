interface Props {
  label: string;
  placeholder?: string;
  classname?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  disabled?: boolean;
}

const InputField = ({
  label,
  placeholder,
  classname,
  type = "text",
  onChange,
  value,
  disabled,
}: Props) => {
  return (
    <div>
      <label className="form-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-field ${classname ?? ""}`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
