import { version } from "../../package.json";

export function getAppVersionLabel() {
  return `v${version}`;
}
