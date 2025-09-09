import { makeAutoObservable, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";

export default class UserStore {
  user: IUser | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: IUserFormValues) => {
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => {
        this.user = user;
      });
      store.navigateStore.setNavigateToRoute("/activities");
      store.modalStore.closeModal();
    } catch (error) {
      console.log(error);
      throw error; // Note! Let the form catch the error for display
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem("jwt");
    this.user = null;
    store.navigateStore.setNavigateToRoute("/");
  };

  getUser = async () => {
    try {
      const user = await agent.Account.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  register = async (creds: IUserFormValues) => {
    try {
      const user = await agent.Account.register(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => {
        this.user = user;
      });
      store.navigateStore.setNavigateToRoute("/activities");
      store.modalStore.closeModal();
    } catch (error) {
      console.log(error);
      throw error; // Note! Let the form catch the error for display
    }
  };

  setImage = (image: string) => {
    if (this.user) {
      this.user.image = image;
    }
  };

  setDisplayName = (displayName: string) => {
    if (this.user) {
      this.user.displayName = displayName;
    }
  };
}
