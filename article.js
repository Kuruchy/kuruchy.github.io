// Script para cargar artículos en article.html
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

// Función para cargar un artículo completo
function loadArticle(article) {
    // Usar la ruta tal como está definida (relativa al directorio raíz)
    const filePath = article.filename;
    
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            return response.text();
        })
        .then(text => {
            if (!text || text.trim() === '') {
                throw new Error('El archivo está vacío');
            }
            const htmlContent = marked.parse(text);
            return { ...article, content: htmlContent };
        })
        .catch(error => {
            console.error(`Error al cargar ${article.filename}:`, error);
            console.error('Ruta intentada:', filePath);
            throw error;
        });
}

// Cargar artículo basado en parámetro URL
function loadArticleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleFile = urlParams.get('file');
    
    console.log('Parámetro file de URL:', articleFile);
    console.log('Artículos disponibles:', articles.map(a => a.filename));
    
    if (!articleFile) {
        document.getElementById('article-content').innerHTML = 
            '<p style="color: #ff6b6b;">No se especificó ningún artículo.</p>';
        return;
    }

    // Decodificar el parámetro en caso de que esté codificado
    const decodedFile = decodeURIComponent(articleFile);
    console.log('Archivo decodificado:', decodedFile);
    
    const article = articles.find(a => a.filename === decodedFile || a.filename === articleFile);
    if (!article) {
        document.getElementById('article-content').innerHTML = 
            `<div style="color: #ff6b6b;">
                <p>Artículo no encontrado.</p>
                <p style="font-size: 0.9em;">Buscado: ${decodedFile}</p>
                <p style="font-size: 0.9em;">Disponibles: ${articles.map(a => a.filename).join(', ')}</p>
            </div>`;
        return;
    }
    
    console.log('Artículo encontrado:', article);

    loadArticle(article)
        .then(loadedArticle => {
            // Crear un header atractivo para el artículo
            const articleHTML = `
                <div class="article-header">
                    <h1>${loadedArticle.title}</h1>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1rem; opacity: 0.7;">
                        <i class="${loadedArticle.icon}" style="font-size: 1.5rem; color: var(--accent-primary);"></i>
                        <span style="color: #94a3b8; font-size: 0.95rem;">Artículo</span>
                    </div>
                </div>
                <div class="article-content">
                    ${loadedArticle.content}
                </div>
            `;
            document.getElementById('article-content').innerHTML = articleHTML;
            document.title = `${loadedArticle.title} | Kuruchy`;
            
            // Cargar comentarios de Giscus después de renderizar el Markdown
            loadComments();
        })
        .catch(error => {
            console.error('Error completo:', error);
            const errorMsg = error.message || 'Error desconocido';
            const isFileProtocol = window.location.protocol === 'file:';
            
            let helpText = '';
            if (isFileProtocol) {
                helpText = `
                    <p style="font-size: 0.9em; margin-top: 1rem; color: #ffd700;">
                        <strong>⚠️ Estás abriendo el archivo directamente desde el sistema de archivos.</strong><br>
                        Los navegadores bloquean las peticiones fetch() con el protocolo file:// por seguridad.<br>
                        <strong>Solución:</strong> Usa un servidor local. Ejemplos:<br>
                        • Python: <code>python3 -m http.server 8000</code><br>
                        • Node.js: <code>npx http-server</code><br>
                        • VS Code: Instala la extensión "Live Server"
                    </p>
                `;
            }
            
            document.getElementById('article-content').innerHTML = 
                `<div style="color: #ff6b6b;">
                    <p><strong>Error al cargar el artículo</strong></p>
                    <p>${errorMsg}</p>
                    <p style="font-size: 0.9em; margin-top: 1rem;">Archivo: ${article.filename}</p>
                    <p style="font-size: 0.9em;">Protocolo: ${window.location.protocol}</p>
                    ${helpText}
                </div>`;
        });
}

// Función para cargar comentarios de Giscus
function loadComments() {
    const commentsSection = document.getElementById('comments-section');
    if (!commentsSection) return;
    
    // Limpiar cualquier script previo de Giscus
    const existingScript = document.querySelector('script[src="https://giscus.app/client.js"]');
    if (existingScript) {
        existingScript.remove();
    }
    
    // Crear el script de Giscus dinámicamente
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'kuruchy/kuruchy.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOGPIhoQ');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOGPIhoc4CyDKy');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'es');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    // Añadir el script al contenedor de comentarios
    commentsSection.appendChild(script);
}

// Función para volver atrás
function goBackFromArticle() {
    // Redirigir a la página principal
    window.location.href = 'index.html#blog';
}

// Hacer la función global para que funcione desde el onclick
window.goBackFromArticle = goBackFromArticle;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadArticleFromURL);
} else {
    loadArticleFromURL();
}

// ANIMACIÓN DE FONDO (mismo código que index.html)
const canvas = document.getElementById('bg-animation');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = (Math.random() * 0.4) - 0.2;
        this.directionY = (Math.random() * 0.4) - 0.2;
        this.size = Math.random() * 2;
        this.color = '#a855f7';
    }
    update() {
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
    let numberOfParticles = (canvas.height * canvas.width) / 15000;
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

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(168, 85, 247,' + opacityValue + ')';
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

// MENÚ MÓVIL
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
if (burger && nav) {
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
}

