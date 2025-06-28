import { observer } from "mobx-react-lite";
import { Button, Container, Menu, MenuItem } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <MenuItem header as={NavLink} to="/">
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Reactivities
        </MenuItem>
        <MenuItem name="Activities" as={NavLink} to="/activities" />
        <MenuItem>
          <Button
            as={NavLink}
            to="/createActivity"
            positive
            content="Create Activity"
            //reloadDocument // Very Important! Use this if you want to force reload
          />
        </MenuItem>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
