document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'rain-canvas';
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
    let drops = [];
    let splashes = [];
    let mouseParticles = [];
    let mouse = { x: -1000, y: -1000 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        // Generate mouse trail particles
        for(let i = 0; i < 2; i++) {
            mouseParticles.push(new MouseParticle(mouse.x, mouse.y));
        }
    });
    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
    window.addEventListener('click', (e) => {
        // Generate click explosion particles
        for(let i = 0; i < 15; i++) {
            mouseParticles.push(new MouseParticle(e.clientX, e.clientY));
        }
    });

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
            
            // Mouse interaction: push drops away
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 100) {
                this.x += dx * 0.05;
            }

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
            ctx.strokeStyle = `rgba(160, 160, 160, ${this.thickness * 0.25})`; // Gray rain
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
            // Barça colors: Pale Blue (0, 77, 152) or Pale Red/Garnet (165, 0, 68)
            this.color = Math.random() > 0.5 ? '0, 77, 152' : '165, 0, 68';
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

    class MouseParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.speedX = (Math.random() - 0.5) * 3;
            this.speedY = (Math.random() - 0.5) * 3;
            this.life = 1;
            this.decay = Math.random() * 0.03 + 0.02;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? '0, 77, 152' : '165, 0, 68';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.life * 0.5})`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        for (let i = 0; i < 150; i++) {
            drops.push(new Drop());
        }
        loop();
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);
        
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

        for (let i = mouseParticles.length - 1; i >= 0; i--) {
            let p = mouseParticles[i];
            p.update();
            if (p.life <= 0) {
                mouseParticles.splice(i, 1);
            } else {
                p.draw();
            }
        }
        
        requestAnimationFrame(loop);
    }

    init();
});