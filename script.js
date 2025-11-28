// 1. CONFIGURACIÓN DEL BLOG MARKDOWN
// Cargar automáticamente los últimos 5 artículos
const articlesContainer = document.getElementById('articles-container');

// Lista de artículos (ordenados del más reciente al más antiguo)
const articles = [
    { 
        filename: 'articles/new-era.md', 
        title: 'New Era!', 
        description: 'I am revamping my blog to include some of the new tools I’ve recently learned and new/forgotten hobbies.', 
        icon: 'fas fa-file-alt'
    },
    { 
        filename: 'articles/my-german-journey.md', 
        title: 'My German Journey', 
        description: 'One of the things I keep telling me over and over again, is how lucky I am...', 
        icon: 'fas fa-file-alt'
    },
    { 
        filename: 'articles/auto-clean-view-binding.md', 
        title: 'Auto Clean View Binding', 
        description: 'View Binding is the recommended way to access your views —in case you are still not using compose 😉— without using Kotlin synthetics, which you should have already stop using.', 
        icon: 'fas fa-file-alt'
    },
    { 
        filename: 'articles/passive-active-finger-strength-training.md', 
        title: '**Passive-active Finger Strength Training**', 
        description: 'In climbing, the skills needed could be split into three well-defined pillars...', 
        icon: 'fas fa-brain'
    },
    { 
        filename: 'articles/my-blog-automation-with-notion.md', 
        title: 'My Blog Automation with Notion', 
        description: 'Lately I have been using Notion for almost any task that needs me to write something, and every new day I use it for something new.', 
        icon: 'fas fa-file-alt'
    },
    { 
        filename: 'articles/droidcon-berlin-2021-day-two.md', 
        title: 'Droidcon Berlin 2021 Day Two', 
        description: 'We were warned that, due to the speakers not being able to travel, some talks would be remote. I attended some of them on the second and the third day.', 
        icon: 'fas fa-file-alt'
    },
    { 
        filename: 'articles/droidcon-berlin-2021-day-one.md', 
        title: 'Droidcon Berlin 2021 Day One', 
        description: 'Finally, the day arrived. One week before I had no plans to be in Berlin, nor to attend the event.', 
        icon: 'fas fa-file-alt'
    },
    { 
        filename: 'articles/droidcon-berlin-2021.md', 
        title: 'Droidcon Berlin 2021', 
        description: 'I made it, I am back to conferences after the global pandemic. Last time I was in a Conference was in Copenhagen, December 2019, for the Kotlin Conf.', 
        icon: 'fas fa-file-alt'
    },
    { 
        filename: 'articles/androids-book-review.md', 
        title: 'Androids Book Review', 
        description: 'In 2004, there were two people who wanted to build software for cameras. But they couldn\'t get investors interested.', 
        icon: 'fas fa-mobile-alt'
    },
    { 
        filename: 'articles/android-studio-logcat-color.md', 
        title: 'Android Studio Logcat Color', 
        description: 'We can add new colors to the Logcat messages by going to: Preferences → Editor → Color Scheme → Andoid Logcat And adjusting the Scheme to your needs.', 
        icon: 'fas fa-mobile-alt'
    },
    { 
        filename: 'articles/android-studio-actions.md', 
        title: 'Android Studio Actions', 
        description: 'One cool feature, I’ve recently found, is the possibility to add custom action buttons to almost anywhere in the Android Studio toolbars.', 
        icon: 'fas fa-mobile-alt'
    },
    { 
        filename: 'articles/new-blog.md', 
        title: 'New Blog', 
        description: 'I always had this idea in mind writing down my experiences, tips, ideas and so on in a personal Blog.', 
        icon: 'fas fa-file-alt'
    },
    { 
        filename: 'articles/ai.md', 
        title: 'Inteligencia Artificial: El Presente y Futuro', 
        description: 'La Inteligencia Artificial ha dejado de ser ciencia ficción. Desde ChatGPT hasta Midjourney, las herramientas de IA están transformando cómo trabajamos, creamos y pensamos...', 
        icon: 'fas fa-brain'
    },
    { 
        filename: 'articles/compose-multiplatform.md', 
        title: 'Compose Multiplatform: El Futuro del Desarrollo Móvil', 
        description: 'Compose Multiplatform es el framework de JetBrains que permite compartir código de UI entre Android, iOS, Desktop y Web usando Kotlin.', 
        icon: 'fas fa-mobile-alt'
    },
    { 
        filename: 'articles/poker-drills-ranges.md', 
        title: 'Poker Drills y Análisis de Rangos: Mejora Tu Juego', 
        description: 'Los drills de poker son ejercicios estructurados que mejoran tu toma de decisiones bajo presión...', 
        icon: 'fas fa-dice'
    }
]

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

// Función para mostrar artículos como cards
function displayArticleCards() {
    if (!articlesContainer) return;

    articlesContainer.innerHTML = '';
    
    // Filter to only ready articles (Ready checkbox must be true)
    const readyArticles = articles.filter(article => {
        // Only include if ready field is true
        // If ready field doesn't exist, don't include (safety - only show explicitly ready articles)
        return article.ready === true;
    });
    
    // Sort by published_date, last_edited_time, or created_time
    const sortedArticles = readyArticles.sort((a, b) => {
        const timeA = a.published_date || a.last_edited_time || a.created_time || '';
        const timeB = b.published_date || b.last_edited_time || b.created_time || '';
        return timeB.localeCompare(timeA); // Most recent first
    });
    
    sortedArticles.forEach((article) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card glass clickable-card';
        cardElement.setAttribute('data-type', 'article');
        cardElement.setAttribute('data-id', article.filename);
        
        cardElement.innerHTML = `
            <div class="card-header">
                <i class="${article.icon} icon-tech"></i>
                <span>${article.category || 'Artículo'}</span>
            </div>
            <div class="card-content">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
            </div>
        `;
        
        cardElement.addEventListener('click', () => {
            // Navegar a la página del artículo
            window.location.href = `article.html?file=${encodeURIComponent(article.filename)}`;
        });
        
        articlesContainer.appendChild(cardElement);
    });
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        displayArticleCards();
        loadAICurator();
        loadPokerPuzzle();
    });
} else {
    displayArticleCards();
    loadAICurator();
    loadPokerPuzzle();
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
                curatorContent.innerHTML = '<p class="typing-indicator">No hay noticias disponibles aún<span class="blink">_</span></p>';
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
                        <p style="color: #94a3b8;">No hay puzzle disponible aún. El primer puzzle se generará mañana.</p>
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
        commentsSection.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 1rem 0;">Error al cargar los comentarios.</p>';
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
                    <p style="color: #94a3b8;">No hay artículos disponibles aún en esta categoría.</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Clear container and create grid
    container.innerHTML = '';
    featuredArticles.forEach((article) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card glass clickable-card';
        cardElement.setAttribute('data-type', 'article');
        cardElement.setAttribute('data-id', article.filename);
        
        cardElement.innerHTML = `
            <div class="card-header">
                <i class="${article.icon} icon-tech"></i>
                <span>${article.category || 'Artículo'}</span>
            </div>
            <div class="card-content">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
            </div>
        `;
        
        cardElement.addEventListener('click', () => {
            window.location.href = `article.html?file=${encodeURIComponent(article.filename)}`;
        });
        
        container.appendChild(cardElement);
    });
}

// Initialize featured sections when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for articles to be loaded, then render featured sections
    setTimeout(() => {
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
                        <h2>Artículos de IA</h2>
                        <p class="subtitle">Últimos artículos sobre Inteligencia Artificial</p>
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
    }, 100);
});

// 2. ANIMACIÓN DE FONDO (Red Neuronal / Constelación)
const canvas = document.getElementById('bg-animation');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Manejo del redimensionamiento
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Crear partículas
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = (Math.random() * 0.4) - 0.2; // Movimiento lento
        this.directionY = (Math.random() * 0.4) - 0.2;
        this.size = Math.random() * 2;
        this.color = '#f97316'; // Color base (naranja)
    }
    update() {
        // Rebotar en bordes
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000; // Densidad
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Dibujar líneas entre partículas cercanas (Efecto Red Neuronal)
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(249, 115, 22,' + opacityValue + ')'; // Líneas naranjas
                ctx.lineWidth = 1;
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

// 3. MENÚ MÓVIL (Igual que antes)
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    if(nav.style.display === 'flex') {
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '70px';
        nav.style.right = '0';
        nav.style.background = 'rgba(5,5,17,0.95)';
        nav.style.width = '100%';
        nav.style.padding = '2rem';
    }
});