import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors: FieldErrors;
  placeholder?: string;
}

const InputField = ({ label, name, type, register, errors, placeholder }: InputFieldProps) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        {...register(name, { required: `${label} الزامی است` })}
        className="shadow appearance-none border border-gray-300 p rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {errors[name] && <p className="text-red-500 text-xs italic">{errors[name]?.message as string}</p>}
    </div>
  );
};

export default InputField;