const router = require('express').Router();
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

router.post('/submit-user-data', authController.protect, viewController.updateUserData);

router.use(authController.isLoggedIn);

router.get('/', bookingController.createBookingCheckout, viewController.getOverview);

router.get('/tours/:slug', viewController.getTour);

router.get('/login', viewController.getLogin);
router.get('/signup', viewController.getSignup);

module.exports = router;
