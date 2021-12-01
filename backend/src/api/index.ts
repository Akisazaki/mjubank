import { Router } from 'express'
import { Connection } from 'typeorm'
import AccountRouter from './account'
import CardRouter from './card'
import CustomerRouter from './customer'
import TransactionRouter from './transaction'


function APIRouter(connection: Connection) {
  const router = Router()

  CustomerRouter(router, connection)
  AccountRouter(router, connection)
  TransactionRouter(router, connection)
  CardRouter(router, connection)
  return router
}

export default APIRouter
