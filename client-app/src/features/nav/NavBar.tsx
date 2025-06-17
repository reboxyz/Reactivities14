import { Button, Container, Menu, MenuItem } from "semantic-ui-react";

interface IProps {
  openCreateForm: () => void;
}

const NavBar: React.FC<IProps> = ({ openCreateForm }) => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <MenuItem header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Reactivities
        </MenuItem>
        <MenuItem name="Activities" />
        <MenuItem>
          <Button
            positive
            content="Create Activity"
            onClick={() => openCreateForm()}
          />
        </MenuItem>
      </Container>
    </Menu>
  );
};

export default NavBar;
