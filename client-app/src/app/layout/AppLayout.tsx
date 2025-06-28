import NavBar from "../../features/nav/NavBar";
import { Container } from "semantic-ui-react";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "5.5em" }}>
        <Outlet />
      </Container>
    </>
  );
};
