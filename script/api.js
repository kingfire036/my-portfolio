const GITHUB_USERNAME = 'krupal-036';
const SELECTED_REPO_NAMES = [
    'polyglotty-translator-n-speech',

];

const projectsGrid = document.getElementById('projects-grid');

async function fetchGitHubRepos() {
    projectsGrid.innerHTML = `<p class="loading-message">Loading selected projects...</p>`;

    const fetchPromises = SELECTED_REPO_NAMES.map(repoName => {
        const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`;
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    console.error(`Failed to fetch repository '${repoName}': ${response.status} ${response.statusText}`);
                    return null;
                }
                return response.json();
            })
            .catch(error => {
                console.error(`Network error fetching repository '${repoName}':`, error);
                return null;
            });
    });

    try {
        const results = await Promise.all(fetchPromises);

        const successfulRepos = results.filter(repo => repo !== null);

        if (successfulRepos.length > 0) {
            displayRepos(successfulRepos);
        } else if (SELECTED_REPO_NAMES.length > 0) {
            projectsGrid.innerHTML = `<p class="error-message">Could not load selected projects. Please check repository names and ensure they are public.</p>`;
            console.error("Failed to fetch any of the selected repositories:", SELECTED_REPO_NAMES);
        } else {
            projectsGrid.innerHTML = `<p class="info-message">No projects selected to display.</p>`;
        }

    } catch (error) {
        console.error("An unexpected error occurred while fetching repositories:", error);
        projectsGrid.innerHTML = `<p class="error-message">An unexpected error occurred while loading projects.</p>`;
    }
}

function displayRepos(repos) {
    projectsGrid.innerHTML = '';

    repos.forEach(repo => {
        const card = document.createElement('div');
        card.classList.add('project-card', 'animate-on-scroll');

        const title = document.createElement('h3');
        title.textContent = repo.name.replace(/[-_]/g, ' ');

        const description = document.createElement('p');
        description.textContent = repo.description || 'No description provided.';

        const link = document.createElement('a');
        link.href = repo.html_url;
        link.textContent = 'View on GitHub';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.classList.add('repo-link');

        const lang = document.createElement('span');
        lang.classList.add('repo-lang');
        lang.textContent = `Language: ${repo.language || 'N/A'}`;
        //  add stars/forks: repo.stargazers_count, repo.forks_count

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(lang);
        card.appendChild(link);

        projectsGrid.appendChild(card);
    });

}
