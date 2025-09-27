import { makeAutoObservable, runInAction, configure } from "mobx";
import { Activity, ActivityFormValues, IActivity } from "../models/activity";
import agent from "../api/agent";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

configure({ enforceActions: "always" });

class ActivityStore {
  activityRegistry = new Map<string, IActivity>();
  loadingInitial = false;
  loading = false;
  submitting = false;
  activity: IActivity | undefined = undefined;
  target = "";

  public constructor() {
    makeAutoObservable(this);
  }

  // Computed Props
  get activitiesByDate() {
    let activitiesToReturn = Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    ); // ascending date order

    return activitiesToReturn;
  }

  // Note! Dictionary keyed by Date with a List value of Activities
  get groupActivitiesByDate() {
    // Note! Dictionary collection
    let accumulatorInitialValue = {} as { [key: string]: IActivity[] };

    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        //const dateKey = new Date(activity.date!).toISOString().split("T")[0];
        const dateKey = format(activity.date!, "dd MMM yyyy");
        activities[dateKey] = activities[dateKey]
          ? [...activities[dateKey], activity]
          : [activity];
        return activities;
      }, accumulatorInitialValue)
    );
  }

  loadActivities = async () => {
    try {
      this.loadingInitial = true;
      const activities = await agent.Activities.list();

      runInAction(() => {
        activities.forEach((activity) => {
          this.setActivity(activity);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingInitial = false;
      });
    }
  };

  setActivity = (activity: IActivity) => {
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees.some(
        (a) => a.username === user.username
      );
    }
    activity.isHost = activity.hostUsername === user?.username;
    activity.host = activity.attendees?.find(
      (x) => x.username === activity.hostUsername
    );

    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      try {
        this.loadingInitial = true;
        activity = await agent.Activities.details(id);
        runInAction(() => {
          this.activity = activity;
        });
        return activity;
      } catch (error) {
        console.log(error);
      } finally {
        runInAction(() => {
          this.loadingInitial = false;
        });
      }
    }
  };

  clearActivity = () => {
    this.activity = undefined;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      await agent.Activities.create(activity);
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user?.username;
      newActivity.attendees = [attendee];
      this.setActivity(newActivity);

      runInAction(() => {
        this.activity = newActivity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  editActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          let updatedActivity = {
            ...this.getActivity(activity.id),
            ...activity,
          };
          this.activityRegistry.set(activity.id, updatedActivity as Activity);
          this.activity = updatedActivity as Activity;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    try {
      this.submitting = true;
      this.target = id;
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.target = "";
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.submitting = false;
      });
    }
  };

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        // Note! Toggle logic
        if (this.activity?.isGoing) {
          this.activity.attendees = this.activity.attendees?.filter(
            (a) => a.username !== user?.username
          );
          this.activity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.activity?.attendees?.push(attendee);
          this.activity!.isGoing = true;
        }
        this.activityRegistry.set(this.activity!.id, this.activity!);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        this.activity!.isCancelled = !this.activity!.isCancelled;
        this.activityRegistry.set(this.activity!.id, this.activity!);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearSelectedActivity = () => {
    this.activity = undefined;
  };

  // Note! username is the User that we are to follow or unfollow. This is a toggle logic
  updateAttendeeFollowing = (username: string) => {
    this.activityRegistry.forEach((activity) => {
      activity.attendees.forEach((attendee) => {
        if (attendee.username === username) {
          attendee.following
            ? attendee.followersCount--
            : attendee.followingCount++;
          attendee.following = !attendee.following;
        }
      });
    });
  };
}

export default ActivityStore;
