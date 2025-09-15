import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { IChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
  comments: IChatComment[] = [];
  hubConnection: HubConnection | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = (activityId: string) => {
    const chatURL: string = import.meta.env.VITE_REACT_APP_CHAT_URL;

    if (store.activityStore.activity) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${chatURL}?activityId=${activityId}`, {
          accessTokenFactory: () => store.userStore.user?.token!,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      this.hubConnection
        .start()
        .catch((error) =>
          console.log("Error establishing hub connection: ", error)
        );

      this.hubConnection.on("LoadComments", (comments: IChatComment[]) => {
        runInAction(() => {
          comments.forEach((comment) => {
            comment.createdAt = new Date(comment.createdAt + "Z"); // Force to be UTC
          });
          this.comments = comments;
        });
      });

      this.hubConnection.on("ReceiveComment", (comment: IChatComment) => {
        runInAction(() => {
          comment.createdAt = new Date(comment.createdAt);
          this.comments.unshift(comment); // Note! Position the comment as the first element
        });
      });
    }
  };

  stopHubConnection = () => {
    this.hubConnection
      ?.stop()
      .catch((error) => console.log("Error stopping hub connection: ", error));
  };

  clearComments = () => {
    this.comments = [];
    this.stopHubConnection();
  };

  addComment = async (values: any) => {
    try {
      values.activityId = store.activityStore.activity?.id;
      await this.hubConnection?.invoke("SendComment", values); // Note! Hub "SendComment" is the method to be invoked on the Server via the Hub
    } catch (error) {
      console.log(error);
    }
  };
}
