const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const mongoose = require('mongoose');
const fetchuser = require('../middleware/fetchuser');
// to check if notes are empty 
const { body, validationResult } = require('express-validator');

//Router#1 Get all notes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Some Error Occured' });
    }
})
//Router#2 Add notes using post  "/api/notes/addnote" login required
router.post('/addnote', [
    body('title').isLength({ min: 3 }).withMessage('Enter a valid title'),
    body('description').isLength({ min: 5 }).withMessage('Description must be at least 5 characters long'),
], fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        // const notes=await Notes.find({user:req.user.id})
        res.json(savedNote);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Some Error Occured' });
    }
})
// Route #3 update the existing note login=>required  /api/notes/updatenote
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };
    // find note to be updated and update it 
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid note ID');
    }


    try {
        // Find the note to be updated
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send('Note not found');
        }

        // Check if the note belongs to the logged-in user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }

        // Update the note
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Some Error Occurred' });
    }
});


// Route #4 delete the existing note login=>required using delete  /api/notes/deletenote
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid note ID');
    }


    try {
// find note to be deleted and delete it 
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send('Note not found find');
        }

        // Check if the note belongs to the logged-in user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }

        // Update the note
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json("Note has been deleted");
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Some Error Occurred' });
    }
});
module.exports = router;