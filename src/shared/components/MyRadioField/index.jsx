import React from "react";
import { useField } from "formik";
import {
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import PropTypes from "prop-types";

const MyRadioField = (props) => {
  const [field, meta, helpers] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  const handleChange = (event) => {
    helpers.setValue(event.target.value);
  };

  return (
    <FormControl component="fieldset" className={props.className} error={!!errorText}>
      <FormLabel>{props.label}</FormLabel>
      <RadioGroup
        {...field}
        value={field.value || ""}
        onChange={handleChange}
        row
      >
        {props.options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                color="primary"
                disabled={props.disabled}
                sx={{
                  color: props.disabled ? "grey.500" : "primary.main",
                  "&.Mui-disabled": {
                    color: "grey.500",
                  },
                }}
              />
            }
            label={option.label}
            disabled={props.disabled}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
  );
};

MyRadioField.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default MyRadioField;
