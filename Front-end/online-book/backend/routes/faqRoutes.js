const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

// GET all FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await FAQ.find().sort({ createdAt: -1 });
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new FAQ
router.post('/', async (req, res) => {
    const faq = new FAQ({
        question: req.body.question,
        answer: req.body.answer
    });

    try {
        const newFAQ = await faq.save();
        res.status(201).json(newFAQ);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (Update) an FAQ
router.put('/:id', async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (faq) {
            faq.question = req.body.question || faq.question;
            faq.answer = req.body.answer || faq.answer;
            const updatedFAQ = await faq.save();
            res.json(updatedFAQ);
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE an FAQ
router.delete('/:id', async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.id);
        if (faq) {
            res.json({ message: 'FAQ deleted' });
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
