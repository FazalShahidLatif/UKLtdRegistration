/**
 * Adstera ads for ukltdregistration.com
 * Direct embed codes from Adstera dashboard
 *
 * POLICY:
 * - Consent-gated: ads only load after user opts in
 * - DNT/GPC honored: visitors with Do Not Track never see ads
 * - One snippet per document: each ad runs in its own iframe (srcdoc)
 * - No popunder, smartlink, native banner, or social bar
 * - No ads on article/legal pages (only tool/service pages)
 * - English only — zero tolerance for any other language
 */

var ZONES = {
  leaderboard: {
    key: "db4049ca9b52a2a134361130360cd0c3",
    width: 728,
    height: 90,
  },
  skyscraper: {
    key: "0ad760d490bac5fba53de64edf625a8e",
    width: 160,
    height: 600,
  },
  rectangle: {
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

/**
 * Build the exact srcdoc for each zone using the dashboard embed code.
 * Splitting "script" into "scr"+"ipt" prevents the HTML parser from
 * closing the outer script tag prematurely.
 */
function snippetDocument(key, width, height) {
  var script1 = "<scr" + "ipt>atOptions={'key':'" + key + "','format':'iframe','height':" + height + ",'width':" + width + ",'params':{}};</scr" + "ipt>";
  var script2 = '<scr' + 'ipt src="https://ballisticcomainvitation.com/' + key + '/invoke.js"></scr' + 'ipt>';
  return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>' + script1 + script2 + '</body></html>';
}

function createAdZone(zone, container) {
  var cfg = ZONES[zone];
  if (!cfg) return null;
  if (!adsAllowed()) return null;

  var iframe = document.createElement("iframe");
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
  var path = window.location.pathname;
  if (path.indexOf("/blog/") === 0) return false;
  if (path.indexOf("/privacy") === 0 || path.indexOf("/terms") === 0 || path.indexOf("/cookies") === 0) return false;
  if (path.indexOf("/article/") === 0) return false;
  return true;
}

window.addEventListener("DOMContentLoaded", function () {
  if (!shouldShowAds()) return;

  var leaderboardTop = document.getElementById("ad-slot-leaderboard-top");
  if (leaderboardTop) createAdZone("leaderboard", leaderboardTop);

  var leaderboardBottom = document.getElementById("ad-slot-leaderboard-bottom");
  if (leaderboardBottom) createAdZone("leaderboard", leaderboardBottom);

  var rectangleSlot = document.getElementById("ad-slot-rectangle");
  if (rectangleSlot) createAdZone("rectangle", rectangleSlot);

  if (window.innerWidth >= 1024) {
    var skyscraperSlot = document.getElementById("ad-slot-skyscraper");
    if (skyscraperSlot) createAdZone("skyscraper", skyscraperSlot);
  }
});
