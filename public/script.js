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

function webkitGo(urls) {
  const { application, store } = urls;

  document.location.replace(application);
  setTimeout(() => (document.location = store), 250);
}

function iFrameGo(urls) {
  const { application, store } = urls;
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
    setTimeout(function () {
      window.location = store;
    }, 250);
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
    AppLink = onErrorGoTo,
    PlayStoreLink = onErrorGoTo,
    IosStoreLink = onErrorGoTo,
  } = options;

  if (!(isAndroid() || isIOS())) {
    return window.location.replace(onErrorGoTo);
  }

  const type = isAndroid() ? ANDROID : IOS;
  const urls = {
    application: AppLink,
    store: isAndroid() ? PlayStoreLink : IosStoreLink,
  };

  go(type, urls);
}

if (typeof module !== "undefined") {
  module.exports = yourDeepLink;
}
