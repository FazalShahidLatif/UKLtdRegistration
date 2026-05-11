const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Blog listing page
router.get('/', blogController.index);

// Blog collections
router.get('/southeast-asia-founders', blogController.seaCollection);
router.get('/export-hub', blogController.exportCollection);
router.get('/regional-guides', blogController.regionalCollection);

// Single blog post
router.get('/:slug', blogController.show);

module.exports = router;
