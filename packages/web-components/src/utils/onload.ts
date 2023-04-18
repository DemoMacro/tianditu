export function onload(callback: () => void) {
  if (document.readyState === "complete") {
    callback();
  } else {
    globalThis.addEventListener("load", callback);
  }
}
