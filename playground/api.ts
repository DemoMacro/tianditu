import * as dotenv from "dotenv";
import { defineTianditu } from "../packages/api/src";

const config = dotenv.config() as {
  parsed: {
    TIANDITU_SERVER_KEY: string;
    TIANDITU_BROWSER_KEY: string;
  };
};

const tianditu = defineTianditu(config.parsed.TIANDITU_SERVER_KEY);
