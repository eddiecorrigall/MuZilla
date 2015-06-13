var legalColors = [
    [0, 0, 0], [0, 0, 51], [0, 0, 255], [0, 51, 0], [0, 51, 102], [0, 51, 153], [0, 102, 153], [0, 153, 51], [0, 153, 153],
    [0, 153, 255], [0, 204, 204], [0, 255, 0], [0, 255, 153], [51, 0, 0], [51, 0, 102], [51, 51, 0], [51, 51, 51], [51, 102, 102],
    [51, 204, 51], [51, 255, 255], [102, 0, 51], [102, 0, 102], [102, 0, 153], [102, 51, 0], [102, 102, 51], [102, 102, 102], [102, 102, 255],
    [102, 153, 0], [102, 204, 153], [153, 0, 102], [153, 0, 204], [153, 51, 0], [153, 51, 255], [153, 102, 0], [153, 153, 153], [153, 153, 255],
    [153, 204, 51], [153, 204, 255], [153, 255, 0], [153, 255, 153], [153, 255, 204], [204, 0, 255], [204, 51, 0], [204, 51, 102], [204, 153, 0],
    [204, 153, 153], [204, 153, 255], [204, 204, 102], [204, 204, 204], [204, 204, 255], [204, 255, 153], [204, 255, 204], [204, 255, 255], [255, 0, 51],
    [255, 0, 204], [255, 102, 204], [255, 153, 0], [255, 153, 153], [255, 153, 204], [255, 204, 0], [255, 204, 153], [255, 204, 204], [255, 255, 51],
    [255, 255, 153], [255, 255, 204], [255, 255, 255]
];

function padToTwo(number) {
  if (number <= 99) { number = ("00" + number).slice(-2); }
  return number;
}

function nearestLegalColorTo(providedColor) {
    var providedR = parseInt(providedColor[0] + providedColor[1], 16);
    var providedG = parseInt(providedColor[2] + providedColor[3], 16);
    var providedB = parseInt(providedColor[4] + providedColor[5], 16);

    var bestDistance = 99999;
    var bestCandidate = null;

    for (var i = 0; i < legalColors.length; i++) {
        var legalColorCandidate = legalColors[i];
        var distance = (
            Math.abs(legalColorCandidate[0] - providedR) +
            Math.abs(legalColorCandidate[1] - providedG) +
            Math.abs(legalColorCandidate[2] - providedB)
        );
        if (distance < bestDistance) {
            bestDistance = distance;
            bestCandidate = legalColorCandidate;
        }
    }

    return padToTwo(bestCandidate[0].toString(16)) + padToTwo(bestCandidate[1].toString(16)) + padToTwo(bestCandidate[2].toString(16));
}

function getAlbumForColor(providedColor, url, callback) {
    var color = nearestLegalColorTo(providedColor);
    var PROXYURL = "https://muzilla-mmhto2015.herokuapp.com/";
    var APIURL = "http://colorhits.com/search?c=" + color.toUpperCase() + "&c2=&c3=&g=0&p=1";
    console.log("Searching for color " + color + " (nearest to " + providedColor + ")...");
    $.get(PROXYURL + APIURL, function(data, status) {
        if (data.indexOf('No results found') !== -1) {
            callback("No results found for color.");
            return;
        }

        var returnedDOM = $(data);
        var results = returnedDOM.find('.resultItem a');
        var albumATag = results[(url.length % results.length)];
        var albumDetailPageLink = albumATag.pathname;
        var albumArt = returnedDOM.find('img').attr('src');
        $.get(PROXYURL + "http://colorhits.com" + albumDetailPageLink, function(data, status) {
            var returnedDOM = $(data);
            var artistName = returnedDOM.find('p.artistName').html();
            var albumName = returnedDOM.find('p.albumName').html();
            var iTunesLink = returnedDOM.find("#albumMenu a:first").href;
            callback(null, {
                'name': albumName,
                'artist': artistName,
                'art_url': albumArt,
                'link': iTunesLink,
            });
        });
    });
}
