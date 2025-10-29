const router = require('express').Router();
 

router.use('/auth', require('../controllers/auth/index'))
router.use('/brand', require('../controllers/brand/index'));
router.use('/category', require('../controllers/category/index'));

module.exports = router