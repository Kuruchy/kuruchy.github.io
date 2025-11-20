// Script para cargar secciones en section.html
// Datos de secciones (mismo que en script.js)
const sections = {
    'ai-vision-system': {
        title: 'AI Vision System',
        icon: 'fas fa-brain',
        tech: 'TensorFlow / Python',
        content: `
            <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.8;">Sistema de visión por computador para detección de objetos en tiempo real optimizado para edge devices.</p>
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
            <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.8;">Aplicación multiplataforma (iOS/Android) de finanzas con predicción de gastos basada en ML.</p>
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
            <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.8;">Chatbot contextual integrado en WhatsApp para gestión de tareas automatizadas.</p>
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
            <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.8;">Análisis de tendencias, indicadores técnicos y gestión de riesgo en mercados financieros.</p>
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
            <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.8;">Seguimiento de inversiones en criptoactivos y análisis de proyectos blockchain.</p>
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
            <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.8;">Evaluación de empresas, ratios financieros y estrategias de inversión a largo plazo.</p>
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
            <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.8;">Ejercicios de cálculo de odds, análisis de rangos y toma de decisiones en situaciones complejas.</p>
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
            <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.8;">Construcción y análisis de rangos de manos según posición, stack y dinámica de mesa.</p>
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
            <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.8;">Aplicación de teoría de juegos, equilibrio de Nash y estrategias GTO en poker moderno.</p>
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
    
    // Mostrar el contenido de la sección
    const sectionHTML = `
        <div class="section-header">
            <h1 style="font-size: 3rem; font-weight: 800; background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; line-height: 1.2;">
                ${section.title}
            </h1>
            <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1rem; opacity: 0.7;">
                <i class="${section.icon}" style="font-size: 1.5rem; color: var(--accent-primary);"></i>
                <span style="color: #94a3b8; font-size: 0.95rem;">${section.tech}</span>
            </div>
        </div>
        <div class="article-content">${section.content}</div>
    `;
    
    document.getElementById('section-content').innerHTML = sectionHTML;
    document.title = `${section.title} | Kuruchy`;
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

