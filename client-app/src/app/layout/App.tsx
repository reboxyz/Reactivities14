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
import LoginForm from "../../features/users/LoginForm";
import { useStore } from "../stores/store";
import { useEffect } from "react";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";

const App: React.FC = () => {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => {
        commonStore.setAppLoaded();
      });
    } else {
      commonStore.setAppLoaded();
    }
  }, [userStore, commonStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Loading app..." />;

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
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
          <Route path="/login" element={<LoginForm />} />
          {/* Default Route Fallback */}
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default observer(App);
