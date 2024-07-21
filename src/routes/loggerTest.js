import express from 'express';
import logger from '../logs/logger.js';

const router = express.Router();

router.get('/loggertest', (req, res) => {
    logger.debug('Debug log - /loggertest endpoint');
    logger.http('HTTP log - /loggertest endpoint');
    logger.info('Info log - /loggertest endpoint');
    logger.warning('Warning log - /loggertest endpoint');
    logger.error('Error log - /loggertest endpoint');
    logger.fatal('Fatal log - /loggertest endpoint');
    
    res.status(200).send('Logs generated. Check the console and log files.');
});

export default router;
