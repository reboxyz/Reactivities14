import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../stores/store";

const RouteNavigateWorkaround = () => {
  const navigate = useNavigate();
  const { navigateStore } = useStore();
  const { navigateToRoute, setNavigateToRoute } = navigateStore;

  useEffect(() => {
    if (navigateToRoute) {
      navigate(navigateToRoute);
      setNavigateToRoute(""); // Note! Must reset the 'route'
    }
  }, [navigateToRoute, setNavigateToRoute, navigate]);

  return <Outlet />;
};

export default observer(RouteNavigateWorkaround);
