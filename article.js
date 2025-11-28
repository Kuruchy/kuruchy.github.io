// Script para cargar artículos en article.html
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
    
    if (!articleFile) {
        document.getElementById('article-content').innerHTML = 
            '<p style="color: #ff6b6b;">No se especificó ningún artículo.</p>';
        return;
    }

    // Primero cargar los artículos desde el JSON, luego buscar el artículo
    loadArticles().then(() => {
        // Decodificar el parámetro en caso de que esté codificado
        const decodedFile = decodeURIComponent(articleFile);
        console.log('Parámetro file de URL:', articleFile);
        console.log('Archivo decodificado:', decodedFile);
        console.log('Artículos disponibles:', articles.map(a => a.filename));
        
        const article = articles.find(a => a.filename === decodedFile || a.filename === articleFile);
        if (!article) {
            document.getElementById('article-content').innerHTML = 
                `<div style="color: #ff6b6b;">
                    <p>Artículo no encontrado.</p>
                    <p style="font-size: 0.9em;">Buscado: ${decodedFile}</p>
                    <p style="font-size: 0.9em;">Disponibles: ${articles.length > 0 ? articles.map(a => a.filename).join(', ') : 'Ninguno'}</p>
                </div>`;
            return;
        }
        
        console.log('Artículo encontrado:', article);

        loadArticle(article)
            .then(loadedArticle => {
                // Remove the first h1 from markdown content if it matches the article title
                let processedContent = loadedArticle.content;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = processedContent;
                const firstH1 = tempDiv.querySelector('h1');
                if (firstH1 && firstH1.textContent.trim() === loadedArticle.title.trim()) {
                    firstH1.remove();
                    processedContent = tempDiv.innerHTML;
                }
                
                // Crear un header atractivo para el artículo
                const articleHTML = `
                    <div class="article-header">
                        <div class="article-title-row">
                            <h1>${loadedArticle.title}</h1>
                            <div class="article-type-badge">
                                <i class="${loadedArticle.icon}"></i>
                                <span>Artículo</span>
                            </div>
                        </div>
                    </div>
                    <div class="article-content">
                        ${processedContent}
                    </div>
                `;
                document.getElementById('article-content').innerHTML = articleHTML;
                document.title = `${loadedArticle.title} | Kuruchy`;
                
                // Cargar comentarios de Giscus después de renderizar el Markdown
                // Usar un pequeño delay para asegurar que el DOM esté completamente renderizado
                setTimeout(() => {
                    // Usar el nombre del archivo como term para comentarios únicos por artículo
                    const articleId = loadedArticle.filename.replace(/[^a-zA-Z0-9]/g, '-');
                    loadComments(articleId);
                }, 100);
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
    }).catch(error => {
        console.error('Error loading articles:', error);
        document.getElementById('article-content').innerHTML = 
            '<div style="color: #ff6b6b;"><p>Error al cargar la lista de artículos.</p></div>';
    });
}

// Función para cargar comentarios de Giscus
// term: ID único para identificar el hilo de comentarios (opcional, si no se proporciona usa pathname)
function loadComments(term = null) {
    const commentsSection = document.getElementById('comments-section');
    if (!commentsSection) {
        console.error('No se encontró el contenedor #comments-section');
        return;
    }
    
    // Limpiar cualquier script previo de Giscus
    const existingScript = document.querySelector('script[src="https://giscus.app/client.js"]');
    if (existingScript) {
        existingScript.remove();
    }
    
    // Limpiar el contenedor antes de añadir el nuevo script
    commentsSection.innerHTML = '';
    
    // Añadir un mensaje de carga temporal
    commentsSection.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 2rem 0;">Cargando comentarios...</p>';
    
    // Crear el script de Giscus dinámicamente
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'kuruchy/kuruchy.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOGPIhoQ');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOGPIhoc4CyDKy');
    
    // Si se proporciona un term, usar data-term con mapping 'specific'
    // Si no, usar pathname como antes
    if (term) {
        script.setAttribute('data-mapping', 'specific');
        script.setAttribute('data-term', term);
    } else {
        script.setAttribute('data-mapping', 'pathname');
    }
    
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
        commentsSection.innerHTML = '<p style="text-align: center; color: #ff6b6b; padding: 2rem 0;">Error al cargar los comentarios. Por favor, recarga la página.</p>';
        console.error('Error al cargar el script de Giscus');
    };
    
    // Añadir el script al contenedor de comentarios
    commentsSection.appendChild(script);
    
    console.log(`Giscus script añadido al contenedor${term ? ` con term: ${term}` : ' usando pathname'}`);
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
        this.color = '#f97316';
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
                ctx.strokeStyle = 'rgba(249, 115, 22,' + opacityValue + ')';
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

