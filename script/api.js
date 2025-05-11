const GITHUB_USERNAME = 'krupal-036';
const PROJECT_DETAILS = {
    'polyglotty': {
        demoUrl: 'https://polyglotty.vercel.app/'
    },
    // 'krupal-036': {
    //     demoUrl: null
    // },
    // 'another-repo-name': {
    //     demoUrl: 'https://my-demo-link.com'
    // }
};

const SELECTED_REPO_NAMES = Object.keys(PROJECT_DETAILS);

const projectsGrid = document.getElementById('projects-grid');
const projectsMessages = document.getElementById('projects-messages');

async function fetchGitHubRepos() {
    if (!projectsGrid) {
        console.error("Element with ID 'projects-grid' not found.");
        return { success: false, error: "DOM element missing" };
    }
    if (!projectsMessages) {
        console.warn("Element with ID 'projects-messages' not found. Warnings/errors might not be displayed.");
    }

    if (SELECTED_REPO_NAMES.length === 0) {
        clearLoadingMessage();
        displayMessage('info', 'No projects are configured to display. Update PROJECT_DETAILS in js/api.js.');
        return { success: true, count: 0 };
    }

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
        const results = await Promise.allSettled(fetchPromises);
        const successfulRepos = [];
        const failedRepos = [];

        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value && !result.value.error) {
                successfulRepos.push(result.value);
            } else {
                const repoName = result.reason?.name || result.value?.name || 'unknown';
                const status = result.reason?.status || result.value?.status || 'fetch error';
                failedRepos.push({ name: repoName, status: status });
                console.warn(`Failed to process repository: ${repoName} (Status: ${status})`);
            }
        });

        clearLoadingMessage();

        if (successfulRepos.length > 0) {
            displayRepos(successfulRepos);

            if (failedRepos.length > 0) {
                const failedNames = failedRepos.map(r => `'${r.name}'`).join(', ');
                displayMessage('warning', `Could not load details for the following repositories: ${failedNames}. Please check names, permissions (repo must be public), or API rate limits.`);
            }

            return { success: true, count: successfulRepos.length };

        } else {
            const failedNames = failedRepos.map(r => `'${r.name}'`).join(', ');
            displayMessage('error', `Could not load any of the configured projects (${failedNames}). Please check repository names, ensure they are public, and verify GitHub API access.`);
            console.error("Failed to fetch all selected repositories:", failedRepos);
            return { success: false, error: "All repositories failed to load", failed: failedRepos };
        }

    } catch (error) {
        console.error("An unexpected error occurred while processing repository data:", error);
        clearLoadingMessage();
        displayMessage('error', 'An unexpected error occurred while loading projects.');
        return { success: false, error: error.message };
    }
}

function clearLoadingMessage() {
    if (projectsGrid) {
        const loadingMsg = projectsGrid.querySelector('.loading-message');
        if (loadingMsg) {
            loadingMsg.remove();
        }
    }
    if (projectsMessages) {
        projectsMessages.innerHTML = '';
    }
}

function displayMessage(type, message) {
    if (projectsMessages) {
        const messageElement = document.createElement('p');
        messageElement.classList.add(`${type}-message`);
        messageElement.textContent = message;
        projectsMessages.appendChild(messageElement);
    } else {
        if (type === 'error') console.error("Project Message:", message);
        else console.warn("Project Message:", message);
    }
}


function displayRepos(repos) {
    repos.forEach(repo => {
        const card = document.createElement('div');
        card.classList.add('project-card', 'animate-on-scroll');

        const title = document.createElement('h3');
        title.textContent = repo.name
            .split(/[-_]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        card.appendChild(title);

        const description = document.createElement('p');
        description.classList.add('project-description');
        description.textContent = repo.description || 'No description provided. Visit GitHub for more details.';
        card.appendChild(description);

        if (repo.language) {
            const lang = document.createElement('span');
            lang.classList.add('repo-lang');
            lang.textContent = `${repo.language}`;
            card.appendChild(lang);
        }

        const linksContainer = document.createElement('div');
        linksContainer.classList.add('project-links');

        const githubLink = document.createElement('a');
        githubLink.href = repo.html_url;
        githubLink.innerHTML = '<i class="fab fa-github"></i> GitHub';
        githubLink.target = '_blank';
        githubLink.rel = 'noopener noreferrer';
        githubLink.classList.add('repo-link', 'github-link');
        githubLink.setAttribute('aria-label', `View ${title.textContent} on GitHub`);
        linksContainer.appendChild(githubLink);

        const repoConfig = PROJECT_DETAILS[repo.name];
        if (repoConfig && repoConfig.demoUrl) {
            const demoLink = document.createElement('a');
            demoLink.href = repoConfig.demoUrl;
            demoLink.innerHTML = 'Live Demo &nbsp; <i class="fas fa-external-link-alt"></i>';
            demoLink.target = '_blank';
            demoLink.rel = 'noopener noreferrer';
            demoLink.classList.add('repo-link', 'demo-link');
            demoLink.setAttribute('aria-label', `View live demo for ${title.textContent}`);
            linksContainer.appendChild(demoLink);
        }

        card.appendChild(linksContainer);

        projectsGrid.appendChild(card);

        gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                    once: true
                }
            }
        );
    });

}
