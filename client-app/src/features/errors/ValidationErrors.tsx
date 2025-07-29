import React from "react";
import { Message } from "semantic-ui-react";

interface IProps {
  errors: any; // string[] | null;  Note! Cheating:)
}

const ValidationErrors: React.FC<IProps> = ({ errors }) => {
  return (
    <Message error>
      {errors && (
        <Message.List>
          {errors.map((err: any, i: any) => (
            <Message.Item key={`unique-key-${i * 2}`}>{err}</Message.Item>
          ))}
        </Message.List>
      )}
    </Message>
  );
};

export default ValidationErrors;
