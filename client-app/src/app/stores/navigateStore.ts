import { makeAutoObservable } from "mobx";

// Note! This is a workaround to circumvent react-router-dom v6 history not available anymore
// Works in conjunction with "RouteNavigateWorkaroundContainer" as an observer that triggers 'useNavigate'
export default class NavigateStore {
  navigateToRoute: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setNavigateToRoute = (route: string) => {
    this.navigateToRoute = route;
  };
}
