import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import { AppLayout } from "./AppLayout";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import RouteNavigateWorkaround from "./RouteNavigateWorkaround";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <RouteNavigateWorkaround />
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
          {/* Default Route Fallback */}
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default observer(App);
