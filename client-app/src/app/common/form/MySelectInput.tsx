import { useField } from "formik";
import React, { useState } from "react";
import { Form, Label, Select } from "semantic-ui-react";

interface IProps {
  placeholder: string;
  name: string;
  options: any;
  label?: string;
}

// Note! Double exclation point or !! is a technique to cast an object to boolean.
//       It will be "true" when the object is set, otherwise, it is false.

const MySelectInput: React.FC<IProps> = (props) => {
  const [field, meta, helpers] = useField(props);
  const [hasFocus, setHasFocus] = useState(false);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <Select
        clearable
        options={props.options}
        value={field.value || null}
        onChange={(_e, d) => helpers.setValue(d.value)}
        onBlur={() => {
          helpers.setTouched(true);
          setHasFocus(false);
        }}
        onFocus={() => setHasFocus(true)}
        placeholder={props.placeholder}
        name={props.name}
      />
      {meta.touched && !hasFocus && meta.error ? (
        <Label basic color="red" style={{ marginTop: "4px" }}>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
};

export default MySelectInput;
