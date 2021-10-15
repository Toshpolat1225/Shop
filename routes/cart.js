const { Router } = require('express')
const router = Router()
const controllers = require('../controllers/cart')
const auth = require('../middleware/auth')

router.post('/', auth, controllers.add)
router.post('/getFullCartInfo',controllers.getFullCartInfo)
router.get('/', controllers.getAll)

router.patch('/', auth, controllers.update)

router.delete('/:productId', auth, controllers.remove)


module.exports = router