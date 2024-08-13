import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img'); // Carpeta donde se guardan las imágenes de productos de administradores
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const uploader = multer({ storage });