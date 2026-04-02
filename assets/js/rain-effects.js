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
    let points = [];
    const spacing = 35; // Distance between grid points
    let mouse = { x: -1000, y: -1000 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initGrid();
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

    function initGrid() {
        points = [];
        for (let x = 0; x < width + spacing; x += spacing) {
            for (let y = 0; y < height + spacing; y += spacing) {
                points.push({
                    baseX: x,
                    baseY: y,
                    x: x,
                    y: y
                });
            }
        }
    }

    function init() {
        resize();
        loop();
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            
            let dx = p.baseX - mouse.x;
            let dy = p.baseY - mouse.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            let targetX = p.baseX;
            let targetY = p.baseY;
            let radius = 1.2;

            // Interactive distortion field
            if (dist < 150) {
                let force = (150 - dist) / 150;
                // Move points away from mouse slightly to create a 3D lens effect
                targetX += (dx / dist) * force * 15;
                targetY += (dy / dist) * force * 15;
                // Grow slightly
                radius = 1.2 + force * 1.5;
                // Shift color to a subtle tech blue
                ctx.fillStyle = `rgba(37, 99, 235, ${0.15 + force * 0.25})`; 
            } else {
                // Default subtle slate gray
                ctx.fillStyle = 'rgba(100, 116, 139, 0.15)';
            }

            // Smooth easing towards target position
            p.x += (targetX - p.x) * 0.1;
            p.y += (targetY - p.y) * 0.1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        requestAnimationFrame(loop);
    }

    init();
});