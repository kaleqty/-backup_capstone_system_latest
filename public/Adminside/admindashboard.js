function toggleDarkMode() {
            const body = document.body;
            const modeIcon = document.getElementById('mode-icon');
            
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                modeIcon.className = 'fas fa-sun';
            } else {
                modeIcon.className = 'fas fa-moon';
            }
        }