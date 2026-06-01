// ========= STATE GLOBAL =========
let currentLang = 'id';
let visibleProjects = 4;
let visibleGalleries = 4;

// ========= DOM ELEMENT REFERENCES =========
const loadingScreen = document.getElementById('loadingScreen');
const mainContent = document.getElementById('mainContent');
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const langToggle = document.getElementById('langToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const projectsGrid = document.getElementById('projectsGrid');
const galleryGrid = document.getElementById('galleryGrid');
const loadMoreProjectsBtn = document.getElementById('loadMoreProjectsBtn');
const loadMoreGalleryBtn = document.getElementById('loadMoreGalleryBtn');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');

// ========= THEME MANAGEMENT =========
function setTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.body.classList.remove('light');
        themeIcon.className = 'fas fa-moon';
    }
    localStorage.setItem('devAetherTheme', theme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('devAetherTheme');
    if (savedTheme === 'light') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light')) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
});

// ========= LANGUAGE MANAGEMENT =========
function applyLanguage() {
    const t = translations[currentLang];
    document.getElementById('loaderText').innerText = t.loaderText;
    document.getElementById('heroTagline').innerText = t.heroTagline;
    document.getElementById('aboutTitle').innerText = t.aboutTitle;
    document.getElementById('skillsTitle').innerText = t.skillsTitle;
    document.getElementById('contactTitle').innerText = t.contactTitle;
    const whatsappSpan = document.querySelector('#whatsappBtn span');
    if (whatsappSpan) whatsappSpan.innerText = t.whatsappText;
    document.getElementById('footerText').innerHTML = t.footerText;
    
    document.getElementById('aboutContent').innerHTML = `<p style="line-height: 1.7;">${t.aboutText1}</p><p style="margin-top: 1rem;">${t.aboutText2}</p>`;
    document.getElementById('projectsTitle').innerHTML = `${t.projectsTitle} <span id="projectCounter" class="counter-badge">${visibleProjects}/${allProjects.length}</span>`;
    document.getElementById('galleryTitle').innerHTML = `${t.galleryTitle} <span id="galleryCounter" class="counter-badge">${visibleGalleries}/${allGalleries.length}</span>`;
    
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (key && t[key]) {
            const span = el.querySelector('span');
            if (span) span.innerText = t[key];
        }
    });
    
    document.getElementById('langIndicator').innerText = currentLang.toUpperCase();
    
    const t2 = translations[currentLang];
    if (visibleProjects >= allProjects.length) {
        loadMoreProjectsBtn.disabled = true;
        document.getElementById('loadMoreProjectsText').innerText = t2.allProjectsLoaded;
    } else {
        loadMoreProjectsBtn.disabled = false;
        document.getElementById('loadMoreProjectsText').innerText = t2.loadMoreProjects;
    }
    
    if (visibleGalleries >= allGalleries.length) {
        loadMoreGalleryBtn.disabled = true;
        document.getElementById('loadMoreGalleryText').innerText = t2.allGalleryLoaded;
    } else {
        loadMoreGalleryBtn.disabled = false;
        document.getElementById('loadMoreGalleryText').innerText = t2.loadMoreGallery;
    }
    
    renderProjects();
    renderGallery();
}

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    applyLanguage();
});

// ========= RENDER FUNCTIONS =========
function renderSkills() {
    const container = document.getElementById('skillsGrid');
    container.innerHTML = '';
    skillsData.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `<i class="${skill.icon}" style="color:${skill.color}"></i> ${skill.name}`;
        container.appendChild(card);
    });
}

function renderProjects() {
    projectsGrid.innerHTML = '';
    for (let i = 0; i < visibleProjects; i++) {
        const proj = allProjects[i];
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${i * 0.05}s`;
        card.innerHTML = `
            <img class="project-img" src="${proj.img}" alt="${proj.title}" loading="lazy">
            <div class="project-info">
                <h3>${proj.title}</h3>
                <p>${proj.desc}</p>
                <a href="${proj.link}" target="_blank" class="project-link">
                    <span>${translations[currentLang].viewProject}</span> <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        projectsGrid.appendChild(card);
    }
    
    const counterSpan = document.getElementById('projectCounter');
    if (counterSpan) counterSpan.innerText = `${visibleProjects}/${allProjects.length}`;
    
    const t = translations[currentLang];
    if (visibleProjects >= allProjects.length) {
        loadMoreProjectsBtn.disabled = true;
        document.getElementById('loadMoreProjectsText').innerText = t.allProjectsLoaded;
    } else {
        loadMoreProjectsBtn.disabled = false;
        document.getElementById('loadMoreProjectsText').innerText = t.loadMoreProjects;
    }
}

function renderGallery() {
    galleryGrid.innerHTML = '';
    for (let i = 0; i < visibleGalleries; i++) {
        const gal = allGalleries[i];
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.style.animationDelay = `${i * 0.05}s`;
        
        const img = document.createElement('img');
        img.src = gal.img;
        img.alt = gal.title;
        img.className = 'gallery-img';
        img.loading = 'lazy';
        
        const info = document.createElement('div');
        info.className = 'gallery-info';
        info.innerHTML = `<p><i class="fas fa-expand-alt"></i> ${gal.title}</p>`;
        
        card.appendChild(img);
        card.appendChild(info);
        card.addEventListener('click', () => openModal(gal.img, gal.title));
        galleryGrid.appendChild(card);
    }
    
    const counterSpan = document.getElementById('galleryCounter');
    if (counterSpan) counterSpan.innerText = `${visibleGalleries}/${allGalleries.length}`;
    
    const t = translations[currentLang];
    if (visibleGalleries >= allGalleries.length) {
        loadMoreGalleryBtn.disabled = true;
        document.getElementById('loadMoreGalleryText').innerText = t.allGalleryLoaded;
    } else {
        loadMoreGalleryBtn.disabled = false;
        document.getElementById('loadMoreGalleryText').innerText = t.loadMoreGallery;
    }
}

// ========= LOAD MORE HANDLERS =========
loadMoreProjectsBtn.addEventListener('click', () => {
    if (visibleProjects < allProjects.length) {
        visibleProjects = Math.min(visibleProjects + 2, allProjects.length);
        renderProjects();
    }
});

loadMoreGalleryBtn.addEventListener('click', () => {
    if (visibleGalleries < allGalleries.length) {
        visibleGalleries = Math.min(visibleGalleries + 3, allGalleries.length);
        renderGallery();
    }
});

// ========= MODAL HANDLER =========
function openModal(src, title) {
    modal.style.display = 'flex';
    modalImg.src = src;
    modalCaption.innerText = title;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

document.querySelector('.close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
});

// ========= NAVBAR SCROLL & ACTIVE MENU =========
const sections = document.querySelectorAll('section');
const navLinkItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    let current = '';
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
            current = section.getAttribute('id');
        }
    });
    
    navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// ========= SMOOTH SCROLL =========
navLinkItems.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// ========= MOBILE MENU =========
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// ========= LOADING SCREEN =========
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        mainContent.style.opacity = '1';
    }, 1400);
});

// ========= INITIALIZATION =========
function init() {
    initTheme();
    renderSkills();
    renderProjects();
    renderGallery();
    applyLanguage();
}

init();
