chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('src/index.html', {
		bounds: {
			width: 1400,
			height: 800,
			left: 0,
			top: 0
		}
	});
});