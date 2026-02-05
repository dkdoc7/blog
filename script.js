document.addEventListener('DOMContentLoaded', () => {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            renderSlides(data);
            createTOC(data);
            setupIntersections();
        })
        .catch(error => console.error('Error loading content:', error));
});

function renderSlides(slides) {
    const container = document.getElementById('slides');

    slides.forEach(slide => {
        if (slide.content.length === 0 && slide.images.length === 0 && !slide.title) return;

        const section = document.createElement('section');
        section.className = 'blog-section';
        section.id = `slide-${slide.index}`;

        let html = `
            <span class="slide-index">Section ${slide.index}</span>
            ${slide.title ? `<h2 class="slide-title">${slide.title}</h2>` : ''}
            <div class="slide-content">
                ${slide.content.map(text => `<p>${formatText(text)}</p>`).join('')}
            </div>
        `;

        if (slide.images && slide.images.length > 0) {
            html += `
                <div class="slide-images">
                    ${slide.images.map(img => `<img src="${img}" class="slide-image" alt="Visual Concept" loading="lazy">`).join('')}
                </div>
            `;
        }

        section.innerHTML = html;
        container.appendChild(section);
    });
}

function createTOC(slides) {
    const toc = document.createElement('div');
    toc.id = 'toc';
    document.body.appendChild(toc);

    slides.forEach(slide => {
        if (slide.content.length === 0 && slide.images.length === 0 && !slide.title) return;

        const dot = document.createElement('a');
        dot.className = 'toc-dot';
        dot.href = `#slide-${slide.index}`;
        dot.title = slide.title || `Section ${slide.index}`;
        dot.id = `toc-dot-${slide.index}`;

        dot.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(`slide-${slide.index}`).scrollIntoView({ behavior: 'smooth' });
        });

        toc.appendChild(dot);
    });
}

function formatText(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text
        .replace(urlRegex, url => `<a href="${url}" target="_blank" style="color: var(--accent-color); word-break: break-all;">${url}</a>`)
        .replace(/\u000b/g, '<br>');
}

function setupIntersections() {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Update TOC
                const index = entry.target.id.split('-')[1];
                document.querySelectorAll('.toc-dot').forEach(dot => dot.classList.remove('active'));
                const activeDot = document.getElementById(`toc-dot-${index}`);
                if (activeDot) activeDot.classList.add('active');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.blog-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        sectionObserver.observe(section);
    });
}
