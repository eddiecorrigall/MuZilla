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
			case 'getHTML': {
				sendResponse(document.documentElement.outerHTML); // document.documentElement.outerHTML
			} break;
			case 'getURL': {
				sendResponse(document.location.href);
			} break;
			case 'getCommonColor': {

				var allColors = {};
				var allElements = $(document.getElementsByTagName('*'));

				allElements.each(function() {
					
					// Font...

					var fontColor = $(this).css('color');
					fontColor = tinycolor(fontColor);
					if (fontColor.isValid() === false) return;
					fontColor = fontColor.toHexString();
					fontColor = fontColor.toLowerCase();

					if (!(fontColor in allColors)) {
						allColors[fontColor] = 0;
					}

					allColors[fontColor]++;

					/*
					// Background...

					var backgroundColor = $(this).css('background-color');
					backgroundColor = tinycolor(backgroundColor);
					if (backgroundColor.isValid() === false) return;
					backgroundColor = backgroundColor.toHexString();
					backgroundColor = backgroundColor.toLowerCase();

					if (!(backgroundColor in allColors)) {
						allColors[backgroundColor] = 0;
					}

					allColors[backgroundColor]++;
					*/
				});

				var theColor = Object.keys(allColors)[0];
				var theColorCount = allColors[theColor];
				
				$.each(allColors, function(k, v) {
					if (theColorCount < v) {
						theColorCount = v;
						theColor = k;
					}
				});
				
				sendResponse(theColor);
			} break;
		}
	}
});