import { makeAutoObservable, runInAction, configure } from "mobx";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  activityRegistry = new Map();
  loadingInitial = false;
  submitting = false;
  activity: IActivity | null = null;
  target = "";

  public constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  // Note! Dictionary keyed by Date with a List value of Activities
  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities
      .slice()
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date)); // Ascending order

    // Note! Dictionary collection
    let accumulatorInitialValue = {} as { [key: string]: IActivity[] };

    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, accumulatorInitialValue)
    );
  }

  loadActivities = async () => {
    try {
      this.loadingInitial = true;
      const activities = await agent.Activities.list();
      console.log(this.groupActivitiesByDate(activities)); // Note! Log non-proxy objects
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
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

  loadActivity = async (id: string): Promise<IActivity> => {
    let activity = this.getActivity(id);

    if (activity) {
      this.activity = activity;
    } else {
      try {
        this.loadingInitial = true;
        activity = await agent.Activities.details(id);
        runInAction(() => {
          this.activity = activity;
        });
      } catch (error) {
        console.log(error);
      } finally {
        runInAction(() => {
          this.loadingInitial = false;
        });
      }
    }
    return activity;
  };

  clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.submitting = false;
      });
    }
  };

  editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.submitting = false;
      });
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
}

export default ActivityStore;
