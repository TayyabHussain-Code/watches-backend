const router = require('express').Router();
 

router.use('/auth', require('../controllers/auth/index'))
router.use('/brand', require('../controllers/brand/index'));
router.use('/category', require('../controllers/category/index'));
router.use('/product', require('../controllers/product/index'));

module.exports = router