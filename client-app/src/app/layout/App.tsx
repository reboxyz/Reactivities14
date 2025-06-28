import { Container } from "semantic-ui-react";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import { AppLayout } from "./AppLayout";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <Container style={{ marginTop: "5.5em" }}>
      <Routes>
        <Route index path="/" element={<HomePage />} />
        {/*  PrivateRoute Start */}
        {/* AppLayout Start */}
        <Route element={<AppLayout />}>
          <Route path="/activities" element={<ActivityDashboard />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />
          <Route
            path="/createActivity"
            element={<ActivityForm key={location.key} />}
            key={location.key}
          />
          <Route
            path="/manage/:id"
            element={<ActivityForm key={location.key} />}
          />
        </Route>
      </Routes>
    </Container>
  );
};

export default observer(App);
