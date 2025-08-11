// Faculty Dashboard Integration Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and has appropriate role
    checkAuthentication();
    
    // Initialize dashboard functionality
    initializeDashboard();
    
    // Load user profile information
    loadUserProfile();
    
    // Setup event listeners
    setupEventListeners();
});

// Authentication check function
function checkAuthentication() {
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    const userRole = sessionStorage.getItem('userRole');
    
    // Redirect to login if not authenticated
    if (!isLoggedIn || isLoggedIn !== 'true') {
        alert('Please log in to access the dashboard');
        window.location.href = '../login.html'; // Adjust path as needed
        return;
    }
    
    // Check if user has faculty role
    if (userRole && userRole.toLowerCase() !== 'faculty') {
        alert('Access denied. This dashboard is for faculty members only.');
        // Redirect to appropriate dashboard based on role
        redirectToCorrectDashboard(userRole);
        return;
    }
}

// Redirect to correct dashboard based on user role
function redirectToCorrectDashboard(role) {
    const dashboardPaths = {
        'admin': '../AdminSide/admindashboard.html',
        'professor': '../ProfessorSide/professordashboard.html',
        'student': '../StudentSide/studentdashboard.html'
    };
    
    const redirectPath = dashboardPaths[role.toLowerCase()];
    if (redirectPath) {
        window.location.href = redirectPath;
    } else {
        window.location.href = '../login.html';
    }
}

// Load user profile information from session storage
function loadUserProfile() {
    const userName = sessionStorage.getItem('userName') || 'Dr. Faculty User';
    const userEmail = sessionStorage.getItem('userEmail') || 'faculty@university.edu';
    const userAvatar = sessionStorage.getItem('userAvatar');
    const loginDate = sessionStorage.getItem('loginDate');
    
    // Update user name in sidebar and header
    const userNameElement = document.getElementById('userName');
    const welcomeMessage = document.querySelector('.welcome-message');
    
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
    
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${userName.split(' ')[0]}`;
    }
    
    // Update avatar if custom photo was uploaded
    const avatarContainer = document.getElementById('avatarContainer');
    if (avatarContainer && userAvatar) {
        avatarContainer.innerHTML = `<img src="${userAvatar}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    }
    
    // Log login information for debugging
    console.log('User Profile Loaded:', {
        name: userName,
        email: userEmail,
        role: sessionStorage.getItem('userRole'),
        loginTime: loginDate
    });
    
    // Update dashboard statistics based on user
    updateDashboardStats();
}

// Update dashboard statistics (simulate real data)
function updateDashboardStats() {
    const userName = sessionStorage.getItem('userName') || 'Faculty User';
    const userEmail = sessionStorage.getItem('userEmail') || '';
    
    // Generate some personalized stats based on user info
    const stats = generateUserStats(userName, userEmail);
    
    // Update dashboard cards with personalized information
    updateDashboardCards(stats);
}

// Generate user-specific statistics
function generateUserStats(userName, userEmail) {
    // Create semi-realistic data based on user info
    const nameHash = userName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    // Use hash to generate consistent but varied stats
    const activeCourses = Math.abs(nameHash % 6) + 2; // 2-7 courses
    const pendingGrades = Math.abs(nameHash % 20) + 5; // 5-24 grades
    const totalStudents = Math.abs(nameHash % 100) + 50; // 50-149 students
    const upcomingClasses = Math.abs(nameHash % 8) + 1; // 1-8 classes
    
    return {
        activeCourses,
        pendingGrades,
        totalStudents,
        upcomingClasses,
        userName,
        userEmail
    };
}

// Update dashboard cards with user-specific data
function updateDashboardCards(stats) {
    const cards = document.querySelectorAll('.dashboard-card');
    
    cards.forEach((card, index) => {
        const cardContent = card.querySelector('.card-content p');
        
        switch(index) {
            case 0: // Active Courses
                if (cardContent) {
                    cardContent.textContent = `You are currently teaching ${stats.activeCourses} courses this semester. Manage your classes and track student progress.`;
                }
                break;
            case 1: // Pending Grades
                if (cardContent) {
                    cardContent.textContent = `You have ${stats.pendingGrades} assignments to grade. Review and submit grades before the deadline.`;
                }
                break;
            case 2: // Total Students
                if (cardContent) {
                    cardContent.textContent = `You have ${stats.totalStudents} students enrolled across all your courses. Track attendance and performance.`;
                }
                break;
            case 3: // Upcoming Classes
                if (cardContent) {
                    cardContent.textContent = `You have ${stats.upcomingClasses} upcoming classes this week. Check your schedule for classes, meetings, and important academic events.`;
                }
                break;
        }
    });
    
    // Update notification badges with relevant numbers
    updateNotificationBadges(stats);
}

// Update notification badges
function updateNotificationBadges(stats) {
    const badges = {
        'announcements': Math.min(Math.floor(stats.activeCourses / 2), 5),
        'grading': Math.min(Math.floor(stats.pendingGrades / 3), 9),
        'messages': Math.min(Math.floor(stats.totalStudents / 30), 9)
    };
    
    // Update announcement badge
    const announcementItem = document.querySelector('[data-section="announcements"] .badge');
    if (announcementItem) {
        announcementItem.textContent = badges.announcements;
        announcementItem.style.display = badges.announcements > 0 ? 'flex' : 'none';
    }
    
    // Update grading badge
    const gradingItem = document.querySelector('[data-section="grading"] .badge');
    if (gradingItem) {
        gradingItem.textContent = badges.grading;
        gradingItem.style.display = badges.grading > 0 ? 'flex' : 'none';
    }
    
    // Update messages badge
    const messagesItem = document.querySelector('[data-section="messages"] .badge');
    if (messagesItem) {
        messagesItem.textContent = badges.messages;
        messagesItem.style.display = badges.messages > 0 ? 'flex' : 'none';
    }
    
    // Update header notification count
    const notificationCount = document.querySelector('.notification-count');
    const totalNotifications = badges.announcements + badges.grading + badges.messages;
    if (notificationCount) {
        notificationCount.textContent = totalNotifications;
        notificationCount.style.display = totalNotifications > 0 ? 'flex' : 'none';
    }
}

// Initialize dashboard functionality
function initializeDashboard() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Save sidebar state
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });
        
        // Restore sidebar state
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            sidebar.classList.add('collapsed');
        }
    }
    
    // Navigation handling
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionName = this.getAttribute('data-section');
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            // Show selected content section
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Load section-specific content
                loadSectionContent(sectionName);
            }
            
            // Save active section
            localStorage.setItem('activeSection', sectionName);
        });
    });
    
    // Restore active section
    const savedSection = localStorage.getItem('activeSection');
    if (savedSection) {
        const savedNavItem = document.querySelector(`[data-section="${savedSection}"]`);
        const savedContentSection = document.getElementById(savedSection);
        
        if (savedNavItem && savedContentSection) {
            // Remove active from all
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Activate saved section
            savedNavItem.classList.add('active');
            savedContentSection.classList.add('active');
        }
    }
}

// Load section-specific content
function loadSectionContent(sectionName) {
    const userName = sessionStorage.getItem('userName') || 'Faculty User';
    const userRole = sessionStorage.getItem('userRole') || 'faculty';
    
    const sectionElement = document.getElementById(sectionName);
    if (!sectionElement) return;
    
    // Add personalized content based on section
    switch(sectionName) {
        case 'profile':
            loadProfileContent(sectionElement);
            break;
        case 'messages':
            loadMessagesContent(sectionElement);
            break;
        case 'students':
            loadStudentsContent(sectionElement);
            break;
        case 'grading':
            loadGradingContent(sectionElement);
            break;
        case 'announcements':
            loadAnnouncementsContent(sectionElement);
            break;
    }
}

// Load profile content
function loadProfileContent(section) {
    const userName = sessionStorage.getItem('userName') || 'Dr. Faculty User';
    const userEmail = sessionStorage.getItem('userEmail') || 'faculty@university.edu';
    const userRole = sessionStorage.getItem('userRole') || 'faculty';
    const loginDate = sessionStorage.getItem('loginDate');
    
    const profileHTML = `
        <h2>Profile Information</h2>
        <div class="profile-info" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Role:</strong> ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
            <p><strong>Last Login:</strong> ${loginDate ? new Date(loginDate).toLocaleString() : 'N/A'}</p>
            <button onclick="editProfile()" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px;">Edit Profile</button>
        </div>
    `;
    
    section.innerHTML = profileHTML;
}

// Load messages content
function loadMessagesContent(section) {
    const messagesHTML = `
        <h2>Messages</h2>
        <div class="messages-container" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p>You have new messages from students and colleagues.</p>
            <div class="message-item" style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <strong>Student Query:</strong> Question about Assignment #3 deadline
            </div>
            <div class="message-item" style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <strong>Department Head:</strong> Faculty meeting scheduled for next week
            </div>
            <div class="message-item" style="padding: 10px 0;">
                <strong>System:</strong> Grade submission deadline reminder
            </div>
        </div>
    `;
    
    section.innerHTML = messagesHTML;
}

// Load students content
function loadStudentsContent(section) {
    const totalStudents = sessionStorage.getItem('totalStudents') || '127';
    
    const studentsHTML = `
        <h2>Student Management</h2>
        <div class="students-container" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p>Manage your ${totalStudents} students across all courses.</p>
            <div class="student-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                <div style="background: #ecf0f1; padding: 15px; border-radius: 5px; text-align: center;">
                    <h4>Active Students</h4>
                    <span style="font-size: 24px; color: #27ae60;">${totalStudents}</span>
                </div>
                <div style="background: #ecf0f1; padding: 15px; border-radius: 5px; text-align: center;">
                    <h4>Average Grade</h4>
                    <span style="font-size: 24px; color: #3498db;">B+</span>
                </div>
            </div>
        </div>
    `;
    
    section.innerHTML = studentsHTML;
}

// Load grading content
function loadGradingContent(section) {
    const pendingGrades = sessionStorage.getItem('pendingGrades') || '12';
    
    const gradingHTML = `
        <h2>Grading Center</h2>
        <div class="grading-container" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p>You have ${pendingGrades} assignments pending review.</p>
            <div class="grading-queue" style="margin-top: 20px;">
                <div class="grade-item" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px;">
                    <strong>Assignment:</strong> Midterm Exam - Computer Science 101
                    <br><span style="color: #e74c3c;">Due: Today</span>
                </div>
                <div class="grade-item" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px;">
                    <strong>Assignment:</strong> Research Paper - Advanced Algorithms
                    <br><span style="color: #f39c12;">Due: Tomorrow</span>
                </div>
            </div>
        </div>
    `;
    
    section.innerHTML = gradingHTML;
}

// Load announcements content


// Setup additional event listeners
function setupEventListeners() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        // Restore dark mode state
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        darkModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', this.checked);
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            handleLogout();
        });
    }
    
    // Notification icon
    const notificationIcon = document.getElementById('notificationIcon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            showNotifications();
        });
    }
    
    // Avatar change functionality
    const avatarContainer = document.getElementById('avatarContainer');
    if (avatarContainer) {
        avatarContainer.addEventListener('click', function() {
            changeProfilePhoto();
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            handleSearch(this.value);
        });
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session storage
        sessionStorage.clear();
        
        // Clear relevant local storage items but keep preferences
        localStorage.removeItem('activeSection');
        
        // Redirect to login page
        window.location.href = '../login.html'; // Adjust path as needed
    }
}

// Show notifications
function showNotifications() {
    const userName = sessionStorage.getItem('userName') || 'Faculty User';
    
    alert(`Notifications for ${userName}:\n\n` +
          '• New student message received\n' +
          '• Grade submission deadline approaching\n' +
          '• Department meeting scheduled');
}

// Change profile photo
function changeProfilePhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const avatarContainer = document.getElementById('avatarContainer');
                avatarContainer.innerHTML = `<img src="${e.target.result}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                
                // Save to session storage
                sessionStorage.setItem('userAvatar', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Handle search
function handleSearch(query) {
    if (query.length > 2) {
        console.log('Searching for:', query);
        // Implement search functionality here
    }
}

// Edit profile function
function editProfile() {
    alert('Profile editing functionality would be implemented here');
}

// Create announcement function
function createAnnouncement() {
    const announcement = prompt('Enter your announcement:');
    if (announcement) {
        alert('Announcement created successfully!');
        // Implement announcement creation logic here
    }
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Auto-refresh dashboard data periodically
setInterval(function() {
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    if (isLoggedIn === 'true') {
        // Refresh user stats or check for new notifications
        console.log('Dashboard auto-refresh');
    }
}, 300000); // Refresh every 5 minutes

// Faculty Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    

    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const logoutBtn = document.getElementById('logoutBtn');
    const notificationIcon = document.getElementById('notificationIcon');
    const searchInput = document.querySelector('.search-input');
    const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
    const announcementsList = document.getElementById('announcementsList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const announcementSearchInput = document.getElementById('searchInput');

    // Sidebar toggle functionality
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });

    // Navigation functionality
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav items and content sections
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding content section
            this.classList.add('active');
            const targetContent = document.getElementById(targetSection);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Dark mode toggle
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
        
        // Store preference in localStorage
        localStorage.setItem('darkMode', this.checked);
    });

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        darkModeToggle.checked = true;
        document.body.classList.add('dark-mode');
    }

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            // Simulate logout
            alert('Logged out successfully!');
            // In a real application, you would redirect to login page
            // window.location.href = '/login';
        }
    });

    // Notification icon click
    notificationIcon.addEventListener('click', function() {
        alert('You have 3 new notifications:\n• New student enrollment\n• Assignment submission\n• Faculty meeting reminder');
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        console.log('Searching for:', searchTerm);
        // In a real application, you would implement search functionality here
    });

    // Announcements functionality
    
    

    // Dashboard card interactions
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('.card-title').textContent.trim();
            
            switch(cardTitle) {
                case 'Active Courses':
                    alert('Navigate to Courses Management\n\nActive Courses:\n• Computer Science 101\n• Data Structures\n• Database Systems\n• Web Development');
                    break;
                case 'Pending Grades':
                    // Switch to grading section
                    document.querySelector('[data-section="grading"]').click();
                    break;
                case 'Total Students':
                    // Switch to students section
                    document.querySelector('[data-section="students"]').click();
                    break;
                case 'Upcoming Classes':
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    alert(`Upcoming Classes:\n\n• Today: CS 101 - 2:00 PM\n• Tomorrow: Database Systems - 10:00 AM\n• ${tomorrow.toDateString()}: Web Development - 3:00 PM`);
                    break;
            }
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Initialize the dashboard
    renderAnnouncements();
    updateNotificationBadges();
    
    // Simulate real-time updates
    setInterval(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        console.log(`Dashboard updated at ${timeString}`);
        
        // Simulate new notifications occasionally
        if (Math.random() < 0.1) { // 10% chance every interval
            const currentCount = parseInt(document.querySelector('.notification-count').textContent);
            document.querySelector('.notification-count').textContent = currentCount + 1;
        }
    }, 30000); // Update every 30 seconds

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt + 1-7 for quick navigation
        if (e.altKey && e.key >= '1' && e.key <= '7') {
            e.preventDefault();
            const navItems = document.querySelectorAll('.nav-item');
            const index = parseInt(e.key) - 1;
            if (navItems[index]) {
                navItems[index].click();
            }
        }
        
        // Ctrl + / for search focus
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape to collapse sidebar
        if (e.key === 'Escape') {
            sidebar.classList.add('collapsed');
        }
    });

    // Welcome message animation
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        setTimeout(() => {
            welcomeMessage.style.opacity = '0.8';
        }, 1000);
    }

    console.log('Faculty Dashboard initialized successfully!');
});

