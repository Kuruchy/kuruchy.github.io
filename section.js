// Script para cargar secciones en section.html
// Metadatos de secciones (icono y tecnología)
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

// Función para cargar el contenido de una sección desde Markdown
function loadSectionContent(section) {
    const filePath = section.filename;
    
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
            return { ...section, content: htmlContent };
        })
        .catch(error => {
            console.error(`Error al cargar ${section.filename}:`, error);
            console.error('Ruta intentada:', filePath);
            throw error;
        });
}

// Cargar sección basada en parámetro URL
function loadSectionFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const sectionId = urlParams.get('id');
    
    console.log('Parámetro id de URL:', sectionId);
    console.log('Secciones disponibles:', Object.keys(sections));
    
    if (!sectionId) {
        document.getElementById('section-content').innerHTML = 
            '<p style="color: #ff6b6b;">No se especificó ninguna sección.</p>';
        return;
    }

    const section = sections[sectionId];
    if (!section) {
        document.getElementById('section-content').innerHTML = 
            `<div style="color: #ff6b6b;">
                <p>Sección no encontrada.</p>
                <p style="font-size: 0.9em;">Buscada: ${sectionId}</p>
                <p style="font-size: 0.9em;">Disponibles: ${Object.keys(sections).join(', ')}</p>
            </div>`;
        return;
    }
    
    console.log('Sección encontrada:', section);

    loadSectionContent(section)
        .then(loadedSection => {
            // Mostrar el contenido de la sección
            const sectionHTML = `
                <div class="section-header">
                    <h1 style="font-size: 3rem; font-weight: 800; background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; line-height: 1.2;">
                        ${loadedSection.title}
                    </h1>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1rem; opacity: 0.7;">
                        <i class="${loadedSection.icon}" style="font-size: 1.5rem; color: var(--accent-primary);"></i>
                        <span style="color: #94a3b8; font-size: 0.95rem;">${loadedSection.tech}</span>
                    </div>
                </div>
                <div class="article-content">${loadedSection.content}</div>
            `;
            
            document.getElementById('section-content').innerHTML = sectionHTML;
            document.title = `${loadedSection.title} | Kuruchy`;
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
            
            document.getElementById('section-content').innerHTML = 
                `<div style="color: #ff6b6b;">
                    <p><strong>Error al cargar la sección</strong></p>
                    <p>${errorMsg}</p>
                    <p style="font-size: 0.9em; margin-top: 1rem;">Archivo: ${section.filename}</p>
                    <p style="font-size: 0.9em;">Protocolo: ${window.location.protocol}</p>
                    ${helpText}
                </div>`;
        });
}

// Función para volver atrás
function goBackFromSection() {
    // Redirigir a la página principal
    window.location.href = 'index.html';
}

// Hacer la función global para que funcione desde el onclick
window.goBackFromSection = goBackFromSection;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSectionFromURL);
} else {
    loadSectionFromURL();
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

