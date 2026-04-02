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
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4 - 0.2; // slight upward drift
            this.radius = Math.random() * 2 + 0.5;
            // Fresh colors: Sky Blue or Emerald Green
            this.color = Math.random() > 0.5 ? '56, 189, 248' : '52, 211, 153';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around to keep it seamless
            if (this.x < -50) this.x = width + 50;
            if (this.x > width + 50) this.x = -50;
            if (this.y < -50) this.y = height + 50;
            if (this.y > height + 50) this.y = -50;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, 0.5)`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        // Dynamic density based on screen size, very breathable
        let particleCount = Math.floor((width * height) / 12000); 
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        loop();
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Connect nearby particles with subtle lines
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(148, 163, 184, ${0.15 - dist/120 * 0.15})`; // Slate-400
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Connect and interact with mouse
            let dxMouse = particles[i].x - mouse.x;
            let dyMouse = particles[i].y - mouse.y;
            let distMouse = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);
            
            if (distMouse < 150) {
                ctx.beginPath();
                // Line to mouse gets slightly tinted
                ctx.strokeStyle = `rgba(${particles[i].color}, ${0.3 - distMouse/150 * 0.3})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
                
                // Mouse gently pushes them away (breathing room)
                particles[i].x += dxMouse * 0.015;
                particles[i].y += dyMouse * 0.015;
            }
        }
        requestAnimationFrame(loop);
    }

    init();
});