import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

const App: React.FC = () => {
  const { activityStore } = useStore();
  const { loadingInitial, loadActivities } = activityStore;

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loadingInitial)
    return <LoadingComponent content="Loading activities..." />;

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "5.5em" }}>
        <ActivityDashboard />
      </Container>
    </>
  );
};

export default observer(App);
