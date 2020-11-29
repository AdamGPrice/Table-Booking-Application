const express = require('express');
const multer = require('multer');
const path = require("path");
const fs = require("fs");

const upload = multer({ dest: 'uploads/' });

const db = require('../../mysql');

const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
    // Get image type and path
    const fileType = req.file.mimetype.split('/');
    const currentName = req.file.path;
    const newName = req.file.path + '.' + fileType[1];
    
    if (fileType[0] == "image") {
        // add image extension to file
        fs.rename(currentName, newName, error => {
            if (error) {
                res.status(500);
                res.json('Error: Could not upload the image.')
                // remove temp file
                try {
                    fs.unlinkSync(currentName)
                } catch(err) {
                    console.error(err)
                }
            }
        });
    } else {
        res.status(403);
        res.json('Only image file types are allowed.')
        // remove temp file
        try {
            fs.unlinkSync(currentName)
        } catch(err) {
            console.error(err)
        }
    }
    // If no error then add picture id to the database

});

router.get('/', (req, res) => {
    res.json('hnenre');
});

module.exports = router;