import { makeAutoObservable, runInAction, configure } from "mobx";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { format } from "date-fns";

configure({ enforceActions: "always" });

class ActivityStore {
  activityRegistry = new Map<string, IActivity>();
  loadingInitial = false;
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
