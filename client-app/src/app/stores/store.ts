import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import NavigateStore from "./navigateStore";
import UserStore from "./userStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import CommentStore from "./commentStore";

interface IStore {
  activityStore: ActivityStore;
  navigateStore: NavigateStore;
  userStore: UserStore;
  commonStore: CommonStore;
  modalStore: ModalStore;
  profileStore: ProfileStore;
  commentStore: CommentStore;
}

export const store: IStore = {
  activityStore: new ActivityStore(),
  navigateStore: new NavigateStore(),
  userStore: new UserStore(),
  commonStore: new CommonStore(),
  modalStore: new ModalStore(),
  profileStore: new ProfileStore(),
  commentStore: new CommentStore(),
};

export const StoreContext = createContext(store);

// Note! hook
export const useStore = () => {
  return useContext(StoreContext);
};
