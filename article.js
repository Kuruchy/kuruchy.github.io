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
                throw new Error('The file is empty');
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
                    <p>Article not found.</p>
                    <p style="font-size: 0.9em;">Searched: ${decodedFile}</p>
                    <p style="font-size: 0.9em;">Available: ${articles.length > 0 ? articles.map(a => a.filename).join(', ') : 'None'}</p>
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
                                <span>Article</span>
                            </div>
                        </div>
                    </div>
                    <div class="article-content">
                        ${processedContent}
                    </div>
                `;
                document.getElementById('article-content').innerHTML = articleHTML;
                document.title = `${loadedArticle.title} | Kuruchy`;
                
                // Generate TOC and reading time after content is rendered
                setTimeout(() => {
                    generateTableOfContents();
                    displayReadingTime();
                    setupArticleSmoothScroll();
                }, 200);
                
                // Cargar comentarios de Giscus después de renderizar el Markdown
                // Usar un pequeño delay para asegurar que el DOM esté completamente renderizado
                setTimeout(() => {
                    // Usar el nombre del archivo como term para comentarios únicos por artículo
                    const articleId = loadedArticle.filename.replace(/[^a-zA-Z0-9]/g, '-');
                    loadComments(articleId);
                }, 300);
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
                        <p><strong>Error loading article</strong></p>
                        <p>${errorMsg}</p>
                        <p style="font-size: 0.9em; margin-top: 1rem;">Archivo: ${article.filename}</p>
                        <p style="font-size: 0.9em;">Protocolo: ${window.location.protocol}</p>
                        ${helpText}
                    </div>`;
            });
    }).catch(error => {
        console.error('Error loading articles:', error);
        document.getElementById('article-content').innerHTML = 
            '<div style="color: #ff6b6b;"><p>Error loading article list.</p></div>';
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
    commentsSection.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 2rem 0;">Loading comments...</p>';
    
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
        commentsSection.innerHTML = '<p style="text-align: center; color: #ff6b6b; padding: 2rem 0;">Error loading comments. Please reload the page.</p>';
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

// Reading progress indicator
function setupReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

// Table of Contents generator
function generateTableOfContents() {
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;
    
    const headings = articleContent.querySelectorAll('h2, h3');
    if (headings.length === 0) return;
    
    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-container';
    tocContainer.innerHTML = '<div class="toc-title"><i class="fas fa-list"></i> Contents</div><ul class="toc-list"></ul>';
    const tocList = tocContainer.querySelector('.toc-list');
    
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = heading.textContent;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(id);
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
        li.appendChild(a);
        tocList.appendChild(li);
    });
    
    // Insert TOC before article content
    const articleView = document.querySelector('.article-view');
    if (articleView) {
        const articleContentWrapper = articleContent.parentElement;
        articleContentWrapper.insertBefore(tocContainer, articleContent);
    }
    
    // Update active TOC item on scroll
    function updateActiveTOC() {
        const scrollPos = window.pageYOffset + 150;
        const tocLinks = tocList.querySelectorAll('a');
        
        headings.forEach((heading, index) => {
            const headingTop = heading.offsetTop;
            const headingBottom = headingTop + heading.offsetHeight;
            const tocLink = tocLinks[index];
            
            if (scrollPos >= headingTop && scrollPos < headingBottom) {
                tocLinks.forEach(link => link.classList.remove('active'));
                if (tocLink) tocLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveTOC);
    updateActiveTOC();
}

// Calculate and display reading time
function displayReadingTime() {
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;
    
    const text = articleContent.textContent || articleContent.innerText || '';
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    
    const readingTimeDiv = document.createElement('div');
    readingTimeDiv.className = 'article-reading-time';
    readingTimeDiv.style.marginBottom = '2rem';
    readingTimeDiv.innerHTML = `<i class="fas fa-clock"></i> ${minutes} min read`;
    
    const articleHeader = document.querySelector('.article-header');
    if (articleHeader) {
        articleHeader.appendChild(readingTimeDiv);
    }
}

// Enhanced back to top for article page
function setupArticleBackToTop() {
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

// Smooth scroll for anchor links in article
function setupArticleSmoothScroll() {
    document.querySelectorAll('.article-content a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadArticleFromURL();
        setupReadingProgress();
        setupArticleBackToTop();
    });
} else {
    loadArticleFromURL();
    setupReadingProgress();
    setupArticleBackToTop();
}

// TOC and reading time are now generated after article content is loaded in loadArticleFromURL

// ANIMACIÓN DE FONDO (Enhanced - same as index.html)
const canvas = document.getElementById('bg-animation');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particlesArray = [];
    let mouse = { x: null, y: null };
    let mouseRadius = 150;
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.directionX = (Math.random() * 0.5) - 0.25;
            this.directionY = (Math.random() * 0.5) - 0.25;
            this.size = Math.random() * 2.5 + 0.5;
            this.baseColor = { r: 249, g: 115, b: 22 };
            this.opacity = Math.random() * 0.5 + 0.3;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }
        
        update() {
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
            
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            
            this.x += this.directionX;
            this.y += this.directionY;
            
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
        ctx.fillStyle = 'rgba(5, 5, 17, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }
    
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

