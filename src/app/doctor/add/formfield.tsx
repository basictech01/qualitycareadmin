import React from "react";

import { FormFieldProps } from "@/utils/types";

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  multiline = false,
  required = false,
}) => {
  return (
    <div className="mb-20">
      <label htmlFor={id} className="form-label fw-semibold text-primary-light text-sm mb-8">
        {label} {required && <span className="text-danger-600">*</span>}
      </label>
      {multiline ? (
        <textarea
          className="form-control radius-8"
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          className="form-control radius-8"
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default FormField;
