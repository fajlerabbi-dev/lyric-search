"use strict";

var searchResult = document.querySelector('.search-result');
var api = {
  baseUrl: "https://api.lyrics.ovh/"
};
document.querySelector('.search-input').addEventListener('keypress', getQueryKeyPress);
document.querySelector('.search-input').addEventListener('click', getQueryClicked);

function getQueryClicked() {
  var searchInput = document.querySelector('.search-input').value;
  fetch("".concat(api.baseUrl, "/suggest/").concat(searchInput)).then(function (response) {
    return response.json();
  }).then(displayResult);
}

function getQueryKeyPress(e) {
  if (e.keyCode == 13) {
    var searchInput = document.querySelector('.search-input').value;
    fetch("".concat(api.baseUrl, "/suggest/").concat(searchInput)).then(function (response) {
      return response.json();
    }).then(displayResult);
  }
}

function displayResult(lyrics) {
  // console.log(lyric);
  console.log(lyrics.data);
  searchResult.innerHTML = '';

  for (var i = 0; i < 10; i++) {
    var lyric = lyrics.data[i];
    var output = '';
    output += "\n                <div class=\"single-result row align-items-center my-3 p-3\">\n                    <div class=\"col-md-9\">\n                        <h3 class=\"lyrics-name\">".concat(lyric.title, "</h3>\n                        <p class=\"author lead\">Album by <span class=\"album-name\">").concat(lyric.album.title, "</span></p>\n                    </div>\n                    <div class=\"col-md-3 text-md-right text-center\">\n                        <button data-artist=\"").concat(lyric.artist.name, "\" data-songtitle=\"").concat(lyric.title, "\" class=\"btn btn-success\">Get Lyrics</button>\n                    </div>\n                </div>\n                "); // // document.querySelector('.lyrics-name').innerText = lyric.title;
    // // document.querySelector('.album-name').innerText = lyric.album.title

    searchResult.innerHTML += output;
  }
}

searchResult.addEventListener('click', function (e) {
  var clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    var artistName = clickedEl.getAttribute('data-artist');
    var songTitle = clickedEl.getAttribute('data-songtitle');
    getLyrics(artistName, songTitle);
  }
});

function getLyrics(artistName, songTitle) {
  var searchInput = document.querySelector('.search-input').value;
  fetch("".concat(api.baseUrl, "/v1/").concat(artistName, "/").concat(songTitle, "/")).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);

    if (data.lyrics == '') {
      searchResult.innerHTML = "\n                            <h2 class=\"text-success text-center lyric-title mb-4\">Lyrics not found, please try again later</h2>\n                        ";
    } else {
      searchResult.innerHTML = "\n                        <div class=\"single-lyrics text-center\">\n                            <button class=\"btn go-back\">&lsaquo;</button>\n                            <h2 class=\"text-success lyric-title mb-4\">".concat(songTitle, "</h2>\n                            <pre class=\"lyric lyric-box text-white\">").concat(data.lyrics, "</pre>\n                        </div>\n                    ");
    }
  });
}