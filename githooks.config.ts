import { defineGithooksConfig } from "@funish/githooks";

export default defineGithooksConfig({
  hooks: {
    "pre-commit": "pnpm build",
  },
  extends: ["@funish/githooks-config"],
});
