const router = require('express').Router();
 

router.use('/brand', require('../controllers/brand/index'));
router.use('/auth', require('../controllers/auth/index'))

module.exports = router