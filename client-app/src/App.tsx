import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header, HeaderContent, Icon, List } from "semantic-ui-react";

interface Value {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
    axios.get<Value[]>("http://localhost:5000/api/values").then((response) => {
      setValues(response.data);
    });
  }, []);

  return (
    <div>
      <Header as="h2">
        <Icon name="users" />
        <HeaderContent>Reactivities</HeaderContent>
      </Header>
      <List>
        {values.map((value) => (
          <List.Item key={value.id}>{value.name}</List.Item>
        ))}
      </List>
    </div>
  );
};

export default App;
