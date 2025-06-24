import { observer } from "mobx-react-lite";
import { Button, Container, Menu, MenuItem } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

const NavBar: React.FC = () => {
  const { activityStore } = useStore();
  const { openCreateForm } = activityStore;

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

export default observer(NavBar);
