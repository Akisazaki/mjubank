import { Router } from "express"
import { Connection } from "typeorm"
import UUID from 'uuid-int'
import { Account } from "../model/entity/account"
import { Customer } from "../model/entity/customer"
import { auth } from "./authentication"

const idGen = UUID(41).uuid

function AccountRouter(router: Router, connection: Connection) {

  const accountRepository = connection.getRepository(Account)
  const customerRepository = connection.getRepository(Customer)

  router.get('/accounts',
    auth.isLoggedIn,
    (req, res, next) => {
      accountRepository
        .find({ where: { ssn: req.user!.ssn } })
        .then(accounts => res.json(accounts))
        .catch(error => next(error))
    })

  router.get('/accounts/:id/holder',
    auth.isLoggedIn,
    async (req, res, next) => {
      const account = await accountRepository
        .findOne({ where: { account_id: parseInt(req.params.id) } })
      if (!account)
        return res.status(404).send({
          message: "계좌를 찾을 수 없음"
        })

      const holder = await customerRepository
        .findOne({ where: { ssn: account.ssn } })
      if (!holder)
        return res.status(404).send({
          message: "소유주를 찾을 수 없음"
        })

      res.status(200).send({
        ...holder,
        password: undefined,
        ssn: undefined
      })
    })

  router.post('/accounts/:id/deposit',
    auth.isLoggedIn,
    async (req, res, next) => {
      let account = await accountRepository
        .findOne({ where: { account_id: parseInt(req.params.id) } })
      if (!account)
        return res.status(404).send({
          message: "계좌를 찾을 수 없음"
        })

      const amount = parseFloat(req.body.amount)
      const note = req.body.note
      if (isNaN(amount) || amount <= 0)
        return res.status(402).send({
          message: "잘못된 입금액"
        })

      const result = await connection.query(`CALL \`Deposit\`(${account.account_id}, ${amount}, '${note}')`)
      res.status(200).send(result[0][0])
    })
  router.post('/accounts/:id/withdraw',
    auth.isLoggedIn,
    async (req, res, next) => {
      const account = await accountRepository
        .findOne({ where: { account_id: parseInt(req.params.id) } })
      if (!account)
        return res.status(404).send({
          message: "계좌를 찾을 수 없음"
        })

      const amount = parseFloat(req.body.amount)
      const note = req.body.note
      if (isNaN(amount) || amount <= 0 || amount > account.balance)
        return res.status(402).send({
          message: "잘못된 출금액"
        })

      const result = await connection.query(`CALL \`Withdraw\`(${account.account_id}, ${amount}, '${note}')`)
      res.status(200).send(result[0][0])
    })

  router.post('/accounts/:id/transfer',
    auth.isLoggedIn,
    async (req, res, next) => {
      const account = await accountRepository
        .findOne({ where: { account_id: parseInt(req.params.id) } })
      if (!account)
        return res.status(404).send({
          message: "계좌를 찾을 수 없음"
        })
      const counterParty = await accountRepository
        .findOne({ where: { account_id: parseInt(req.body.counterParty) } })
      if (!counterParty)
        return res.status(404).send({
          message: "상대 계좌를 찾을 수 없음"
        })

      const amount = parseFloat(req.body.amount)
      const note = req.body.note
      if (isNaN(amount) || amount <= 0 || amount > account.balance)
        return res.status(402).send({
          message: "잘못된 출금액"
        })

      const result = await connection.query(`CALL \`Transfer\`(${account.account_id}, ${counterParty.account_id}, ${amount}, '${note}')`)
      res.status(200).send(result[0][0])
    })

  router.put('/accounts/:id',
    auth.isLoggedIn,
    async (req, res, next) => {
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
    auth.isLoggedIn,
    (req, res, next) => {
      if (req.user) {
        let query = `CALL \`OpenAccount\`(${req.user.ssn}, '${idGen()}', ${req.body.accountType})`
        connection.query(query)
          .then(_ => accountRepository.find({
            where: { 'ssn': req.user!.ssn }
          }))
          .then(accounts => res.status(200).send(accounts))
          .catch(err => res.status(500).send({
            message: err
          }))
      }
      else
        next(401)
    })
}

export default AccountRouter