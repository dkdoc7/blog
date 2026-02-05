document.addEventListener('DOMContentLoaded', () => {
    fetch('vibe_engineering.md')
        .then(response => response.text())
        .then(text => {
            renderMarkdown(text);
            setupIntersections();
        })
        .catch(error => console.error('Error loading markdown:', error));
});

function renderMarkdown(md) {
    const container = document.getElementById('content-area');

    // Split content by '---' (with optional whitespace)
    const sections = md.split(/\n---\s*\n/);

    // Create Table of Contents container
    const toc = document.createElement('div');
    toc.id = 'toc';
    document.body.appendChild(toc);

    sections.forEach((content, index) => {
        if (!content.trim()) return;

        const section = document.createElement('section');
        section.className = 'blog-section';
        const sectionId = `section-${index + 1}`;
        section.id = sectionId;

        // Use marked to render the markdown chunk
        section.innerHTML = marked.parse(content);
        container.appendChild(section);

        // Add to TOC
        const dot = document.createElement('a');
        dot.className = 'toc-dot';
        dot.href = `#${sectionId}`;
        dot.id = `toc-dot-${index + 1}`;

        // Try to find a header for the tooltip
        const headerMatch = content.match(/^#+\s+(.*)/m);
        if (headerMatch) {
            dot.title = headerMatch[1];
        } else {
            dot.title = `Section ${index + 1}`;
        }

        dot.addEventListener('click', (e) => {
            e.preventDefault();
            section.scrollIntoView({ behavior: 'smooth' });
        });

        toc.appendChild(dot);
    });
}

function setupIntersections() {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Update TOC active state
                const id = entry.target.id;
                const index = id.split('-')[1];
                document.querySelectorAll('.toc-dot').forEach(dot => dot.classList.remove('active'));
                const activeDot = document.getElementById(`toc-dot-${index}`);
                if (activeDot) activeDot.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    // Initial check for sections
    const observerLoop = setInterval(() => {
        const sections = document.querySelectorAll('.blog-section');
        if (sections.length > 0) {
            sections.forEach(section => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(50px)';
                section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                sectionObserver.observe(section);
            });
            clearInterval(observerLoop);
        }
    }, 100);
}
