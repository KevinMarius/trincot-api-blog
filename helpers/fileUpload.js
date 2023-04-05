const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const fileUpload = multer({
    limits: { 
        fileSize: 2000000,
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv4() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid MIME type');
        
        // upload only png and jpg format
        cb(error, isValid);
    },
});


module.exports =  fileUpload;
