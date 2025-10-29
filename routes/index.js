const router = require('express').Router();
 

router.use('/brand', require('../controllers/brand/index'))

module.exports = router