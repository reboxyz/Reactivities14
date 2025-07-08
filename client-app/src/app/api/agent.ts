import axios, { AxiosResponse } from "axios";
import { IActivity } from "../models/activity";
import { store } from "../stores/store";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

const DELAY: number = 1000;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(undefined, (error) => {
  console.log(error);

  // Note! Network Error checking should be performed first before anything
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error - make sure API is running!");
  }

  const { status, config, data } = error.response;

  if (status === 404) {
    store.navigateStore.setNavigateToRoute("/notfound");
  }

  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    store.navigateStore.setNavigateToRoute("/notfound");
  }

  if (status === 500) {
    toast.error("Server error - check the terminal for more info!");
  }
});

// Note! Currying pattern
const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) => axios.get(url).then(sleep(DELAY)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(DELAY)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(DELAY)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(DELAY)).then(responseBody),
};

const Activities = {
  list: (): Promise<IActivity[]> => requests.get("/activities"),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
};

export default {
  Activities,
};
