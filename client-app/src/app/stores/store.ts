import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface IStore {
  activityStore: ActivityStore;
}

export const store: IStore = {
  activityStore: new ActivityStore(),
};

export const StoreContext = createContext(store);

// Note! hook
export const useStore = () => {
  return useContext(StoreContext);
};
