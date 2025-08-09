import { IUser } from "./user";

export interface IProfile {
  username: string;
  displayName: string;
  image?: string;
  bio?: string;
}

export class Profile implements IProfile {
  username: string;
  displayName: string;
  image?: string;
  bio?: string;

  constructor(user: IUser) {
    this.username = user.username;
    this.displayName = user.username;
    this.image = user.image;
  }
}
