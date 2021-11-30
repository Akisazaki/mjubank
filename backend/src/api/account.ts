import { Router } from "express"
import passport from 'passport'
import { Connection } from "typeorm"
import UUID from 'uuid-int'
import { Account } from "../model/entity/account"

const idGen = UUID(41).uuid

function AccountRouter(router: Router, connection: Connection) {

  const accountRepository = connection.getRepository(Account)

  router.get('/accounts',
    passport.authenticate('local'),
    (req, res, next) => {
      accountRepository
        .find({ where: { ssn: req.user!.ssn } })
        .then(accounts => res.json(accounts))
        .catch(error => next(error))
    })

  router.get('/accounts/:id', async (req, res, next) => {
    const account = await accountRepository
      .findOne({ where: { 'ssn': parseInt(req.params.id) } })
    if (account) res.json(account)
    else next(404)
  })

  router.put('/accounts/:id', async (req, res, next) => {
    const account = await accountRepository.findOne({ where: { account_id: parseInt(req.params.id) } })
    if (account) {
      accountRepository.merge(account, req.body)
      const result = await accountRepository.save(account)
      res.json(result)
    }
    else
      next(404)
  })

  router.post('/accounts',
    passport.authenticate('local'),
    (req, res, next) => {
      if (req.user) {
        let query = `CALL \`CreateCustomer\`(${req.user.ssn}, '${idGen()}', 0)`
        connection.query(query)
          .then(result => res.json(result))
          .catch(err => next(err))
      }
      else
        next(401)
    })
}

export default AccountRouter