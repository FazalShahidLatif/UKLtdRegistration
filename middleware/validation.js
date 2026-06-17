/**
 * Input Validation Middleware
 * Using express-validator for robust input sanitization
 * 
 * @author BlueOceanHub
 * @license MIT
 */

const { body, query, param, validationResult } = require('express-validator');
const validator = require('validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Company formation validation rules
 */
const validateCompanyFormation = [
    body('companyName')
        .trim()
        .notEmpty().withMessage('Company name is required')
        .isLength({ min: 3, max: 160 }).withMessage('Company name must be 3-160 characters')
        .matches(/^[a-zA-Z0-9\s&\-'.()]+$/).withMessage('Company name contains invalid characters')
        .customSanitizer(value => validator.escape(value)),
    
    body('directorFirstName')
        .trim()
        .notEmpty().withMessage('Director first name is required')
        .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters')
        .matches(/^[a-zA-Z\s\-']+$/).withMessage('First name contains invalid characters'),
    
    body('directorLastName')
        .trim()
        .notEmpty().withMessage('Director last name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters')
        .matches(/^[a-zA-Z\s\-']+$/).withMessage('Last name contains invalid characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .isLength({ max: 100 }).withMessage('Email too long'),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[\d\s\-+()]{10,20}$/).withMessage('Invalid phone number format'),
    
    body('address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ min: 10, max: 200 }).withMessage('Address must be 10-200 characters'),
    
    body('postcode')
        .trim()
        .notEmpty().withMessage('Postcode is required')
        .matches(/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i).withMessage('Invalid UK postcode'),
    
    body('sicCode')
        .optional()
        .trim()
        .matches(/^\d{5}$/).withMessage('SIC code must be 5 digits'),
    
    handleValidationErrors
];

/**
 * Contact form validation
 */
const validateContactForm = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
        .matches(/^[a-zA-Z\s\-']+$/).withMessage('Name contains invalid characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required')
        .isLength({ min: 5, max: 200 }).withMessage('Subject must be 5-200 characters'),
    
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 20, max: 5000 }).withMessage('Message must be 20-5000 characters'),
    
    handleValidationErrors
];

/**
 * Login validation
 */
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    
    handleValidationErrors
];

/**
 * Registration validation
 */
const validateRegister = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .custom(async (email) => {
            // Check if email already exists (implement your logic)
            // const user = await User.findOne({ email });
            // if (user) throw new Error('Email already registered');
            return true;
        }),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match'),
    
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters')
        .matches(/^[a-zA-Z\s\-']+$/).withMessage('First name contains invalid characters'),
    
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters')
        .matches(/^[a-zA-Z\s\-']+$/).withMessage('Last name contains invalid characters'),
    
    body('agreedToTerms')
        .isBoolean()
        .equals('true').withMessage('You must agree to terms and conditions'),
    
    handleValidationErrors
];

/**
 * Company name check validation
 */
const validateNameCheck = [
    query('name')
        .trim()
        .notEmpty().withMessage('Company name is required')
        .isLength({ min: 3, max: 160 }).withMessage('Company name must be 3-160 characters')
        .matches(/^[a-zA-Z0-9\s&\-'.()]+$/).withMessage('Company name contains invalid characters'),
    
    handleValidationErrors
];

/**
 * Payment webhook validation
 */
const validatePaddleWebhook = [
    body('alert_name')
        .notEmpty().withMessage('Alert name is required')
        .isString(),
    
    body('p_signature')
        .notEmpty().withMessage('Signature is required')
        .isString(),
    
    // Don't run handleValidationErrors here - webhook needs custom handling
];

/**
 * Affiliate registration validation
 */
const validateAffiliateRegister = [
    body('companyName')
        .trim()
        .notEmpty().withMessage('Company/individual name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    
    body('website')
        .trim()
        .notEmpty().withMessage('Website is required')
        .isURL({ require_protocol: true }).withMessage('Invalid website URL'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .matches(/^[\d\s\-+()]{10,20}$/).withMessage('Invalid phone number'),
    
    body('country')
        .trim()
        .notEmpty().withMessage('Country is required')
        .isLength({ min: 2, max: 2 }).withMessage('Country must be 2-letter code'),
    
    body('paymentMethod')
        .isIn(['bank_transfer', 'paypal', 'wise']).withMessage('Invalid payment method'),
    
    handleValidationErrors
];

/**
 * VAT registration validation
 */
const validateVATRegistration = [
    body('companyNumber')
        .trim()
        .notEmpty().withMessage('Company number is required')
        .matches(/^\d{8}$/).withMessage('Company number must be 8 digits'),
    
    body('vatThreshold')
        .isFloat({ min: 0 }).withMessage('Invalid VAT threshold amount'),
    
    body('startDate')
        .isISO8601().withMessage('Invalid date format')
        .toDate(),
    
    handleValidationErrors
];

/**
 * Sanitize MongoDB query parameters
 */
const sanitizeMongoQuery = (req, res, next) => {
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                // Remove $ and . to prevent NoSQL injection
                req.query[key] = req.query[key].replace(/[$.]/, '');
            }
        });
    }
    next();
};

module.exports = {
    handleValidationErrors,
    validateCompanyFormation,
    validateContactForm,
    validateLogin,
    validateRegister,
    validateNameCheck,
    validatePaddleWebhook,
    validateAffiliateRegister,
    validateVATRegistration,
    sanitizeMongoQuery
};
