// 1. CONFIGURACIÓN DEL BLOG MARKDOWN
// Cargar automáticamente los últimos 5 artículos
const articlesContainer = document.getElementById('articles-container');

// Lista de artículos (ordenados del más reciente al más antiguo)
const articles = [
    { 
        filename: 'articles/ai.md', 
        title: 'Inteligencia Artificial',
        description: 'La Inteligencia Artificial ha dejado de ser ciencia ficción. Desde ChatGPT hasta Midjourney, las herramientas de IA están transformando cómo trabajamos, creamos y pensamos.',
        icon: 'fas fa-brain'
    },
    { 
        filename: 'articles/poker-drills-ranges.md', 
        title: 'Poker Drills y Rangos',
        description: 'Los drills de poker son ejercicios estructurados que mejoran tu toma de decisiones bajo presión. Aprende a construir rangos y calcular equity.',
        icon: 'fas fa-dice'
    },
    { 
        filename: 'articles/compose-multiplatform.md', 
        title: 'Compose Multiplatform',
        description: 'El framework de JetBrains que permite compartir código de UI entre Android, iOS, Desktop y Web usando Kotlin.',
        icon: 'fas fa-mobile-alt'
    }
];

// Datos de secciones para las páginas de detalle (metadatos - el contenido está en archivos Markdown)
const sections = {
    'ai-vision-system': {
        title: 'AI Vision System',
        icon: 'fas fa-brain',
        tech: 'TensorFlow / Python',
        filename: 'sections/ai-vision-system.md'
    },
    'ecowallet-app': {
        title: 'EcoWallet App',
        icon: 'fas fa-mobile-alt',
        tech: 'Flutter / React Native',
        filename: 'sections/ecowallet-app.md'
    },
    'asistente-cognitivo': {
        title: 'Asistente Cognitivo',
        icon: 'fas fa-robot',
        tech: 'OpenAI API / Node.js',
        filename: 'sections/asistente-cognitivo.md'
    },
    'estrategias-trading': {
        title: 'Estrategias de Trading',
        icon: 'fas fa-chart-line',
        tech: 'Análisis Técnico',
        filename: 'sections/estrategias-trading.md'
    },
    'portfolio-digital': {
        title: 'Portfolio Digital',
        icon: 'fas fa-coins',
        tech: 'Criptomonedas',
        filename: 'sections/portfolio-digital.md'
    },
    'analisis-fundamental': {
        title: 'Análisis Fundamental',
        icon: 'fas fa-building',
        tech: 'Acciones',
        filename: 'sections/analisis-fundamental.md'
    },
    'entrenamiento-diario': {
        title: 'Entrenamiento Diario',
        icon: 'fas fa-dice',
        tech: 'Drills & Práctica',
        filename: 'sections/entrenamiento-diario.md'
    },
    'range-construction': {
        title: 'Range Construction',
        icon: 'fas fa-table',
        tech: 'Análisis de Rangos',
        filename: 'sections/range-construction.md'
    },
    'game-theory': {
        title: 'Game Theory',
        icon: 'fas fa-brain',
        tech: 'Estrategia Avanzada',
        filename: 'sections/game-theory.md'
    }
};

// Función para mostrar artículos como cards
function displayArticleCards() {
    if (!articlesContainer) return;

    articlesContainer.innerHTML = '';
    
    articles.forEach((article) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card glass clickable-card';
        cardElement.setAttribute('data-type', 'article');
        cardElement.setAttribute('data-id', article.filename);
        
        cardElement.innerHTML = `
            <div class="card-header">
                <i class="${article.icon} icon-tech"></i>
                <span>Artículo</span>
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
    });
} else {
    displayArticleCards();
    loadAICurator();
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
            renderAICurator(data, curatorContent);
        })
        .catch(error => {
            console.error('Error loading AI Curator:', error);
            curatorContent.innerHTML = `
                <div class="terminal-line">
                    <span class="terminal-prompt">$</span>
                    <span class="terminal-text">Connecting to neural net...</span>
                    <span class="terminal-cursor">█</span>
                </div>
                <div class="terminal-line">
                    <span class="terminal-error">⚠️  Neural net offline. Check back later.</span>
                </div>
            `;
        });
}

function renderAICurator(news, container) {
    container.innerHTML = '';
    
    // Header line
    const headerLine = document.createElement('div');
    headerLine.className = 'terminal-line';
    headerLine.innerHTML = `
        <span class="terminal-prompt">$</span>
        <span class="terminal-text">curl -X GET https://hackernews.ai/top-5</span>
        <span class="terminal-cursor">█</span>
    `;
    container.appendChild(headerLine);
    
    // Loading simulation
    setTimeout(() => {
        const loadingLine = document.createElement('div');
        loadingLine.className = 'terminal-line';
        loadingLine.innerHTML = `
            <span class="terminal-success">✓ Connected to HackerNews API</span>
        `;
        container.appendChild(loadingLine);
        
        setTimeout(() => {
            const processingLine = document.createElement('div');
            processingLine.className = 'terminal-line';
            processingLine.innerHTML = `
                <span class="terminal-success">✓ Processing with GPT-4...</span>
            `;
            container.appendChild(processingLine);
            
            setTimeout(() => {
                // News items
                news.forEach((item, index) => {
                    setTimeout(() => {
                        const newsItem = document.createElement('div');
                        newsItem.className = 'terminal-news-item';
                        newsItem.innerHTML = `
                            <div class="terminal-line">
                                <span class="terminal-prompt">[${index + 1}]</span>
                                <span class="terminal-text">${item.title}</span>
                            </div>
                            <div class="terminal-line terminal-summary">
                                <span class="terminal-comment">//</span>
                                <span class="terminal-text">${item.summary}</span>
                            </div>
                            <div class="terminal-line">
                                <span class="terminal-link" onclick="window.open('${item.link}', '_blank')">
                                    → ${item.link}
                                </span>
                            </div>
                        `;
                        container.appendChild(newsItem);
                        
                        // Add cursor to last item
                        if (index === news.length - 1) {
                            setTimeout(() => {
                                const cursorLine = document.createElement('div');
                                cursorLine.className = 'terminal-line';
                                cursorLine.innerHTML = `
                                    <span class="terminal-prompt">$</span>
                                    <span class="terminal-cursor">█</span>
                                `;
                                container.appendChild(cursorLine);
                            }, 300);
                        }
                    }, index * 200);
                });
            }, 500);
        }, 500);
    }, 500);
}

// Hacer las cards de secciones clickables
document.addEventListener('DOMContentLoaded', () => {
    // Portfolio cards
    const portfolioCards = document.querySelectorAll('#portfolio .card');
    portfolioCards.forEach((card, index) => {
        const sectionIds = ['ai-vision-system', 'ecowallet-app', 'asistente-cognitivo'];
        if (sectionIds[index]) {
            card.classList.add('clickable-card');
            card.addEventListener('click', () => {
                // Navegar a la página de la sección
                window.location.href = `section.html?id=${sectionIds[index]}`;
            });
        }
    });

    // Investment cards
    const investmentCards = document.querySelectorAll('#investments .card');
    investmentCards.forEach((card, index) => {
        const sectionIds = ['estrategias-trading', 'portfolio-digital', 'analisis-fundamental'];
        if (sectionIds[index]) {
            card.classList.add('clickable-card');
            card.addEventListener('click', () => {
                // Navegar a la página de la sección
                window.location.href = `section.html?id=${sectionIds[index]}`;
            });
        }
    });

    // Poker cards
    const pokerCards = document.querySelectorAll('#poker .card');
    pokerCards.forEach((card, index) => {
        const sectionIds = ['entrenamiento-diario', 'range-construction', 'game-theory'];
        if (sectionIds[index]) {
            card.classList.add('clickable-card');
            card.addEventListener('click', () => {
                // Navegar a la página de la sección
                window.location.href = `section.html?id=${sectionIds[index]}`;
            });
        }
    });
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
        this.color = '#a855f7'; // Color base (morado)
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
                ctx.strokeStyle = 'rgba(168, 85, 247,' + opacityValue + ')'; // Líneas moradas
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