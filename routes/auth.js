import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered successfully.');
    } catch (err) {
        res.status(400).send('Error registering user: ' + err.message);
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).send('User not found.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials.');

    req.session.user = user;
    res.send('Login successful.');
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => res.send('Logout successful.'));
});

export default router;
