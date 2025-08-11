import { Router } from 'express';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to split full name into first and last name
function splitFullName(fullName) {
    if (!fullName || typeof fullName !== 'string') {
        return { firstName: '', lastName: '' };
    }
    
    const nameParts = fullName.trim().split(/\s+/);
    
    if (nameParts.length === 1) {
        return { firstName: nameParts[0], lastName: '' };
    } else if (nameParts.length === 2) {
        return { firstName: nameParts[0], lastName: nameParts[1] };
    } else {
        // For names with more than 2 parts, first part is first name, rest is last name
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        return { firstName, lastName };
    }
}

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        console.log('🚀 REGISTRATION REQUEST RECEIVED');
        console.log('Request body:', req.body);
        
        const { name, email, password, confirmPassword } = req.body;
        
        console.log('Extracted values:');
        console.log('- name:', name, '(type:', typeof name, ')');
        console.log('- email:', email);
        
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill in all required fields' 
            });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Passwords do not match' 
            });
        }
        
        // Check if user exists
        const [existingUsers] = await db.execute(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }
        
        // Split the full name - SIMPLE INLINE APPROACH
        let firstName = '';
        let lastName = '';
        
        if (name && typeof name === 'string') {
            const trimmedName = name.trim();
            const nameParts = trimmedName.split(/\s+/);
            
            console.log('Name splitting:');
            console.log('- Original name:', name);
            console.log('- Trimmed name:', trimmedName);
            console.log('- Name parts:', nameParts);
            
            if (nameParts.length >= 1 && nameParts[0]) {
                firstName = nameParts[0];
            }
            if (nameParts.length >= 2) {
                lastName = nameParts.slice(1).join(' ');
            }
        }
        
        console.log('Final split result:');
        console.log('- firstName:', firstName);
        console.log('- lastName:', lastName);
        
        // Determine role
        let role = 'student';
        
        // Hash password
        const hashedPassword = await hash(password, 10);
        
        // Prepare database values (convert empty strings to null)
        const dbFirstName = firstName.trim() || null;
        const dbLastName = lastName.trim() || null;
        
        console.log('Database insertion values:');
        console.log('- username:', name);
        console.log('- first_name:', dbFirstName);
        console.log('- last_name:', dbLastName);
        console.log('- email:', email);
        console.log('- role:', role);
        
        // Insert into database
        const insertQuery = 'INSERT INTO users (username, first_name, last_name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';
        const insertValues = [name, dbFirstName, dbLastName, email, hashedPassword, role];
        
        console.log('Executing SQL:', insertQuery);
        console.log('With values:', [name, dbFirstName, dbLastName, email, '[HIDDEN]', role]);
        
        const [result] = await db.execute(insertQuery, insertValues);
        
        console.log('✅ Database insertion successful, ID:', result.insertId);
        
        // Verify the insertion
        const [verifyResult] = await db.execute(
            'SELECT id, username, first_name, last_name, email, role FROM users WHERE id = ?',
            [result.insertId]
        );
        
        console.log('✅ Verification - User in database:', verifyResult[0]);
        
        res.json({ 
            success: true, 
            message: 'Account created successfully',
            user: {
                id: result.insertId,
                username: name,
                first_name: dbFirstName,
                last_name: dbLastName,
                email: email,
                role: role
            }
        });
        
    } catch (error) {
        console.error('🚨 Registration error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide email and password' 
            });
        }
        
        // Find user
        const [results] = await db.execute(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );
        
        if (results.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        const user = results[0];
        
        // Check password
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        // Generate token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Update last login
        await db.execute(
            'UPDATE users SET last_login = NOW() WHERE id = ?', 
            [user.id]
        );
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Token verification middleware
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
};

// Token validation endpoint
router.post('/validate', verifyToken, async (req, res) => {
    try {
        const [results] = await db.execute(
            'SELECT id, username, first_name, last_name, email, role FROM users WHERE id = ?', 
            [req.user.userId]
        );
        
        if (results.length === 0) {
            return res.status(404).json({ 
                valid: false, 
                message: 'User not found' 
            });
        }
        
        res.json({ 
            valid: true, 
            user: results[0] 
        });
        
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(500).json({ 
            valid: false, 
            message: 'Internal server error' 
        });
    }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const [results] = await db.execute(
            'SELECT id, username, first_name, last_name, email, role, created_at, last_login FROM users WHERE id = ?', 
            [req.user.userId]
        );
        
        if (results.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        res.json({ 
            success: true, 
            user: results[0] 
        });
        
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Database error' 
        });
    }
});

export default router;