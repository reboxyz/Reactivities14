import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import NavigateStore from "./navigateStore";

interface IStore {
  activityStore: ActivityStore;
  navigateStore: NavigateStore;
}

export const store: IStore = {
  activityStore: new ActivityStore(),
  navigateStore: new NavigateStore(),
};

export const StoreContext = createContext(store);

// Note! hook
export const useStore = () => {
  return useContext(StoreContext);
};
