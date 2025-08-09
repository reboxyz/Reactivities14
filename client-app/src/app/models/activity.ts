import { IProfile } from "./profile";

export interface IActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date | null;
  city: string;
  venue: string;
  hostUsername?: string;
  isCancelled?: boolean;
  isGoing: boolean;
  isHost: boolean;
  host?: IProfile;
  attendees: IProfile[];
}

export class Activity implements IActivity {
  id: string = "";
  title: string = "";
  description: string = "";
  category: string = "";
  date: Date | null = null;
  city: string = "";
  venue: string = "";
  hostUsername?: string;
  isCancelled?: boolean;
  isGoing: boolean = false;
  isHost: boolean = false;
  host?: IProfile;
  attendees: IProfile[] = [];

  constructor(init?: ActivityFormValues) {
    Object.assign(this, init);
  }
}

// Note! This is a subset of IActivity
export class ActivityFormValues {
  id?: string;
  title: string = "";
  category: string = "";
  description: string = "";
  date: Date | null = null;
  city: string = "";
  venue: string = "";

  constructor(activity?: ActivityFormValues) {
    if (activity) {
      this.id = activity.id;
      this.title = activity.title;
      this.category = activity.category;
      this.description = activity.description;
      this.date = activity.date;
      this.venue = activity.venue;
      this.city = activity.city;
    }
  }
}
