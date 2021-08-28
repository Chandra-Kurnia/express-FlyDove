import Express from 'express'

const router = Express.Router()

router.get('/', (req, res) => {
  res.json({
    msg: 'sampai disini bro'
  })
})

export default router
