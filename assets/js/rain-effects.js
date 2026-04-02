window.currentWeather = localStorage.getItem('blog-weather') || 'sunny';

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'weather-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Arrays for different particles
    let drops = [];
    let splashes = [];
    let snowflakes = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);

    // --- RAIN CLASSES ---
    class Drop {
        constructor() {
            this.reset();
            this.y = Math.random() * height;
        }
        reset() {
            this.x = Math.random() * width;
            this.y = -10;
            this.speed = Math.random() * 5 + 10;
            this.length = Math.random() * 20 + 10;
            this.thickness = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.y += this.speed;

            if (this.y > height) {
                this.splash();
                this.reset();
            }
        }
        splash() {
            for(let i = 0; i < 3; i++) {
                splashes.push(new Splash(this.x, height));
            }
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.length);
            ctx.strokeStyle = `rgba(160, 160, 160, ${this.thickness * 0.25})`; // Subtle gray rain
            ctx.lineWidth = this.thickness;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    class Splash {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.speedX = (Math.random() - 0.5) * 4;
            this.speedY = -Math.random() * 3 - 2;
            this.radius = Math.random() * 1.5 + 0.5;
            this.life = 1;
            this.decay = Math.random() * 0.05 + 0.02;
            this.color = Math.random() > 0.5 ? '0, 77, 152' : '165, 0, 68'; // Barca colors for splashes
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += 0.2; // gravity
            this.life -= this.decay;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.life * 0.6})`;
            ctx.fill();
        }
    }

    // --- SNOW CLASSES ---
    class Snowflake {
        constructor() {
            this.reset();
            this.y = Math.random() * height;
        }
        reset() {
            this.x = Math.random() * width;
            this.y = -10;
            this.speed = Math.random() * 1.5 + 0.5;
            this.radius = Math.random() * 2 + 1;
            this.wind = (Math.random() - 0.5) * 1;
            this.swing = Math.random() * Math.PI * 2;
            this.swingSpeed = Math.random() * 0.02 + 0.01;
        }
        update() {
            this.y += this.speed;
            this.swing += this.swingSpeed;
            this.x += Math.sin(this.swing) * 0.5 + this.wind;
            
            if (this.y > height) this.reset();
            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            // Make snow visible in light and dark mode: semi-transparent blue/white
            const isDark = document.documentElement.classList.contains('dark');
            ctx.fillStyle = isDark ? `rgba(255, 255, 255, 0.6)` : `rgba(160, 190, 230, 0.7)`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        for (let i = 0; i < 100; i++) {
            drops.push(new Drop());
        }
        for (let i = 0; i < 150; i++) {
            snowflakes.push(new Snowflake());
        }
        loop();
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);
        
        if (window.currentWeather === 'rain') {
            drops.forEach(drop => {
                drop.update();
                drop.draw();
            });

            for (let i = splashes.length - 1; i >= 0; i--) {
                let s = splashes[i];
                s.update();
                if (s.life <= 0) {
                    splashes.splice(i, 1);
                } else {
                    s.draw();
                }
            }
        } else if (window.currentWeather === 'snow') {
            snowflakes.forEach(flake => {
                flake.update();
                flake.draw();
            });
        }
        // If 'sunny', draw nothing
        
        requestAnimationFrame(loop);
    }

    init();
});