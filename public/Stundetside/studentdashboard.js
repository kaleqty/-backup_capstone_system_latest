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

        // Add interactive features
        document.addEventListener('DOMContentLoaded', function() {
            // Add click handlers for grade cells to show more details
            const gradeCells = document.querySelectorAll('.grade');
            gradeCells.forEach(cell => {
                cell.addEventListener('click', function() {
                    const grade = this.textContent;
                    const row = this.closest('tr');
                    const subject = row.querySelector('.subject-title').textContent;
                    
                    alert(`${subject}\nGrade: ${grade}\nClick the GPA cards for detailed analytics.`);
                });
            });

            // Add animation to GPA cards
            const gpaCards = document.querySelectorAll('.gpa-card');
            gpaCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            });
        });

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);


        

        class AcademicCalendar {
            constructor() {
                this.currentDate = new Date();
                this.events = this.loadEvents();
                this.editingEventId = null;
                this.init();
            }

            init() {
                this.renderCalendar();
                this.renderEvents();
                this.updateStats();
                this.bindEvents();
            }

            bindEvents() {
                document.getElementById('prevMonth').addEventListener('click', () => this.previousMonth());
                document.getElementById('nextMonth').addEventListener('click', () => this.nextMonth());
                document.getElementById('addEventBtn').addEventListener('click', () => this.showEventForm());
                document.getElementById('saveEventBtn').addEventListener('click', () => this.saveEvent());
                document.getElementById('cancelEventBtn').addEventListener('click', () => this.hideEventForm());
            }

            previousMonth() {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar();
            }

            nextMonth() {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar();
            }

            renderCalendar() {
                const year = this.currentDate.getFullYear();
                const month = this.currentDate.getMonth();
                
                // Update month display
                const months = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];
                document.getElementById('currentMonth').textContent = `${months[month]} ${year}`;

                // Create calendar grid
                const grid = document.getElementById('calendarGrid');
                grid.innerHTML = '';

                // Add day headers
                const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                dayHeaders.forEach(day => {
                    const header = document.createElement('div');
                    header.className = 'day-header';
                    header.textContent = day;
                    grid.appendChild(header);
                });

                // Get first day of month and number of days
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const daysInPrevMonth = new Date(year, month, 0).getDate();

                // Add previous month's trailing days
                for (let i = firstDay - 1; i >= 0; i--) {
                    const day = daysInPrevMonth - i;
                    const cell = this.createDayCell(day, true, year, month - 1);
                    grid.appendChild(cell);
                }

                // Add current month's days
                for (let day = 1; day <= daysInMonth; day++) {
                    const cell = this.createDayCell(day, false, year, month);
                    grid.appendChild(cell);
                }

                // Add next month's leading days
                const totalCells = grid.children.length - 7; // Subtract headers
                const remainingCells = 42 - totalCells; // 6 rows × 7 days
                for (let day = 1; day <= remainingCells; day++) {
                    const cell = this.createDayCell(day, true, year, month + 1);
                    grid.appendChild(cell);
                }
            }

            createDayCell(day, isOtherMonth, year, month) {
                const cell = document.createElement('div');
                cell.className = 'day-cell';
                
                if (isOtherMonth) {
                    cell.classList.add('other-month');
                }

                // Check if today
                const today = new Date();
                const cellDate = new Date(year, month, day);
                if (cellDate.toDateString() === today.toDateString()) {
                    cell.classList.add('today');
                }

                // Check for events
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEvents = this.events.filter(event => event.date === dateStr);
                
                if (dayEvents.length > 0) {
                    cell.classList.add('has-events');
                }

                const dayNumber = document.createElement('div');
                dayNumber.className = 'day-number';
                dayNumber.textContent = day;
                cell.appendChild(dayNumber);

                // Add event dots
                const dotsContainer = document.createElement('div');
                dayEvents.slice(0, 3).forEach(() => {
                    const dot = document.createElement('div');
                    dot.className = 'event-dot';
                    dotsContainer.appendChild(dot);
                });
                cell.appendChild(dotsContainer);

                // Add click event
                cell.addEventListener('click', () => {
                    document.getElementById('eventDate').value = dateStr;
                    this.showEventForm();
                });

                return cell;
            }

            showEventForm(event = null) {
                const form = document.getElementById('eventForm');
                form.classList.add('active');
                
                if (event) {
                    // Editing existing event
                    this.editingEventId = event.id;
                    document.getElementById('eventTitle').value = event.title;
                    document.getElementById('eventDate').value = event.date;
                    document.getElementById('eventTime').value = event.time || '';
                    document.getElementById('eventType').value = event.type;
                    document.getElementById('eventDescription').value = event.description || '';
                    document.getElementById('saveEventBtn').textContent = 'Update Event';
                } else {
                    // Adding new event
                    this.editingEventId = null;
                    document.getElementById('eventTitle').value = '';
                    document.getElementById('eventTime').value = '';
                    document.getElementById('eventType').value = 'class';
                    document.getElementById('eventDescription').value = '';
                    document.getElementById('saveEventBtn').textContent = 'Save Event';
                }
            }

            hideEventForm() {
                document.getElementById('eventForm').classList.remove('active');
                this.editingEventId = null;
            }

            saveEvent() {
                const title = document.getElementById('eventTitle').value.trim();
                const date = document.getElementById('eventDate').value;
                const time = document.getElementById('eventTime').value;
                const type = document.getElementById('eventType').value;
                const description = document.getElementById('eventDescription').value.trim();

                if (!title || !date) {
                    alert('Please fill in title and date fields.');
                    return;
                }

                const event = {
                    id: this.editingEventId || Date.now().toString(),
                    title,
                    date,
                    time,
                    type,
                    description
                };

                if (this.editingEventId) {
                    // Update existing event
                    const index = this.events.findIndex(e => e.id === this.editingEventId);
                    this.events[index] = event;
                } else {
                    // Add new event
                    this.events.push(event);
                }

                this.saveEvents();
                this.renderCalendar();
                this.renderEvents();
                this.updateStats();
                this.hideEventForm();
            }

            deleteEvent(eventId) {
                if (confirm('Are you sure you want to delete this event?')) {
                    this.events = this.events.filter(event => event.id !== eventId);
                    this.saveEvents();
                    this.renderCalendar();
                    this.renderEvents();
                    this.updateStats();
                }
            }

            renderEvents() {
                const eventsList = document.getElementById('eventsList');
                eventsList.innerHTML = '';

                if (this.events.length === 0) {
                    eventsList.innerHTML = '<div class="no-events">No events scheduled</div>';
                    return;
                }

                // Sort events by date
                const sortedEvents = [...this.events].sort((a, b) => new Date(a.date) - new Date(b.date));

                sortedEvents.forEach(event => {
                    const eventItem = document.createElement('div');
                    eventItem.className = 'event-item';

                    const eventDate = new Date(event.date);
                    const formattedDate = eventDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                    });

                    eventItem.innerHTML = `
                        <div class="event-title">${event.title}</div>
                        <div class="event-date">${formattedDate}${event.time ? ` at ${event.time}` : ''}</div>
                        <div class="event-type ${event.type}">${event.type}</div>
                        ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                        <div class="event-actions">
                            <button class="btn-small btn-edit" onclick="calendar.showEventForm(${JSON.stringify(event).replace(/"/g, '&quot;')})">Edit</button>
                            <button class="btn-small btn-delete" onclick="calendar.deleteEvent('${event.id}')">Delete</button>
                        </div>
                    `;

                    eventsList.appendChild(eventItem);
                });
            }

            updateStats() {
                const today = new Date();
                const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                
                const totalEvents = this.events.length;
                const upcomingEvents = this.events.filter(event => new Date(event.date) >= today).length;
                const overdueEvents = this.events.filter(event => new Date(event.date) < today).length;
                const thisWeekEvents = this.events.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate >= today && eventDate <= weekFromNow;
                }).length;
                
                document.getElementById('totalEvents').textContent = totalEvents;
                document.getElementById('upcomingEvents').textContent = upcomingEvents;
                document.getElementById('overdueEvents').textContent = overdueEvents;
                document.getElementById('thisWeekEvents').textContent = thisWeekEvents;
            }

            saveEvents() {
                // In a real application, you would save to a database
                this.events = [...this.events];
            }

            loadEvents() {
                // Sample events matching the academic theme
                return [
                    {
                        id: '1',
                        title: 'Mathematics Final Exam',
                        date: '2025-06-15',
                        time: '09:00',
                        type: 'exam',
                        description: 'Comprehensive final exam covering all semester topics'
                    },
                    {
                        id: '2',
                        title: 'Computer Science Project Due',
                        date: '2025-06-12',
                        time: '23:59',
                        type: 'assignment',
                        description: 'Submit final project with documentation'
                    },
                    {
                        id: '3',
                        title: 'History Class',
                        date: '2025-06-10',
                        time: '14:00',
                        type: 'class',
                        description: 'Weekly history lecture'
                    }
                ];
            }
        }

        // Initialize calendar
        const calendar = new AcademicCalendar();

        // Toggle password visibility
        function togglePassword(fieldId) {
            const field = document.getElementById(fieldId);
            const icon = field.nextElementSibling;
            
            if (field.type === 'password') {
                field.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                field.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        // Password strength checker
        function checkPasswordStrength(password) {
            let strength = 0;
            let status = '';
            
            if (password.length >= 8) strength++;
            if (/[a-z]/.test(password)) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            const strengthBar = document.getElementById('strengthBar');
            const passwordStatus = document.getElementById('passwordStatus');
            
            strengthBar.className = 'password-strength-bar';
            
            if (strength < 3) {
                strengthBar.classList.add('weak');
                status = 'Password strength: Weak';
            } else if (strength < 5) {
                strengthBar.classList.add('medium');
                status = 'Password strength: Medium';
            } else {
                strengthBar.classList.add('strong');
                status = 'Password strength: Strong';
            }
            
            passwordStatus.textContent = status;
        }

        // Check password match
        function checkPasswordMatch() {
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const matchIndicator = document.getElementById('matchIndicator');
            
            if (confirmPassword === '') {
                matchIndicator.textContent = '';
                return;
            }
            
            if (newPassword === confirmPassword) {
                matchIndicator.textContent = '✓ Passwords match';
                matchIndicator.className = 'password-match-indicator match';
            } else {
                matchIndicator.textContent = '✗ Passwords do not match';
                matchIndicator.className = 'password-match-indicator no-match';
            }
        }

        // Form submission
        document.getElementById('passwordChangeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Hide previous messages
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'none';
            
            // Validation
            if (!currentPassword || !newPassword || !confirmPassword) {
                showError('Please fill in all required fields.');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showError('New passwords do not match.');
                return;
            }
            
            if (newPassword.length < 8) {
                showError('New password must be at least 8 characters long.');
                return;
            }
            
            if (currentPassword === newPassword) {
                showError('New password must be different from current password.');
                return;
            }
            
            // Simulate API call (replace with actual implementation)
            setTimeout(() => {
                // Simulate success (in real implementation, check with server)
                if (currentPassword === 'wrongpassword') {
                    showError('Current password is incorrect.');
                } else {
                    showSuccess();
                    resetForm();
                }
            }, 1000);
        });

        function showSuccess() {
            const successMsg = document.getElementById('successMessage');
            successMsg.style.display = 'flex';
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 5000);
        }

        function showError(message) {
            const errorMsg = document.getElementById('errorMessage');
            const errorText = document.getElementById('errorText');
            errorText.textContent = message;
            errorMsg.style.display = 'flex';
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 5000);
        }

        function resetForm() {
            document.getElementById('passwordChangeForm').reset();
            document.getElementById('strengthBar').className = 'password-strength-bar';
            document.getElementById('passwordStatus').textContent = 'Password strength: Not set';
            document.getElementById('matchIndicator').textContent = '';
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'none';
        }

        // Event listeners
        document.getElementById('newPassword').addEventListener('input', function() {
            checkPasswordStrength(this.value);
            checkPasswordMatch();
        });

        document.getElementById('confirmPassword').addEventListener('input', checkPasswordMatch);

        // Dark mode toggle
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const icon = document.querySelector('.dark-mode-toggle i');
            
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }

        // Initialize form
        document.addEventListener('DOMContentLoaded', function() {
            resetForm();
        });

        // Student Announcements Display JavaScript
// This script fetches and displays announcements from faculty/registrar for students
// Read-only view with per-account read status tracking

class StudentAnnouncementsManager {
    constructor() {
        this.announcements = [];
        this.filteredAnnouncements = [];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.readAnnouncements = new Set();
        this.currentUserId = null;
        
        // DOM elements
        this.announcementsList = document.getElementById('announcements-list');
        this.loadingState = document.getElementById('loading-state');
        this.noAnnouncementsState = document.getElementById('no-announcements');
        this.urgentCount = document.getElementById('urgent-count');
        this.unreadCount = document.getElementById('unread-count');
        this.searchInput = document.getElementById('announcement-search');
        this.pagination = document.getElementById('pagination');
        this.pageInfo = document.getElementById('page-info');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        this.init();
    }
    
    init() {
        this.getCurrentUserId();
        this.loadReadAnnouncements();
        this.setupEventListeners();
        this.fetchAnnouncements();
        
        // Refresh announcements every 30 seconds for real-time updates
        setInterval(() => this.fetchAnnouncements(), 30 * 1000);
        
        // Listen for storage changes from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === 'facultyAnnouncements') {
                this.fetchAnnouncements();
            }
        });
    }
    
    getCurrentUserId() {
        // Get current user ID from token or session
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                this.currentUserId = payload.userId;
            } catch (error) {
                console.error('Error parsing token:', error);
                this.currentUserId = 'guest';
            }
        } else {
            this.currentUserId = 'guest';
        }
    }
    
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.getAttribute('data-filter');
                this.currentPage = 1;
                this.filterAndDisplayAnnouncements();
            });
        });
        
        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                this.currentPage = 1;
                this.filterAndDisplayAnnouncements();
            });
        }
        
        // Pagination buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.displayAnnouncements();
                    this.updatePagination();
                }
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredAnnouncements.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.displayAnnouncements();
                    this.updatePagination();
                }
            });
        }
    }
    
    // Fetch announcements from API or localStorage
    async fetchAnnouncements() {
        try {
            this.showLoading(true);
            
            // First try to get from API
            const apiAnnouncements = await this.fetchAnnouncementsFromAPI();
            
            // If API fails, fallback to localStorage/sessionStorage
            const localAnnouncements = this.getFacultyAnnouncements();
            
            // Merge API and local announcements, preferring API data
            let allAnnouncements = apiAnnouncements.length > 0 ? apiAnnouncements : localAnnouncements;
            
            this.announcements = allAnnouncements.map(announcement => ({
                ...announcement,
                isRead: this.isAnnouncementRead(announcement.id)
            }));
            
            this.filterAndDisplayAnnouncements();
            this.updateStats();
            
        } catch (error) {
            console.error('Error fetching announcements:', error);
            this.showError();
        } finally {
            this.showLoading(false);
        }
    }
    
    // Fetch announcements from API
    async fetchAnnouncementsFromAPI() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/announcements', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.announcements || [];
            }
        } catch (error) {
            console.error('API fetch error:', error);
        }
        return [];
    }
    
    // Get announcements from localStorage/sessionStorage (fallback)
    getFacultyAnnouncements() {
        // Try to get from localStorage first (persistent)
        const storedAnnouncements = localStorage.getItem('facultyAnnouncements');
        if (storedAnnouncements) {
            try {
                return JSON.parse(storedAnnouncements);
            } catch (error) {
                console.error('Error parsing stored announcements:', error);
            }
        }
        
        // Try sessionStorage as fallback
        const sessionAnnouncements = sessionStorage.getItem('facultyAnnouncements');
        if (sessionAnnouncements) {
            try {
                return JSON.parse(sessionAnnouncements);
            } catch (error) {
                console.error('Error parsing session announcements:', error);
            }
        }
        
        return [];
    }
    
    filterAndDisplayAnnouncements() {
        let filtered = [...this.announcements];
        
        // Apply priority filter
        if (this.currentFilter === 'urgent') {
            filtered = filtered.filter(a => a.priority === 'urgent');
        } else if (this.currentFilter === 'important') {
            filtered = filtered.filter(a => a.priority === 'important');
        } else if (this.currentFilter === 'general') {
            filtered = filtered.filter(a => a.priority === 'general');
        } else if (this.currentFilter === 'unread') {
            filtered = filtered.filter(a => !a.isRead);
        }
        
        // Apply search filter
        const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';
        if (searchTerm) {
            filtered = filtered.filter(a => 
                a.title.toLowerCase().includes(searchTerm) || 
                a.content.toLowerCase().includes(searchTerm) ||
                a.author.toLowerCase().includes(searchTerm)
            );
        }
        
        // Sort by timestamp or date (newest first)
        filtered.sort((a, b) => {
            const aTime = a.timestamp || new Date(a.date).getTime();
            const bTime = b.timestamp || new Date(b.date).getTime();
            return bTime - aTime;
        });
        
        this.filteredAnnouncements = filtered;
        this.currentPage = 1;
        this.displayAnnouncements();
        this.updatePagination();
    }
    
    displayAnnouncements() {
        if (this.filteredAnnouncements.length === 0) {
            this.showNoAnnouncements();
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageAnnouncements = this.filteredAnnouncements.slice(startIndex, endIndex);
        
        this.announcementsList.innerHTML = pageAnnouncements.map(announcement => this.createAnnouncementHTML(announcement)).join('');
        
        // Add click listeners for marking as read
        this.announcementsList.querySelectorAll('.announcement-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                this.markAsRead(id);
            });
        });
        
        this.showAnnouncementsList();
    }
    
    createAnnouncementHTML(announcement) {
        const priorityClass = announcement.priority;
        const readClass = announcement.isRead ? 'read' : 'unread';
        const priorityIcon = this.getPriorityIcon(announcement.priority);
        
        return `
            <div class="announcement-card ${priorityClass} ${readClass}" data-id="${announcement.id}">
                <div class="announcement-header">
                    <div class="announcement-priority">
                        <i class="fas ${priorityIcon}"></i>
                        <span class="priority-label">${announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}</span>
                    </div>
                    <div class="announcement-meta">
                        <span class="announcement-date">
                            <i class="fas fa-calendar"></i>
                            ${announcement.date}
                        </span>
                        ${!announcement.isRead ? '<span class="unread-indicator">NEW</span>' : ''}
                    </div>
                </div>
                <div class="announcement-content">
                    <h3 class="announcement-title">${announcement.title}</h3>
                    <p class="announcement-text">${announcement.content}</p>
                </div>
                <div class="announcement-footer">
                    <div class="announcement-author">
                        <i class="fas fa-user"></i>
                        <span>By ${announcement.author}</span>
                    </div>
                    <div class="announcement-audience">
                        <i class="fas fa-users"></i>
                        <span>${announcement.targetAudience}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    getPriorityIcon(priority) {
        const icons = {
            urgent: 'fa-exclamation-triangle',
            important: 'fa-star',
            general: 'fa-info-circle'
        };
        return icons[priority] || 'fa-info-circle';
    }
    
    // Check if announcement is read for current user
    isAnnouncementRead(announcementId) {
        return this.readAnnouncements.has(`${this.currentUserId}_${announcementId}`);
    }
    
    markAsRead(announcementId) {
        const readKey = `${this.currentUserId}_${announcementId}`;
        this.readAnnouncements.add(readKey);
        this.saveReadAnnouncements();
        
        // Update the announcement's read status
        const announcement = this.announcements.find(a => a.id.toString() === announcementId.toString());
        if (announcement) {
            announcement.isRead = true;
        }
        
        // Update the display and stats
        this.displayAnnouncements();
        this.updateStats();
        
        // Send read status to API
        this.updateReadStatusAPI(announcementId);
    }
    
    // Update read status on server
    async updateReadStatusAPI(announcementId) {
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/announcements/mark-read', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ announcementId })
            });
        } catch (error) {
            console.error('Error updating read status:', error);
        }
    }
    
    updateStats() {
        const urgentCount = this.announcements.filter(a => a.priority === 'urgent').length;
        const unreadCount = this.announcements.filter(a => !a.isRead).length;
        
        if (this.urgentCount) this.urgentCount.textContent = `${urgentCount} Urgent`;
        if (this.unreadCount) this.unreadCount.textContent = `${unreadCount} Unread`;
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.filteredAnnouncements.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            if (this.pagination) this.pagination.style.display = 'none';
            return;
        }
        
        if (this.pagination) this.pagination.style.display = 'flex';
        if (this.pageInfo) this.pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        
        if (this.prevBtn) this.prevBtn.disabled = this.currentPage === 1;
        if (this.nextBtn) this.nextBtn.disabled = this.currentPage === totalPages;
    }
    
    showLoading(show) {
        if (show) {
            if (this.loadingState) this.loadingState.style.display = 'flex';
            if (this.announcementsList) this.announcementsList.style.display = 'none';
            if (this.noAnnouncementsState) this.noAnnouncementsState.style.display = 'none';
            if (this.pagination) this.pagination.style.display = 'none';
        } else {
            if (this.loadingState) this.loadingState.style.display = 'none';
        }
    }
    
    showNoAnnouncements() {
        if (this.announcementsList) this.announcementsList.style.display = 'none';
        if (this.noAnnouncementsState) this.noAnnouncementsState.style.display = 'flex';
        if (this.pagination) this.pagination.style.display = 'none';
    }
    
    showAnnouncementsList() {
        if (this.announcementsList) this.announcementsList.style.display = 'block';
        if (this.noAnnouncementsState) this.noAnnouncementsState.style.display = 'none';
    }
    
    showError() {
        if (this.announcementsList) {
            this.announcementsList.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Announcements</h3>
                    <p>There was an error loading announcements. Please try again later.</p>
                    <button class="retry-btn" onclick="studentAnnouncementsManager.fetchAnnouncements()">
                        <i class="fas fa-refresh"></i>
                        Retry
                    </button>
                </div>
            `;
        }
        this.showAnnouncementsList();
    }
    
    // Load read announcements for current user
    loadReadAnnouncements() {
        if (!this.currentUserId) return;
        
        const stored = localStorage.getItem(`readAnnouncements_${this.currentUserId}`);
        if (stored) {
            try {
                this.readAnnouncements = new Set(JSON.parse(stored));
            } catch (error) {
                console.error('Error loading read announcements:', error);
                this.readAnnouncements = new Set();
            }
        }
    }
    
    // Save read announcements for current user
    saveReadAnnouncements() {
        if (!this.currentUserId) return;
        
        try {
            localStorage.setItem(
                `readAnnouncements_${this.currentUserId}`, 
                JSON.stringify([...this.readAnnouncements])
            );
        } catch (error) {
            console.error('Error saving read announcements:', error);
        }
    }
    
    // Public method to refresh announcements (can be called from other scripts)
    refresh() {
        this.fetchAnnouncements();
    }
    
    // Method to handle real-time announcement updates
    handleAnnouncementUpdate(updatedAnnouncements) {
        // Store updated announcements
        localStorage.setItem('facultyAnnouncements', JSON.stringify(updatedAnnouncements));
        
        // Check for new announcements
        const currentIds = new Set(this.announcements.map(a => a.id));
        const newAnnouncements = updatedAnnouncements.filter(a => !currentIds.has(a.id));
        
        // Show notifications for new announcements
        newAnnouncements.forEach(announcement => {
            this.showNotification(`New ${announcement.priority} announcement: ${announcement.title}`);
        });
        
        // Refresh display
        this.fetchAnnouncements();
    }
    
    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = 'announcement-notification';
        notification.innerHTML = `
            <i class="fas fa-bell"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize the announcements manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure all other scripts are loaded
    setTimeout(() => {
        window.studentAnnouncementsManager = new StudentAnnouncementsManager();
    }, 100);
});

// Function to handle real-time updates from registrar
function handleAnnouncementUpdates(announcements) {
    if (window.studentAnnouncementsManager) {
        window.studentAnnouncementsManager.handleAnnouncementUpdate(announcements);
    }
}

// Export for use in other scripts
window.handleAnnouncementUpdates = handleAnnouncementUpdates;

// Sample curriculum data for different programs, years, and terms
const curriculumData = {
    'BSIT': {
        '1st Year': {
            '1st Term': [
                { code: 'IT 101', description: 'Introduction to Computing', section: 'A', units: 3, prereq: '-', day: 'MWF', time: '08:00-09:00' },
                { code: 'IT 102', description: 'Computer Programming 1', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '10:00-11:30' },
                { code: 'GE 01', description: 'Mathematics in the Modern World', section: 'B', units: 3, prereq: '-', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 02', description: 'Understanding the Self', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 01', description: 'Physical Education 1', section: 'C', units: 2, prereq: '-', day: 'SAT', time: '08:00-10:00' }
            ],
            '2nd Term': [
                { code: 'IT 103', description: 'Computer Programming 2', section: 'A', units: 3, prereq: 'IT 102', day: 'MWF', time: '08:00-09:00' },
                { code: 'IT 104', description: 'Web Systems and Technologies', section: 'A', units: 3, prereq: 'IT 101', day: 'TTH', time: '10:00-11:30' },
                { code: 'GE 03', description: 'The Contemporary World', section: 'B', units: 3, prereq: '-', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 04', description: 'Purposive Communication', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 02', description: 'Physical Education 2', section: 'C', units: 2, prereq: 'PE 01', day: 'SAT', time: '08:00-10:00' }
            ],
            '3rd Term': [
                { code: 'IT 105', description: 'Data Structures and Algorithms', section: 'A', units: 3, prereq: 'IT 103', day: 'MWF', time: '08:00-09:00' },
                { code: 'IT 106', description: 'Database Management Systems', section: 'A', units: 3, prereq: 'IT 104', day: 'TTH', time: '10:00-11:30' },
                { code: 'GE 05', description: 'Art Appreciation', section: 'B', units: 3, prereq: '-', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 06', description: 'Science, Technology and Society', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 03', description: 'Physical Education 3', section: 'C', units: 2, prereq: 'PE 02', day: 'SAT', time: '08:00-10:00' }
            ]
        },
        '2nd Year': {
            '1st Term': [
                { code: 'IT 201', description: 'Object-Oriented Programming', section: 'A', units: 3, prereq: 'IT 105', day: 'MWF', time: '08:00-09:00' },
                { code: 'IT 202', description: 'Systems Analysis and Design', section: 'A', units: 3, prereq: 'IT 106', day: 'TTH', time: '10:00-11:30' },
                { code: 'IT 203', description: 'Human Computer Interaction', section: 'B', units: 3, prereq: 'IT 104', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 07', description: 'Ethics and Social Responsibility', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 04', description: 'Physical Education 4', section: 'C', units: 2, prereq: 'PE 03', day: 'SAT', time: '08:00-10:00' }
            ],
            '2nd Term': [
                { code: 'IT 204', description: 'Network Technologies', section: 'A', units: 3, prereq: 'IT 201', day: 'MWF', time: '08:00-09:00' },
                { code: 'IT 205', description: 'Software Engineering', section: 'A', units: 3, prereq: 'IT 202', day: 'TTH', time: '10:00-11:30' },
                { code: 'IT 206', description: 'Information Security', section: 'B', units: 3, prereq: 'IT 204', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 08', description: 'Readings in Philippine History', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'NSTP 01', description: 'National Service Training Program 1', section: 'C', units: 3, prereq: '-', day: 'SAT', time: '08:00-11:00' }
            ],
            '3rd Term': [
                { code: 'IT 207', description: 'Mobile Application Development', section: 'A', units: 3, prereq: 'IT 205', day: 'MWF', time: '08:00-09:00' },
                { code: 'IT 208', description: 'Advanced Database Systems', section: 'A', units: 3, prereq: 'IT 106', day: 'TTH', time: '10:00-11:30' },
                { code: 'IT 209', description: 'IT Project Management', section: 'B', units: 3, prereq: 'IT 202', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 09', description: 'Life and Works of Rizal', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'NSTP 02', description: 'National Service Training Program 2', section: 'C', units: 3, prereq: 'NSTP 01', day: 'SAT', time: '08:00-11:00' }
            ]
        },
        '3rd Year': {
            '1st Term': [
                { code: 'IT 301', description: 'Systems Integration and Architecture', section: 'A', units: 3, prereq: 'IT 207', day: 'MWF', time: '08:00-09:00' },
                { code: 'IT 302', description: 'Web Application Development', section: 'A', units: 3, prereq: 'IT 208', day: 'TTH', time: '10:00-11:30' },
                { code: 'IT 303', description: 'IT Capstone Project 1', section: 'B', units: 3, prereq: 'IT 209', day: 'MWF', time: '13:00-14:00' },
                { code: 'IT 304', description: 'Advanced Programming', section: 'A', units: 3, prereq: 'IT 207', day: 'TTH', time: '14:00-15:30' },
                { code: 'ELEC 01', description: 'IT Elective 1', section: 'C', units: 3, prereq: '-', day: 'SAT', time: '08:00-11:00' }
            ],
            '2nd Term': [
                { code: 'IT 305', description: 'Machine Learning and AI', section: 'A', units: 3, prereq: 'IT 301', day: 'MWF', time: '08:00-09:00' },
                { code: 'IT 306', description: 'Cloud Computing', section: 'A', units: 3, prereq: 'IT 302', day: 'TTH', time: '10:00-11:30' },
                { code: 'IT 307', description: 'IT Capstone Project 2', section: 'B', units: 3, prereq: 'IT 303', day: 'MWF', time: '13:00-14:00' },
                { code: 'IT 308', description: 'DevOps and Automation', section: 'A', units: 3, prereq: 'IT 304', day: 'TTH', time: '14:00-15:30' },
                { code: 'ELEC 02', description: 'IT Elective 2', section: 'C', units: 3, prereq: 'ELEC 01', day: 'SAT', time: '08:00-11:00' }
            ],
            '3rd Term': [
                { code: 'IT 309', description: 'Emerging Technologies', section: 'A', units: 3, prereq: 'IT 305', day: 'MWF', time: '08:00-09:00' },
                { code: 'IT 310', description: 'IT Audit and Compliance', section: 'A', units: 3, prereq: 'IT 306', day: 'TTH', time: '10:00-11:30' },
                { code: 'IT 311', description: 'Professional Issues in IT', section: 'B', units: 3, prereq: 'IT 307', day: 'MWF', time: '13:00-14:00' },
                { code: 'IT 312', description: 'Internship/Practicum', section: 'A', units: 6, prereq: 'IT 308', day: 'MTW', time: '08:00-17:00' }
            ]
        },
        '4th Year': {
            '1st Term': [
                { code: 'IT 401', description: 'Advanced Systems Development', section: 'A', units: 3, prereq: 'IT 309', day: 'MWF', time: '08:00-09:00' },
                { code: 'IT 402', description: 'IT Research Methods', section: 'A', units: 3, prereq: 'IT 310', day: 'TTH', time: '10:00-11:30' },
                { code: 'IT 403', description: 'Thesis/Capstone Project', section: 'B', units: 6, prereq: 'IT 311', day: 'MWF', time: '13:00-16:00' },
                { code: 'ELEC 03', description: 'IT Elective 3', section: 'C', units: 3, prereq: 'ELEC 02', day: 'SAT', time: '08:00-11:00' }
            ],
            '2nd Term': [
                { code: 'IT 404', description: 'IT Entrepreneurship', section: 'A', units: 3, prereq: 'IT 401', day: 'MWF', time: '08:00-09:00' },
                { code: 'IT 405', description: 'Advanced Database Administration', section: 'A', units: 3, prereq: 'IT 402', day: 'TTH', time: '10:00-11:30' },
                { code: 'IT 406', description: 'Thesis/Capstone Project 2', section: 'B', units: 6, prereq: 'IT 403', day: 'MWF', time: '13:00-16:00' },
                { code: 'ELEC 04', description: 'IT Elective 4', section: 'C', units: 3, prereq: 'ELEC 03', day: 'SAT', time: '08:00-11:00' }
            ]
        }
    },
    'BSCS': {
        '1st Year': {
            '1st Term': [
                { code: 'CS 101', description: 'Introduction to Computer Science', section: 'A', units: 3, prereq: '-', day: 'MWF', time: '08:00-09:00' },
                { code: 'CS 102', description: 'Programming Fundamentals', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '10:00-11:30' },
                { code: 'MATH 01', description: 'Calculus 1', section: 'B', units: 3, prereq: '-', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 01', description: 'Understanding the Self', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 01', description: 'Physical Education 1', section: 'C', units: 2, prereq: '-', day: 'SAT', time: '08:00-10:00' }
            ],
            '2nd Term': [
                { code: 'CS 103', description: 'Object-Oriented Programming', section: 'A', units: 3, prereq: 'CS 102', day: 'MWF', time: '08:00-09:00' },
                { code: 'CS 104', description: 'Discrete Mathematics', section: 'A', units: 3, prereq: 'MATH 01', day: 'TTH', time: '10:00-11:30' },
                { code: 'MATH 02', description: 'Calculus 2', section: 'B', units: 3, prereq: 'MATH 01', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 02', description: 'Purposive Communication', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 02', description: 'Physical Education 2', section: 'C', units: 2, prereq: 'PE 01', day: 'SAT', time: '08:00-10:00' }
            ],
            '3rd Term': [
                { code: 'CS 105', description: 'Data Structures', section: 'A', units: 3, prereq: 'CS 103', day: 'MWF', time: '08:00-09:00' },
                { code: 'CS 106', description: 'Computer Organization', section: 'A', units: 3, prereq: 'CS 104', day: 'TTH', time: '10:00-11:30' },
                { code: 'MATH 03', description: 'Linear Algebra', section: 'B', units: 3, prereq: 'MATH 02', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 03', description: 'The Contemporary World', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 03', description: 'Physical Education 3', section: 'C', units: 2, prereq: 'PE 02', day: 'SAT', time: '08:00-10:00' }
            ]
        }
    },
    'BSIS': {
        '1st Year': {
            '1st Term': [
                { code: 'IS 101', description: 'Introduction to Information Systems', section: 'A', units: 3, prereq: '-', day: 'MWF', time: '08:00-09:00' },
                { code: 'IS 102', description: 'Programming Logic and Design', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '10:00-11:30' },
                { code: 'GE 01', description: 'Mathematics in the Modern World', section: 'B', units: 3, prereq: '-', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 02', description: 'Understanding the Self', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 01', description: 'Physical Education 1', section: 'C', units: 2, prereq: '-', day: 'SAT', time: '08:00-10:00' }
            ],
            '2nd Term': [
                { code: 'IS 103', description: 'Business Process Management', section: 'A', units: 3, prereq: 'IS 101', day: 'MWF', time: '08:00-09:00' },
                { code: 'IS 104', description: 'Database Systems', section: 'A', units: 3, prereq: 'IS 102', day: 'TTH', time: '10:00-11:30' },
                { code: 'GE 03', description: 'The Contemporary World', section: 'B', units: 3, prereq: '-', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 04', description: 'Purposive Communication', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 02', description: 'Physical Education 2', section: 'C', units: 2, prereq: 'PE 01', day: 'SAT', time: '08:00-10:00' }
            ],
            '3rd Term': [
                { code: 'IS 105', description: 'Systems Analysis', section: 'A', units: 3, prereq: 'IS 103', day: 'MWF', time: '08:00-09:00' },
                { code: 'IS 106', description: 'Information Systems Security', section: 'A', units: 3, prereq: 'IS 104', day: 'TTH', time: '10:00-11:30' },
                { code: 'GE 05', description: 'Art Appreciation', section: 'B', units: 3, prereq: '-', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 06', description: 'Science, Technology and Society', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 03', description: 'Physical Education 3', section: 'C', units: 2, prereq: 'PE 02', day: 'SAT', time: '08:00-10:00' }
            ]
        }
    },
    'BSBA': {
        '1st Year': {
            '1st Term': [
                { code: 'BA 101', description: 'Introduction to Business', section: 'A', units: 3, prereq: '-', day: 'MWF', time: '08:00-09:00' },
                { code: 'BA 102', description: 'Business Mathematics', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '10:00-11:30' },
                { code: 'GE 01', description: 'Mathematics in the Modern World', section: 'B', units: 3, prereq: '-', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 02', description: 'Understanding the Self', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 01', description: 'Physical Education 1', section: 'C', units: 2, prereq: '-', day: 'SAT', time: '08:00-10:00' }
            ],
            '2nd Term': [
                { code: 'BA 103', description: 'Principles of Management', section: 'A', units: 3, prereq: 'BA 101', day: 'MWF', time: '08:00-09:00' },
                { code: 'BA 104', description: 'Financial Accounting', section: 'A', units: 3, prereq: 'BA 102', day: 'TTH', time: '10:00-11:30' },
                { code: 'GE 03', description: 'The Contemporary World', section: 'B', units: 3, prereq: '-', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 04', description: 'Purposive Communication', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 02', description: 'Physical Education 2', section: 'C', units: 2, prereq: 'PE 01', day: 'SAT', time: '08:00-10:00' }
            ],
            '3rd Term': [
                { code: 'BA 105', description: 'Marketing Management', section: 'A', units: 3, prereq: 'BA 103', day: 'MWF', time: '08:00-09:00' },
                { code: 'BA 106', description: 'Business Statistics', section: 'A', units: 3, prereq: 'BA 104', day: 'TTH', time: '10:00-11:30' },
                { code: 'GE 05', description: 'Art Appreciation', section: 'B', units: 3, prereq: '-', day: 'MWF', time: '13:00-14:00' },
                { code: 'GE 06', description: 'Science, Technology and Society', section: 'A', units: 3, prereq: '-', day: 'TTH', time: '14:00-15:30' },
                { code: 'PE 03', description: 'Physical Education 3', section: 'C', units: 2, prereq: 'PE 02', day: 'SAT', time: '08:00-10:00' }
            ]
        }
    }
};

// Program title mappings
const programTitles = {
    'BSIT': 'BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY',
    'BSCS': 'BACHELOR OF SCIENCE IN COMPUTER SCIENCE',
    'BSIS': 'BACHELOR OF SCIENCE IN INFORMATION SYSTEMS',
    'BSBA': 'BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION'
};

// DOM elements
const enrollmentForm = document.getElementById('enrollmentForm');
const programCards = document.querySelectorAll('input[name="program"]');
const yearCards = document.querySelectorAll('input[name="yearLevel"]');
const termCards = document.querySelectorAll('input[name="academicTerm"]');
const selectedProgram = document.getElementById('selectedProgram');
const selectedYear = document.getElementById('selectedYear');
const selectedTerm = document.getElementById('selectedTerm');
const successMessage = document.getElementById('successMessage');
const curriculumModal = document.getElementById('curriculumModal');

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for form interactions
    programCards.forEach(card => {
        card.addEventListener('change', handleProgramChange);
    });

    yearCards.forEach(card => {
        card.addEventListener('change', handleYearChange);
    });

    termCards.forEach(card => {
        card.addEventListener('change', handleTermChange);
    });

    // Handle card selection visual feedback
    document.querySelectorAll('.selection-card, .year-card, .term-card').forEach(card => {
        card.addEventListener('click', function() {
            const input = this.querySelector('input[type="radio"]');
            if (input) {
                input.checked = true;
                updateCardSelection(input.name);
                updateSummary();
            }
        });
    });

    // Form submission
    enrollmentForm.addEventListener('submit', handleFormSubmit);

    // Modal close event
    window.addEventListener('click', function(event) {
        if (event.target === curriculumModal) {
            closeModal();
        }
    });
});

// Handle program selection
function handleProgramChange() {
    updateCardSelection('program');
    updateSummary();
}

// Handle year level selection
function handleYearChange() {
    updateCardSelection('yearLevel');
    updateSummary();
}

// Handle term selection
function handleTermChange() {
    updateCardSelection('academicTerm');
    updateSummary();
}

// Update card visual selection
function updateCardSelection(name) {
    const cards = document.querySelectorAll(`input[name="${name}"]`);
    cards.forEach(card => {
        const cardElement = card.closest('.selection-card, .year-card, .term-card');
        if (card.checked) {
            cardElement.classList.add('selected');
        } else {
            cardElement.classList.remove('selected');
        }
    });
}

// Update enrollment summary
function updateSummary() {
    const program = document.querySelector('input[name="program"]:checked');
    const year = document.querySelector('input[name="yearLevel"]:checked');
    const term = document.querySelector('input[name="academicTerm"]:checked');

    selectedProgram.textContent = program ? program.value : 'Not selected';
    selectedProgram.className = program ? 'summary-value' : 'summary-value not-selected';

    selectedYear.textContent = year ? year.value : 'Not selected';
    selectedYear.className = year ? 'summary-value' : 'summary-value not-selected';

    selectedTerm.textContent = term ? term.value : 'Not selected';
    selectedTerm.className = term ? 'summary-value' : 'summary-value not-selected';
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const program = document.querySelector('input[name="program"]:checked');
    const year = document.querySelector('input[name="yearLevel"]:checked');
    const term = document.querySelector('input[name="academicTerm"]:checked');

    if (!program || !year || !term) {
        alert('Please select all required fields before submitting.');
        return;
    }

    // Show success message
    successMessage.classList.add('show');
    
    // Hide success message after 3 seconds and show modal
    setTimeout(() => {
        successMessage.classList.remove('show');
        showCurriculumModal(program.value, year.value, term.value);
    }, 3000);
}

// Show curriculum modal
function showCurriculumModal(program, year, term) {
    // Update modal header information
    document.getElementById('modalCourseTitle').textContent = programTitles[program];
    document.getElementById('modalYearLevel').textContent = year.toUpperCase();
    document.getElementById('modalTermLevel').textContent = term.toUpperCase();
    document.getElementById('modalProgram').textContent = program;
    document.getElementById('modalYear').textContent = year;
    document.getElementById('modalTerm').textContent = term;

    // Get curriculum data
    const subjects = getCurriculumData(program, year, term);
    
    // Calculate total units
    const totalUnits = subjects.reduce((sum, subject) => sum + subject.units, 0);
    document.getElementById('totalUnits').textContent = totalUnits;

    // Populate table
    populateTable(subjects);

    // Show modal
    curriculumModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Get curriculum data based on selection
function getCurriculumData(program, year, term) {
    if (curriculumData[program] && curriculumData[program][year] && curriculumData[program][year][term]) {
        return curriculumData[program][year][term];
    }
    
    // Return default data if not found
    return [
        { code: 'N/A', description: 'No curriculum data available', section: '-', units: 0, prereq: '-', day: '-', time: '-' }
    ];
}

// Populate curriculum table
function populateTable(subjects) {
    const tableBody = document.getElementById('modalTableBody');
    tableBody.innerHTML = '';

    subjects.forEach(subject => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${subject.code}</td>
            <td>${subject.description}</td>
            <td>${subject.section}</td>
            <td class="units-cell">${subject.units}</td>
            <td class="prereq-cell">${subject.prereq}</td>
            <td class="day-cell">${subject.day}</td>
            <td class="time-cell">${subject.time}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Close modal
function closeModal() {
    curriculumModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Reset form
function resetForm() {
    // Reset all form inputs
    enrollmentForm.reset();
    
    // Remove all selected classes
    document.querySelectorAll('.selection-card, .year-card, .term-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset summary
    selectedProgram.textContent = 'Not selected';
    selectedProgram.className = 'summary-value not-selected';
    selectedYear.textContent = 'Not selected';
    selectedYear.className = 'summary-value not-selected';
    selectedTerm.textContent = 'Not selected';
    selectedTerm.className = 'summary-value not-selected';
    
    // Hide success message
    successMessage.classList.remove('show');
    
    // Close modal if open
    closeModal();
}

// Keyboard navigation for modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && curriculumModal.classList.contains('show')) {
        closeModal();
    }
});

// Print functionality
function printCurriculum() {
    const printContent = document.getElementById('curriculumModal').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    
    // Re-initialize event listeners after restoring content
    location.reload();
}

// Download curriculum as PDF (basic implementation)
function downloadCurriculum() {
    // Create a simple text version for download
    const program = document.getElementById('modalProgram').textContent;
    const year = document.getElementById('modalYear').textContent;
    const term = document.getElementById('modalTerm').textContent;
    
    const subjects = getCurriculumData(program, year, term);
    const totalUnits = subjects.reduce((sum, subject) => sum + subject.units, 0);
    
    let content = `ENROLLMENT DETAILS\n`;
    content += `Program: ${program}\n`;
    content += `Year Level: ${year}\n`;
    content += `Term: ${term}\n`;
    content += `Total Units: ${totalUnits}\n\n`;
    content += `CURRICULUM:\n`;
    content += `${'CODE'.padEnd(12)} ${'DESCRIPTION'.padEnd(35)} ${'SEC'.padEnd(5)} ${'UNITS'.padEnd(7)} ${'PREREQ'.padEnd(12)} ${'DAY'.padEnd(8)} ${'TIME'.padEnd(15)}\n`;
    content += `${'='.repeat(100)}\n`;
    
    subjects.forEach(subject => {
        content += `${subject.code.padEnd(12)} ${subject.description.padEnd(35)} ${subject.section.padEnd(5)} ${subject.units.toString().padEnd(7)} ${subject.prereq.padEnd(12)} ${subject.day.padEnd(8)} ${subject.time.padEnd(15)}\n`;
    });
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${program}_${year}_${term}_Curriculum.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Search functionality for subjects
function searchSubjects(searchTerm) {
    const rows = document.querySelectorAll('#modalTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add search functionality to modal
function addSearchToModal() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search subjects...';
    searchInput.className = 'search-input';
    searchInput.addEventListener('input', function() {
        searchSubjects(this.value);
    });
    
    const modalHeader = document.querySelector('.modal-header');
    if (modalHeader && !modalHeader.querySelector('.search-input')) {
        modalHeader.appendChild(searchInput);
    }
}

// Enhanced form validation
function validateForm() {
    const program = document.querySelector('input[name="program"]:checked');
    const year = document.querySelector('input[name="yearLevel"]:checked');
    const term = document.querySelector('input[name="academicTerm"]:checked');
    
    const errors = [];
    
    if (!program) errors.push('Please select a program');
    if (!year) errors.push('Please select a year level');
    if (!term) errors.push('Please select an academic term');
    
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }
    
    return true;
}

// Enhanced form submission with validation
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const program = document.querySelector('input[name="program"]:checked');
    const year = document.querySelector('input[name="yearLevel"]:checked');
    const term = document.querySelector('input[name="academicTerm"]:checked');

    // Show success message
    successMessage.classList.add('show');
    
    // Hide success message after 3 seconds and show modal
    setTimeout(() => {
        successMessage.classList.remove('show');
        showCurriculumModal(program.value, year.value, term.value);
    }, 3000);
}

// Enhanced modal display with search functionality
function showCurriculumModal(program, year, term) {
    // Update modal header information
    document.getElementById('modalCourseTitle').textContent = programTitles[program];
    document.getElementById('modalYearLevel').textContent = year.toUpperCase();
    document.getElementById('modalTermLevel').textContent = term.toUpperCase();
    document.getElementById('modalProgram').textContent = program;
    document.getElementById('modalYear').textContent = year;
    document.getElementById('modalTerm').textContent = term;

    // Get curriculum data
    const subjects = getCurriculumData(program, year, term);
    
    // Calculate total units
    const totalUnits = subjects.reduce((sum, subject) => sum + subject.units, 0);
    document.getElementById('totalUnits').textContent = totalUnits;

    // Populate table
    populateTable(subjects);

    // Add search functionality
    addSearchToModal();

    // Show modal
    curriculumModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Local storage functionality for form data persistence
function saveFormData() {
    const program = document.querySelector('input[name="program"]:checked');
    const year = document.querySelector('input[name="yearLevel"]:checked');
    const term = document.querySelector('input[name="academicTerm"]:checked');
    
    const formData = {
        program: program ? program.value : null,
        year: year ? year.value : null,
        term: term ? term.value : null,
        timestamp: Date.now()
    };
    
    try {
        localStorage.setItem('enrollmentFormData', JSON.stringify(formData));
    } catch (e) {
        console.log('Unable to save form data to localStorage');
    }
}

// Load saved form data
function loadFormData() {
    try {
        const savedData = localStorage.getItem('enrollmentFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            // Check if data is not too old (24 hours)
            const dayInMs = 24 * 60 * 60 * 1000;
            if (Date.now() - formData.timestamp < dayInMs) {
                if (formData.program) {
                    const programInput = document.querySelector(`input[name="program"][value="${formData.program}"]`);
                    if (programInput) {
                        programInput.checked = true;
                        updateCardSelection('program');
                    }
                }
                
                if (formData.year) {
                    const yearInput = document.querySelector(`input[name="yearLevel"][value="${formData.year}"]`);
                    if (yearInput) {
                        yearInput.checked = true;
                        updateCardSelection('yearLevel');
                    }
                }
                
                if (formData.term) {
                    const termInput = document.querySelector(`input[name="academicTerm"][value="${formData.term}"]`);
                    if (termInput) {
                        termInput.checked = true;
                        updateCardSelection('academicTerm');
                    }
                }
                
                updateSummary();
            }
        }
    } catch (e) {
        console.log('Unable to load form data from localStorage');
    }
}

// Save form data when selections change
document.addEventListener('change', function(event) {
    if (event.target.name === 'program' || event.target.name === 'yearLevel' || event.target.name === 'academicTerm') {
        saveFormData();
    }
});

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    // Load saved form data
    loadFormData();
    
    // Add event listeners for form interactions
    programCards.forEach(card => {
        card.addEventListener('change', handleProgramChange);
    });

    yearCards.forEach(card => {
        card.addEventListener('change', handleYearChange);
    });

    termCards.forEach(card => {
        card.addEventListener('change', handleTermChange);
    });

    // Handle card selection visual feedback
    document.querySelectorAll('.selection-card, .year-card, .term-card').forEach(card => {
        card.addEventListener('click', function() {
            const input = this.querySelector('input[type="radio"]');
            if (input) {
                input.checked = true;
                updateCardSelection(input.name);
                updateSummary();
            }
        });
    });

    // Form submission
    enrollmentForm.addEventListener('submit', handleFormSubmit);

    // Modal close event
    window.addEventListener('click', function(event) {
        if (event.target === curriculumModal) {
            closeModal();
        }
    });

    // Initialize summary
    updateSummary();
});

// Utility function to format time display
function formatTime(time) {
    if (!time || time === '-') return '-';
    
    const [start, end] = time.split('-');
    if (!start || !end) return time;
    
    const formatSingleTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };
    
    return `${formatSingleTime(start)} - ${formatSingleTime(end)}`;
}

// Enhanced table population with better formatting
function populateTable(subjects) {
    const tableBody = document.getElementById('modalTableBody');
    tableBody.innerHTML = '';

    subjects.forEach(subject => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="code-cell">${subject.code}</td>
            <td class="description-cell">${subject.description}</td>
            <td class="section-cell">${subject.section}</td>
            <td class="units-cell">${subject.units}</td>
            <td class="prereq-cell">${subject.prereq}</td>
            <td class="day-cell">${subject.day}</td>
            <td class="time-cell">${formatTime(subject.time)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Clear localStorage on reset
function resetForm() {
    // Reset all form inputs
    enrollmentForm.reset();
    
    // Remove all selected classes
    document.querySelectorAll('.selection-card, .year-card, .term-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset summary
    selectedProgram.textContent = 'Not selected';
    selectedProgram.className = 'summary-value not-selected';
    selectedYear.textContent = 'Not selected';
    selectedYear.className = 'summary-value not-selected';
    selectedTerm.textContent = 'Not selected';
    selectedTerm.className = 'summary-value not-selected';
    
    // Hide success message
    successMessage.classList.remove('show');
    
    // Close modal if open
    closeModal();
    
    // Clear saved data
    try {
        localStorage.removeItem('enrollmentFormData');
    } catch (e) {
        console.log('Unable to clear localStorage');
    }
}

function checkAuthentication() {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
        const hasToken = sessionStorage.getItem('authToken') !== null;
        const hasUser = sessionStorage.getItem('userData') !== null;
        
        // Fallback to old authentication method for backward compatibility
        const oldAuth = sessionStorage.getItem('loggedIn') === 'true';
        const hasUserName = sessionStorage.getItem('userName') !== null;
        
        console.log("🔍 Auth status:", { isAuthenticated, hasToken, hasUser, oldAuth, hasUserName });
        
        if ((!isAuthenticated || !hasToken || !hasUser) && (!oldAuth || !hasUserName)) {
            console.log("❌ Not authenticated, redirecting to login...");
            window.location.href = '../login.html';
            return false;
        }
        
        return true;
    }
    
    // Get current user data
    function getCurrentUser() {
        try {
            const userData = sessionStorage.getItem('userData');
            if (userData) {
                return JSON.parse(userData);
            }
            
            // Fallback to old user data format
            const userName = sessionStorage.getItem('userName');
            const userEmail = sessionStorage.getItem('userEmail');
            const userRole = sessionStorage.getItem('userRole');
            
            if (userName) {
                return {
                    username: userName,
                    name: userName,
                    email: userEmail,
                    role: userRole || 'Student'
                };
            }
            
            return null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    }
    
    // Enhanced server request with error handling
    async function makeServerRequest(url, options = {}) {
        const token = sessionStorage.getItem('authToken');
        
        // Add auth header if token exists
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
        
        const requestOptions = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, requestOptions);
            
            // Handle authentication errors
            if (response.status === 401) {
                console.log("🔒 Authentication expired, redirecting to login...");
                sessionStorage.clear();
                window.location.href = '../login.html';
                return null;
            }
            
            return response;
        } catch (error) {
            console.error("🚨 Server request failed:", error);
            
            // Check if we just logged in - if so, don't show error
            const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
            const skipServerCheck = sessionStorage.getItem('skipInitialServerCheck') === 'true';
            
            if (justLoggedIn || skipServerCheck) {
                console.log("⏭️ Skipping server error - just logged in");
                // Clear the flags after first use
                sessionStorage.removeItem('justLoggedIn');
                sessionStorage.removeItem('skipInitialServerCheck');
                return null;
            }
            
            // Show error for genuine server issues
            showServerError();
            return null;
        }
    }
    
    // Show server error modal/message
    function showServerError() {
        // Check if error modal already exists
        if (document.getElementById('serverErrorModal')) {
            return;
        }
        
        const errorModal = document.createElement('div');
        errorModal.id = 'serverErrorModal';
        errorModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        errorModal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                max-width: 400px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            ">
                <h3 style="color: #ef4444; margin-bottom: 15px;">Server Connection Error</h3>
                <p style="margin-bottom: 20px; color: #666;">
                    Cannot connect to server. Please check if the server is running on port 3006.
                </p>
                <button id="dismissError" style="
                    background: #3b82f6;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-right: 10px;
                ">OK</button>
                <button id="retryConnection" style="
                    background: #10b981;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">Retry</button>
            </div>
        `;
        
        document.body.appendChild(errorModal);
        
        // Add event listeners
        document.getElementById('dismissError').addEventListener('click', () => {
            errorModal.remove();
        });
        
        document.getElementById('retryConnection').addEventListener('click', () => {
            errorModal.remove();
            // Retry loading dashboard data
            setTimeout(() => {
                window.location.reload();
            }, 500);
        });
    }
    
    // Load dashboard data with fallback
    async function loadDashboardData() {
        console.log("📊 Loading dashboard data...");
        
        // Try to load announcements
        try {
            const response = await makeServerRequest('http://localhost:3006/api/announcements');
            if (response && response.ok) {
                const data = await response.json();
                console.log("📢 Announcements loaded:", data);
                // Update announcements UI here
            }
        } catch (error) {
            console.log("⚠️ Failed to load announcements, using offline mode");
            // Show offline message or cached data
        }
        
        // Try to load other data...
        // Add similar blocks for grades, schedules, etc.
        
        console.log("📊 Dashboard data loading complete");
    }

    