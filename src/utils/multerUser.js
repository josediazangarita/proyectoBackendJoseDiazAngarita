import multer from 'multer';
import path from 'path';
import __dirname from '../utils.js';

const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'documents'; 

        if (file.fieldname === 'profileImages') {
            folder = 'profiles'; 
        } else if (file.fieldname === 'productImages') {
            folder = 'products'; 
        }

        cb(null, path.join(__dirname, `../public/${folder}`));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|docx/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (jpegf, jpg, png, gif) and documents (PDF, DOCX) are allowed'));
    }
};

export const userUploader = multer({ 
    storage: userStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});