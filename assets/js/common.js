// --- common.js ---
// Global shared functionality for language, theme, and weather toggling

// 1. Language Toggle
function toggleLanguage() {
    const html = document.documentElement;
    const currentLang = html.getAttribute('lang') || 'en';
    const newLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
    html.setAttribute('lang', newLang);
    localStorage.setItem('blog-lang', newLang);
    
    // Regenerate TOC if the function exists (post pages only)
    if (typeof generateTOC === 'function') {
        generateTOC();
    }
}

// 2. Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('blog-theme', isDark ? 'dark' : 'light');
}

// 3. Weather Toggle
const weatherTypes = ['constellation', 'rain', 'snow', 'fireflies', 'cherry', 'dandelion', 'ripples', 'grid', 'none'];
function toggleWeather() {
    let current = localStorage.getItem('blog-weather') || 'none';
    let nextIndex = (weatherTypes.indexOf(current) + 1) % weatherTypes.length;
    let next = weatherTypes[nextIndex];
    
    localStorage.setItem('blog-weather', next);
    window.currentWeather = next;
    
    document.documentElement.className = document.documentElement.className.replace(/\bweather-\w+\b/g, '').trim();
    document.documentElement.classList.add(`weather-${next}`);
}

// 4. Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    // Init Language
    const savedLang = localStorage.getItem('blog-lang') || 'en';
    document.documentElement.setAttribute('lang', savedLang);

    // Init Theme
    let theme = localStorage.getItem('blog-theme');
    if (!theme) {
        theme = 'light';
        localStorage.setItem('blog-theme', theme);
    }
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Init Weather
    let weather = localStorage.getItem('blog-weather');
    if (!weather) {
        weather = 'none';
        localStorage.setItem('blog-weather', weather);
    }
    window.currentWeather = weather;
    document.documentElement.classList.add(`weather-${weather}`);
    
    // Init KaTeX if auto-render is loaded (post pages only)
    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\(", right: "\\)", display: false},
                {left: "\\[", right: "\\]", display: true}
            ],
            throwOnError: false
        });
    }
    
    // Init TOC if the function exists (post pages only)
    if (typeof generateTOC === 'function') {
        generateTOC();
    }
});

// 5. Post Page Specific Functions
// Generate Table of Contents
let tocObserver = null;
function generateTOC() {
    const tocContainer = document.getElementById('toc-container');
    if (!tocContainer) return;
    
    tocContainer.innerHTML = '';
    if (tocObserver) {
        tocObserver.disconnect();
    }
    
    const html = document.documentElement;
    const currentLang = html.getAttribute('lang') || 'en';
    const langClass = currentLang === 'zh-CN' ? '.lang-zh' : '.lang-en';
    
    const article = document.querySelector('article');
    if (!article) return;
    
    const headings = article.querySelectorAll(`${langClass} h2, ${langClass} h3`);
    if (headings.length === 0) return;
    
    tocObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                document.querySelectorAll('#toc-container a').forEach(a => {
                    a.classList.remove('text-blue-600', 'dark:text-blue-400', 'font-bold');
                    if (a.getAttribute('href') === `#${id}`) {
                        a.classList.add('text-blue-600', 'dark:text-blue-400', 'font-bold');
                    }
                });
            }
        });
    }, { rootMargin: '-10% 0px -80% 0px' });
    
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${currentLang}-${index}`;
        }
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        
        let baseClasses = 'block hover:text-blue-600 dark:hover:text-blue-400 transition-colors';
        if (heading.tagName.toLowerCase() === 'h3') {
            link.className = `${baseClasses} ml-4 text-xs text-gray-500 dark:text-gray-400`;
        } else {
            link.className = `${baseClasses} font-medium mt-2 first:mt-0`;
        }
        
        tocContainer.appendChild(link);
        tocObserver.observe(heading);
    });
}

// Scroll Progress and Back to Top
document.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById("myBar");
    if (progressBar) progressBar.style.width = scrolled + "%";
    
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        if (winScroll > 300) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    }
});

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// 6. Citation Copy Function
function copyCitation(url, title) {
    const year = new Date().getFullYear();
    const citation = `Feng, W. (${year}). ${title}. Wanquan Feng's Blog. ${url}`;
    navigator.clipboard.writeText(citation).then(() => {
        showToast();
    });
}

function copyCitationText(btn) {
    const pre = btn.previousElementSibling;
    if (pre) {
        navigator.clipboard.writeText(pre.innerText).then(() => {
            showToast();
        });
    }
}

function showToast() {
    const html = document.documentElement;
    const isZh = html.getAttribute('lang') === 'zh-CN';
    const text = isZh ? '已复制引用！' : 'Citation copied!';
    
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl z-50 transition-all duration-300 opacity-0 translate-y-4 font-medium text-sm';
    toast.innerText = text;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-y-4');
    }, 10);
    
    // Animate out
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
    }, 2000);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 2300);
}


function scrollToCitation() {
    const html = document.documentElement;
    const isZh = html.getAttribute('lang') === 'zh-CN';
    const sectionId = isZh ? 'citation-section-zh' : 'citation-section-en';
    const el = document.getElementById(sectionId);
    
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a highlight effect
        el.style.transition = 'all 0.5s ease';
        el.style.boxShadow = '0 0 0 2px #3b82f6, 0 0 20px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
            el.style.boxShadow = '';
        }, 2000);
    }
}