
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
        this.trees = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.init();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousedown', (e) => this.addRipple(e.clientX, e.clientY));
        
        // Optional: Splash on mouse move too, but sparingly
        window.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.95) this.addRipple(e.clientX, e.clientY, 10);
        });

        this.animate();
    }

    init() {
        this.resize();
        for (let i = 0; i < 100; i++) {
            this.drops.push(this.createDrop());
        }
        this.createTrees();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.createTrees(); // Re-create trees on resize to fit screen
    }

    createDrop() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 10 + 5,
            opacity: Math.random() * 0.3 + 0.1
        };
    }

    addRipple(x, y, radius = 30) {
        this.ripples.push({
            x, y,
            r: 0,
            maxR: radius,
            opacity: 0.5
        });
    }

    createTrees() {
        this.trees = [];
        const treeCount = 5;
        for (let i = 0; i < treeCount; i++) {
            this.trees.push({
                x: (i + 0.5) * (this.width / treeCount) + (Math.random() - 0.5) * 100,
                size: Math.random() * 100 + 150,
                opacity: 0.05 + Math.random() * 0.05
            });
        }
    }

    drawTree(x, y, size, opacity) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.fillStyle = `rgba(15, 23, 42, ${opacity})`; // slate-900 with opacity
        
        // Simple triangular tree
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-size / 2, size);
        this.ctx.lineTo(size / 2, size);
        this.ctx.closePath();
        this.ctx.fill();

        // Second layer
        this.ctx.translate(0, -size * 0.4);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-size * 0.4, size * 0.8);
        this.ctx.lineTo(size * 0.4, size * 0.8);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw Trees first (background)
        this.trees.forEach(tree => {
            this.drawTree(tree.x, this.height - tree.size, tree.size, tree.opacity);
        });

        // Draw Rain
        this.ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)'; // slate-500 with low opacity
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = 'round';
        this.drops.forEach(drop => {
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x + 1, drop.y + drop.length); // Slight tilt
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
            this.ctx.strokeStyle = `rgba(100, 116, 139, ${ripple.opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            ripple.r += 1.5;
            ripple.opacity -= 0.008;

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