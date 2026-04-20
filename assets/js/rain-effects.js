window.currentWeather = localStorage.getItem('blog-weather') || 'none';

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
    let drops = [], splashes = [], snowflakes = [];
    let fireflies = [], cherries = [], dandelions = [], ripples = [], stars = [];
    let lightning = null;
    let mouse = { x: -1000, y: -1000 };
    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('click', e => {
        if (window.currentWeather === 'ripples') ripples.push(new Ripple(e.clientX, e.clientY, 1));
    });

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

    class Firefly{constructor(){this.reset(!0)}reset(r){this.x=Math.random()*width;this.y=r?Math.random()*height:height+10;this.vx=(Math.random()-.5);this.vy=-Math.random()-0.5;this.r=Math.random()*2+1;this.life=Math.random()*6}update(){this.x+=this.vx+Math.sin(this.life)*.5;this.y+=this.vy;this.life+=.05;if(this.y<-10)this.reset()}draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,6.28);ctx.fillStyle=`rgba(200,255,100,${.5+Math.sin(this.life)*.5})`;ctx.shadowBlur=10;ctx.shadowColor='#c8ff64';ctx.fill();ctx.shadowBlur=0}}
    class Cherry{constructor(){this.reset(!0)}reset(r){this.x=Math.random()*width;this.y=r?Math.random()*height:-20;this.vx=Math.random()*2+1;this.vy=Math.random()*2+1;this.s=Math.random()*6+4;this.a=Math.random()*6.28;this.spin=Math.random()*6.28}update(){this.x+=this.vx;this.y+=this.vy;this.spin+=.03;if(this.y>height+20||this.x>width+20)this.reset()}draw(){ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.a);ctx.scale(1,Math.abs(Math.sin(this.spin)));ctx.beginPath();ctx.ellipse(0,0,this.s,this.s/2,0,0,6.28);ctx.fillStyle='rgba(255,183,197,0.8)';ctx.fill();ctx.restore()}}
    class Dandelion{constructor(){this.reset(!0)}reset(r){this.x=Math.random()*width;this.y=r?Math.random()*height:height+20;this.vx=Math.random()*1.5-.5;this.vy=-Math.random()-0.5;this.s=Math.random()*1.5+1}update(){this.x+=this.vx;this.y+=this.vy;if(this.y<-20||this.x>width+20||this.x<-20)this.reset()}draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.s,0,6.28);ctx.fillStyle='rgba(255,255,255,0.8)';ctx.fill();ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.x,this.y+this.s*5);ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=.5;ctx.stroke()}}
    class Ripple{constructor(x,y,auto){this.x=x;this.y=y;this.r=1;this.max=auto?Math.random()*30+20:100;this.a=1;this.speed=auto?.5:2}update(){this.r+=this.speed;this.a-=this.speed/this.max}draw(){if(this.a<=0)return;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,6.28);ctx.strokeStyle=`rgba(100,150,255,${this.a})`;ctx.lineWidth=1.5;ctx.stroke()}}
    class Star{constructor(){this.x=Math.random()*width;this.y=Math.random()*height;this.vx=(Math.random()-.5);this.vy=(Math.random()-.5)}update(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>width)this.vx*=-1;if(this.y<0||this.y>height)this.vy*=-1}draw(d){ctx.beginPath();ctx.arc(this.x,this.y,1.5,0,6.28);ctx.fillStyle=d?'rgba(255,255,255,0.8)':'rgba(0,0,0,0.5)';ctx.fill()}}
    class Lightning{constructor(){this.reset()}reset(){this.t=Math.random()*150+50;this.l=0;this.p=[]}gen(){this.p=[];let x=Math.random()*width,y=0;this.p.push({x,y});while(y<height){x+=(Math.random()-.5)*150;y+=Math.random()*40+20;this.p.push({x,y})}this.l=15}update(){if(this.l>0)this.l--;else{this.t--;if(this.t<=0)this.gen()}}draw(d){if(this.l<=0)return;let a=this.l/15;ctx.fillStyle=d?`rgba(255,255,255,${a*.15})`:`rgba(0,0,0,${a*.1})`;ctx.fillRect(0,0,width,height);ctx.beginPath();ctx.moveTo(this.p[0].x,this.p[0].y);for(let i=1;i<this.p.length;i++)ctx.lineTo(this.p[i].x,this.p[i].y);ctx.strokeStyle=`rgba(200,220,255,${a})`;ctx.lineWidth=3;ctx.shadowBlur=20;ctx.shadowColor='#aaccff';ctx.stroke();ctx.shadowBlur=0}}
    let time=0;function drawGrid(d){time+=.01;ctx.strokeStyle=d?'rgba(0,255,255,0.3)':'rgba(0,150,255,0.3)';ctx.lineWidth=1;let cx=width/2,cy=height/2+100;for(let i=-10;i<=10;i++){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+i*200,height);ctx.stroke()}for(let i=1;i<20;i++){let y=cy+Math.pow(i+(time%1),2)*2;if(y>height)continue;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke()}}

    function init() {
        resize();
        lightning = new Lightning();
        for (let i = 0; i < 100; i++) drops.push(new Drop());
        for (let i = 0; i < 150; i++) snowflakes.push(new Snowflake());
        for (let i = 0; i < 50; i++) fireflies.push(new Firefly());
        for (let i = 0; i < 40; i++) cherries.push(new Cherry());
        for (let i = 0; i < 40; i++) dandelions.push(new Dandelion());
        for (let i = 0; i < 80; i++) stars.push(new Star());
        loop();
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);
        
        const w = window.currentWeather;
        const isDark = document.documentElement.classList.contains('dark');

        if (w === 'rain' || w === 'lightning') {
            drops.forEach(d => { d.update(); d.draw(); });
            for (let i = splashes.length - 1; i >= 0; i--) {
                splashes[i].update();
                if (splashes[i].life <= 0) splashes.splice(i, 1);
                else splashes[i].draw();
            }
            if (w === 'lightning') {
                lightning.update();
                lightning.draw(isDark);
            }
        } else if (w === 'snow') {
            snowflakes.forEach(f => { f.update(); f.draw(); });
        } else if (w === 'fireflies') {
            fireflies.forEach(f => { f.update(); f.draw(); });
        } else if (w === 'cherry') {
            cherries.forEach(c => { c.update(); c.draw(); });
        } else if (w === 'dandelion') {
            dandelions.forEach(d => { d.update(); d.draw(); });
        } else if (w === 'ripples') {
            if (Math.random() < 0.05) ripples.push(new Ripple(Math.random()*width, Math.random()*height, true));
            for (let i = ripples.length - 1; i >= 0; i--) {
                ripples[i].update();
                if (ripples[i].a <= 0) ripples.splice(i, 1);
                else ripples[i].draw();
            }
        } else if (w === 'constellation') {
            stars.forEach(s => { s.update(); s.draw(isDark); });
            let pts = [...stars, mouse];
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    let dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 120) {
                        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
                        let alpha = 1 - dist/120;
                        ctx.strokeStyle = isDark ? `rgba(255,255,255,${alpha*0.2})` : `rgba(0,0,0,${alpha*0.2})`;
                        ctx.stroke();
                    }
                }
            }
        } else if (w === 'grid') {
            drawGrid(isDark);
        }
        
        requestAnimationFrame(loop);
    }

    init();
});