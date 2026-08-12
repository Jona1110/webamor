document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PANTALLA DE BIENVENIDA Y AUDIO ---
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainContent = document.getElementById('mainContent');
    const startBtn = document.getElementById('startBtn');
    const audio = document.getElementById('miAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const icon = playPauseBtn.querySelector('i');
    
    let isPlaying = false;
    let typeWriterStarted = false;

    startBtn.addEventListener('click', () => {
        // Desvanecer pantalla de bienvenida
        welcomeScreen.classList.add('hidden');
        
        // Mostrar contenido principal
        setTimeout(() => {
            mainContent.classList.remove('hidden');
            mainContent.style.opacity = 1;
            
            // Iniciar Audio automáticamente
            audio.play().catch(e => console.log("Auto-play bloqueado por navegador", e));
            isPlaying = true;
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');

            // Iniciar Lluvia de Pétalos
            createPetals();
        }, 800);
    });

    // Controles del reproductor (Click manual)
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            icon.classList.replace('fa-pause', 'fa-play');
        } else {
            audio.play();
            icon.classList.replace('fa-play', 'fa-pause');
        }
        isPlaying = !isPlaying;
    });

    // Actualizar barra de progreso del audio
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const timeDisplay = document.getElementById('timeDisplay');

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            const mins = Math.floor(audio.currentTime / 60);
            const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${mins}:${secs}`;
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        audio.currentTime = (clickX / width) * audio.duration;
    });


    // --- 2. CONTADOR DE TIEMPO JUNTOS ---
    // ¡MODIFICA ESTA FECHA CON SU FECHA REAL DE ANIVERSARIO! (Formato: Año, Mes (0-11), Día)
    // Nota: El mes en JS va de 0 (Enero) a 11 (Diciembre).
    const startDate = new Date(2024, 7, 22); // Ejemplo: 22 de Septiembre de 2024

    function updateCounter() {
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    setInterval(updateCounter, 1000);
    updateCounter();


    // --- 3. GENERADOR DE PÉTALOS DE ROSA ---
    function createPetals() {
        const container = document.getElementById('petalsContainer');
        const petalCount = 30; // Cantidad de pétalos simultáneos

        for (let i = 0; i < petalCount; i++) {
            let petal = document.createElement('div');
            petal.classList.add('petal');
            
            // Posición y tamaño aleatorio
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.width = (Math.random() * 10 + 10) + 'px';
            petal.style.height = (Math.random() * 10 + 15) + 'px';
            
            // Duración y retraso de animación aleatoria
            petal.style.animationDuration = (Math.random() * 3 + 4) + 's'; // caen entre 4 y 7 segundos
            petal.style.animationDelay = Math.random() * 5 + 's';
            
            container.appendChild(petal);
        }
    }


    // --- 4. EFECTO MÁQUINA DE ESCRIBIR (Al hacer scroll) ---
    const textStr = document.getElementById('secretMessage').textContent;
    const typeWriterElement = document.getElementById('typewriterText');
    let i = 0;

    function typeWriter() {
        if (i < textStr.length) {
            typeWriterElement.textContent += textStr.charAt(i);
            i++;
            setTimeout(typeWriter, 40); // Velocidad de tipeo en ms
        }
    }


    // --- 5. LÓGICA DE LIGHTBOX PARA LA GALERÍA ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.close-lightbox');
    const galleryImages = document.querySelectorAll('.gallery-img');

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => {
        if(e.target !== lightboxImg) lightbox.classList.remove('active');
    });


    // --- 6. ANIMACIONES AL HACER SCROLL (Intersection Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Si la carta entra en pantalla, iniciar el efecto de escritura
                if(entry.target.classList.contains('letter-paper') && !typeWriterStarted) {
                    typeWriterStarted = true;
                    setTimeout(typeWriter, 500); // Pequeño delay antes de escribir
                }
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.scroll-anim, .fade-in').forEach(el => observer.observe(el));
});