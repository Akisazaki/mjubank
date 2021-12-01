import { Router } from "express"
import { Connection } from "typeorm"
import UUID from 'uuid-int'
import { Account } from "../model/entity/account"
import { Card } from "../model/entity/card"
import { Customer } from "../model/entity/customer"
import { auth } from "./authentication"

const idGen = UUID(42).uuid


function CardRouter(router: Router, connection: Connection) {

  const accountRepository = connection.getRepository(Account)
  const customerRepository = connection.getRepository(Customer)
  const cardRepository = connection.getRepository(Card)

  const getAllCard = async (owner: Customer) => {
    const query = `SELECT card.* FROM card INNER JOIN account ON account.account_id=card.account_id WHERE account.ssn=${owner.ssn}`
    const cards = await cardRepository.query(query)
    return cards;
  }

  router.get('/cards',
    auth.isLoggedIn,
    async (req, res, next) => {
      const cards = await getAllCard(req.user!)
      res.send(cards)
    })

  router.post('/cards',
    auth.isLoggedIn,
    async (req, res, next) => {
      let id: string = ''
      do {
        id = idGen().toString()
        if (id.length >= 16) {
          id = id.substr(0, 16)
          if (await cardRepository.findOne({ where: { card_id: id } }))
            continue
          else
            break
        }
      } while (true)

      let query = `CALL \`ApplicateCard\`(${id}, ${req.body.account_id}, 100000, ${req.body.type})`
      await connection.query(query)
      const card = await cardRepository.findOne({ where: { card_id: id } })
      if (card) {
        const cards = await getAllCard(req.user!)
        res.send(cards)
      }
      else res.status(500).send({ message: "카드를 생성하지 못 함" })
    })
  router.put('/cards/:id',
    auth.isLoggedIn,
    async (req, res, next) => {
      let card = await cardRepository.findOne({
        where: { card_id: parseInt(req.params.id) }
      })
      console.log('find card')
      if (!card)
        return res.status(404).send({
          message: "카드를 찾을 수 없습니다."
        })
      const result = await cardRepository.query(`UPDATE card SET card.limit=${req.body.limit || 100000} WHERE card.card_id=${card.card_id}`)
      const cards = await getAllCard(req.user!)
      res.status(200).send(cards)
    })

  router.put('/cards/:id/:method',
    auth.isLoggedIn,
    async (req, res, next) => {
      await cardRepository.query(`CALL \`${req.params.method === 'pause' ? 'Pause' : 'Resume'}Card\`(${req.params.id})`)
      const cards = await getAllCard(req.user!)
      res.status(200).send(cards)
    })
}

export default CardRouter

