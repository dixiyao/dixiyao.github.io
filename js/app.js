// Main Application JavaScript
(async function() {
    'use strict';
    
    // Configuration
    let config = {};
    let homeData = {};
    let publicationsData = {};
    let projectsData = {};
    let blogData = {};
    let petsData = {};
    
    // Initialize marked for markdown rendering
    marked.setOptions({
        breaks: true,
        gfm: true
    });
    
    // Load JSON data
    async function loadData() {
        try {
            const cacheBuster = '?v=' + Date.now();
            [config, homeData, publicationsData, projectsData, blogData, petsData] = await Promise.all([
                fetch('data/config.json' + cacheBuster).then(r => r.json()),
                fetch('data/home.json' + cacheBuster).then(r => r.json()),
                fetch('data/publications.json' + cacheBuster).then(r => r.json()),
                fetch('data/projects.json' + cacheBuster).then(r => r.json()),
                fetch('data/blog.json' + cacheBuster).then(r => r.json()),
                fetch('data/pets.json' + cacheBuster).then(r => r.json())
            ]);
            
            await renderPage();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
    
    // Render the entire page
    async function renderPage() {
        renderNavigation();
        renderHero();
        renderHome();
        renderPublications();
        renderProjects();
        await renderBlog();
        renderPets();
        updateFooter();
        // Render sidebar after content is rendered so it can find all IDs
        renderSidebar();
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
            initCollapsibleSections();
        }, 100);
    }
    
    // Render Sidebar Navigation
    function renderSidebar() {
        const sidebarMenu = document.getElementById('sidebarMenu');
        if (!sidebarMenu) return;
        
        let html = '';
        
        // Home section (collapsible with subsections)
        if (homeData.research || homeData.about || homeData.academia || homeData.honors || homeData.teaching || homeData.personalLife) {
            html += `<div class="sidebar-menu-item">`;
            html += `<button class="sidebar-menu-toggle" data-toggle="home-subsections">`;
            html += `<span>Home</span>`;
            html += `<span class="toggle-icon">▶</span>`;
            html += `</button>`;
            html += `<div class="sidebar-submenu" id="home-subsections">`;
            if (homeData.research) {
                html += `<div class="sidebar-submenu-item">`;
                html += `<a href="#home" class="sidebar-submenu-link" data-section="research">Research</a>`;
                html += `</div>`;
            }
            if (homeData.about) {
                html += `<div class="sidebar-submenu-item">`;
                html += `<a href="#home" class="sidebar-submenu-link" data-section="about">About Me</a>`;
                html += `</div>`;
            }
            if (homeData.academia) {
                html += `<div class="sidebar-submenu-item">`;
                html += `<a href="#home" class="sidebar-submenu-link" data-section="academia">Academia</a>`;
                html += `</div>`;
            }
            if (homeData.honors) {
                html += `<div class="sidebar-submenu-item">`;
                html += `<a href="#home" class="sidebar-submenu-link" data-section="honors">Honors</a>`;
                html += `</div>`;
            }
            if (homeData.teaching) {
                html += `<div class="sidebar-submenu-item">`;
                html += `<a href="#home" class="sidebar-submenu-link" data-section="teaching">Teaching</a>`;
                html += `</div>`;
            }
            if (homeData.personalLife) {
                html += `<div class="sidebar-submenu-item">`;
                html += `<a href="#home" class="sidebar-submenu-link" data-section="personalLife">Personal Life</a>`;
                html += `</div>`;
            }
            html += `</div>`;
            html += `</div>`;
        } else {
            html += `<div class="sidebar-menu-item">`;
            html += `<a href="#home" class="sidebar-menu-link" data-section="home">Home</a>`;
            html += `</div>`;
        }
        
        // Publications section (collapsible with categories)
        if (publicationsData.categories && publicationsData.categories.length > 0) {
            html += `<div class="sidebar-menu-item">`;
            html += `<button class="sidebar-menu-toggle" data-toggle="publications-subsections">`;
            html += `<span>Publications</span>`;
            html += `<span class="toggle-icon">▶</span>`;
            html += `</button>`;
            html += `<div class="sidebar-submenu" id="publications-subsections">`;
            publicationsData.categories.forEach(category => {
                html += `<div class="sidebar-submenu-item">`;
                html += `<a href="#publications" class="sidebar-submenu-link" data-category="${category.name}">${category.name}</a>`;
                html += `</div>`;
                
                // Subcategories
                if (category.subcategories && category.subcategories.length > 0) {
                    category.subcategories.forEach(subcat => {
                        html += `<div class="sidebar-submenu-item" style="padding-left: 3rem;">`;
                        html += `<a href="#publications" class="sidebar-submenu-link" data-subcategory="${subcat.name}">${subcat.name}</a>`;
                        html += `</div>`;
                    });
                }
            });
            html += `</div>`;
            html += `</div>`;
        } else {
            html += `<div class="sidebar-menu-item">`;
            html += `<a href="#publications" class="sidebar-menu-link" data-section="publications">Publications</a>`;
            html += `</div>`;
        }
        
        // Projects section (collapsible with project sections)
        if (projectsData.sections && projectsData.sections.length > 0) {
            html += `<div class="sidebar-menu-item">`;
            html += `<button class="sidebar-menu-toggle" data-toggle="projects-subsections">`;
            html += `<span>Projects</span>`;
            html += `<span class="toggle-icon">▶</span>`;
            html += `</button>`;
            html += `<div class="sidebar-submenu" id="projects-subsections">`;
            projectsData.sections.forEach(section => {
                html += `<div class="sidebar-submenu-item">`;
                html += `<a href="#projects" class="sidebar-submenu-link" data-project-section="${section.title}">${section.title}</a>`;
                html += `</div>`;
            });
            html += `</div>`;
            html += `</div>`;
        } else {
            html += `<div class="sidebar-menu-item">`;
            html += `<a href="#projects" class="sidebar-menu-link" data-section="projects">Projects</a>`;
            html += `</div>`;
        }
        
        // Blog section
        html += `<div class="sidebar-menu-item">`;
        html += `<a href="#blog" class="sidebar-menu-link" data-section="blog">Blogs</a>`;
        html += `</div>`;
        
        // Pets section
        html += `<div class="sidebar-menu-item">`;
        html += `<a href="#pets" class="sidebar-menu-link" data-section="pets">Pets</a>`;
        html += `</div>`;
        
        sidebarMenu.innerHTML = html;
        
        // Initialize sidebar toggle
        initSidebarToggle();
        initSidebarSubmenuToggles();
        
        // Initialize click handlers immediately after rendering
        initSidebarClickHandlers();
        
        // Initialize scroll spy after a short delay to ensure DOM is ready
        setTimeout(() => {
            initSidebarScrollSpy();
        }, 100);
    }
    
    // Initialize sidebar collapse/expand
    function initSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarExpandBtn = document.getElementById('sidebarExpandBtn');
        const sidebarNav = document.getElementById('sidebarNav');
        const mainContent = document.getElementById('mainContent');
        
        const toggleSidebar = () => {
            sidebarNav.classList.toggle('collapsed');
            mainContent.classList.toggle('sidebar-collapsed');
        };
        
        if (sidebarToggle && sidebarNav && mainContent) {
            sidebarToggle.addEventListener('click', toggleSidebar);
        }
        
        if (sidebarExpandBtn && sidebarNav && mainContent) {
            sidebarExpandBtn.addEventListener('click', toggleSidebar);
        }
    }
    
    // Initialize submenu toggles
    function initSidebarSubmenuToggles() {
        const toggles = document.querySelectorAll('.sidebar-menu-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.getAttribute('data-toggle');
                const submenu = document.getElementById(targetId);
                if (submenu) {
                    submenu.classList.toggle('expanded');
                    toggle.classList.toggle('expanded');
                }
            });
        });
    }
    
    // Initialize click handlers for sidebar navigation
    function initSidebarClickHandlers() {
        const links = document.querySelectorAll('.sidebar-menu-link, .sidebar-submenu-link');
        
        links.forEach(link => {
            // Add click event listener directly (remove any existing first by using once or checking)
            link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const href = this.getAttribute('href');
                    const dataSection = this.getAttribute('data-section');
                    const dataCategory = this.getAttribute('data-category');
                    const dataSubcategory = this.getAttribute('data-subcategory');
                    const dataProjectSection = this.getAttribute('data-project-section');
                    
                    let target = null;
                    let targetId = null;
                    
                    // Priority: specific data attributes > href
                    if (dataSection === 'home') {
                        // Home section - scroll to top of home content
                        target = document.getElementById('home') || document.getElementById('homeContent') || document.getElementById('homeContentWrapper');
                    } else if (dataSection === 'publications') {
                        // Publications section
                        target = document.getElementById('publications') || document.getElementById('publicationsContent');
                    } else if (dataSection === 'projects') {
                        // Projects section
                        target = document.getElementById('projects') || document.getElementById('projectsContent');
                    } else if (dataSection === 'blog') {
                        // Blog section
                        target = document.getElementById('blog') || document.getElementById('blogContent');
                    } else if (dataSection === 'pets') {
                        // Pets section
                        target = document.getElementById('pets') || document.getElementById('petsContent');
                    } else if (dataSection && dataSection !== 'home' && dataSection !== 'publications' && dataSection !== 'projects' && dataSection !== 'blog') {
                        // Home subsections (academia, honors, teaching, personalLife, about, research)
                        // Try original case first (for camelCase IDs like personalLife)
                        target = document.getElementById(dataSection) || document.getElementById(dataSection + '-heading');
                        
                        // If not found, try lowercase version
                        if (!target) {
                            targetId = dataSection.toLowerCase().replace(/\s+/g, '-');
                            target = document.getElementById(targetId) || document.getElementById(targetId + '-heading');
                        }
                        
                        // If research, also check heroResearch
                        if (!target && dataSection === 'research') {
                            target = document.getElementById('heroResearch') || document.getElementById('research');
                        }
                        
                        // If not found by ID, search in homeContent by heading text
                        if (!target) {
                            const homeContent = document.getElementById('homeContentWrapper');
                            if (homeContent) {
                                const headings = homeContent.querySelectorAll('h1, h2, div[id]');
                                headings.forEach(heading => {
                                    const headingId = heading.id || heading.getAttribute('id');
                                    const headingText = heading.textContent.trim().toLowerCase();
                                    const normalizedSection = dataSection.toLowerCase().replace(/\s+/g, '-');
                                    
                                    // Try exact match first (case-sensitive)
                                    if (headingId === dataSection || 
                                        headingId === dataSection + '-heading' ||
                                        headingId === normalizedSection || 
                                        headingId === normalizedSection + '-heading' ||
                                        headingText.includes(dataSection.toLowerCase()) ||
                                        (heading.tagName === 'DIV' && (headingId === dataSection || headingId === normalizedSection))) {
                                        target = heading;
                                    }
                                });
                            }
                        }
                        
                        // Also check in hero section for research
                        if (!target && dataSection === 'research') {
                            const heroSection = document.getElementById('heroResearch');
                            if (heroSection) {
                                target = heroSection;
                            }
                        }
                    } else if (dataCategory) {
                        // Publication categories - normalize the category name (same as in renderPublications)
                        targetId = dataCategory.toLowerCase().replace(/\s+/g, '-');
                        target = document.getElementById(targetId) || document.getElementById(targetId + '-heading');
                        // If still not found, try to find the h2 with the category name
                        if (!target) {
                            const publicationsContent = document.getElementById('publicationsContent');
                            if (publicationsContent) {
                                const headings = publicationsContent.querySelectorAll('h2');
                                headings.forEach(h2 => {
                                    const h2Text = h2.textContent.trim().toLowerCase();
                                    const categoryText = dataCategory.toLowerCase();
                                    if (h2Text === categoryText || h2.id === targetId || h2.id === targetId + '-heading') {
                                        target = h2;
                                    }
                                });
                            }
                        }
                    } else if (dataSubcategory) {
                        // Publication subcategories - normalize the subcategory name (same as in renderPublications)
                        targetId = dataSubcategory.toLowerCase().replace(/\s+/g, '-');
                        target = document.getElementById(targetId);
                        // If not found, try to find the h3 with the subcategory name
                        if (!target) {
                            const publicationsContent = document.getElementById('publicationsContent');
                            if (publicationsContent) {
                                const headings = publicationsContent.querySelectorAll('h3');
                                headings.forEach(h3 => {
                                    const h3Text = h3.textContent.trim().toLowerCase();
                                    const subcatText = dataSubcategory.toLowerCase();
                                    if (h3Text === subcatText || h3.id === targetId) {
                                        target = h3;
                                    }
                                });
                            }
                        }
                    } else if (dataProjectSection) {
                        // Project sections - normalize the section name (same as in renderProjects)
                        targetId = dataProjectSection.toLowerCase().replace(/\s+/g, '-');
                        target = document.getElementById(targetId) || document.getElementById(targetId + '-heading');
                        // If not found, try to find the h3 with the section name
                        if (!target) {
                            const projectsContent = document.getElementById('projectsContent');
                            if (projectsContent) {
                                const headings = projectsContent.querySelectorAll('h3');
                                headings.forEach(h3 => {
                                    const h3Text = h3.textContent.trim().toLowerCase();
                                    const sectionText = dataProjectSection.toLowerCase();
                                    if (h3Text === sectionText || h3.id === targetId || h3.id === targetId + '-heading') {
                                        target = h3;
                                    }
                                });
                            }
                        }
                    } else if (href && href.startsWith('#')) {
                        // Fallback to href
                        target = document.querySelector(href);
                    }
                    
                    if (target) {
                        // Scroll to target with offset for fixed navbar and sidebar
                        const offset = 120;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                        window.scrollTo({
                            top: Math.max(0, targetPosition),
                            behavior: 'smooth'
                        });
                        
                        // Update active state
                        const allLinks = document.querySelectorAll('.sidebar-menu-link, .sidebar-submenu-link');
                        allLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                        
                        console.log('Navigation successful:', { 
                            target: target.id || target.tagName, 
                            dataSection, 
                            dataCategory, 
                            dataSubcategory, 
                            dataProjectSection 
                        });
                    } else {
                        // Final fallback: search all elements with IDs in homeContent
                        const searchTerm = dataSection || dataCategory || dataSubcategory || dataProjectSection;
                        if (searchTerm) {
                            const normalized = searchTerm.toLowerCase().replace(/\s+/g, '-');
                            const homeContent = document.getElementById('homeContentWrapper');
                            if (homeContent) {
                                const allElements = homeContent.querySelectorAll('[id]');
                                allElements.forEach(el => {
                                    if (el.id === normalized || el.id === normalized + '-heading') {
                                        target = el;
                                    }
                                });
                            }
                            
                            // Also search in all content
                            if (!target) {
                                const allElements = document.querySelectorAll('[id]');
                                allElements.forEach(el => {
                                    if (el.id === normalized || el.id === normalized + '-heading') {
                                        target = el;
                                    }
                                });
                            }
                            
                            if (target) {
                                const offset = 120;
                                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                                window.scrollTo({
                                    top: Math.max(0, targetPosition),
                                    behavior: 'smooth'
                                });
                                const allLinks = document.querySelectorAll('.sidebar-menu-link, .sidebar-submenu-link');
                                allLinks.forEach(l => l.classList.remove('active'));
                                this.classList.add('active');
                            } else {
                                console.warn('Navigation target not found:', { 
                                    dataSection, 
                                    dataCategory, 
                                    dataSubcategory, 
                                    dataProjectSection, 
                                    href,
                                    searchingFor: normalized,
                                    availableIds: Array.from(document.querySelectorAll('[id]')).map(el => el.id).slice(0, 20)
                                });
                            }
                        }
                    }
                });
        });
    }
    
    // Initialize scroll spy for active navigation
    function initSidebarScrollSpy() {
        const links = document.querySelectorAll('.sidebar-menu-link, .sidebar-submenu-link');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                if (entry.isIntersecting) {
                    links.forEach(link => {
                        link.classList.remove('active');
                        const linkSection = link.getAttribute('data-section') || 
                                         link.getAttribute('data-category') || 
                                         link.getAttribute('data-subcategory') ||
                                         link.getAttribute('data-project-section');
                        if (linkSection) {
                            const normalizedId = linkSection.toLowerCase().replace(/\s+/g, '-');
                            if (entry.target.id === normalizedId || entry.target.id === normalizedId + '-heading') {
                                link.classList.add('active');
                            }
                        }
                    });
                }
            });
        }, observerOptions);
        
        // Observe all sections with IDs
        document.querySelectorAll('section[id], div[id], h1[id], h2[id], h3[id]').forEach(section => {
            observer.observe(section);
        });
    }
    
    // Render Navigation
    function renderNavigation() {
        const navMenu = document.getElementById('navMenu');
        if (!navMenu) return;
        
        navMenu.innerHTML = config.navigation.map(item => 
            `<li><a href="${item.url}">${item.name}</a></li>`
        ).join('');
        
        // Mobile menu toggle
        const navToggle = document.getElementById('navToggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }
    
    // Render Hero Section
    function renderHero() {
        // Render profile in navigation
        const navProfileImg = document.getElementById('navProfileImage');
        const navTitle = document.getElementById('navTitle');
        const navSubtitle = document.getElementById('navSubtitle');
        const navSocialLinks = document.getElementById('navSocialLinks');
        
        if (navProfileImg && config.site.profilePicture) {
            navProfileImg.src = config.site.profilePicture;
            navProfileImg.onerror = function() {
                console.error('Failed to load profile image:', config.site.profilePicture);
            };
        }
        
        if (navTitle) {
            navTitle.textContent = config.site.title;
        }
        
        if (navSubtitle) {
            navSubtitle.textContent = config.site.subtitle;
        }
        
        if (navSocialLinks) {
            navSocialLinks.innerHTML = config.social.map(social => {
                // Handle Google Scholar with custom SVG
                if (social.icon && (social.icon.includes('google-scholar') || social.title === 'Google Scholar')) {
                    return `<a href="${social.url}" target="_blank" rel="noopener noreferrer" title="${social.title}" class="social-link-gs">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                        </svg>
                    </a>`;
                }
                return `<a href="${social.url}" target="_blank" rel="noopener noreferrer" title="${social.title}">
                    <i class="${social.icon}"></i>
                </a>`;
            }).join('');
        }
        
        // Render research content in hero section
        const heroResearch = document.getElementById('heroResearch');
        if (heroResearch && homeData.research) {
            heroResearch.id = 'research'; // Add ID for navigation
            heroResearch.innerHTML = `
                <h2 class="section-title collapsible-heading" id="research-heading">
                    <span class="collapsible-arrow" style="margin-right: 0.5rem;">▼</span>
                    ${homeData.research.title}
                </h2>
                <div class="content-wrapper">
                    <div class="collapsible-content markdown-content">${DOMPurify.sanitize(marked.parse(homeData.research.content))}</div>
                </div>
            `;
            
            // Add click handler for research section
            const researchHeading = heroResearch.querySelector('.collapsible-heading');
            const researchContent = heroResearch.querySelector('.collapsible-content');
            if (researchHeading && researchContent) {
                researchHeading.addEventListener('click', () => {
                    researchHeading.classList.toggle('collapsed');
                    researchContent.classList.toggle('collapsed');
                    const arrow = researchHeading.querySelector('.collapsible-arrow');
                    if (arrow) {
                        arrow.innerHTML = researchHeading.classList.contains('collapsed') ? '▶' : '▼';
                    }
                });
            }
        }
    }
    
    // Render Home Content
    function renderHome() {
        const wrapper = document.getElementById('homeContentWrapper');
        if (!wrapper) return;
        
        let html = '';
        
        // About Section
        if (homeData.about) {
            html += `<div class="section-content" id="about">`;
            html += `<h1 class="collapsible-heading" id="about-heading">${homeData.about.title}<span class="collapsible-arrow">▼</span></h1>`;
            html += `<div class="collapsible-content">`;
            html += `<div class="markdown-content">${DOMPurify.sanitize(marked.parse(homeData.about.content))}</div>`;
            html += `</div></div>`;
        }
        
        // Academia Section
        if (homeData.academia) {
            html += `<div class="section-content" id="academia">`;
            html += `<h1 class="collapsible-heading" id="academia-heading">${homeData.academia.title}<span class="collapsible-arrow">▼</span></h1>`;
            html += `<div class="collapsible-content">`;
            
            if (homeData.academia.reviewer) {
                html += `<h2>Reviewer</h2>`;
                html += `<div class="markdown-content">${DOMPurify.sanitize(marked.parse(homeData.academia.reviewer.content))}</div>`;
                
                if (homeData.academia.reviewer.conferences) {
                    html += `<h3>Conferences</h3>`;
                    html += `<div class="markdown-content">`;
                    Object.keys(homeData.academia.reviewer.conferences).reverse().forEach(year => {
                        html += `<p><strong>${year}:</strong> ${homeData.academia.reviewer.conferences[year].join(', ')}</p>`;
                    });
                    html += `</div>`;
                }
                
                if (homeData.academia.reviewer.journals) {
                    html += `<h3>Journals</h3>`;
                    html += `<div class="markdown-content">`;
                    html += `<p>${homeData.academia.reviewer.journals.join(', ')}</p>`;
                    html += `</div>`;
                }
            }
            
            if (homeData.academia.workExperience) {
                html += `<h2>Work Experience</h2>`;
                if (homeData.academia.workExperience.fullTime && homeData.academia.workExperience.fullTime.length > 0) {
                    html += `<h3>Full Time</h3>`;
                    html += `<ul>${homeData.academia.workExperience.fullTime.map(item => 
                        `<li>${DOMPurify.sanitize(marked.parse(item))}</li>`
                    ).join('')}</ul>`;
                }
                if (homeData.academia.workExperience.partTime && homeData.academia.workExperience.partTime.length > 0) {
                    html += `<h3>Part Time</h3>`;
                    html += `<ul>${homeData.academia.workExperience.partTime.map(item => 
                        `<li>${DOMPurify.sanitize(marked.parse(item))}</li>`
                    ).join('')}</ul>`;
                }
            }
            
            if (homeData.academia.talks && homeData.academia.talks.length > 0) {
                html += `<h2>Talks</h2>`;
                html += `<ul>${homeData.academia.talks.map(talk => 
                    `<li>${DOMPurify.sanitize(marked.parse(talk))}</li>`
                ).join('')}</ul>`;
            }
            
            if (homeData.academia.appointments && homeData.academia.appointments.length > 0) {
                html += `<h2>Appointments</h2>`;
                html += `<ul>${homeData.academia.appointments.map(appointment => 
                    `<li>${DOMPurify.sanitize(marked.parse(appointment))}</li>`
                ).join('')}</ul>`;
            }
            
            html += `</div></div>`;
        }
        
        // Honors Section
        if (homeData.honors) {
            html += `<div class="section-content" id="honors">`;
            html += `<h1 class="collapsible-heading" id="honors-heading">${homeData.honors.title}<span class="collapsible-arrow">▼</span></h1>`;
            html += `<div class="collapsible-content">`;
            
            if (homeData.honors.awards) {
                html += `<h2>Awards</h2>`;
                html += `<ul>${homeData.honors.awards.map(award => 
                    `<li>${DOMPurify.sanitize(marked.parse(award))}</li>`
                ).join('')}</ul>`;
            }
            
            if (homeData.honors.scholarships) {
                html += `<h2>Scholarships</h2>`;
                if (homeData.honors.scholarships.graduate && homeData.honors.scholarships.graduate.length > 0) {
                    html += `<h3>Graduate</h3>`;
                    html += `<ul>${homeData.honors.scholarships.graduate.map(scholarship => 
                        `<li>${DOMPurify.sanitize(marked.parse(scholarship))}</li>`
                    ).join('')}</ul>`;
                }
                if (homeData.honors.scholarships.undergraduate && homeData.honors.scholarships.undergraduate.length > 0) {
                    html += `<h3>Undergraduate</h3>`;
                    html += `<ul>${homeData.honors.scholarships.undergraduate.map(scholarship => 
                        `<li>${DOMPurify.sanitize(marked.parse(scholarship))}</li>`
                    ).join('')}</ul>`;
                }
                if (homeData.honors.scholarships.travelGrants && homeData.honors.scholarships.travelGrants.length > 0) {
                    html += `<h3>Travel Grants</h3>`;
                    html += `<ul>${homeData.honors.scholarships.travelGrants.map(grant => 
                        `<li>${DOMPurify.sanitize(marked.parse(grant))}</li>`
                    ).join('')}</ul>`;
                }
            }
            
            if (homeData.honors.fundings && homeData.honors.fundings.length > 0) {
                html += `<h2>Funding</h2>`;
                html += `<ul>${homeData.honors.fundings.map(funding => 
                    `<li>${DOMPurify.sanitize(marked.parse(funding))}</li>`
                ).join('')}</ul>`;
            }
            
            html += `</div></div>`;
        }
        
        // Teaching Section
        if (homeData.teaching) {
            html += `<div class="section-content" id="teaching">`;
            html += `<h1 class="collapsible-heading" id="teaching-heading">${homeData.teaching.title}<span class="collapsible-arrow">▼</span></h1>`;
            html += `<div class="collapsible-content">`;
            
            if (homeData.teaching.teachingAssistant) {
                html += `<h2>Teaching Assistant</h2>`;
                Object.keys(homeData.teaching.teachingAssistant).forEach(school => {
                    html += `<p><strong>${school}:</strong> ${homeData.teaching.teachingAssistant[school].join(', ')}</p>`;
                });
            }
            
            html += `</div></div>`;
        }
        
        // Personal Life Section
        if (homeData.personalLife) {
            html += `<div class="section-content" id="personalLife">`;
            html += `<h1 class="collapsible-heading" id="personalLife-heading">${homeData.personalLife.title}<span class="collapsible-arrow">▼</span></h1>`;
            html += `<div class="collapsible-content">`;
            
            if (homeData.personalLife.volunteer) {
                html += `<h2>Volunteer</h2>`;
                html += `<ul>${homeData.personalLife.volunteer.map(item => {
                    // Parse markdown and add icons for Bilibili links
                    let itemHtml = DOMPurify.sanitize(marked.parse(item));
                    itemHtml = itemHtml.replace(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g, (match, url, text) => {
                        const textLower = text.toLowerCase();
                        const urlLower = url.toLowerCase();
                        let iconHtml = '';
                        let blockClass = 'inline-link-block';
                        
                        if (textLower.includes('bilibili') || urlLower.includes('bilibili.com')) {
                            iconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.5 2.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-1.5 6h-2c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-8c0-.6-.4-1-1-1zm-6 0H9c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-8c0-.6-.4-1-1-1zm-6 0H3c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-8c0-.6-.4-1-1-1z"/></svg>`;
                            blockClass += ' inline-link-bilibili';
                            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${blockClass}">${iconHtml}<span>${text}</span></a>`;
                        }
                        return match;
                    });
                    return `<li>${itemHtml}</li>`;
                }).join('')}</ul>`;
            }
            
            if (homeData.personalLife.skills && homeData.personalLife.skills.length > 0) {
                html += `<h2>Skills</h2>`;
                html += `<ul>${homeData.personalLife.skills.map(skill => 
                    `<li>${DOMPurify.sanitize(marked.parse(skill))}</li>`
                ).join('')}</ul>`;
            }
            
            if (homeData.personalLife.hobbies && homeData.personalLife.hobbies.length > 0) {
                html += `<h2>Hobbies</h2>`;
                html += `<ul>${homeData.personalLife.hobbies.map(hobby => 
                    `<li>${DOMPurify.sanitize(marked.parse(hobby))}</li>`
                ).join('')}</ul>`;
            }
            
            html += `</div></div>`;
        }
        
        wrapper.innerHTML = html;
    }
    
    // Render Publications
    function renderPublications() {
        const container = document.getElementById('publicationsContent');
        if (!container) return;
        
        let html = '';
        
        if (publicationsData.header) {
            // Parse markdown links and create cute blocks
            const headerText = publicationsData.header;
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            const links = [];
            let match;
            let lastIndex = 0;
            
            while ((match = linkRegex.exec(headerText)) !== null) {
                links.push({
                    text: match[1],
                    url: match[2],
                    index: match.index
                });
            }
            
            // Extract the intro text (before first link)
            const introText = links.length > 0 ? headerText.substring(0, links[0].index).replace(/\s+\|\s*$/, '').trim() : headerText.split('|')[0].trim();
            
            html += `<div class="publications-header-wrapper">`;
            if (introText) {
                html += `<p class="publications-header-intro">${introText}</p>`;
            }
            html += `<div class="publications-link-blocks">`;
            links.forEach((link, index) => {
                let iconHtml = '';
                let blockClass = 'publication-link-block';
                const linkText = link.text.toLowerCase();
                
                if (linkText.includes('google scholar')) {
                    iconHtml = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>`;
                    blockClass += ' pub-block-scholar';
                } else if (linkText.includes('openreview')) {
                    blockClass += ' pub-block-openreview';
                } else if (linkText.includes('dblp')) {
                    blockClass += ' pub-block-dblp';
                } else if (linkText.includes('semantic scholar')) {
                    blockClass += ' pub-block-semantic';
                } else if (linkText.includes('hugging face')) {
                    iconHtml = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6S17.302 21.6 12 21.6 2.4 17.302 2.4 12 6.698 2.4 12 2.4zm-3.6 6c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm7.2 0c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-3.6 4.8c-2.21 0-4 1.79-4 4v1.2h8v-1.2c0-2.21-1.79-4-4-4z"/></svg>`;
                    blockClass += ' pub-block-huggingface';
                } else {
                    // Default color based on position
                    const colors = ['pub-block-scholar', 'pub-block-openreview', 'pub-block-dblp', 'pub-block-semantic', 'pub-block-huggingface'];
                    blockClass += ' ' + colors[index % colors.length];
                }
                
                html += `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="${blockClass}">${iconHtml}<span>${link.text}</span></a>`;
            });
            html += `</div></div>`;
        }
        
        publicationsData.categories.forEach(category => {
            const categoryId = category.name.toLowerCase().replace(/\s+/g, '-');
            html += `<div class="publication-category" id="${categoryId}">`;
            html += `<h2 id="${categoryId}-heading">${category.name}</h2>`;
            
            category.subcategories.forEach(subcat => {
                const subcatId = subcat.name.toLowerCase().replace(/\s+/g, '-');
                html += `<h3 id="${subcatId}">${subcat.name}</h3>`;
                
                subcat.publications.forEach(pub => {
                    const imagePath = pub.image || pub.images || '';
                    const hasImage = imagePath && imagePath.trim() !== '';
                    html += `<div class="publication-block ${hasImage ? 'publication-block-with-image' : ''}">`;
                    html += `<div class="publication-content-wrapper">`;
                    html += `<div class="publication-text-content">`;
                    html += `<div class="publication-header">`;
                    html += `<h3 class="publication-title">`;
                    
                    if (pub.links.paper) {
                        html += `<a href="${pub.links.paper}" target="_blank" rel="noopener noreferrer">${pub.title}</a>`;
                    } else if (pub.links.arxiv) {
                        html += `<a href="${pub.links.arxiv}" target="_blank" rel="noopener noreferrer">${pub.title}</a>`;
                    } else {
                        html += pub.title;
                    }
                    
                    html += `</h3>`;
                    html += `<div class="publication-authors">${DOMPurify.sanitize(marked.parse(pub.authors))}</div>`;
                    html += `</div>`;
                    
                    html += `<div class="publication-venue">`;
                    html += `<span class="venue-badge venue-${pub.venueType}">${pub.venue}</span>`;
                    html += `</div>`;
                    
                    html += `<div class="publication-links">`;
                    if (pub.links.arxiv) html += `<a href="${pub.links.arxiv}" class="pub-link pub-arxiv" target="_blank" rel="noopener noreferrer">arXiv</a>`;
                    if (pub.links.paper) html += `<a href="${pub.links.paper}" class="pub-link pub-paper" target="_blank" rel="noopener noreferrer">Paper</a>`;
                    if (pub.links.supplementary) html += `<a href="${pub.links.supplementary}" class="pub-link pub-paper" target="_blank" rel="noopener noreferrer">Supplementary</a>`;
                    if (pub.links.code) html += `<a href="${pub.links.code}" class="pub-link pub-code" target="_blank" rel="noopener noreferrer">Code</a>`;
                    if (pub.links.project) html += `<a href="${pub.links.project}" class="pub-link pub-project" target="_blank" rel="noopener noreferrer">Project</a>`;
                    if (pub.links.poster) html += `<a href="${pub.links.poster}" class="pub-link pub-poster" target="_blank" rel="noopener noreferrer">Poster</a>`;
                    if (pub.links.video) html += `<a href="${pub.links.video}" class="pub-link pub-video" target="_blank" rel="noopener noreferrer">Video</a>`;
                    if (pub.links.slides) html += `<a href="${pub.links.slides}" class="pub-link pub-slides" target="_blank" rel="noopener noreferrer">Slides</a>`;
                    html += `</div>`;
                    html += `</div>`;
                    
                    if (hasImage) {
                        html += `<div class="publication-image-wrapper">`;
                        html += `<img src="${imagePath}" alt="${pub.title}" class="publication-image" loading="lazy" data-full-image="${imagePath}" data-image-title="${pub.title}">`;
                        html += `</div>`;
                    }
                    html += `</div>`;
                    html += `</div>`;
                });
            });
            
            html += `</div>`;
        });
        
        container.innerHTML = html;
    }
    
    // Render Projects
    function renderProjects() {
        const container = document.getElementById('projectsContent');
        if (!container) return;
        
        let html = '';
        
        if (projectsData.intro) {
            // Parse markdown first, then replace links with styled blocks
            let introHtml = DOMPurify.sanitize(marked.parse(projectsData.intro));
            introHtml = introHtml.replace(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g, (match, url, text) => {
                const textLower = text.toLowerCase();
                let iconHtml = '';
                let blockClass = 'project-link-block';
                
                if (textLower.includes('github')) {
                    iconHtml = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
                    blockClass += ' project-link-github';
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${blockClass}">${iconHtml}<span>${text}</span></a>`;
                }
                return match; // Return original if not GitHub
            });
            html += `<p>${introHtml}</p>`;
        }
        
        if (projectsData.githubGraph) {
            html += `<div style="text-align: center; margin: 2rem 0;">`;
            html += `<img src="${projectsData.githubGraph}" alt="GitHub Activity Graph" style="max-width: 70%; height: auto; margin: 0 auto; display: block;">`;
            html += `</div>`;
        }
        
        if (projectsData.huggingFace) {
            // Parse markdown first, then replace links with styled blocks
            let huggingFaceHtml = DOMPurify.sanitize(marked.parse(projectsData.huggingFace));
            huggingFaceHtml = huggingFaceHtml.replace(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g, (match, url, text) => {
                const textLower = text.toLowerCase();
                let iconHtml = '';
                let blockClass = 'project-link-block';
                
                if (textLower.includes('hugging face')) {
                    iconHtml = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6S17.302 21.6 12 21.6 2.4 17.302 2.4 12 6.698 2.4 12 2.4zm-3.6 6c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm7.2 0c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-3.6 4.8c-2.21 0-4 1.79-4 4v1.2h8v-1.2c0-2.21-1.79-4-4-4z"/></svg>`;
                    blockClass += ' project-link-huggingface';
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${blockClass}">${iconHtml}<span>${text}</span></a>`;
                }
                return match; // Return original if not Hugging Face
            });
            html += `<p>${huggingFaceHtml}</p>`;
        }
        
        projectsData.sections.forEach(section => {
            const sectionId = section.title.toLowerCase().replace(/\s+/g, '-');
            html += `<div class="project-section" id="${sectionId}">`;
            html += `<h3 id="${sectionId}-heading">${section.title}</h3>`;
            
            if (section.subsections) {
                section.subsections.forEach(subsection => {
                    html += `<h4>${subsection.title}</h4>`;
                    if (subsection.items) {
                        subsection.items.forEach(item => {
                            html += `<div class="project-item">`;
                            html += `<a href="${item.url}" target="_blank">${item.title}</a>`;
                            html += `</div>`;
                        });
                    }
                });
            } else if (section.items) {
                section.items.forEach(item => {
                    html += `<div class="project-item">`;
                    html += `<a href="${item.url}" target="_blank">${item.title}</a>`;
                    if (item.description) {
                        html += `<p>${item.description}</p>`;
                    }
                    if (item.subitems) {
                        html += `<ul>`;
                        item.subitems.forEach(subitem => {
                            html += `<li><a href="${subitem.url}" target="_blank">${subitem.title}</a></li>`;
                        });
                        html += `</ul>`;
                    }
                    html += `</div>`;
                });
            }
            
            html += `</div>`;
        });
        
        if (projectsData.sponsor) {
            // Chiikawa character images - load from resources/chiikawa folder (PNG with transparent backgrounds)
            // 吉伊 (Jiyi/Chiikawa) - main white character
            const chiikawaImg = `<img src="resources/chiikawa/jiyi.png" alt="吉伊" class="chiikawa-char" style="background: transparent; background-color: transparent; width: 35px; height: 35px;" onerror="this.style.display='none'">`;
            
            // 小八 (Xiaoba/Hachiware) - with blue hat
            const hachiwareImg = `<img src="resources/chiikawa/xiaoba.png" alt="小八" class="chiikawa-char" style="background: transparent; background-color: transparent; width: 35px; height: 35px;" onerror="this.style.display='none'">`;
            
            // うさぎ (Wusaqi/Usagi) - yellow rabbit
            const usagiImg = `<img src="resources/chiikawa/wusaqi.png" alt="うさぎ" class="chiikawa-char" style="background: transparent; background-color: transparent; width: 35px; height: 35px;" onerror="this.style.display='none'">`;
            
            // 谢 (Xie) - another character
            const xieImg = `<img src="resources/chiikawa/xie.png" alt="谢" class="chiikawa-char" style="background: transparent; background-color: transparent; width: 35px; height: 35px;" onerror="this.style.display='none'">`;
            
            html += `<div class="sponsor-section">`;
            html += `<div class="chiikawa-container">`;
            html += `<div class="chiikawa-left">${chiikawaImg}${hachiwareImg}</div>`;
            html += `<div class="sponsor-content">`;
            html += `<p class="sponsor-text">${projectsData.sponsor.text}</p>`;
            html += `<div class="sponsor-buttons">`;
            html += `<a href="${projectsData.sponsor.url}" target="_blank" class="sponsor-button sponsor-github">`;
            html += `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
            html += `<span>Sponsor</span>`;
            html += `</a>`;
            html += `<a href="${projectsData.sponsor.url}" target="_blank" class="sponsor-button sponsor-heart">`;
            html += `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
            html += `</a>`;
            html += `</div>`;
            html += `</div>`;
            html += `<div class="chiikawa-right">${usagiImg}${xieImg}</div>`;
            html += `</div>`;
            html += `</div>`;
        }
        
        container.innerHTML = html;
    }
    
    // Render Blog
    async function renderBlog() {
        const container = document.getElementById('blogContent');
        if (!container) return;
        
        // Sort posts by date in descending order (newest first)
        const sortedPosts = [...blogData.posts].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA; // Descending order (newest first)
        });
        
        // Load excerpts for each post
        const cacheBuster = '?v=' + Date.now();
        const postsWithExcerpts = await Promise.all(sortedPosts.map(async (post) => {
            let excerpt = '';
            if (post.content && post.content.endsWith('.md')) {
                try {
                    const response = await fetch(post.content + cacheBuster);
                    const text = await response.text();
                    // Remove front matter (+++ ... +++ or --- ... ---)
                    let content = text.replace(/^\+{3}[\s\S]*?\+{3}\n?/m, '').replace(/^-{3}[\s\S]*?-{3}\n?/m, '');
                    // Get first 200 characters
                    excerpt = content.substring(0, 200).trim() + '...';
                } catch (error) {
                    console.error(`Error loading ${post.content}:`, error);
                    excerpt = 'Click to read more...';
                }
            } else {
                excerpt = post.content ? post.content.substring(0, 200) + '...' : 'Click to read more...';
            }
            return { ...post, excerpt };
        }));
        
        // Aspect mapping for blog posts (cycling through aspects)
        const aspects = ['winter', 'heart', 'cup', 'forge', 'lantern', 'edge'];
        const aspectIcons = {
            'winter': '❄',
            'heart': '❤',
            'cup': '🍷',
            'forge': '🔥',
            'lantern': '🕯',
            'edge': '⚔'
        };
        
        const html = `<div class="blog-grid">
            ${postsWithExcerpts.map((post, index) => {
                const aspect = aspects[index % aspects.length];
                return `
                <div class="blog-card" data-aspect="${aspect}" onclick="showBlogPost('${post.id}')">
                    <h3>${post.title}</h3>
                    <div class="blog-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div class="blog-excerpt">${DOMPurify.sanitize(marked.parse(post.excerpt))}</div>
                </div>
            `;
            }).join('')}
        </div>`;
        
        container.innerHTML = html;
    }
    
    // Render Pets
    function renderPets() {
        const container = document.getElementById('petsContent');
        if (!container || !petsData.images || petsData.images.length === 0) return;
        
        const html = `<div class="pets-grid">
            ${petsData.images.map((pet, index) => `
                <div class="pet-card" data-pet-index="${index}">
                    <img src="${pet.image}" alt="${pet.name}" class="pet-image" 
                         data-full-image="${pet.image}" 
                         data-image-title="${pet.name}">
                    <div class="pet-name">${pet.name}</div>
                </div>
            `).join('')}
        </div>`;
        
        container.innerHTML = html;
        
        // Add click handlers for pet images
        const petImages = container.querySelectorAll('.pet-image');
        petImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                const fullImageSrc = img.getAttribute('data-full-image');
                const imageTitle = img.getAttribute('data-image-title');
                if (fullImageSrc) {
                    showPetImageModal(fullImageSrc, imageTitle);
                }
            });
        });
    }
    
    // Show Pet Image Modal (动物迷城 style)
    function showPetImageModal(imageSrc, imageTitle) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('imageModalImg');
        const modalTitle = document.getElementById('imageModalTitle');
        const modalClose = document.getElementById('imageModalClose');
        
        if (!modal || !modalImg || !modalTitle || !modalClose) return;
        
        modalImg.src = imageSrc;
        modalTitle.textContent = imageTitle;
        modal.classList.add('pet-modal'); // Add special class for pet styling
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Show blog post (modal or new page)
    async function showBlogPost(id) {
        const post = blogData.posts.find(p => p.id === id);
        if (!post) return;
        
        let content = '';
        if (post.content && post.content.endsWith('.md')) {
            try {
                const cacheBuster = '?v=' + Date.now();
                const response = await fetch(post.content + cacheBuster);
                let text = await response.text();
                // Remove front matter
                text = text.replace(/^\+{3}[\s\S]*?\+{3}\n?/m, '').replace(/^-{3}[\s\S]*?-{3}\n?/m, '');
                content = text;
            } catch (error) {
                console.error(`Error loading ${post.content}:`, error);
                content = 'Error loading content. Please try again later.';
            }
        } else {
            content = post.content || '';
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 2000; overflow-y: auto; padding: 2rem;';
        
        modal.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; position: relative;">
                <button onclick="this.closest('.blog-modal').remove()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 2rem; cursor: pointer; color: #666;">&times;</button>
                <h1>${post.title}</h1>
                <div class="blog-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="markdown-content" style="margin-top: 2rem;">${DOMPurify.sanitize(marked.parse(content))}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    // Make showBlogPost global
    window.showBlogPost = showBlogPost;
    
    // Update Footer
    function updateFooter() {
        const yearEl = document.getElementById('currentYear');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }
    
    // Initialize collapsible sections
    function initCollapsibleSections() {
        // Process all headings in content-wrapper and section-content
        const headings = document.querySelectorAll('.content-wrapper h1, .content-wrapper h2, .content-wrapper h3, .section-content h1, .section-content h2, .section-content h3');
        
        headings.forEach(heading => {
            if (heading.classList.contains('collapsible-processed')) return;
            heading.classList.add('collapsible-processed');
            
            // Check if already has an arrow (like sections from renderHome)
            const hasExistingArrow = heading.querySelector('.collapsible-arrow');
            
            // If no arrow exists, create one
            if (!hasExistingArrow) {
                const arrow = document.createElement('span');
                arrow.className = 'collapsible-arrow';
                arrow.innerHTML = '▼';
                heading.insertBefore(arrow, heading.firstChild);
                heading.classList.add('collapsible-heading');
            }
            
            // Determine heading level
            const level = parseInt(heading.tagName.charAt(1));
            
            // Check if content wrapper already exists (from renderHome)
            let wrapper = heading.nextElementSibling;
            const hasExistingWrapper = wrapper && wrapper.classList.contains('collapsible-content');
            
            if (!hasExistingWrapper) {
                // Create wrapper for dynamically discovered content
                let content = [];
                let next = heading.nextElementSibling;
                
                // Collect content until we hit a heading of same or higher level
                while (next) {
                    if (next.matches('h1, h2, h3, h4, h5, h6')) {
                        const nextLevel = parseInt(next.tagName.charAt(1));
                        if (nextLevel <= level) break; // Stop at same or higher level heading
                    }
                    content.push(next);
                    next = next.nextElementSibling;
                }
                
                if (content.length > 0) {
                    wrapper = document.createElement('div');
                    wrapper.className = 'collapsible-content';
                    content.forEach(el => wrapper.appendChild(el));
                    heading.parentNode.insertBefore(wrapper, heading.nextSibling);
                }
            }
            
            // Add click event listener (for both new and existing sections)
            if (wrapper && wrapper.classList.contains('collapsible-content')) {
                heading.addEventListener('click', () => {
                    heading.classList.toggle('collapsed');
                    wrapper.classList.toggle('collapsed');
                    const arrow = heading.querySelector('.collapsible-arrow');
                    if (arrow) {
                        arrow.innerHTML = heading.classList.contains('collapsed') ? '▶' : '▼';
                    }
                });
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
    
    // Initialize Image Modal
    function initImageModal() {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('imageModalImg');
        const modalTitle = document.getElementById('imageModalTitle');
        const modalClose = document.getElementById('imageModalClose');
        const publicationImages = document.querySelectorAll('.publication-image');
        
        if (!modal || !modalImg || !modalTitle || !modalClose) return;
        
        // Open modal when clicking on publication images
        publicationImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                const fullImageSrc = img.getAttribute('data-full-image');
                const imageTitle = img.getAttribute('data-image-title');
                if (fullImageSrc) {
                    modalImg.src = fullImageSrc;
                    modalTitle.textContent = imageTitle;
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            });
        });
        
        // Close modal when clicking the X button
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            modal.classList.remove('pet-modal');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close modal when clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                modal.classList.remove('pet-modal');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                modal.classList.remove('pet-modal');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
    
    // Initialize
    loadData();
    
    // Initialize image modal after page loads
    setTimeout(() => {
        initImageModal();
    }, 500);
})();

