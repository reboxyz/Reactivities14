import { useField } from "formik";
import React from "react";
import { Form, Label } from "semantic-ui-react";
import DatePicker, { DatePickerProps } from "react-datepicker";

// Note! Double exclation point or !! is a technique to cast an object to boolean.
//       It will be "true" when the object is set, otherwise, it is false.

const MyDateInput: React.FC<DatePickerProps> = (props) => {
  const [field, meta, helpers] = useField(props.name!);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <DatePicker
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={(value: any) => helpers.setValue(value)}
      />

      {meta.touched && meta.error ? (
        <Label basic color="red" style={{ marginTop: "4px" }}>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
};

export default MyDateInput;
