import axios, { AxiosError, AxiosResponse } from "axios";
import { IActivity } from "../models/activity";
import { store } from "../stores/store";
import { toast } from "react-toastify";
import { IUser, IUserFormValues } from "../models/user";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

const DELAY: number = 1000;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  console.log(error);

  // Note! Network Error checking should be performed first before anything
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error - make sure API is running!");
  }

  //const { status, config, data } = error.response;
  const {
    data,
    status,
    config,
    headers,
  }: { data: any; status: number; config: any; headers: any } = error.response!;

  switch (status) {
    case 400:
      if (typeof data === "string") {
        toast.error(data); // String data
      }

      if (config.method === "get" && data.errors.hasOwnProperty("id")) {
        store.navigateStore.setNavigateToRoute("/notfound");
      }

      if (data.errors) {
        const modalStateErrors = [];
        for (const key in data.errors) {
          if (data.errors[key]) {
            modalStateErrors.push(data.errors[key]);
          }
        }
        //console.log("modalStateErrors before flattened:", modalStateErrors);
        throw modalStateErrors.flat();
      }

      break;

    case 404:
      store.navigateStore.setNavigateToRoute("/notfound");
      break;

    case 500:
      toast.error("Server error - check the terminal for more info!");
      break;
  }

  return Promise.reject(error);
});

// Note! Currying pattern
const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: <T>(url: string) =>
    axios.get<T>(url).then(sleep(DELAY)).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(sleep(DELAY)).then(responseBody),
  put: <T>(url: string, body: {}) =>
    axios.put<T>(url, body).then(sleep(DELAY)).then(responseBody),
  del: <T>(url: string) =>
    axios.delete<T>(url).then(sleep(DELAY)).then(responseBody),
};

const Activities = {
  list: () => requests.get<IActivity[]>("/activities"),
  details: (id: string) => requests.get<IActivity>(`/activities/${id}`),
  create: (activity: IActivity) => requests.post<void>("/activities", activity),
  update: (activity: IActivity) =>
    requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
};

const Account = {
  current: () => requests.get<IUser>("/account"),
  login: (user: IUserFormValues) =>
    requests.post<IUser>("/account/login", user),
  register: (user: IUserFormValues) =>
    requests.post<IUser>("/account/register", user),
};

export default {
  Activities,
  Account,
};
