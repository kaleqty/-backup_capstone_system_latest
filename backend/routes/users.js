// routes/users.js
import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

// Token verification middleware (same as in auth.js)
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
};

// Get user's contacts
router.get('/contacts', verifyToken, async (req, res) => {
    try {
        // Get all users except the current user
        const [results] = await db.execute(
            `SELECT u.id, u.username, u.email, u.role, u.last_login,
                    CASE WHEN u.last_login > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN 1 ELSE 0 END as online
             FROM users u 
             WHERE u.id != ?
             ORDER BY u.username ASC`,
            [req.user.userId]
        );
        
        res.json({ 
            success: true, 
            contacts: results 
        });
        
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Database error' 
        });
    }
});

// Search users by email
router.get('/search', verifyToken, async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.json({ 
                success: true, 
                users: [] 
            });
        }
        
        const [results] = await db.execute(
            `SELECT id, username, email, role 
             FROM users 
             WHERE email LIKE ? AND id != ?
             LIMIT 10`,
            [`%${email}%`, req.user.userId]
        );
        
        res.json({ 
            success: true, 
            users: results 
        });
        
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Database error' 
        });
    }
});

export default router;