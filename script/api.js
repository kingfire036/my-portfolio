const GITHUB_USERNAME = 'krupal-036';
const PROJECT_DETAILS = {
    'polyglotty-translator-n-speech': {
        demoUrl: 'https://polyglotty.vercel.app/'
    },
    // 'krupal-036': {
    //     demoUrl: null 
    // }
};

const SELECTED_REPO_NAMES = Object.keys(PROJECT_DETAILS);

const projectsGrid = document.getElementById('projects-grid');

async function fetchGitHubRepos() {
    if (!projectsGrid) {
        console.error("Element with ID 'projects-grid' not found.");
        return;
    }

    if (SELECTED_REPO_NAMES.length === 0) {
        projectsGrid.innerHTML = `<p class="info-message">No projects configured to display.</p>`;
        return;
    }

    projectsGrid.innerHTML = `<p class="loading-message">Loading selected projects...</p>`;

    const fetchPromises = SELECTED_REPO_NAMES.map(repoName => {
        const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`;
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    console.error(`Failed to fetch repository '${repoName}': ${response.status} ${response.statusText}`);
                    return { error: true, name: repoName, status: response.status };
                }
                return response.json();
            })
            .catch(error => {
                console.error(`Network error fetching repository '${repoName}':`, error);
                return { error: true, name: repoName, message: error.message };
            });
    });

    try {
        const results = await Promise.all(fetchPromises);

        const successfulRepos = results.filter(result => result && !result.error);
        const failedRepos = results.filter(result => result && result.error);

        if (failedRepos.length > 0) {
            console.warn("Some repositories failed to load:", failedRepos);
        }

        if (successfulRepos.length > 0) {
            displayRepos(successfulRepos);
            if (failedRepos.length > 0) {
                const failedNames = failedRepos.map(r => r.name).join(', ');
                const warningElement = document.createElement('p');
                warningElement.classList.add('warning-message');
                warningElement.textContent = `Warning: Could not load details for the following repositories: ${failedNames}. Please check names and permissions.`;
                projectsGrid.insertAdjacentElement('afterend', warningElement);
            }
        } else if (SELECTED_REPO_NAMES.length > 0) {
            projectsGrid.innerHTML = `<p class="error-message">Could not load any selected projects. Please check repository names and ensure they are public.</p>`;
            console.error("Failed to fetch all selected repositories:", failedRepos);
        }

    } catch (error) {
        console.error("An unexpected error occurred while processing repository data:", error);
        projectsGrid.innerHTML = `<p class="error-message">An unexpected error occurred while loading projects.</p>`;
    }
}

function displayRepos(repos) {
    projectsGrid.innerHTML = '';

    repos.forEach(repo => {
        const card = document.createElement('div');
        card.classList.add('project-card', 'animate-on-scroll');

        const title = document.createElement('h3');
        title.textContent = repo.name
            .split(/[-_]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        const description = document.createElement('p');
        description.textContent = repo.description || 'No description provided.';

        const lang = document.createElement('span');
        lang.classList.add('repo-lang');
        lang.textContent = `Language: ${repo.language || 'N/A'}`;

        const linksContainer = document.createElement('div');
        linksContainer.classList.add('project-links');

        const githubLink = document.createElement('a');
        githubLink.href = repo.html_url;
        githubLink.textContent = 'View on GitHub';
        githubLink.target = '_blank';
        githubLink.rel = 'noopener noreferrer';
        githubLink.classList.add('repo-link', 'github-link');

        linksContainer.appendChild(githubLink);

        const repoDetails = PROJECT_DETAILS[repo.name];
        if (repoDetails && repoDetails.demoUrl) {
            const demoLink = document.createElement('a');
            demoLink.href = repoDetails.demoUrl;
            demoLink.textContent = 'Live Demo';
            demoLink.target = '_blank';
            demoLink.rel = 'noopener noreferrer';
            demoLink.classList.add('repo-link', 'demo-link');

            linksContainer.appendChild(demoLink);
        }

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(lang);
        card.appendChild(linksContainer);

        projectsGrid.appendChild(card);
    });

}

fetchGitHubRepos();
