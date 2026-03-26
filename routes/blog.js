const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Blog listing page
router.get('/', blogController.index);

// Southeast Asia Founders collection
router.get('/southeast-asia-founders', blogController.seaCollection);

// Single blog post
router.get('/:slug', blogController.show);

module.exports = router;
