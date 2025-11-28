// 1. CONFIGURACIÓN DEL BLOG MARKDOWN
// Cargar automáticamente los artículos desde el archivo JSON de metadata
const articlesContainer = document.getElementById('articles-container');

// Variable global para almacenar los artículos cargados
let articles = [];

// Función para cargar artículos desde el archivo JSON
function loadArticles() {
    return fetch('data/articles_metadata.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Verificar que los datos sean un array válido
            if (data && Array.isArray(data)) {
                // Mapear los datos de Notion a nuestro formato
                articles = data.map(item => {
                    // Determinar el icono basado en la categoría o título
                    const icon = getIconForArticle(item.title || '', item.filename || '', item.category || '');
                    
                    return {
                        filename: item.filename || '',
                        title: item.title || 'Untitled',
                        description: item.excerpt || item.description || '',
                        category: item.category || '',
                        icon: icon,
                        ready: item.ready !== undefined ? item.ready : true,
                        published_date: item.published_date || null,
                        last_edited_time: item.last_edited_time || null,
                        created_time: item.created_time || null
                    };
                });
                
                console.log(`✓ Loaded ${articles.length} article(s) from metadata`);
                return articles;
            } else {
                console.warn('Invalid metadata format, expected array');
                articles = [];
                return [];
            }
        })
        .catch(error => {
            console.error('Error loading articles:', error);
            articles = [];
            return [];
        });
}

// Función para determinar el icono basado en título, filename o categoría
function getIconForArticle(title, filename, category) {
    const searchText = `${title} ${filename} ${category}`.toLowerCase();
    
    if (searchText.includes('ai') || searchText.includes('artificial') || searchText.includes('intelligence') || searchText.includes('machine learning')) {
        return 'fas fa-brain';
    }
    if (searchText.includes('poker') || searchText.includes('game theory') || searchText.includes('gto')) {
        return 'fas fa-dice';
    }
    if (searchText.includes('android') || searchText.includes('ios') || searchText.includes('mobile') || searchText.includes('compose')) {
        return 'fas fa-mobile-alt';
    }
    if (searchText.includes('trading') || searchText.includes('investment') || searchText.includes('finance') || searchText.includes('portfolio')) {
        return 'fas fa-chart-line';
    }
    if (searchText.includes('climbing') || searchText.includes('bouldering')) {
        return 'fas fa-mountain';
    }
    
    return 'fas fa-file-alt';
}

// Helper function to get articles by category
function getArticlesByCategory(category) {
    const categoryLower = category.toLowerCase();
    return articles.filter(article => {
        const articleCategory = (article.category || '').toLowerCase();
        
        // Direct match
        if (articleCategory === categoryLower || articleCategory.includes(categoryLower)) {
            return true;
        }
        
        // Special category mappings
        if (categoryLower === 'ai' || categoryLower === 'artificial intelligence') {
            return articleCategory.includes('ai') || 
                   articleCategory.includes('artificial') || 
                   articleCategory.includes('intelligence') ||
                   articleCategory.includes('machine learning') ||
                   articleCategory.includes('ml');
        }
        
        if (categoryLower === 'poker') {
            return articleCategory.includes('poker') || 
                   articleCategory.includes('game theory') ||
                   articleCategory.includes('gto');
        }
        
        if (categoryLower === 'investing' || categoryLower === 'investment') {
            return articleCategory.includes('invest') || 
                   articleCategory.includes('trading') || 
                   articleCategory.includes('finance') ||
                   articleCategory.includes('stock') ||
                   articleCategory.includes('crypto') ||
                   articleCategory.includes('portfolio');
        }
        
        if (categoryLower === 'climbing' || categoryLower === 'bouldering') {
            return articleCategory.includes('climbing') || 
                   articleCategory.includes('bouldering') ||
                   articleCategory.includes('climb');
        }
        
        return false;
    });
}

// Get featured articles for each section (last 3)
function getFeaturedArticles(category, limit = 3) {
    const categoryArticles = getArticlesByCategory(category);
    
    // Filter to only ready articles (Ready checkbox must be true)
    const readyArticles = categoryArticles.filter(article => {
        // Only include if ready field is true
        return article.ready === true;
    });
    
    // Sort by published_date, last_edited_time, or created_time if available
    const sorted = readyArticles.sort((a, b) => {
        const timeA = a.published_date || a.last_edited_time || a.created_time || '';
        const timeB = b.published_date || b.last_edited_time || b.created_time || '';
        return timeB.localeCompare(timeA); // Most recent first
    });
    return sorted.slice(0, limit);
}

// Helper function to calculate reading time
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

// Función para mostrar artículos como cards
function displayArticleCards() {
    if (!articlesContainer) return;

    articlesContainer.innerHTML = '';
    
    // Si no hay artículos cargados, mostrar skeleton loaders
    // Si no hay artículos cargados, mostrar skeleton loaders
    if (!articles || articles.length === 0) {
        articlesContainer.innerHTML = `
            <div class="card glass skeleton-card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-line"></div>
                <div class="skeleton skeleton-line short"></div>
            <div class="card glass skeleton-card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-line"></div>
                <div class="skeleton skeleton-line short"></div>
            </div>
        `;
        return;
    }
    
    // Filter to only ready articles (Ready checkbox must be true)
    const readyArticles = articles.filter(article => {
        return article.ready === true;
    });
    
    // Sort by published_date, last_edited_time, or created_time
    const sortedArticles = readyArticles.sort((a, b) => {
        const timeA = a.published_date || a.last_edited_time || a.created_time || '';
        const timeB = b.published_date || b.last_edited_time || b.created_time || '';
        return timeB.localeCompare(timeA); // Most recent first
    });
    
    if (sortedArticles.length === 0) {
        articlesContainer.innerHTML = `
            <div class="card glass" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p style="color: #94a3b8;">No articles ready to display.</p>
            </div>
        `;
        return;
    }
    
    sortedArticles.forEach((article, index) => {
    sortedArticles.forEach((article, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card glass clickable-card article-item';
        cardElement.className = 'card glass clickable-card article-item';
        cardElement.setAttribute('data-type', 'article');
        cardElement.setAttribute('data-id', article.filename);
        cardElement.style.animationDelay = `${index * 0.1}s`;
        
        const dateBadge = article.published_date || article.last_edited_time || article.created_time;
        const dateFormatted = dateBadge ? formatDate(dateBadge) : '';
        const readingTime = calculateReadingTime(article.description || '');
        cardElement.style.animationDelay = `${index * 0.1}s`;
        
        const dateBadge = article.published_date || article.last_edited_time || article.created_time;
        const dateFormatted = dateBadge ? formatDate(dateBadge) : '';
        const readingTime = calculateReadingTime(article.description || '');
        
        cardElement.innerHTML = `
            <div class="card-header">
                <i class="${article.icon} icon-tech"></i>
                <span>${Array.isArray(article.category) ? article.category[0] : (article.category || 'Article')}</span>
            </div>
            <div class="card-content">
                ${dateFormatted ? `<div class="article-date-badge">${dateFormatted}</div>` : ''}
                ${dateFormatted ? `<div class="article-date-badge">${dateFormatted}</div>` : ''}
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                ${readingTime > 0 ? `<div class="article-reading-time"><i class="fas fa-clock"></i> ${readingTime} min read</div>` : ''}
            </div>
        `;
        
        cardElement.addEventListener('click', () => {
            window.location.href = `article.html?file=${encodeURIComponent(article.filename)}`;
        });
        
        articlesContainer.appendChild(cardElement);
    });
}

// Inicializar - cargar artículos primero, luego mostrar
function initialize() {
    // Cargar artículos y luego mostrar
    loadArticles().then(() => {
        displayArticleCards();
        // También actualizar las secciones destacadas después de cargar
        setTimeout(() => {
            updateFeaturedSections();
        }, 100);
    }).catch(error => {
        console.error('Error initializing articles:', error);
        if (articlesContainer) {
            articlesContainer.innerHTML = `
                <div class="card glass" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p style="color: #ff6b6b;">Error loading articles. Please reload the page.</p>
                </div>
            `;
        }
    });
    
    // Cargar otros componentes
    loadAICurator();
    loadPokerPuzzle();
}

// Navigation scroll indicators and active section tracking
function setupNavigationScroll() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
}

// Navbar scroll behavior
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const nav = document.querySelector('.nav-links');
                if (nav && window.innerWidth <= 768) {
                    nav.classList.remove('active');
                }
            }
        });
    });
}

// Back to top button
function setupBackToTop() {
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

// Enhanced mobile menu
function setupMobileMenu() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.style.transform = nav.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !burger.contains(e.target)) {
                nav.classList.remove('active');
                burger.style.transform = 'rotate(0deg)';
            }
        });
    }
}

// Navigation scroll indicators and active section tracking
function setupNavigationScroll() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
}

// Navbar scroll behavior
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const nav = document.querySelector('.nav-links');
                if (nav && window.innerWidth <= 768) {
                    nav.classList.remove('active');
                }
            }
        });
    });
}

// Back to top button
function setupBackToTop() {
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

// Enhanced mobile menu
function setupMobileMenu() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.style.transform = nav.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !burger.contains(e.target)) {
                nav.classList.remove('active');
                burger.style.transform = 'rotate(0deg)';
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initialize();
        setupNavigationScroll();
        setupNavbarScroll();
        setupSmoothScroll();
        setupBackToTop();
        setupMobileMenu();
    });
    document.addEventListener('DOMContentLoaded', () => {
        initialize();
        setupNavigationScroll();
        setupNavbarScroll();
        setupSmoothScroll();
        setupBackToTop();
        setupMobileMenu();
    });
} else {
    initialize();
    setupNavigationScroll();
    setupNavbarScroll();
    setupSmoothScroll();
    setupBackToTop();
    setupMobileMenu();
    setupNavigationScroll();
    setupNavbarScroll();
    setupSmoothScroll();
    setupBackToTop();
    setupMobileMenu();
}

// 4. AI TECH CURATOR - Cargar y mostrar noticias
function loadAICurator() {
    const curatorContent = document.getElementById('ai-curator-content');
    if (!curatorContent) return;

    fetch('data/ai-news.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Verificar si hay datos válidos (no el ejemplo)
            if (data && Array.isArray(data) && data.length > 0) {
                // Verificar si es el ejemplo o datos reales
                const isExample = data[0].title === "Example News Title" || 
                                 data[0].link === "https://example.com";
                if (!isExample) {
                    renderAICurator(data, curatorContent);
                } else {
                    curatorContent.innerHTML = '<p class="typing-indicator">Esperando primera actualización del AI Curator...<span class="blink">_</span></p>';
                }
            } else {
                curatorContent.innerHTML = '<p class="typing-indicator">No news available yet<span class="blink">_</span></p>';
            }
        })
        .catch(error => {
            console.error('Error loading AI Curator:', error);
            curatorContent.innerHTML = '<p class="typing-indicator">Neural net offline. Check back later<span class="blink">_</span></p>';
        });
}

function typeText(element, text, speed = 30, callback) {
    let i = 0;
    element.textContent = '';
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            if (callback) callback();
        }
    }, speed);
}

function parseKeypoints(summary) {
    // Intentar detectar keypoints por diferentes formatos
    // 1. Números seguidos de punto o guión: "1. punto", "2- punto", etc.
    // 2. Guiones: "- punto"
    // 3. Asteriscos: "* punto"
    // 4. Separados por saltos de línea
    
    const patterns = [
        /(\d+)[\.\-]\s*(.+?)(?=\d+[\.\-]|$)/g,  // Números con punto o guión
        /[-•]\s*(.+?)(?=[-•]|$)/g,              // Guiones o bullets
        /\*\s*(.+?)(?=\*|$)/g,                  // Asteriscos
    ];
    
    let keypoints = [];
    
    // Intentar con números
    const numberedMatch = summary.match(/(\d+)[\.\-]\s*(.+?)(?=\d+[\.\-]|$)/g);
    if (numberedMatch && numberedMatch.length >= 2) {
        keypoints = numberedMatch.map(kp => kp.replace(/^\d+[\.\-]\s*/, '').trim());
        return keypoints;
    }
    
    // Intentar con guiones o bullets
    const bulletMatch = summary.match(/[-•]\s*(.+?)(?=[-•]|$)/g);
    if (bulletMatch && bulletMatch.length >= 2) {
        keypoints = bulletMatch.map(kp => kp.replace(/^[-•]\s*/, '').trim());
        return keypoints;
    }
    
    // Intentar dividir por saltos de línea
    const lines = summary.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length >= 2) {
        // Si hay líneas que empiezan con números, guiones, etc., usarlas
        const formattedLines = lines.filter(l => /^[\d\-•*]/.test(l));
        if (formattedLines.length >= 2) {
            keypoints = formattedLines.map(l => l.replace(/^[\d\-•*.\s]+/, '').trim());
            return keypoints;
        }
        // Si no, usar todas las líneas
        return lines;
    }
    
    // Si no se detectan keypoints, dividir por puntos y comas
    const sentences = summary.split(/[.;]/).map(s => s.trim()).filter(s => s.length > 10);
    if (sentences.length >= 2) {
        return sentences;
    }
    
    // Fallback: devolver el texto completo
    return [summary];
}

function renderAICurator(news, container) {
    container.innerHTML = '';
    container.className = 'ai-curator-content';
    
    const newsContainer = document.createElement('div');
    newsContainer.className = 'ai-news-list';
    container.appendChild(newsContainer);
    
    news.forEach((item, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'ai-news-item';
        
        // Título con número
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'ai-news-title';
        const titleNumber = document.createElement('span');
        titleNumber.className = 'ai-news-number';
        titleNumber.textContent = `[${index + 1}] `;
        const titleText = document.createElement('span');
        titleText.className = 'ai-news-title-text';
        titleWrapper.appendChild(titleNumber);
        titleWrapper.appendChild(titleText);
        
        // Resumen con keypoints
        const summaryWrapper = document.createElement('div');
        summaryWrapper.className = 'ai-news-summary';
        const keypointsList = document.createElement('ul');
        keypointsList.className = 'ai-keypoints-list';
        summaryWrapper.appendChild(keypointsList);
        
        // Link
        const linkWrapper = document.createElement('div');
        linkWrapper.className = 'ai-news-link-wrapper';
        const linkElement = document.createElement('a');
        linkElement.href = item.link;
        linkElement.target = '_blank';
        linkElement.className = 'ai-news-link';
        linkElement.textContent = '→ Leer más';
        linkWrapper.appendChild(linkElement);
        
        newsItem.appendChild(titleWrapper);
        newsItem.appendChild(summaryWrapper);
        newsItem.appendChild(linkWrapper);
        newsContainer.appendChild(newsItem);
        
        // Parsear keypoints
        const keypoints = parseKeypoints(item.summary);
        
        // Efecto typing secuencial
        setTimeout(() => {
            // Typing del título
            typeText(titleText, item.title, 20, () => {
                setTimeout(() => {
                    // Typing de cada keypoint
                    let keypointIndex = 0;
                    const typeNextKeypoint = () => {
                        if (keypointIndex < keypoints.length) {
                            const li = document.createElement('li');
                            li.className = 'ai-keypoint-item';
                            const keypointText = document.createElement('span');
                            keypointText.className = 'ai-keypoint-text';
                            li.appendChild(keypointText);
                            keypointsList.appendChild(li);
                            
                            typeText(keypointText, keypoints[keypointIndex], 10, () => {
                                keypointIndex++;
                                setTimeout(typeNextKeypoint, 200);
                            });
                        } else {
                            // Mostrar link después de todos los keypoints
                            setTimeout(() => {
                                linkWrapper.style.opacity = '1';
                            }, 300);
                        }
                    };
                    typeNextKeypoint();
                }, 300);
            });
        }, index * 2000); // Aumentado el delay para keypoints más largos
    });
}

// 5. DAILY POKER PUZZLE - Cargar y mostrar puzzle del día
function loadPokerPuzzle() {
    const puzzleContainer = document.getElementById('poker-puzzle-container');
    if (!puzzleContainer) return;

    fetch('data/daily_poker.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            renderPokerPuzzle(data, puzzleContainer);
        })
        .catch(error => {
            console.error('Error loading Poker Puzzle:', error);
            puzzleContainer.innerHTML = `
                <div class="card glass">
                    <div class="card-content" style="text-align: center; padding: 3rem;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: #ff6b6b;"></i>
                        <p style="color: #94a3b8;">No puzzle available yet. The first puzzle will be generated tomorrow.</p>
                    </div>
                </div>
            `;
        });
}

function getCardSymbol(card) {
    // card format: "Ah", "Ks", "Qd", "Jc"
    const suit = card[1].toLowerCase();
    const rank = card[0].toUpperCase();
    
    const suitSymbols = {
        'h': '♥',
        'd': '♦',
        's': '♠',
        'c': '♣'
    };
    
    return {
        rank: rank === 'A' ? 'A' : rank === 'K' ? 'K' : rank === 'Q' ? 'Q' : rank === 'J' ? 'J' : rank === 'T' ? '10' : rank,
        suit: suitSymbols[suit] || suit,
        color: (suit === 'h' || suit === 'd') ? 'red' : 'black'
    };
}

function renderPokerPuzzle(puzzle, container) {
    container.innerHTML = '';
    
    const puzzleCard = document.createElement('div');
    puzzleCard.className = 'card glass poker-puzzle-card';
    
    // Header con título
    const header = document.createElement('div');
    header.className = 'poker-puzzle-header';
    header.innerHTML = `
        <div class="poker-puzzle-title">
            <i class="fas fa-spade" style="color: var(--accent-primary);"></i>
            <h3>${puzzle.title}</h3>
        </div>
        <div class="poker-puzzle-date">${puzzle.id.replace('poker-', '')}</div>
    `;
    
    // Historia/Acción previa
    const historySection = document.createElement('div');
    historySection.className = 'poker-puzzle-history';
    historySection.innerHTML = `
        <h4><i class="fas fa-history"></i> Acción Previa</h4>
        <p>${puzzle.history}</p>
    `;
    
    // Mesa de poker
    const tableSection = document.createElement('div');
    tableSection.className = 'poker-puzzle-table';
    
    // Board
    const boardSection = document.createElement('div');
    boardSection.className = 'poker-board';
    if (puzzle.board && puzzle.board.length > 0) {
        boardSection.innerHTML = '<h4>Board</h4>';
        const boardCards = document.createElement('div');
        boardCards.className = 'poker-cards board-cards';
        puzzle.board.forEach(card => {
            const cardSymbol = getCardSymbol(card);
            const cardElement = document.createElement('div');
            cardElement.className = `poker-card ${cardSymbol.color}`;
            cardElement.innerHTML = `
                <span class="card-rank">${cardSymbol.rank}</span>
                <span class="card-suit">${cardSymbol.suit}</span>
            `;
            boardCards.appendChild(cardElement);
        });
        boardSection.appendChild(boardCards);
    }
    
    // Hero Cards
    const heroSection = document.createElement('div');
    heroSection.className = 'poker-hero';
    heroSection.innerHTML = '<h4>Hero Cards</h4>';
    const heroCards = document.createElement('div');
    heroCards.className = 'poker-cards hero-cards';
    puzzle.hero_cards.forEach(card => {
        const cardSymbol = getCardSymbol(card);
        const cardElement = document.createElement('div');
        cardElement.className = `poker-card ${cardSymbol.color}`;
        cardElement.innerHTML = `
            <span class="card-rank">${cardSymbol.rank}</span>
            <span class="card-suit">${cardSymbol.suit}</span>
        `;
        heroCards.appendChild(cardElement);
    });
    heroSection.appendChild(heroCards);
    
    tableSection.appendChild(boardSection);
    tableSection.appendChild(heroSection);
    
    // Información del bote y acción
    const infoSection = document.createElement('div');
    infoSection.className = 'poker-puzzle-info';
    infoSection.innerHTML = `
        <div class="poker-info-item">
            <i class="fas fa-coins"></i>
            <span><strong>Pot:</strong> ${puzzle.pot_size}</span>
        </div>
        <div class="poker-info-item">
            <i class="fas fa-user-ninja"></i>
            <span><strong>Villain:</strong> ${puzzle.villain_action}</span>
        </div>
    `;
    
    // Botón para mostrar solución
    const solutionButton = document.createElement('button');
    solutionButton.className = 'btn-show-solution';
    solutionButton.innerHTML = '<i class="fas fa-lightbulb"></i> Mostrar Solución GTO';
    solutionButton.addEventListener('click', () => {
        const solutionDiv = puzzleCard.querySelector('.poker-solution');
        if (solutionDiv) {
            solutionDiv.style.display = solutionDiv.style.display === 'none' ? 'block' : 'none';
            solutionButton.innerHTML = solutionDiv.style.display === 'none' 
                ? '<i class="fas fa-lightbulb"></i> Mostrar Solución GTO'
                : '<i class="fas fa-eye-slash"></i> Ocultar Solución';
        }
    });
    
    // Solución (oculta inicialmente)
    const solutionSection = document.createElement('div');
    solutionSection.className = 'poker-solution';
    solutionSection.style.display = 'none';
    solutionSection.innerHTML = `
        <h4><i class="fas fa-brain"></i> Solución GTO</h4>
        <p>${puzzle.solution}</p>
    `;
    
    // Comentarios Giscus
    const commentsSection = document.createElement('div');
    commentsSection.id = 'poker-puzzle-comments';
    commentsSection.className = 'poker-puzzle-comments';
    
    // Construir el card completo
    puzzleCard.appendChild(header);
    puzzleCard.appendChild(historySection);
    puzzleCard.appendChild(tableSection);
    puzzleCard.appendChild(infoSection);
    puzzleCard.appendChild(solutionButton);
    puzzleCard.appendChild(solutionSection);
    puzzleCard.appendChild(commentsSection);
    
    container.appendChild(puzzleCard);
    
    // Cargar comentarios de Giscus con el ID del puzzle como term
    setTimeout(() => {
        loadPokerPuzzleComments(puzzle.id);
    }, 500);
}

function loadPokerPuzzleComments(puzzleId) {
    const commentsSection = document.getElementById('poker-puzzle-comments');
    if (!commentsSection) return;
    
    // Limpiar cualquier script previo de Giscus
    const existingScript = document.querySelector('script[src="https://giscus.app/client.js"][data-term]');
    if (existingScript) {
        existingScript.remove();
    }
    
    // Limpiar el contenedor antes de añadir el nuevo script
    commentsSection.innerHTML = '';
    
    // Crear el script de Giscus dinámicamente con data-term
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'kuruchy/kuruchy.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOGPIhoQ');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOGPIhoc4CyDKy');
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', puzzleId); // Usar el ID del puzzle como term
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'es');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    // Manejar errores de carga
    script.onerror = function() {
        commentsSection.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 1rem 0;">Error loading comments.</p>';
        console.error('Error al cargar el script de Giscus');
    };
    
    // Añadir el script al contenedor de comentarios
    commentsSection.appendChild(script);
    
    console.log(`Giscus script añadido para puzzle: ${puzzleId}`);
}

// Render featured articles for a section
function renderFeaturedArticles(sectionId, category, container) {
    const featuredArticles = getFeaturedArticles(category, 3);
    
    if (featuredArticles.length === 0) {
        // If no articles found, show placeholder
        container.innerHTML = `
            <div class="card glass">
                <div class="card-content" style="text-align: center; padding: 2rem;">
                    <p style="color: #94a3b8;">No articles available yet in this category.</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Clear container and create grid
    container.innerHTML = '';
    featuredArticles.forEach((article, index) => {
    featuredArticles.forEach((article, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card glass clickable-card article-item';
        cardElement.className = 'card glass clickable-card article-item';
        cardElement.setAttribute('data-type', 'article');
        cardElement.setAttribute('data-id', article.filename);
        cardElement.style.animationDelay = `${index * 0.1}s`;
        
        const dateBadge = article.published_date || article.last_edited_time || article.created_time;
        const dateFormatted = dateBadge ? formatDate(dateBadge) : '';
        const readingTime = calculateReadingTime(article.description || '');
        cardElement.style.animationDelay = `${index * 0.1}s`;
        
        const dateBadge = article.published_date || article.last_edited_time || article.created_time;
        const dateFormatted = dateBadge ? formatDate(dateBadge) : '';
        const readingTime = calculateReadingTime(article.description || '');
        
        cardElement.innerHTML = `
            <div class="card-header">
                <i class="${article.icon} icon-tech"></i>
                <span>${Array.isArray(article.category) ? article.category[0] : (article.category || 'Article')}</span>
            </div>
            <div class="card-content">
                ${dateFormatted ? `<div class="article-date-badge">${dateFormatted}</div>` : ''}
                ${dateFormatted ? `<div class="article-date-badge">${dateFormatted}</div>` : ''}
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                ${readingTime > 0 ? `<div class="article-reading-time"><i class="fas fa-clock"></i> ${readingTime} min read</div>` : ''}
            </div>
        `;
        
        cardElement.addEventListener('click', () => {
            window.location.href = `article.html?file=${encodeURIComponent(article.filename)}`;
        });
        
        container.appendChild(cardElement);
    });
}

// Función para actualizar las secciones destacadas
function updateFeaturedSections() {
    // Portfolio section - AI articles (after AI Curator)
    const portfolioContainer = document.querySelector('#portfolio .grid-3');
    if (portfolioContainer) {
        const aiArticles = getFeaturedArticles('ai', 3);
        if (aiArticles.length > 0) {
            // Create a new section for AI articles
            let aiSection = document.getElementById('ai-articles-section');
            if (!aiSection) {
                aiSection = document.createElement('section');
                aiSection.id = 'ai-articles-section';
                aiSection.className = 'container';
                aiSection.innerHTML = `
                    <h2>AI Articles</h2>
                    <p class="subtitle">Latest articles about Artificial Intelligence</p>
                    <div id="ai-articles-container" class="grid-3"></div>
                `;
                // Insert after portfolio section
                const portfolioSection = document.getElementById('portfolio');
                portfolioSection.parentNode.insertBefore(aiSection, portfolioSection.nextSibling);
            }
            const aiContainer = document.getElementById('ai-articles-container');
            if (aiContainer) {
                renderFeaturedArticles('portfolio', 'ai', aiContainer);
            }
        }
    }

    // Investment section
    const investmentContainer = document.querySelector('#investments .grid-3');
    if (investmentContainer) {
        renderFeaturedArticles('investments', 'investing', investmentContainer);
    }

    // Poker section
    const pokerContainer = document.querySelector('#poker .grid-3');
    if (pokerContainer) {
        renderFeaturedArticles('poker', 'poker', pokerContainer);
    }

    // Climbing section
    const climbingContainer = document.querySelector('#climbing .grid-3');
    if (climbingContainer) {
        renderFeaturedArticles('climbing', 'climbing', climbingContainer);
    }
}

// 2. ANIMACIÓN DE FONDO (Red Neuronal / Constelación) - Enhanced
// 2. ANIMACIÓN DE FONDO (Red Neuronal / Constelación) - Enhanced
const canvas = document.getElementById('bg-animation');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particlesArray = [];
    let mouse = { x: null, y: null };
    let mouseRadius = 150;
    
    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Manejo del redimensionamiento
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
    
    // Crear partículas mejoradas
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.directionX = (Math.random() * 0.5) - 0.25;
            this.directionY = (Math.random() * 0.5) - 0.25;
            this.size = Math.random() * 2.5 + 0.5;
            this.baseColor = { r: 249, g: 115, b: 22 };
            this.color = `rgb(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b})`;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }
        
        update() {
            // Interacción con el mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouseRadius) {
                    const force = (mouseRadius - distance) / mouseRadius;
                    this.directionX -= (dx / distance) * force * 0.05;
                    this.directionY -= (dy / distance) * force * 0.05;
                }
            }
            
            // Rebotar en bordes
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            
            this.x += this.directionX;
            this.y += this.directionY;
            
            // Pulse effect
            this.pulsePhase += this.pulseSpeed;
            const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
            this.opacity = (Math.random() * 0.3 + 0.4) * pulse;
            
            this.draw();
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = `rgba(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b}, ${this.opacity})`;
            ctx.fill();
            
            // Glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b}, 0.8)`;
        }
    }
    
    function init() {
        particlesArray = [];
        let numberOfParticles = Math.floor((canvas.height * canvas.width) / 12000);
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fade effect
        ctx.fillStyle = 'rgba(5, 5, 17, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }
    
    // Dibujar líneas entre partículas cercanas (Efecto Red Neuronal mejorado)
    function connect() {
        ctx.shadowBlur = 0;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = dx * dx + dy * dy;
                const maxDistance = (canvas.width / 6) * (canvas.height / 6);
                
                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    const gradient = ctx.createLinearGradient(
                        particlesArray[a].x, particlesArray[a].y,
                        particlesArray[b].x, particlesArray[b].y
                    );
                    
                    // Color gradient based on mouse proximity
                    let r1 = 249, g1 = 115, b1 = 22;
                    let r2 = 251, g2 = 191, b2 = 36;
                    
                    if (mouse.x !== null && mouse.y !== null) {
                        const distA = Math.sqrt(
                            Math.pow(particlesArray[a].x - mouse.x, 2) +
                            Math.pow(particlesArray[a].y - mouse.y, 2)
                        );
                        const distB = Math.sqrt(
                            Math.pow(particlesArray[b].x - mouse.x, 2) +
                            Math.pow(particlesArray[b].y - mouse.y, 2)
                        );
                        
                        if (distA < mouseRadius || distB < mouseRadius) {
                            r1 = 251; g1 = 191; b1 = 36;
                            r2 = 234; g2 = 88; b2 = 12;
                        }
                    }
                    
                    gradient.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${opacity * 0.6})`);
                    gradient.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, ${opacity * 0.6})`);
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = opacity * 1.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    init();
    animate();
}

// Mobile menu is now handled by setupMobileMenu() function above
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particlesArray = [];
    let mouse = { x: null, y: null };
    let mouseRadius = 150;
    
    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Manejo del redimensionamiento
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
    
    // Crear partículas mejoradas
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.directionX = (Math.random() * 0.5) - 0.25;
            this.directionY = (Math.random() * 0.5) - 0.25;
            this.size = Math.random() * 2.5 + 0.5;
            this.baseColor = { r: 249, g: 115, b: 22 };
            this.color = `rgb(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b})`;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }
        
        update() {
            // Interacción con el mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouseRadius) {
                    const force = (mouseRadius - distance) / mouseRadius;
                    this.directionX -= (dx / distance) * force * 0.05;
                    this.directionY -= (dy / distance) * force * 0.05;
                }
            }
            
            // Rebotar en bordes
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            
            this.x += this.directionX;
            this.y += this.directionY;
            
            // Pulse effect
            this.pulsePhase += this.pulseSpeed;
            const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
            this.opacity = (Math.random() * 0.3 + 0.4) * pulse;
            
            this.draw();
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = `rgba(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b}, ${this.opacity})`;
            ctx.fill();
            
            // Glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b}, 0.8)`;
        }
    }
    
    function init() {
        particlesArray = [];
        let numberOfParticles = Math.floor((canvas.height * canvas.width) / 12000);
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fade effect
        ctx.fillStyle = 'rgba(5, 5, 17, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }
    
    // Dibujar líneas entre partículas cercanas (Efecto Red Neuronal mejorado)
    function connect() {
        ctx.shadowBlur = 0;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = dx * dx + dy * dy;
                const maxDistance = (canvas.width / 6) * (canvas.height / 6);
                
                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    const gradient = ctx.createLinearGradient(
                        particlesArray[a].x, particlesArray[a].y,
                        particlesArray[b].x, particlesArray[b].y
                    );
                    
                    // Color gradient based on mouse proximity
                    let r1 = 249, g1 = 115, b1 = 22;
                    let r2 = 251, g2 = 191, b2 = 36;
                    
                    if (mouse.x !== null && mouse.y !== null) {
                        const distA = Math.sqrt(
                            Math.pow(particlesArray[a].x - mouse.x, 2) +
                            Math.pow(particlesArray[a].y - mouse.y, 2)
                        );
                        const distB = Math.sqrt(
                            Math.pow(particlesArray[b].x - mouse.x, 2) +
                            Math.pow(particlesArray[b].y - mouse.y, 2)
                        );
                        
                        if (distA < mouseRadius || distB < mouseRadius) {
                            r1 = 251; g1 = 191; b1 = 36;
                            r2 = 234; g2 = 88; b2 = 12;
                        }
                    }
                    
                    gradient.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${opacity * 0.6})`);
                    gradient.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, ${opacity * 0.6})`);
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = opacity * 1.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    init();
    animate();
}

// Mobile menu is now handled by setupMobileMenu() function above