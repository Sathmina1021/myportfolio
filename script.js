// ─── Page Loader (Bulletproof Fix) ──────────────────
// DOM එක load වුණ ගමන් loader එක අයින් කරනවා (images load වෙනකම් ඉන්නේ නෑ)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) loader.classList.add('hidden');
    }, 1500);
});

// Fallback: මොනවා හරි අවුලක් ගිහින් හිරවුණොත් තත්පර 3කින් අනිවාර්යයෙන් loader එක අයින් කරනවා
setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
    }
}, 3000);

// ─── AOS Init ───────────────────────────────────────
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 900,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic'
    });
}

// ─── Typing Effect ───────────────────────────────────
if (document.querySelector('.typing-text') && typeof Typed !== 'undefined') {
    new Typed(".typing-text", {
        strings: [
            "Software Engineer.",
            "Full Stack Developer.",
            "Java & Spring Boot.",
            "React Developer."
        ],
        typeSpeed: 65,
        backSpeed: 35,
        backDelay: 1800,
        loop: true
    });
}

// ─── Navbar Scroll Effect ────────────────────────────
const nav = document.getElementById('navbar');
window.addEventListener("scroll", () => {
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ─── Hamburger Menu ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });
}

// ─── Smooth Scroll ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── Active Nav Link Highlight ───────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav ul li a');

if (sections.length > 0 && navLinks.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.style.color = '');
                const activeLink = document.querySelector(`nav ul li a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.style.color = 'var(--text-main)';
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(section => observer.observe(section));
}

// ─── GitHub API Integration ──────────────────────────
const GITHUB_USERNAME = 'Sathmina1021';
const GITHUB_API      = `https://api.github.com/users/${GITHUB_USERNAME}`;
const REPOS_API       = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`;

const LANG_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python':     '#3572A5',
    'Java':       '#b07219',
    'Dart':       '#00B4AB',
    'PHP':        '#4F5D95',
    'CSS':        '#563d7c',
    'HTML':       '#e34c26',
    'C#':         '#178600',
    'Kotlin':     '#A97BFF',
    'Swift':      '#F05138',
    'Go':         '#00ADD8',
    'Rust':       '#dea584',
    'Shell':      '#89e051',
};

function getLangColor(lang) {
    return LANG_COLORS[lang] || '#8b949e';
}

function timeAgo(dateStr) {
    const date = new Date(dateStr);
    const now  = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60)       return 'just now';
    if (diff < 3600)     return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400)    return Math.floor(diff / 3600) + 'h ago';
    if (diff < 2592000)  return Math.floor(diff / 86400) + 'd ago';
    if (diff < 31536000) return Math.floor(diff / 2592000) + 'mo ago';
    return Math.floor(diff / 31536000) + 'yr ago';
}

async function loadGitHubData() {
    try {
        const [profileRes, reposRes] = await Promise.all([
            fetch(GITHUB_API),
            fetch(REPOS_API)
        ]);

        if (profileRes.ok) {
            const profile = await profileRes.json();
            
            const statRepos = document.getElementById('statRepos');
            const statFollowers = document.getElementById('statFollowers');
            if (statRepos) statRepos.textContent = profile.public_repos ?? '—';
            if (statFollowers) statFollowers.textContent = profile.followers ?? '—';

            const ghAvatar   = document.getElementById('ghAvatar');
            const ghName     = document.getElementById('ghName');
            const ghUsername = document.getElementById('ghUsername');
            const ghBio      = document.getElementById('ghBio');
            const ghRepos    = document.getElementById('ghRepos');
            const ghFollowers = document.getElementById('ghFollowers');
            const ghFollowing = document.getElementById('ghFollowing');

            if (ghAvatar && profile.avatar_url) ghAvatar.src = profile.avatar_url;
            if (ghName)     ghName.textContent    = profile.name || GITHUB_USERNAME;
            if (ghUsername) ghUsername.textContent = `@${profile.login}`;
            if (ghBio)      ghBio.textContent     = profile.bio || 'Software Engineer';
            if (ghRepos)    ghRepos.textContent   = profile.public_repos ?? '—';
            if (ghFollowers) ghFollowers.textContent = profile.followers ?? '—';
            if (ghFollowing) ghFollowing.textContent = profile.following ?? '—';

            const heroImg = document.querySelector('.hero-img-container img');
            if (heroImg && profile.avatar_url) {
                heroImg.src = profile.avatar_url;
            }
        }

        if (reposRes.ok) {
            const repos = await reposRes.json();
            const grid  = document.getElementById('ghReposGrid');
            if (!grid) return;

            const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
            const ghStars    = document.getElementById('ghStars');
            if (ghStars) ghStars.textContent = totalStars;

            const starChip = document.getElementById('starCount');
            if (starChip) starChip.textContent = totalStars;

            const filtered = repos.filter(r => !r.fork).slice(0, 9);

            if (filtered.length === 0) {
                grid.innerHTML = `
                    <div class="gh-error">
                        <i class="fas fa-code-branch"></i>
                        <p>No public repositories found yet.</p>
                    </div>`;
                return;
            }

            grid.innerHTML = filtered.map(repo => `
                <a href="${repo.html_url}" target="_blank" class="gh-repo-card">
                    <div class="gh-repo-header">
                        <div class="gh-repo-name">
                            <i class="fas fa-book"></i>
                            ${repo.name}
                        </div>
                        <span class="gh-repo-visibility">${repo.private ? 'Private' : 'Public'}</span>
                    </div>
                    ${repo.description
                        ? `<p class="gh-repo-desc">${repo.description}</p>`
                        : `<p class="gh-repo-desc" style="font-style:italic;opacity:.5;">No description</p>`
                    }
                    <div class="gh-repo-footer">
                        ${repo.language ? `
                            <span class="gh-repo-lang">
                                <span class="lang-dot" style="background:${getLangColor(repo.language)}"></span>
                                ${repo.language}
                            </span>` : ''}
                        ${repo.stargazers_count > 0 ? `
                            <span class="gh-repo-stars">
                                <i class="fas fa-star" style="color:#e3b341;font-size:.8rem;"></i>
                                ${repo.stargazers_count}
                            </span>` : ''}
                        ${repo.forks_count > 0 ? `
                            <span class="gh-repo-forks">
                                <i class="fas fa-code-branch" style="font-size:.75rem;"></i>
                                ${repo.forks_count}
                            </span>` : ''}
                        <span class="gh-repo-updated">${timeAgo(repo.updated_at)}</span>
                    </div>
                </a>
            `).join('');
        } else {
            showRepoError();
        }

    } catch (err) {
        console.warn('GitHub API error:', err);
        showRepoError();
    }
}

function showRepoError() {
    const grid = document.getElementById('ghReposGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="gh-error">
                <i class="fab fa-github"></i>
                <p>Could not load repositories. <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" style="color:var(--primary-light);">View on GitHub →</a></p>
            </div>`;
    }
}

loadGitHubData();

// ─── Number Counter Animation (Fixed Bug Here) ────────
function animateCounter(el, target, duration = 1200) {
    if (!el) return;
    let start = null; // Error fixed (Was 'const start = 0')
    const step  = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}