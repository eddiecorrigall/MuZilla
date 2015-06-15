console.log("popup.chrome.js");

function getCommonColor(doc) {

	var allColors = {};
	var allElements = $(doc.getElementsByTagName('*'));

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

		// Background...

		var backgroundColor = $(this).css('background-color');
		backgroundColor = tinycolor(backgroundColor);
		if (fontColor.isValid() === false) return;
		backgroundColor = backgroundColor.toHexString();
		backgroundColor = backgroundColor.toLowerCase();

		if (!(backgroundColor in allColors)) {
			allColors[backgroundColor] = 0;
		}

		allColors[backgroundColor]++;
	});

	var theColor = Object.keys(allColors)[0];
	var theColorCount = allColors[theColor];

	allColors.each(function(k, v) {
		if (theColorCount < v) {
			theColorCount = v;
			theColor = k;
		}
	});
}

$(document).ready(function() {

	function play() {
		$('#album_mode')
			.attr('src', '../assets/play.png')
			.addClass('play')
			.removeClass('pause')
			;
	}

	function pause() {
		$('#album_mode')
			.attr('src', '../assets/pause.png')
			.addClass('pause')
			.removeClass('play')
			;
	}

	$(document.body).css({
		'width': 'auto',
		'height': 'auto'
	});

	// Query active page...

	$('#loader').fadeIn();
	$('#album').hide();

	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

		var activeTab = tabs[0];
		//alert('tab url: ' + activeTab.url);
		//alert('tab id: ' + activeTab.id);

		/*
		chrome.tabs.sendMessage(activeTab.id, { from: 'popup', subject: 'getURL' }, function(response) {
			alert('msg: ' + response);
		});
		*/

		chrome.tabs.sendMessage(activeTab.id, { from: 'popup', subject: 'getCommonColor' }, function(hexColor) {

			$('.popup').css('background-color', hexColor);
			$('#color').text(hexColor);

			getAlbumForColor(hexColor.substring(1), activeTab.url, function(error, data) {

				if (error) {
					console.error(error);
					return;
				}

				$('#loader').hide();
				$('#album').fadeIn('slow');

				play();

				$('#album_cover').attr('src', data.art_url);
				$('#album_artist').text(data.artist);
				$('#album_title').text(data.name);
			});
		});
	});
});
