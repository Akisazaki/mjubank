import { Router } from "express"
import { Connection } from "typeorm"
import { Customer } from "../model/entity/customer"
import { password } from "../utils"
import { auth } from "./authentication"

function CustomerRouter(router: Router, connection: Connection) {

  const customerRepository = connection.getRepository(Customer)

  router.get('/customers',
    auth.isLoggedIn,
    (req, res, next) => {
      if (req.user)
        customerRepository
          .findOne({ where: { ssn: req.user.ssn } })
          .then(customer => {
            req.user = { ...req.user!, ...customer }
            res.json(customer)
          })
          .catch(error => next(error))
      else
        customerRepository
          .find()
          .then(customers => res.json(customers))
          .catch(error => next(error))
    })

  router.get('/customers/:ssn',
    auth.isLoggedIn,
    auth.isAdmin,
    async (req, res, next) => {
      const user = await customerRepository
        .findOne({ where: { 'ssn': parseInt(req.params.ssn) } })
      if (user) res.json(user)
      else res.status(404).json({
        message: "Not found"
      })
    })

  router.put('/customers',
    auth.isLoggedIn,
    async (req, res, next) => {
      if (req.user) {
        const user = await customerRepository.findOne({ where: { ssn: req.user.ssn } })
        if (user) {
          customerRepository.merge(user, req.body)
          const result = await customerRepository.save(user)
          res.status(200).json(result)
        } else res.status(404).json({
          message: "Not found"
        })
      }
      else res.status(401).json({
        message: "로그인이 필요합니다."
      })
    })

  router.put('/customers/:ssn',
    auth.isLoggedIn,
    auth.isAdmin,
    async (req, res, next) => {
      const user = await customerRepository.findOne({ where: { ssn: parseInt(req.params.ssn) } })
      if (user) {
        customerRepository.merge(user, req.body)
        const result = await customerRepository.save(user)
        res.json(result)
      }
      else
        next(404)
    })

  router.post('/customers',
    auth.isLoggedIn,
    auth.isAdmin,
    (req, res, next) => {
      let data = req.body as Customer;
      let query = `CALL \`CreateCustomer\`(${data.ssn}, '${data.name}', '${data.address}', '${data.birthday}', '${data.email}', '${data.tel}', '${data.job}', 0x${password(data.password)}, 0)`;
      connection.query(query)
        .then(result => res.json(result))
        .catch(err => next(err))
    })
}

export default CustomerRouter