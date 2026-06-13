import { Controller, useFormContext } from "react-hook-form";

interface SelectOption {
  label: string;
  value: string | number;
}

interface Props {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  rules?: object;
  className?: string;
  isLoading?: boolean;
}

const SelectField = ({
  name,
  label,
  options,
  placeholder = "Select...",
  rules,
  className,
  isLoading,
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label className="form-label">{label}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <select
            {...field}
            className={`form-field ${className ?? ""}`}
            disabled={isLoading}
          >
            <option value="">{isLoading ? "Loading..." : placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      />
      {errors[name] && (
        <p className="text-xs text-red-500 mt-1">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default SelectField;
