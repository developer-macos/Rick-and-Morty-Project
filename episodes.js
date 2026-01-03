const grid = document.getElementById("episodesGrid");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const searchInput = document.getElementById("searchInput");
const seasonSelect = document.getElementById("seasonSelect");

let allEpisodes = [];
let visibleCount = 12;

async function fetchAllEpisodes() {
    let page = 1;
    let finished = false;

    while (!finished) {
        const res = await fetch(`https://rickandmortyapi.com/api/episode?page=${page}`);
        const data = await res.json();

        allEpisodes = allEpisodes.concat(data.results);

        if (!data.info.next) finished = true;
        page++;
    }

    renderEpisodes();
}

function renderEpisodes(reset = true) {
    if (reset) {
        grid.innerHTML = "";
        visibleCount = 12;
    }

    let filtered = allEpisodes;

    // Name filter
    if (searchInput.value) {
        filtered = filtered.filter(ep =>
            ep.name.toLowerCase().includes(searchInput.value.toLowerCase())
        );
    }

    // Season filter (S02, S03, S04)
    if (seasonSelect.value) {
        filtered = filtered.filter(ep =>
            ep.episode.startsWith(seasonSelect.value)
        );
    }

    filtered.slice(0, visibleCount).forEach(ep => {
        const card = document.createElement("div");
        card.className = "episode-card";

        card.innerHTML = `
            <img src="https://rickandmortyapi.com/api/character/avatar/1.jpeg">
            <div class="episode-info">
                <h4>${ep.name}</h4>
                <div>Season ${ep.episode.slice(1, 3)}</div>
                <div>${ep.air_date}</div>
            </div>
        `;

        grid.appendChild(card);
    });

    loadMoreBtn.style.display =
        visibleCount < filtered.length ? "block" : "none";
}

loadMoreBtn.addEventListener("click", () => {
    visibleCount += 12;
    renderEpisodes(false);
});

searchInput.addEventListener("input", () => renderEpisodes());
seasonSelect.addEventListener("change", () => renderEpisodes());

fetchAllEpisodes();
