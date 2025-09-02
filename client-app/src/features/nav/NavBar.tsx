import { observer } from "mobx-react-lite";
import {
  Button,
  Container,
  Dropdown,
  Image,
  Menu,
  MenuItem,
} from "semantic-ui-react";
import { NavLink, Link } from "react-router-dom";
import { useStore } from "../../app/stores/store";

const NavBar: React.FC = () => {
  const { userStore } = useStore();
  const { user, logout } = userStore;

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
        <MenuItem position="right">
          <Image
            src={user?.image || "/assets/user.png"}
            avatar
            spaced="right"
          />
          <Dropdown pointing="top left" text={user?.displayName}>
            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to={`/profiles/${user?.username}`}
                text="My Profile"
                icon="user"
              />
              <Dropdown.Item onClick={logout} text="Logout" icon="power" />
            </Dropdown.Menu>
          </Dropdown>
        </MenuItem>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
