import { makeAutoObservable, runInAction, configure, reaction } from "mobx";
import { Activity, ActivityFormValues, IActivity } from "../models/activity";
import agent from "../api/agent";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";
import { IPagination, PagingParams } from "../models/pagination";

configure({ enforceActions: "always" });

class ActivityStore {
  activityRegistry = new Map<string, IActivity>();
  loadingInitial = false;
  loading = false;
  submitting = false;
  activity: IActivity | undefined = undefined;
  target = "";

  // Paging fields
  pagination: IPagination | null = null; // Current Pagination state returned from the Server
  pagingParams = new PagingParams(); // Current Pagination request
  // Filtering field
  predicate = new Map().set("all", true); // 'all', 'startDate', 'isGoing', 'isHost'

  public constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.predicate.keys(), // Note! When a key changes, then react
      () => {
        this.pagingParams = new PagingParams(); // reset Paging
        this.activityRegistry.clear(); // Clear Activities in memory
        this.loadActivities(); // Note! This will use the computed props
      }
    );
  }

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  setPredicate = (predicate: string, value: string | Date) => {
    // Note! Always retain the 'startDate' in the filtering
    const resetPredicate = () => {
      this.predicate.forEach((_, key) => {
        if (key !== "startDate") this.predicate.delete(key);
      });
    };

    switch (predicate) {
      case "all": // 'All Activities'
        resetPredicate();
        this.predicate.set("all", true);
        break;
      case "isGoing":
        resetPredicate();
        this.predicate.set("isGoing", true);
        break;
      case "isHost":
        resetPredicate();
        this.predicate.set("isHost", true);
        break;
      case "startDate":
        this.predicate.delete("startDate"); // Note! Delete and set a new so that 'observer' or 'reaction' will surely trigger
        this.predicate.set("startDate", value);
    }
  };

  // Computed Props
  get axiosParams() {
    const params = new URLSearchParams();
    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());

    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, (value as Date).toISOString());
      } else {
        params.append(key, value);
      }
    });

    return params;
  }

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
      const result = await agent.Activities.list(this.axiosParams); // PaginatedResult

      runInAction(() => {
        result.data.forEach((activity) => {
          this.setActivity(activity);
        });
        this.setPagination(result.pagination);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingInitial = false;
      });
    }
  };

  setPagination = (pagination: IPagination) => {
    this.pagination = pagination;
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
