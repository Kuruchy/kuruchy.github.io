// 1. CONFIGURACIÓN DEL BLOG MARKDOWN
// Cargar automáticamente los últimos 5 artículos
const articlesContainer = document.getElementById('articles-container');
const articleViewContainer = document.getElementById('article-view-container');
const mainContent = document.getElementById('main-content');

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

// Datos de secciones para las páginas de detalle
const sections = {
    'ai-vision-system': {
        title: 'AI Vision System',
        icon: 'fas fa-brain',
        tech: 'TensorFlow / Python',
        content: `
            <h2>AI Vision System</h2>
            <p>Sistema de visión por computador para detección de objetos en tiempo real optimizado para edge devices.</p>
            <h3>Características Principales</h3>
            <ul>
                <li>Detección de objetos en tiempo real</li>
                <li>Optimizado para dispositivos edge</li>
                <li>Baja latencia y alto rendimiento</li>
                <li>Modelos TensorFlow Lite para móviles</li>
            </ul>
            <h3>Tecnologías Utilizadas</h3>
            <ul>
                <li>TensorFlow 2.x</li>
                <li>OpenCV para procesamiento de imágenes</li>
                <li>Python para backend</li>
                <li>TensorFlow Lite para deployment</li>
            </ul>
        `
    },
    'ecowallet-app': {
        title: 'EcoWallet App',
        icon: 'fas fa-mobile-alt',
        tech: 'Flutter / React Native',
        content: `
            <h2>EcoWallet App</h2>
            <p>Aplicación multiplataforma (iOS/Android) de finanzas con predicción de gastos basada en ML.</p>
            <h3>Características Principales</h3>
            <ul>
                <li>Gestión de finanzas personales</li>
                <li>Predicción de gastos con Machine Learning</li>
                <li>Interfaz multiplataforma</li>
                <li>Sincronización en la nube</li>
            </ul>
            <h3>Tecnologías Utilizadas</h3>
            <ul>
                <li>Flutter / React Native</li>
                <li>TensorFlow.js para predicciones</li>
                <li>Firebase para backend</li>
                <li>GraphQL para APIs</li>
            </ul>
        `
    },
    'asistente-cognitivo': {
        title: 'Asistente Cognitivo',
        icon: 'fas fa-robot',
        tech: 'OpenAI API / Node.js',
        content: `
            <h2>Asistente Cognitivo</h2>
            <p>Chatbot contextual integrado en WhatsApp para gestión de tareas automatizadas.</p>
            <h3>Características Principales</h3>
            <ul>
                <li>Integración con WhatsApp Business API</li>
                <li>Gestión automática de tareas</li>
                <li>Respuestas contextuales inteligentes</li>
                <li>Procesamiento de lenguaje natural</li>
            </ul>
            <h3>Tecnologías Utilizadas</h3>
            <ul>
                <li>OpenAI GPT-4 API</li>
                <li>Node.js y Express</li>
                <li>WhatsApp Business API</li>
                <li>MongoDB para almacenamiento</li>
            </ul>
        `
    },
    'estrategias-trading': {
        title: 'Estrategias de Trading',
        icon: 'fas fa-chart-line',
        tech: 'Análisis Técnico',
        content: `
            <h2>Estrategias de Trading</h2>
            <p>Análisis de tendencias, indicadores técnicos y gestión de riesgo en mercados financieros.</p>
            <h3>Enfoque</h3>
            <ul>
                <li>Análisis técnico avanzado</li>
                <li>Indicadores personalizados</li>
                <li>Gestión de riesgo estricta</li>
                <li>Backtesting de estrategias</li>
            </ul>
        `
    },
    'portfolio-digital': {
        title: 'Portfolio Digital',
        icon: 'fas fa-coins',
        tech: 'Criptomonedas',
        content: `
            <h2>Portfolio Digital</h2>
            <p>Seguimiento de inversiones en criptoactivos y análisis de proyectos blockchain.</p>
            <h3>Enfoque</h3>
            <ul>
                <li>Análisis fundamental de proyectos</li>
                <li>Seguimiento de portfolio</li>
                <li>Análisis de tendencias del mercado</li>
                <li>Gestión de riesgo en cripto</li>
            </ul>
        `
    },
    'analisis-fundamental': {
        title: 'Análisis Fundamental',
        icon: 'fas fa-building',
        tech: 'Acciones',
        content: `
            <h2>Análisis Fundamental</h2>
            <p>Evaluación de empresas, ratios financieros y estrategias de inversión a largo plazo.</p>
            <h3>Enfoque</h3>
            <ul>
                <li>Análisis de estados financieros</li>
                <li>Evaluación de ratios clave</li>
                <li>Análisis de la industria</li>
                <li>Estrategias value investing</li>
            </ul>
        `
    },
    'entrenamiento-diario': {
        title: 'Entrenamiento Diario',
        icon: 'fas fa-dice',
        tech: 'Drills & Práctica',
        content: `
            <h2>Entrenamiento Diario</h2>
            <p>Ejercicios de cálculo de odds, análisis de rangos y toma de decisiones en situaciones complejas.</p>
            <h3>Enfoque</h3>
            <ul>
                <li>Drills de cálculo de odds</li>
                <li>Análisis de rangos</li>
                <li>Decisiones en situaciones complejas</li>
                <li>Práctica estructurada</li>
            </ul>
        `
    },
    'range-construction': {
        title: 'Range Construction',
        icon: 'fas fa-table',
        tech: 'Análisis de Rangos',
        content: `
            <h2>Range Construction</h2>
            <p>Construcción y análisis de rangos de manos según posición, stack y dinámica de mesa.</p>
            <h3>Enfoque</h3>
            <ul>
                <li>Construcción de rangos por posición</li>
                <li>Análisis según stack depth</li>
                <li>Dinámica de mesa</li>
                <li>GTO y estrategias explotativas</li>
            </ul>
        `
    },
    'game-theory': {
        title: 'Game Theory',
        icon: 'fas fa-brain',
        tech: 'Estrategia Avanzada',
        content: `
            <h2>Game Theory</h2>
            <p>Aplicación de teoría de juegos, equilibrio de Nash y estrategias GTO en poker moderno.</p>
            <h3>Enfoque</h3>
            <ul>
                <li>Teoría de juegos aplicada</li>
                <li>Equilibrio de Nash</li>
                <li>Estrategias GTO</li>
                <li>Análisis con solvers</li>
            </ul>
        `
    }
};

// Función para cargar un artículo completo
function loadArticle(article) {
    return fetch(article.filename)
        .then(response => {
            if (!response.ok) throw new Error(`No se encontró el archivo ${article.filename}`);
            return response.text();
        })
        .then(text => {
            const htmlContent = marked.parse(text);
            return { ...article, content: htmlContent };
        })
        .catch(error => {
            console.error(`Error al cargar ${article.filename}:`, error);
            return { ...article, content: `<p style="color: #ff6b6b;">Error al cargar el artículo.</p>` };
        });
}

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
            showArticle(article.filename);
        });
        
        articlesContainer.appendChild(cardElement);
    });
}

// Función para mostrar un artículo completo
function showArticle(articleFilename) {
    const article = articles.find(a => a.filename === articleFilename);
    if (!article) return;

    loadArticle(article).then(loadedArticle => {
        if (mainContent) mainContent.style.display = 'none';
        if (articleViewContainer) {
            articleViewContainer.style.display = 'block';
            articleViewContainer.innerHTML = `
                <div class="article-view glass">
                    <button class="btn-back" onclick="goBack()">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                    <div class="article-content">${loadedArticle.content}</div>
                </div>
            `;
        }
        window.scrollTo(0, 0);
        window.location.hash = `article/${articleFilename}`;
    });
}

// Función para mostrar una sección
function showSection(sectionId) {
    const section = sections[sectionId];
    if (!section) return;

    if (mainContent) mainContent.style.display = 'none';
    if (articleViewContainer) {
        articleViewContainer.style.display = 'block';
        articleViewContainer.innerHTML = `
            <div class="article-view glass">
                <button class="btn-back" onclick="goBack()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <div class="section-header">
                    <div class="card-header">
                        <i class="${section.icon} icon-tech"></i>
                        <span>${section.tech}</span>
                    </div>
                </div>
                <div class="article-content">${section.content}</div>
            </div>
        `;
    }
    window.scrollTo(0, 0);
    window.location.hash = `section/${sectionId}`;
}

// Función para volver atrás
function goBack() {
    if (mainContent) mainContent.style.display = 'block';
    if (articleViewContainer) {
        articleViewContainer.style.display = 'none';
        articleViewContainer.innerHTML = '';
    }
    window.location.hash = '';
}

// Manejar routing con hash
function handleRouting() {
    const hash = window.location.hash.substring(1);
    
    if (hash.startsWith('article/')) {
        const articleFilename = hash.replace('article/', '');
        showArticle(articleFilename);
    } else if (hash.startsWith('section/')) {
        const sectionId = hash.replace('section/', '');
        showSection(sectionId);
    } else {
        goBack();
    }
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        displayArticleCards();
        handleRouting();
    });
} else {
    displayArticleCards();
    handleRouting();
}

// Escuchar cambios en el hash
window.addEventListener('hashchange', handleRouting);

// Hacer las cards de secciones clickables
document.addEventListener('DOMContentLoaded', () => {
    // Portfolio cards
    const portfolioCards = document.querySelectorAll('#portfolio .card');
    portfolioCards.forEach((card, index) => {
        const sectionIds = ['ai-vision-system', 'ecowallet-app', 'asistente-cognitivo'];
        if (sectionIds[index]) {
            card.classList.add('clickable-card');
            card.addEventListener('click', () => showSection(sectionIds[index]));
        }
    });

    // Investment cards
    const investmentCards = document.querySelectorAll('#investments .card');
    investmentCards.forEach((card, index) => {
        const sectionIds = ['estrategias-trading', 'portfolio-digital', 'analisis-fundamental'];
        if (sectionIds[index]) {
            card.classList.add('clickable-card');
            card.addEventListener('click', () => showSection(sectionIds[index]));
        }
    });

    // Poker cards
    const pokerCards = document.querySelectorAll('#poker .card');
    pokerCards.forEach((card, index) => {
        const sectionIds = ['entrenamiento-diario', 'range-construction', 'game-theory'];
        if (sectionIds[index]) {
            card.classList.add('clickable-card');
            card.addEventListener('click', () => showSection(sectionIds[index]));
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