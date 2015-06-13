console.log("content.chrome.js");

// Inform the backgrund page that this tab should have a page-action
chrome.runtime.sendMessage({
	from: 'content',
	subject: 'showPageAction'
});

// Setup communication between chrome extension and tab
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.from === 'popup') {
		switch (message.subject) {
			case 'getDOM': {
				sendResponse(document.documentElement.outerHTML);
			} break;
			case 'getURL': {
				sendResponse(document.location.href);
			} break;
			default: {
				sendResponse(false);
			} break;
		}
	}
});