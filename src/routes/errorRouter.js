import express from 'express';

const router = express.Router();

router.get('/error', (req, res) => {
    const { message, details, previousUrl  } = req.query;
    res.render('error', { 
        message, 
        details,
        style:'style.css',
        previousUrl 
    });
});

export default router;