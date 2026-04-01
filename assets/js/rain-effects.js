
class RainEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        document.body.appendChild(this.canvas);

        this.drops = [];
        this.ripples = [];
        this.splashes = []; // New array for bottom splashes
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Barça colors (slightly more visible but still subtle)
        this.colors = {
            blue: 'rgba(0, 77, 152, 0.15)',
            red: 'rgba(165, 0, 68, 0.15)',
            rippleBlue: 'rgba(0, 77, 152, 0.3)',
            rippleRed: 'rgba(165, 0, 68, 0.3)',
            splashBlue: 'rgba(0, 77, 152, 0.2)',
            splashRed: 'rgba(165, 0, 68, 0.2)'
        };

        this.init();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousedown', (e) => this.addRipple(e.clientX, e.clientY));
        
        window.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.95) this.addRipple(e.clientX, e.clientY, 15);
        });

        this.animate();
    }

    init() {
        this.resize();
        for (let i = 0; i < 80; i++) {
            this.drops.push(this.createDrop());
        }
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createDrop() {
        const isBlue = Math.random() > 0.5;
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            length: Math.random() * 15 + 10,
            speed: Math.random() * 8 + 4,
            color: isBlue ? this.colors.blue : this.colors.red,
            isBlue: isBlue
        };
    }

    addRipple(x, y, radius = 30) {
        const isBlue = Math.random() > 0.5;
        this.ripples.push({
            x, y,
            r: 0,
            maxR: radius,
            opacity: 0.4,
            color: isBlue ? this.colors.rippleBlue : this.colors.rippleRed
        });
    }

    addSplash(x, y, isBlue) {
        const count = 3 + Math.floor(Math.random() * 3);
        const color = isBlue ? this.colors.splashBlue : this.colors.splashRed;
        for (let i = 0; i < count; i++) {
            this.splashes.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3 - 1, // Move upwards
                radius: Math.random() * 1.5 + 0.5,
                opacity: 0.5,
                color: color,
                gravity: 0.1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw Rain
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = 'round';
        this.drops.forEach(drop => {
            this.ctx.strokeStyle = drop.color;
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x + 0.5, drop.y + drop.length);
            this.ctx.stroke();

            drop.y += drop.speed;
            if (drop.y > this.height) {
                this.addSplash(drop.x, this.height, drop.isBlue); // Trigger splash
                drop.y = -drop.length;
                drop.x = Math.random() * this.width;
            }
        });

        // Draw Splashes
        this.splashes.forEach((splash, index) => {
            this.ctx.beginPath();
            this.ctx.arc(splash.x, splash.y, splash.radius, 0, Math.PI * 2);
            const color = splash.color.replace(/[\d\.]+\)$/g, `${splash.opacity})`);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            splash.x += splash.vx;
            splash.y += splash.vy;
            splash.vy += splash.gravity;
            splash.opacity -= 0.01;

            if (splash.opacity <= 0) {
                this.splashes.splice(index, 1);
            }
        });

        // Draw Ripples
        this.ripples.forEach((ripple, index) => {
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
            const color = ripple.color.replace(/[\d\.]+\)$/g, `${ripple.opacity})`);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            ripple.r += 1.2;
            ripple.opacity -= 0.006;

            if (ripple.opacity <= 0) {
                this.ripples.splice(index, 1);
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RainEffect();
});