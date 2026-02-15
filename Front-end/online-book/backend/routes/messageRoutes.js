const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET all Messages
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ date: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new Message
router.post('/', async (req, res) => {
    const message = new Message({
        title: req.body.title,
        content: req.body.content
    });

    try {
        const newMessage = await message.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (Update) a Message
router.put('/:id', async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (message) {
            message.title = req.body.title || message.title;
            message.content = req.body.content || message.content;
            const updatedMessage = await message.save();
            res.json(updatedMessage);
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a Message
router.delete('/:id', async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (message) {
            res.json({ message: 'Message deleted' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
