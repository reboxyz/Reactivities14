import { makeAutoObservable, reaction, runInAction } from "mobx";
import { IPhoto, IProfile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
  profile: IProfile | null = null;
  loadingProfile = false;
  uploading = false;
  loading = false;
  deleting = false;
  loadingFollowings = false;
  followings: IProfile[] = [];
  activeTab = 0; // 0: About, 1: Photos, 2: Events, 3: Followers, 4: Following

  static readonly FOLLOWERS_TAB: number = 3;
  static readonly FOLLOWING_TAB: number = 4;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (
          activeTab === ProfileStore.FOLLOWERS_TAB ||
          activeTab === ProfileStore.FOLLOWING_TAB
        ) {
          const predicate =
            activeTab === ProfileStore.FOLLOWERS_TAB
              ? "followers"
              : "following";
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  setActiveTab = (activeTab: any) => {
    this.activeTab = activeTab;
  };

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
        if (this.profile?.photos) {
          this.profile.photos.find((p) => p.isMain)!.isMain = false; // unset current main photo
          this.profile.photos.find((p) => p.id === photo.id)!.isMain = true; // set new main photo
          this.profile.image = photo.url;
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

  // Note! username is the target user; following is the update status if we will follow or unfollow
  updateFollowing = async (username: string, following: boolean) => {
    this.loading = true;
    try {
      await agent.Profiles.updateFollowing(username);
      store.activityStore.updateAttendeeFollowing(username);
      runInAction(() => {
        // We are interested if we are looking other User's profile
        if (
          this.profile &&
          this.profile.username !== store.userStore.user?.username &&
          this.profile.username === username // Note! The target user is the current profile shown
        ) {
          following
            ? this.profile.followersCount++
            : this.profile.followersCount--;
          this.profile.following = !this.profile.following;
        }

        if (
          this.profile &&
          this.profile.username === store.userStore.user?.username
        ) {
          following
            ? this.profile.followingCount++
            : this.profile.followingCount--;
          this.profile.following = !this.profile.following;
        }

        this.followings.forEach((profile) => {
          // Update current profile which is basically a toggle (reverse) logic
          if (this.profile?.username === username) {
            profile.following
              ? profile.followersCount--
              : profile.followersCount++;
            profile.following = !profile.following;
          }
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  loadFollowings = async (predicate: string) => {
    try {
      this.loadingFollowings = true;
      if (this.profile) {
        const followings = await agent.Profiles.listFollowings(
          this.profile.username,
          predicate
        );
        runInAction(() => {
          this.followings = followings;
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingFollowings = false;
      });
    }
  };
}
