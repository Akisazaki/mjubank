import { Router } from 'express'
import passport from 'passport'
import { Connection } from 'typeorm'
import CustomerRouter from './customer'


function APIRouter(connection: Connection) {
  const router = Router()

  // session
  router.post('/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/')
    })
  router.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  CustomerRouter(router, connection)
  return router
}

export default APIRouter
