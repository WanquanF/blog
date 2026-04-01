
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
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Barça colors (very light versions)
        this.colors = {
            blue: 'rgba(0, 77, 152, 0.05)',
            red: 'rgba(165, 0, 68, 0.05)',
            rippleBlue: 'rgba(0, 77, 152, 0.2)',
            rippleRed: 'rgba(165, 0, 68, 0.2)'
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
            color: isBlue ? this.colors.blue : this.colors.red
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
                drop.y = -drop.length;
                drop.x = Math.random() * this.width;
            }
        });

        // Draw Ripples
        this.ripples.forEach((ripple, index) => {
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
            // Replace the opacity in the rgba string
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