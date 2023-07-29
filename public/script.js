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
  }, 51);
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
  const { fallbackLink } = options;
  const {
    appLink = fallbackLink,
    playStoreLink = fallbackLink,
    iosStoreLink = fallbackLink,
    desktopLink = fallbackLink,
  } = options;
  const isPhone = isAndroid() || isIOS();

  if (!isPhone) {
    return window.location.replace(desktopLink);
  }

  const type = isAndroid() ? ANDROID : IOS;
  const urls = {
    application: appLink,
    store: isAndroid() ? playStoreLink : iosStoreLink,
    error: fallbackLink,
  };

  go(type, urls);
}

if (typeof module !== "undefined") {
  module.exports = yourDeepLink;
}
