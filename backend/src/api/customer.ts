import { Router } from "express"
import passport from 'passport'
import { Connection } from "typeorm"
import { Customer } from "../model/entity/customer"
import { password } from "../utils"

function CustomerRouter(router: Router, connection: Connection) {

  const customerRepository = connection.getRepository(Customer)

  router.get('/customers',
    passport.authenticate('local'),
    (req, res, next) => {
      if (req.user)
        customerRepository
          .findOne({ where: { ssn: req.user.ssn } })
          .then(customer => {
            req.user = customer
            res.json(customer)
          })
          .catch(error => next(error))
      else
        customerRepository
          .find()
          .then(customers => res.json(customers))
          .catch(error => next(error))
    })

  router.get('/customers/:ssn', async (req, res, next) => {
    const user = await customerRepository
      .findOne({ where: { 'ssn': parseInt(req.params.ssn) } })
    if (user) res.json(user)
    else next(404)
  })

  router.put('/customers',
    passport.authenticate('local'),
    async (req, res, next) => {
      if (req.user) {
        const user = await customerRepository.findOne({ where: { ssn: req.user.ssn } })
        if (user) {
          customerRepository.merge(user, req.body)
          const result = await customerRepository.save(user)
          res.json(result)
        }
        else
          next(404)
      } else next(401)
    })

  router.put('/customers/:ssn', async (req, res, next) => {
    const user = await customerRepository.findOne({ where: { ssn: parseInt(req.params.ssn) } })
    if (user) {
      customerRepository.merge(user, req.body)
      const result = await customerRepository.save(user)
      res.json(result)
    }
    else
      next(404)
  })

  router.post('/customers', (req, res, next) => {
    let data = req.body as Customer;
    let query = `CALL \`CreateCustomer\`(${data.ssn}, '${data.name}', '${data.address}', '${data.birthday}', '${data.email}', '${data.tel}', '${data.job}', 0x${password(data.password)}, 0)`;
    connection.query(query)
      .then(result => res.json(result))
      .catch(err => next(err))
  })
}

export default CustomerRouter