import { StateType } from "typesafe-actions";
import services from "./services";
import * as store from "./store/index";
import { actions } from "./store/root-action";
import rootReducer from "./store/root-reducer";

declare module "redux-observable" {
  export type Store = StateType<typeof store>;
  export type RootState = StateType<ReturnType<typeof rootReducer>>;
  export type RootAction = RootActionType<typeof actions>;
  export type Services = typeof services;
}
