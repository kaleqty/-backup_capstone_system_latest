// Registrar Dashboard Script with Authentication
// Handles authentication, role checks, and dashboard initialization

document.addEventListener('DOMContentLoaded', function() {
    console.log("🎯 Registrar Dashboard loaded - checking authentication...");

    if (!checkAuthentication()) return; // Stop if user is not authenticated

    // Initialize dashboard functionality
    initializeDashboard();

    // Load user profile information
    loadUserProfile();

    // Setup event listeners
    setupEventListeners();
});

// ===== AUTHENTICATION FUNCTIONS =====

// Check if user is authenticated and has the correct role
function checkAuthentication() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const hasToken = sessionStorage.getItem('authToken') !== null;
    const hasUser = sessionStorage.getItem('userData') !== null;

    // Fallback to old authentication method for backward compatibility
    const oldAuth = sessionStorage.getItem('loggedIn') === 'true';
    const hasUserName = sessionStorage.getItem('userName') !== null;

    console.log("🔍 Auth status (Registrar):", { isAuthenticated, hasToken, hasUser, oldAuth, hasUserName });

    if ((!isAuthenticated || !hasToken || !hasUser) && (!oldAuth || !hasUserName)) {
        console.log("❌ Not authenticated, redirecting to login...");
        window.location.href = '../login.html';
        return false;
    }

    // Determine role
    let role = '';
    if (hasUser) {
        try {
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            role = userData.role || '';
        } catch (e) {
            console.error("Error parsing userData:", e);
        }
    } else {
        role = sessionStorage.getItem('userRole') || '';
    }

    // Check if role is registrar
    if (!role || role.toLowerCase() !== 'registrar') {
        console.log("⚠️ Wrong role:", role, "Redirecting to correct dashboard...");
        redirectToCorrectDashboard(role);
        return false;
    }

    return true;
}

// Redirect to correct dashboard based on user role
function redirectToCorrectDashboard(role) {
    const dashboardPaths = {
        'admin': '../AdminSide/admindashboard.html',
        'professor': '../ProfessorSide/professordashboard.html',
        'student': '../StudentSide/studentdashboard.html'
    };

    const redirectPath = dashboardPaths[role?.toLowerCase()] || '../login.html';
    window.location.href = redirectPath;
}


// Load user profile information from session storage
function loadUserProfile() {
    const userName = sessionStorage.getItem('userName') || 'Dr. Registrar User';
    const userEmail = sessionStorage.getItem('userEmail') || 'registrar@university.edu';
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
    const userName = sessionStorage.getItem('userName') || 'Registrar User';
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
    const userName = sessionStorage.getItem('userName') || 'Registrar User';
    const userRole = sessionStorage.getItem('userRole') || 'registrar';
    
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
    const userName = sessionStorage.getItem('userName') || 'Dr. Registrar User';
    const userEmail = sessionStorage.getItem('userEmail') || 'registrar@university.edu';
    const userRole = sessionStorage.getItem('userRole') || 'registrar';
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
    const userName = sessionStorage.getItem('userName') || 'Registrar User';
    
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

    console.log('Registrar Dashboard initialized successfully!');
});

// ===== ANNOUNCEMENTS FUNCTIONALITY =====
    
// Sample data and state management in Announcements section
let announcements = [];
let currentFilter = 'all';
let editingId = null;

// Initialize announcements
function initializeAnnouncements() {
    console.log("📢 Initializing announcements...");
    
    const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
    if (!addAnnouncementBtn) {
        console.log("⚠️ Announcements elements not found - skipping initialization");
        return;
    }
    
    // Load existing announcements from localStorage
    loadAnnouncementsFromStorage();
    
    updateStats();
    renderAnnouncements();
    
    // Add sample announcement for demonstration with current user as author
    const currentUser = getCurrentUser();
    if (currentUser && announcements.length === 0) {
        const sampleAnnouncement = {
            id: Date.now(),
            title: 'Welcome to the New Semester',
            content: 'Welcome to the new academic semester! We\'re excited to have you all back. Please check your course schedules and make sure you have all required materials. If you have any questions, don\'t hesitate to reach out to your respective faculty members.',
            priority: 'general',
            targetAudience: 'All Students',
            author: currentUser.username || currentUser.name || 'Registrar',
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            timestamp: new Date().getTime()
        };
        announcements.push(sampleAnnouncement);
        saveAnnouncementsToStorage();
        console.log("📝 Sample announcement added");
    }
    
    updateStats();
    renderAnnouncements();
    
    // Event listeners for announcements
    addAnnouncementBtn.addEventListener('click', () => openModal());
    
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const announcementModal = document.getElementById('announcementModal');
    const announcementForm = document.getElementById('announcementForm');
    const searchInputAnnouncements = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    if (announcementModal) {
        announcementModal.addEventListener('click', (e) => {
            if (e.target === announcementModal) closeModal();
        });
    }

    if (announcementForm) {
        announcementForm.addEventListener('submit', handleFormSubmit);
    }

    if (searchInputAnnouncements) {
        searchInputAnnouncements.addEventListener('input', handleSearch);
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                renderAnnouncements();
            });
        });
    }
    
    console.log("✅ Announcements initialized successfully");
}

// Load announcements from localStorage
function loadAnnouncementsFromStorage() {
    try {
        const storedAnnouncements = localStorage.getItem('facultyAnnouncements');
        if (storedAnnouncements) {
            announcements = JSON.parse(storedAnnouncements);
            console.log("📄 Loaded announcements from storage:", announcements.length);
        }
    } catch (error) {
        console.error("Error loading announcements from storage:", error);
        announcements = [];
    }
}

// Save announcements to localStorage
function saveAnnouncementsToStorage() {
    try {
        localStorage.setItem('facultyAnnouncements', JSON.stringify(announcements));
        console.log("💾 Saved announcements to storage:", announcements.length);
        
        // Notify all student dashboards about the update
        notifyStudentDashboards();
        
        // Also save to API if available
        saveAnnouncementsToAPI();
        
    } catch (error) {
        console.error("Error saving announcements to storage:", error);
    }
}

// Save announcements to API
async function saveAnnouncementsToAPI() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('/api/announcements', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ announcements })
        });
        
        if (response.ok) {
            console.log("✅ Announcements saved to API");
        } else {
            console.warn("⚠️ Failed to save announcements to API");
        }
    } catch (error) {
        console.error("Error saving announcements to API:", error);
    }
}

// Notify student dashboards about announcement changes
function notifyStudentDashboards() {
    try {
        // Dispatch custom event for same-page communication
        const event = new CustomEvent('announcementsUpdated', {
            detail: { announcements: announcements }
        });
        window.dispatchEvent(event);
        
        // Trigger storage event for cross-tab communication
        // This will notify other open tabs/windows
        localStorage.setItem('announcementUpdate', Date.now().toString());
        
        // Call the global update function if it exists
        if (typeof window.handleAnnouncementUpdates === 'function') {
            window.handleAnnouncementUpdates(announcements);
        }
        
        console.log("📡 Notified student dashboards of announcement changes");
    } catch (error) {
        console.error("Error notifying student dashboards:", error);
    }
}

// Announcement functions
function openModal(id = null) {
    const announcementModal = document.getElementById('announcementModal');
    const modalTitle = document.getElementById('modalTitle');
    const announcementForm = document.getElementById('announcementForm');
    
    if (!announcementModal) return;
    
    editingId = id;
    
    if (id) {
        if (modalTitle) modalTitle.textContent = 'Edit Announcement';
        const announcement = announcements.find(a => a.id === id);
        if (announcement) {
            const titleInput = document.getElementById('announcementTitle');
            const contentInput = document.getElementById('announcementContent');
            const audienceInput = document.getElementById('targetAudience');
            
            if (titleInput) titleInput.value = announcement.title;
            if (contentInput) contentInput.value = announcement.content;
            if (audienceInput) audienceInput.value = announcement.targetAudience;
            
            const priorityInput = document.querySelector(`input[name="priority"][value="${announcement.priority}"]`);
            if (priorityInput) priorityInput.checked = true;
        }
    } else {
        if (modalTitle) modalTitle.textContent = 'Add New Announcement';
        if (announcementForm) announcementForm.reset();
    }
    
    announcementModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const announcementModal = document.getElementById('announcementModal');
    const announcementForm = document.getElementById('announcementForm');
    
    if (!announcementModal) return;
    
    announcementModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (announcementForm) announcementForm.reset();
    editingId = null;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const announcementForm = document.getElementById('announcementForm');
    // Get current user information
    const currentUser = getCurrentUser();
    
    const formData = new FormData(announcementForm);
    const announcementData = {
        title: formData.get('announcementTitle') || document.getElementById('announcementTitle')?.value,
        content: formData.get('announcementContent') || document.getElementById('announcementContent')?.value,
        priority: formData.get('priority'),
        targetAudience: formData.get('targetAudience') || document.getElementById('targetAudience')?.value,
        author: currentUser ? (currentUser.username || currentUser.name || 'Registrar') : 'Registrar',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        timestamp: new Date().getTime()
    };

    if (editingId) {
        const index = announcements.findIndex(a => a.id === editingId);
        if (index !== -1) {
            announcements[index] = { ...announcements[index], ...announcementData };
            console.log("✏️ Updated announcement:", announcements[index].title);
        }
    } else {
        const newAnnouncement = {
            id: Date.now(),
            ...announcementData
        };
        announcements.unshift(newAnnouncement);
        console.log("➕ Added new announcement:", newAnnouncement.title);
    }

    // Save and notify students
    saveAnnouncementsToStorage();
    updateStats();
    renderAnnouncements();
    closeModal();
    
    // Show success message
    showNotification(editingId ? 'Announcement updated successfully!' : 'Announcement created successfully!', 'success');
}

function deleteAnnouncement(id) {
    if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
        const announcementToDelete = announcements.find(a => a.id === id);
        announcements = announcements.filter(a => a.id !== id);
        
        // Save and notify students
        saveAnnouncementsToStorage();
        updateStats();
        renderAnnouncements();
        
        console.log("🗑️ Deleted announcement:", announcementToDelete?.title);
        showNotification('Announcement deleted successfully!', 'success');
    }
}

function editAnnouncement(id) {
    openModal(id);
}

function updateStats() {
    const total = announcements.length;
    const urgent = announcements.filter(a => a.priority === 'urgent').length;
    
    const totalCountSpan = document.getElementById('totalCount');
    const urgentCountSpan = document.getElementById('urgentCount');
    
    if (totalCountSpan) totalCountSpan.textContent = `${total} Total`;
    if (urgentCountSpan) urgentCountSpan.textContent = `${urgent} Urgent`;
}

function renderAnnouncements() {
    const announcementsList = document.getElementById('announcementsList');
    const searchInputAnnouncements = document.getElementById('searchInput');
    
    if (!announcementsList) return;
    
    let filteredAnnouncements = announcements;
    
    // Apply filter
    if (currentFilter !== 'all') {
        filteredAnnouncements = announcements.filter(a => a.priority === currentFilter);
    }
    
    // Apply search
    const searchTerm = searchInputAnnouncements ? searchInputAnnouncements.value.toLowerCase() : '';
    if (searchTerm) {
        filteredAnnouncements = filteredAnnouncements.filter(a => 
            a.title.toLowerCase().includes(searchTerm) || 
            a.content.toLowerCase().includes(searchTerm) ||
            a.author.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort by timestamp (newest first)
    filteredAnnouncements.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    if (filteredAnnouncements.length === 0) {
        announcementsList.innerHTML = `
            <div class="no-announcements">
                <i class="fas fa-search"></i>
                <h3>No Announcements Found</h3>
                <p>${searchTerm ? 'No announcements match your search criteria.' : 'No announcements in this category.'}</p>
            </div>
        `;
        return;
    }
    
    announcementsList.innerHTML = filteredAnnouncements.map(announcement => `
        <div class="announcement-card ${announcement.priority}">
            <div class="announcement-header">
                <div class="announcement-priority">
                    <i class="fas ${getPriorityIcon(announcement.priority)}"></i>
                    <span class="priority-label">${announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}</span>
                </div>
                <div class="announcement-actions">
                    <button class="action-btn edit-btn" onclick="editAnnouncement(${announcement.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteAnnouncement(${announcement.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="announcement-content">
                <h3 class="announcement-title">${announcement.title}</h3>
                <p class="announcement-text">${announcement.content}</p>
            </div>
            <div class="announcement-footer">
                <div class="announcement-meta">
                    <div class="announcement-author">
                        <i class="fas fa-user"></i>
                        <span>By ${announcement.author}</span>
                    </div>
                    <div class="announcement-date">
                        <i class="fas fa-calendar"></i>
                        <span>${announcement.date}</span>
                    </div>
                </div>
                <div class="announcement-audience">
                    <i class="fas fa-users"></i>
                    <span>${announcement.targetAudience}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log(`📋 Rendered ${filteredAnnouncements.length} announcements`);
}

function getPriorityIcon(priority) {
    const icons = {
        urgent: 'fa-exclamation-triangle',
        important: 'fa-star',
        general: 'fa-info-circle'
    };
    return icons[priority] || 'fa-info-circle';
}

function handleSearch() {
    renderAnnouncements();
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Get current user function (utility function)
function getCurrentUser() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                userId: payload.userId,
                username: payload.username,
                name: payload.name,
                role: payload.role
            };
        }
        
        // Fallback to stored user data
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            return JSON.parse(userData);
        }
        
        // Default user for demo purposes
        return {
            userId: 'registrar_001',
            username: 'registrar',
            name: 'Registrar Office',
            role: 'registrar'
        };
    } catch (error) {
        console.error('Error getting current user:', error);
        return {
            userId: 'unknown',
            username: 'registrar',
            name: 'Registrar Office',
            role: 'registrar'
        };
    }
}

// Listen for storage changes to sync across tabs
window.addEventListener('storage', function(e) {
    if (e.key === 'facultyAnnouncements') {
        console.log("🔄 Announcements updated in another tab, refreshing...");
        loadAnnouncementsFromStorage();
        updateStats();
        renderAnnouncements();
    }
});

// Listen for custom events from student dashboards
window.addEventListener('announcementsUpdated', function(e) {
    console.log("📡 Received announcements update event");
    // This could be used for two-way communication if needed
});

// Export functions for global access
window.initializeAnnouncements = initializeAnnouncements;
window.openModal = openModal;
window.closeModal = closeModal;
window.editAnnouncement = editAnnouncement;
window.deleteAnnouncement = deleteAnnouncement;
window.handleAnnouncementUpdates = notifyStudentDashboards;

// Auto-initialize announcements when this script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnnouncements);
} else {
    // DOM is already loaded
    setTimeout(initializeAnnouncements, 100);
}
