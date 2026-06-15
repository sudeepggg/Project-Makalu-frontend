import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label?: string;
  value?: string;
  placeholder?: string;
  classname?: string;
  rules?: object;
  type?: string;
  multiline?: boolean;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputField = ({
  name,
  value,
  label,
  placeholder,
  classname,
  rules,
  type = "text",
  multiline,
  rows = 3,
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
        render={({ field }) =>
          multiline ? (
            <textarea
              {...field}
              defaultValue={value}
              rows={rows}
              className={`form-field resize-none ${classname}`}
              placeholder={placeholder}
              onChange={(e) => {
                field.onChange(e.target.value);
                onChange?.(e);
              }}
            />
          ) : (
            <input
              {...field}
              type={type}
              defaultValue={value}
              className={`form-field ${classname}`}
              placeholder={placeholder}
              onChange={(e) => {
                const val =
                  type === "number" ? e.target.valueAsNumber : e.target.value;
                field.onChange(val);
                onChange?.(e);
              }}
            />
          )
        }
      />
      {errors[name] && (
        <span className="error">{errors[name]?.message as string}</span>
      )}
    </div>
  );
};

export default InputField;