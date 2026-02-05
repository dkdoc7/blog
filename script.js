document.addEventListener('DOMContentLoaded', () => {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            renderSlides(data);
            setupIntersections();
        })
        .catch(error => console.error('Error loading content:', error));
});

function renderSlides(slides) {
    const container = document.getElementById('slides');

    slides.forEach(slide => {
        if (slide.content.length === 0 && slide.images.length === 0 && !slide.title) return;

        const card = document.createElement('div');
        card.className = 'slide-card';
        card.id = `slide-${slide.index}`;

        let html = `
            <div class="slide-index">Slide ${slide.index}</div>
            ${slide.title ? `<h2 class="slide-title">${slide.title}</h2>` : ''}
            <div class="slide-content">
                ${slide.content.map(text => `<p>${formatText(text)}</p>`).join('')}
            </div>
        `;

        if (slide.images && slide.images.length > 0) {
            html += `
                <div class="slide-images">
                    ${slide.images.map(img => `<img src="${img}" class="slide-image" alt="Slide Image" loading="lazy">`).join('')}
                </div>
            `;
        }

        card.innerHTML = html;
        container.appendChild(card);
    });
}

function formatText(text) {
    // Basic formatting: handle URLs and line breaks
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text
        .replace(urlRegex, url => `<a href="${url}" target="_blank" style="color: var(--accent-color); word-break: break-all;">${url}</a>`)
        .replace(/\u000b/g, '<br>');
}

function setupIntersections() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.slide-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}
