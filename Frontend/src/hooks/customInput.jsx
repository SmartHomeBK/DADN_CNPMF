import React from "react";

const CustomInput = ({
  contentLabel,
  placeholder,
  name,
  value,
  onChange,
  type = "text",
  classWrapper = "",
  onBlur,
  error,
  touched,
  disabled = false,
}) => {
  return (
    <div className={classWrapper}>
      <label className="block mb-2 text-sm font-medium">{contentLabel}</label>
      <input
        type={type}
        className={`bg-gray-50 border border-gray-300 text-gray-900 ${classWrapper} text-sm rounded-lg  block w-full p-2.5 ${
          error && touched ? "border-red-500" : "border-blue-500"
        } `}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
        disabled={disabled}
      />
      {error && touched && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CustomInput;
