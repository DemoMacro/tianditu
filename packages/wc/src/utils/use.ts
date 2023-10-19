export function filterProps(props: object) {
  return Object.keys(props).reduce((acc, key) => {
    if (props[key] !== undefined) {
      acc[key] = props[key];
    }
    return acc;
  }, {});
}

export function onload(callback: () => void) {
  if (document.readyState === "complete") {
    callback();
  } else {
    globalThis.addEventListener("load", callback);
  }
}
