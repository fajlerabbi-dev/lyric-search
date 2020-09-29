const searchResult = document.querySelector('.search-result');
const api = {
    baseUrl: "https://api.lyrics.ovh"
}
document.querySelector('.search-input').addEventListener('keypress', getQueryKeyPress);
document.querySelector('.search-btn').addEventListener('click', getQueryClicked);

function getQueryClicked() {
    const searchInput = document.querySelector('.search-input').value;
    fetch(`${api.baseUrl}/suggest/${searchInput}`)
        .then(response => response.json())
        .then(displayResult)
}

function getQueryKeyPress(e) {
    if (e.keyCode == 13) {
        const searchInput = document.querySelector('.search-input').value;
        fetch(`${api.baseUrl}/suggest/${searchInput}`)
            .then(response => response.json())
            .then(displayResult)
    }
}



function displayResult(lyrics) {
    searchResult.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const lyric = lyrics.data[i];

        let output = '';
        output += `
                <div class="single-result row align-items-center my-3 p-3">
                    <div class="col-md-9">
                        <h3 class="lyrics-name">${lyric.title}</h3>
                        <p class="author lead">Album by <span class="album-name">${lyric.album.title}</span></p>
                    </div>
                    <div class="col-md-3 text-md-right text-center">
                        <button data-artist="${lyric.artist.name}" data-songtitle="${lyric.title}" class="btn btn-success">Get Lyrics</button>
                    </div>
                </div>
                `;
        searchResult.innerHTML += output;
    }
}

searchResult.addEventListener('click', function (e) {
    const clickedEl = e.target;
    if (clickedEl.tagName === 'BUTTON') {
        const artistName = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');

        getLyrics(artistName, songTitle);
    }
})

function getLyrics(artistName, songTitle) {
    const searchInput = document.querySelector('.search-input').value;

    fetch(`${api.baseUrl}/v1/${artistName}/${songTitle}/`)
        .then(response => response.json())
        .then(data => {
            if (data.lyrics == '') {
                searchResult.innerHTML = `
                            <h2 class="text-success text-center lyric-title mb-4">Lyrics not found, please try again later</h2>
                        `;
            } else {
                searchResult.innerHTML = `
                        <div class="single-lyrics text-center">
                            <button class="btn go-back">&lsaquo;</button>
                            <h2 class="text-success lyric-title mb-4">${songTitle}</h2>
                            <pre class="lyric lyric-box text-white">${data.lyrics}</pre>
                        </div>
                    `;
            }
        })
}
