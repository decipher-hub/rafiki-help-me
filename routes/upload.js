const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: './uploads/', // Destination folder for uploads
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // File naming convention
    }
});

// Initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).array('uploads', 10); // Accept multiple files

// Check file type
function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Validate extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Validate mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Route for uploading user avatar
router.post('/upload-avatar', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send({ message: err });
        } else {
            if (req.files == undefined) {
                return res.status(400).send({ message: 'No file selected!' });
            }
            res.send({ message: 'Avatar uploaded successfully!', file: req.files });
        }
    });
});

// Route for uploading donation photos
router.post('/upload-donation', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send({ message: err });
        } else {
            if (req.files == undefined) {
                return res.status(400).send({ message: 'No file selected!' });
            }
            res.send({ message: 'Donation photos uploaded successfully!', file: req.files });
        }
    });
});

module.exports = router;