// Load navigation component
(function() {
    fetch('nav-component.html')
        .then(response => response.text())
        .then(html => {
            const template = document.createElement('template');
            template.innerHTML = html.trim();

            const fragment = document.createDocumentFragment();
            const scripts = [];

            Array.from(template.content.childNodes).forEach(node => {
                if (node.tagName === 'SCRIPT') {
                    scripts.push(node);
                } else {
                    fragment.appendChild(node);
                }
            });

            document.body.insertBefore(fragment, document.body.firstChild);

            scripts.forEach(script => {
                const executableScript = document.createElement('script');
                executableScript.textContent = script.textContent;
                document.body.appendChild(executableScript);
            });
        })
        .catch(error => console.error('Error loading nav component:', error));
})();
