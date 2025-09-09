import { makeAutoObservable, runInAction } from "mobx";
import { IPhoto, IProfile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
  profile: IProfile | null = null;
  loadingProfile = false;
  uploading = false;
  loading = false;
  deleting = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }
    return false;
  }

  loadProfile = async (username: string) => {
    try {
      this.loadingProfile = true;
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingProfile = false;
      });
    }
  };

  uploadPhoto = async (file: Blob) => {
    try {
      this.uploading = true;
      const response = await agent.Profiles.uploadPhoto(file);
      const photo = response.data;

      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.uploading = false;
      });
    }
  };

  setMainPhoto = async (photo: IPhoto) => {
    try {
      this.loading = true;
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);

      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile!.photos!.find((p) => p.isMain)!.isMain = false; // unset current main photo
          this.profile!.photos!.find((p) => p.id === photo.id)!.isMain = true; // set new main photo
          this.profile!.image = photo.url;
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deletePhoto = async (photo: IPhoto) => {
    try {
      this.deleting = true;
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile?.photos) {
          this.profile.photos = this.profile.photos.filter(
            (p) => p.id !== photo.id
          );
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.deleting = false;
      });
    }
  };

  editProfile = async (profile: Partial<IProfile>) => {
    try {
      this.uploading = true;
      await agent.Profiles.update(profile);
      runInAction(() => {
        if (this.profile && store.userStore.user) {
          this.profile.displayName = profile.displayName!;
          this.profile.bio = profile.bio;
          store.userStore.setDisplayName(profile.displayName!);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.uploading = true;
      });
    }
  };
}
