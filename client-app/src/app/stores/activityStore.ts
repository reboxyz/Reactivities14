import { makeAutoObservable, runInAction, configure } from "mobx";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  activityRegistry = new Map();
  loadingInitial = false;
  submitting = false;
  selectedActivity: IActivity | undefined = undefined;
  editMode = false;
  target = "";

  public constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return (
      Array.from(this.activityRegistry.values())
        //.slice()
        .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    ); // Ascending order
  }

  loadActivities = async () => {
    try {
      this.loadingInitial = true;
      const activities = await agent.Activities.list();

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

  createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
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
        this.selectedActivity = activity;
        this.editMode = false;
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

  openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  };

  selectActivity = (id: string) => {
    runInAction(() => {
      this.selectedActivity = this.activityRegistry.get(id);
      this.editMode = false;
    });
  };

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  cancelFormOpen = () => {
    this.editMode = false;
  };
}

export default ActivityStore;
