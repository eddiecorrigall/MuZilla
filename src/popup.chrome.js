console.log("popup.chrome.js");

$(document).ready(function() {
	
	// query active page
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		
		var activeTab = tabs[0];
		alert('tab url: ' + activeTab.url);

		// send a request for the DOM info...

		alert('tab id: ' + activeTab.id);

		chrome.tabs.sendMessage(activeTab.id, { from: 'popup', subject: 'getDOM' }, function(response) {
			alert('msg: ' + response);
		});
	});
});
