console.log("popup.chrome.js");

$(document).ready(function() {

	$(document.body).css({
		'width': 'auto',
		'height': 'auto'
	});

	// Query active page...

	$(".album").hide();

	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

		var activeTab = tabs[0];
		//alert('tab url: ' + activeTab.url);
		//alert('tab id: ' + activeTab.id);

		/*
		chrome.tabs.sendMessage(activeTab.id, { from: 'popup', subject: 'getDOM' }, function(response) {
			alert('msg: ' + response);
		});

		chrome.tabs.sendMessage(activeTab.id, { from: 'popup', subject: 'getURL' }, function(response) {
			alert('msg: ' + response);
		});
		*/

		// ##### TOM - extract color
		activeTab.color = "309070";

		// ##### PETER - Fetch album info
		getAlbumForColor(activeTab.color, activeTab.url, function(error, data) {

			if (error) {
				console.error(error);
				return;
			}

			$('#loader').hide();
			$(".album").fadeIn();

			$('#album_image').attr('src', data.art_url);
			$('#album_artist').text(data.artist);
			$('#album_title').text(data.name);
			$('#album_info').text('Todo...');
		});
	});
});
