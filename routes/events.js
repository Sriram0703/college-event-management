import express from 'express';
import Event from '../models/Event.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get All Events
router.get('/', async (req, res) => {
    const events = await Event.find();
    res.json(events);
});

// Register for Event
router.post('/:id/register', isAuthenticated, async (req, res) => {
    const eventId = req.params.id;
    const userId = req.session.user._id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).send('Event not found.');

    if (event.registeredUsers.includes(userId)) {
        return res.status(400).send('You are already registered for this event.');
    }

    event.registeredUsers.push(userId);
    await event.save();

    res.send('Registered successfully.');
});

export default router;
