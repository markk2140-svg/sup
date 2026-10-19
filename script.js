const githubUsername = "markk2140-svg";
const repoGrid = document.querySelector("#repo-grid");
const currentYear = document.querySelector("#current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

function addRepository(repository) {
    const card = document.createElement("a");
    card.className = "repo-card";
    card.href = repository.html_url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const top = document.createElement("span");
    top.className = "repo-card-top";

    const name = document.createElement("span");
    name.className = "repo-name";
    name.textContent = repository.name;

    const arrow = document.createElement("span");
    arrow.className = "repo-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    top.append(name, arrow);

    const description = document.createElement("span");
    description.className = "repo-description";
    description.textContent = repository.description || "No description provided.";

    const meta = document.createElement("span");
    meta.className = "repo-meta";

    const language = document.createElement("span");
    language.textContent = repository.language || "Repository";

    const stars = document.createElement("span");
    stars.textContent = `★ ${repository.stargazers_count}`;
    meta.append(language, stars);
    card.append(top, description, meta);
    repoGrid.append(card);
}

async function loadRepositories() {
    if (!repoGrid) return;

    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6&type=owner`);
        if (!response.ok) throw new Error("Repository request failed");

        const repositories = await response.json();
        repoGrid.replaceChildren();

        if (repositories.length === 0) {
            const empty = document.createElement("p");
            empty.className = "repo-status";
            empty.textContent = "No public repositories are available yet. Visit the GitHub profile for updates.";
            repoGrid.append(empty);
            return;
        }

        repositories.forEach(addRepository);
    } catch {
        const status = document.createElement("p");
        status.className = "repo-status";
        status.textContent = "Repositories could not load right now. View them on GitHub instead.";

        const profile = document.createElement("a");
        profile.className = "text-link";
        profile.href = `https://github.com/${githubUsername}`;
        profile.target = "_blank";
        profile.rel = "noopener noreferrer";
        profile.textContent = "Open GitHub profile ↗";
        repoGrid.replaceChildren(status, profile);
    }
}

loadRepositories();
