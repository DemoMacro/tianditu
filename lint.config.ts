import { defineLintConfig } from "@funish/lint";

export default defineLintConfig({
  staged: {
    "*": "pnpm build",
  },
});
