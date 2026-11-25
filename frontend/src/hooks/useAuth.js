import { useSyncExternalStore } from "react";
import { getAuthName, getAuthToken, subscribeAuth } from "../services/api";

export function useAuth() {
  const token = useSyncExternalStore(subscribeAuth, getAuthToken);
  const name = useSyncExternalStore(subscribeAuth, getAuthName);

  return { isLoggedIn: Boolean(token), name };
}
