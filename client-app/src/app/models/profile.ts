import { IUser } from "./user";

export interface IProfile {
  username: string;
  displayName: string;
  image?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  following: boolean; // Note! Flag denoting if the currently logged in User is following the target User's profile being handled/displayed
  photos?: IPhoto[];
}

export class Profile implements IProfile {
  username: string;
  displayName: string;
  image?: string;
  bio?: string;

  followersCount: number;
  followingCount: number;
  following: boolean;

  constructor(user: IUser) {
    this.username = user.username;
    this.displayName = user.username;
    this.image = user.image;

    this.followersCount = 0;
    this.followingCount = 0;
    this.following = false;
  }
}

export interface IPhoto {
  id: string;
  url: string;
  isMain: boolean;
}

export interface IUserActivity {
  id: string;
  title: string;
  category: string;
  date: Date;
}
