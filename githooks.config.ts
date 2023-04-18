import { defineGithooksConfig } from "@funish/githooks";

export default defineGithooksConfig({
  hooks: {
    "pre-applypatch": "pnpm build",
  },
  extends: ["@funish/githooks-config"],
});
