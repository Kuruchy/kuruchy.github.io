// 1. CONFIGURACIÓN DEL BLOG MARKDOWN
// Cargar automáticamente los últimos 5 artículos
const articlesContainer = document.getElementById('articles-container');

// Lista de artículos (ordenados del más reciente al más antiguo)
const articles = [
    { filename: 'articles/ai.md', title: 'Inteligencia Artificial' },
    { filename: 'articles/poker-drills-ranges.md', title: 'Poker Drills y Rangos' },
    { filename: 'articles/compose-multiplatform.md', title: 'Compose Multiplatform' }
];

// Limitar a los últimos 5 artículos
const latestArticles = articles.slice(0, 5);

function loadArticle(article) {
    return fetch(article.filename)
        .then(response => {
            if (!response.ok) throw new Error(`No se encontró el archivo ${article.filename}`);
            return response.text();
        })
        .then(text => {
            // Convertir MD a HTML usando marked.js
            const htmlContent = marked.parse(text);
            return { ...article, content: htmlContent };
        })
        .catch(error => {
            console.error(`Error al cargar ${article.filename}:`, error);
            return { ...article, content: `<p style="color: #ff6b6b;">Error al cargar el artículo.</p>` };
        });
}

// Cargar todos los artículos
function loadAllArticles() {
    if (!articlesContainer) return;

    const loadPromises = latestArticles.map(article => loadArticle(article));
    
    Promise.all(loadPromises)
        .then(loadedArticles => {
            articlesContainer.innerHTML = '';
            
            loadedArticles.forEach((article, index) => {
                const articleElement = document.createElement('div');
                articleElement.className = 'glass blog-container article-item';
                articleElement.innerHTML = article.content;
                articlesContainer.appendChild(articleElement);
            });
        })
        .catch(error => {
            articlesContainer.innerHTML = 
                `<p style="color: #ff6b6b; text-align: center;">Error al cargar los artículos: ${error.message}</p>`;
        });
}

// Cargar artículos cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllArticles);
} else {
    loadAllArticles();
}


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