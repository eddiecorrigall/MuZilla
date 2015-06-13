$(document).ready(function() {
	// query active page
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		// send a request for the DOM info...
		var url = tabs[0].url;
		alert(url);
	});
});
