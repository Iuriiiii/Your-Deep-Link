function userAgent() {
  return window.navigator.userAgent;
}

function isAndroid() {
  return /Android/i.test(userAgent());
}

function isIOS() {
  return /iPhone|iPad|iPod/i.test(userAgent());
}

function isSafari() {
  return (
    userAgent().match(/Safari/) && userAgent().match(/Version\/(9|10|11|12)/)
  );
}

function isCriOS() {
  return userAgent().match(/CriOS/i);
}

function isChrome() {
  return userAgent().match(/Chrome/i);
}

function isFirefox() {
  return userAgent().match(/Firefox/i);
}

function debug(message) {
  document.body.append(message);
  document.body.append(document.createElement("br"));
}

function tryToGo(urls) {
  const { application, store, error } = urls;

  document.location = application;
  setTimeout(() => {
    document.location = store;

    setTimeout(() => (document.location = error), 3000);
  }, 250);
}

function webkitGo(urls) {
  tryToGo(urls);
}

function iFrameGo(urls) {
  const { application } = urls;
  const iFrameElement = document.createElement("iframe");
  iFrameElement.style.border = "none";
  iFrameElement.style.width = "1px";
  iFrameElement.style.height = "1px";

  iFrameElement.addEventListener(
    "load",
    () => (document.location = application)
  );
  iFrameElement.src = application;

  window.addEventListener("load", () => {
    document.body.appendChild(iFrameElement);
    setTimeout(() => tryToGo(urls), 250);
  });
}

const ANDROID = 0;
const IOS = 1;

function go(type, urls) {
  switch (type) {
    case ANDROID:
      if (isChrome() || isFirefox()) {
        return webkitGo(urls);
      }

      break;
    case IOS:
      if (isCriOS() || isSafari()) {
        return webkitGo(urls);
      }
  }
  return iFrameGo(urls);
}

function yourDeepLink(options) {
  const { onErrorGoTo } = options;
  const {
    appLink = onErrorGoTo,
    playStoreLink = onErrorGoTo,
    iosStoreLink = onErrorGoTo,
  } = options;

  if (!(isAndroid() || isIOS())) {
    return window.location.replace(onErrorGoTo);
  }

  const type = isAndroid() ? ANDROID : IOS;
  const urls = {
    application: appLink,
    store: isAndroid() ? playStoreLink : iosStoreLink,
    error: onErrorGoTo,
  };

  go(type, urls);
}

if (typeof module !== "undefined") {
  module.exports = yourDeepLink;
}
