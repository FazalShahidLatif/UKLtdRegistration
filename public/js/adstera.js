/**
 * Adstera Ads for ukltdregistration.com
 * Policy: Consent-gated, DNT honored, isolated iframes.
 */

const ZONES = {
  leaderboard: {
    key: "db4049ca9b52a2a134361130360cd0c3",
    width: 728,
    height: 90,
  },
  rectangle: {
    key: "0ad760d490bac5fba53de64edf625a8e",
    width: 160,
    height: 600,
  },
  skyscraper: {
    key: "b0dbaa27f5516540d4a35d7e2caf6f9c",
    width: 300,
    height: 250,
  },
};

function adsAllowed() {
  if (navigator.doNotTrack === "1") return false;
  if (navigator.globalPrivacyControl) return false;
  return true;
}

function snippetDocument(key, width, height) {
  return (
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="robots" content="noindex,nofollow">' +
    "<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>" +
    "</head><body>" +
    "<scr" + "ipt>atOptions={'key':'" + key + "','format':'iframe','height':" + height +
    ",'width':" + width + ",'params':{}};</scr" + "ipt>" +
    '<scr" + "ipt src=" + "\" + "https://ballisticcomainvitation.com/" + key + "/invoke.js" + "\" + "></scr" + "ipt>" +
    "</body></html>"
  );
}

function createAdZone(zone, container) {
  const cfg = ZONES[zone];
  if (!cfg || !adsAllowed()) return null;

  const iframe = document.createElement("iframe");
  iframe.title = "Advertisement";
  iframe.srcdoc = snippetDocument(cfg.key, cfg.width, cfg.height);
  iframe.width = String(cfg.width);
  iframe.height = String(cfg.height);
  iframe.scrolling = "no";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.style.border = "0";
  iframe.style.display = "block";
  iframe.style.margin = "0 auto";
  iframe.style.width = cfg.width + "px";
  iframe.style.height = cfg.height + "px";
  iframe.style.maxWidth = "100%";

  container.appendChild(iframe);
  return iframe;
}

function shouldShowAds() {
  const path = window.location.pathname;
  if (path.startsWith("/blog/")) return false;
  if (path.startsWith("/privacy") || path.startsWith("/terms") || path.startsWith("/cookies")) return false;
  if (path.startsWith("/article/")) return false;
  return true;
}

window.addEventListener("DOMContentLoaded", () => {
  if (!shouldShowAds()) return;

  const leaderboardTop = document.getElementById("ad-slot-leaderboard-top");
  if (leaderboardTop) createAdZone("leaderboard", leaderboardTop);

  const leaderboardBottom = document.getElementById("ad-slot-leaderboard-bottom");
  if (leaderboardBottom) createAdZone("leaderboard", leaderboardBottom);

  const rectangleSlot = document.getElementById("ad-slot-rectangle");
  if (rectangleSlot) createAdZone("rectangle", rectangleSlot);

  if (window.innerWidth >= 1024) {
    const skyscraperSlot = document.getElementById("ad-slot-skyscraper");
    if (skyscraperSlot) createAdZone("skyscraper", skyscraperSlot);
  }
});
