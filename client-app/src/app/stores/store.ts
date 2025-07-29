import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import NavigateStore from "./navigateStore";
import UserStore from "./userStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";

interface IStore {
  activityStore: ActivityStore;
  navigateStore: NavigateStore;
  userStore: UserStore;
  commonStore: CommonStore;
  modalStore: ModalStore;
}

export const store: IStore = {
  activityStore: new ActivityStore(),
  navigateStore: new NavigateStore(),
  userStore: new UserStore(),
  commonStore: new CommonStore(),
  modalStore: new ModalStore(),
};

export const StoreContext = createContext(store);

// Note! hook
export const useStore = () => {
  return useContext(StoreContext);
};
