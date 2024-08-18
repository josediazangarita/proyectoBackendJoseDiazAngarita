import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder;
        if (file.fieldname === 'profileImage') {
            folder = path.resolve('public/profile_images');
        } else if (file.fieldname === 'productImages') {
            folder = path.resolve('public/product_images');
        } else {
            folder = path.resolve('public/documents');
        }
        console.log(`Saving file to: ${folder}`);
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
        console.log(`Generated filename: ${filename}`);
        cb(null, filename);
    }
});

export const upload = multer({ storage });