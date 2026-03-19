const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Blog listing page
router.get('/', blogController.index);

// Single blog post
router.get('/:slug', blogController.show);

module.exports = router;
