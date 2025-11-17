const router = require('express').Router();
 

router.use('/auth', require('../controllers/auth/index'))
router.use('/brand', require('../controllers/brand/index'));
router.use('/category', require('../controllers/category/index'));
router.use('/product', require('../controllers/product/index'));
router.use('/reviews', require('../controllers/reviews/index'));
router.use( require('../controllers/dashboard/index'));

module.exports = router