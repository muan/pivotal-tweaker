var settings = new Store("settings", {
  "tagOn": true,
  "dropdownOn": true,
  "effectOn": true,
  "showUnassigned": true,
  "requesters": false
});

chrome.extension.onMessage.addListener(
  function(request, sender, sendMessage) {
    sendMessage(settings.toObject());
  }
);

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-21332781-8']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
