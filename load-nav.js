// Load navigation component
(function() {
    fetch('nav-component.html')
        .then(response => response.text())
        .then(html => {
            const navContainer = document.createElement('div');
            navContainer.innerHTML = html;
            document.body.insertBefore(navContainer.firstElementChild, document.body.firstChild);
        })
        .catch(error => console.error('Error loading nav component:', error));
})();
