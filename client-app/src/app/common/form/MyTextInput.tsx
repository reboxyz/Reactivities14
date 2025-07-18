import { useField } from "formik";
import React from "react";
import { Form, Label } from "semantic-ui-react";

interface IProps {
  placeholder: string;
  name: string;
  label?: string;
}

// Note! Double exclation point or !! is a technique to cast an object to boolean.
//       It will be "true" when the object is set, otherwise, it is false.

const MyTextInput: React.FC<IProps> = (props) => {
  const [field, meta] = useField(props);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <Label basic color="red" style={{ marginTop: "4px" }}>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
};

export default MyTextInput;
