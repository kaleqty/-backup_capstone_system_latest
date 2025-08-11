// Simple authentication guard for protected pages
(function() {
    'use strict';
    
    // Prevent multiple initializations
    if (window.authGuardInitialized) {
        console.warn('Auth guard already initialized');
        return;
    }
    window.authGuardInitialized = true;
    
    // Check authentication immediately
    function checkAuth() {
        const token = sessionStorage.getItem('authToken');
        const userData = sessionStorage.getItem('userData');
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        
        console.log('Auth check:', {
            hasToken: !!token,
            hasUserData: !!userData,
            isAuthenticated: isAuthenticated,
            currentPage: window.location.pathname
        });
        
        // If any auth data is missing, redirect to login
        if (!token || !userData || isAuthenticated !== 'true') {
            console.log('Authentication failed - redirecting to login');
            alert('Please log in to access this page.');
            // Fixed: Use absolute path from root instead of relative path
            window.location.href = 'http://localhost:3006/login.html';
            return false;
        }
        
        try {
            const user = JSON.parse(userData);
            console.log('User authenticated:', user.username, 'Role:', user.role);
            
            // Store user data globally for easy access
            window.currentUser = user;
            
            return true;
        } catch (error) {
            console.error('Invalid user data stored:', error);
            sessionStorage.clear();
            alert('Authentication error. Please log in again.');
            // Fixed: Use absolute path from root instead of relative path
            window.location.href = 'http://localhost:3006/login.html';
            return false;
        }
    }
    
    // Global logout function
    window.logout = function() {
        sessionStorage.clear();
        alert('You have been logged out.');
        // Fixed: Use absolute path from root instead of relative path
        window.location.href = 'http://localhost:3006/login.html';
    };
    
    // Global function to get current user
    window.getCurrentUser = function() {
        const userData = sessionStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    };
    
    // Check auth when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAuth);
    } else {
        checkAuth();
    }
    
    // Optional: Check auth periodically (every 30 minutes)
    setInterval(function() {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            console.log('Session expired - redirecting to login');
            // Fixed: Use absolute path from root instead of relative path
            window.location.href = 'http://localhost:3006/login.html';
        }
    }, 30 * 60 * 1000); // 30 minutes
    
    console.log('Auth guard initialized');
})();