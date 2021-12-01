import { Router } from "express"
import { Connection } from "typeorm"
import { Account } from "../model/entity/account"
import { Transaction } from "../model/entity/transaction"
import { auth } from "./authentication"

function TransactionRouter(router: Router, connection: Connection) {

  const accountRepository = connection.getRepository(Account)
  const transactionRepository = connection.getRepository(Transaction)

  router.get('/transaction/:id',
    auth.isLoggedIn,
    async (req, res, next) => {
      const account = await accountRepository.findOne({ where: { account_id: req.params.id } });
      if (!account)
        return res.status(404).send({
          message: "계좌를 찾을 수 없습니다."
        })

      const transactions = await transactionRepository.find({
        where: {
          account_id: account.account_id
        },
        order: {
          transaction_date: 'DESC'
        }
      })

      res.status(200).send({
        account: account,
        transactions: transactions
      })
    })
}

export default TransactionRouter