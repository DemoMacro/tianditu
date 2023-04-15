import { createStorage } from "unstorage";
import localStorageDriver from "unstorage/drivers/localstorage";

export const storage = createStorage({
  driver: localStorageDriver({ base: "tianditu:" }),
});
