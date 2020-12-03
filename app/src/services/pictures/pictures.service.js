const express = require('express');
const multer = require('multer');
const fs = require("fs");

const upload = multer({ dest: 'uploads/' });

const queries = require('./pictures.queries');
const auth = require('../../authentication');
const router = express.Router();

router.post('/pub/:id', auth.authenticateToken, auth.isOwner, upload.single('file'), async (req, res) => {
    // check if the image being uploaded is by the pub owner
    const pubId = req.params.id;
    const isOwner = await auth.isPubOwner(req, res, pubId);

    if (req.file == undefined) {
        res.status(403);
        res.json('No image/file provided in the request');
    } else {
        // Get image type and path
        const fileType = req.file.mimetype.split('/');
        const currentName = req.file.path;
        const newName = req.file.path + '.' + fileType[1];

        console.log('req.file', req.file);

        console.log('newName1', newName);

        if (!isOwner) {
            res.status(403);
            res.json({
                status: res.statusCode,
                message: 'Account does not permissions to upload images for this pub.'
            });
            cleanUpImage(currentName);
        } else {
            let fileUploaded = true;

            if (fileType[0] == "image") {
                // add image extension to file
                fs.rename(currentName, newName, error => {
                    if (error) {
                        res.status(500);
                        res.json('Error: Could not upload the image.');
                        // remove temp file
                        cleanUpImage(currentName);
                        fileUploaded = false;
                    }
                });
            } else {
                res.status(403);
                res.json('Only image file types are allowed.');
                // remove temp file
                cleanUpImage(currentName);
                fileUploaded = false;
            }
            if (fileUploaded) {
                // If no error then add picture name/id to the database
                console.log('newName2', newName);

                let fileName = newName.split('\\')[1];
                if (fileName == undefined) {
                    fileName = newName.split('/')[1];
                }
                if (fileName != undefined) {
                    console.log('filename', fileName);
                    try {
                        const picture = await queries.newPicture(pubId, fileName);
                        res.status(201);
                        res.json({
                            status: res.statusCode,
                            message: 'Uploded image successfully.'
                        });
                    } catch(error) {
                        res.status(500);
                        res.json({
                            status: res.statusCode,
                            message: error.sqlMessage
                        });
                        console.log(error);
                        cleanUpImage(newName);
                    }
                }
            }
        }
    }
});

router.get('/', async (req, res) => {       
    const pictures = await queries.getAll();
    res.json(pictures);
});

router.get('/pub/:id', async (req, res) => {
    const { id } = req.params;
    const pictures = await queries.getAllByPubId(id);
    res.json(pictures);
});

router.delete('/pub/:id/image/:name', auth.authenticateToken, auth.isOwner, async (req, res) => {
    // check if the use making the delete request is the owner
    const { id, name } = req.params; 
    const isOwner = await auth.isPubOwner(req, res, id);
    
    // Delete the db entry and remove image from the server
    if (!isOwner) {
        res.status(403);
        res.json({
            status: res.statusCode,
            message: 'Account does not permissions to delete images for this pub.'
        });
    } else {
        // check if the image is in the database
        const exists = await queries.getByPubIdAndName(id, name);
        if (exists != undefined) {
            try {
                const result = await queries.deleteByPubIdAndName(id, name);
                res.status(200);
                res.json({
                    status: res.statusCode,
                    message: 'Image deleted successfully.'
                });
                cleanUpImage(`uploads\\${name}`);   // Try both \ and / depending what os we are on.
                cleanUpImage(`uploads/${name}`);   
            } catch(error) {
                res.status(500);
                res.json({
                    status: res.statusCode,
                    message: error.sqlMessage
                });
            }
        } else {
            res.status(409);
            res.json({
                status: res.statusCode,
                message: 'Unable to delete an image that does not exist.' 
            });
        }
    }
});

function cleanUpImage(name) {
    try {
        fs.unlinkSync(name);
    } catch(err) {
        console.error(err);
    }
}

module.exports = router;