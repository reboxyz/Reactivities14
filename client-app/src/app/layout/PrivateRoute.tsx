import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../stores/store";

const PrivateRoute = () => {
  const { userStore } = useStore();

  if (!userStore.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
