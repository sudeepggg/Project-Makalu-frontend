import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  value?: string;
  placeholder: string;
  classname?: string;
  rules?: object;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  name,
  value,
  label,
  placeholder,
  classname,
  rules,
  type = "text",
  onChange,
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
          <input
            {...field}
            type={type}
            defaultValue={value}
            className={`form-field ${classname}`}
            placeholder={placeholder}
            onChange={(e) => {
              const value =
                type === "number" ? e.target.valueAsNumber : e.target.value;
              field.onChange(value);
              onChange?.(e);
            }}
          />
        )}
      />
      {errors[name] && (
        <span className="error">{errors[name]?.message as string}</span>
      )}
    </div>
  );
};

export default InputField;
