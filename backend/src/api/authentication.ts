import crypto from 'crypto'
import dotenv from 'dotenv'
import { Application, NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Connection } from 'typeorm'
import { Customer } from '../model/entity/customer'
import { password } from '../utils'

dotenv.config()

declare global {
  namespace Express {
    interface User {
      ssn: number;
      name: string;
      address: string;
      birthday?: Date;
      email: string;
      tel?: string;
      job?: string;
      disabled_at?: Date;
      customer_type: number;
      password: string;
      accessToken: string;
    }
  }
}


const jwtSecret = process.env.JWT_SECRET as string
const sessionExpiresIn = eval(process.env.SESSION_EXPIRY as string)


interface SignInInfo {
  email: string
  password: string
}

export const auth = {
  isLoggedIn: (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers['x-access-token'] as string
    if (!token)
      return res.status(403).send({
        message: "로그아웃상태입니다."
      })

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err)
        return res.status(401).send({
          message: '로그아웃 상태입니다.'
        });
      (req.app.get('db') as Connection)
        .getRepository(Customer)
        .findOne({
          where: {
            ssn: decoded!.id
          }
        }).then(user => {
          if (user) {
            req.user = {
              ...user,
              accessToken: token
            }
            next()
          }
          else
            res.status(404).send({
              message: '사용자를 찾을 수 없습니다.'
            })
        }).catch(err => res.status(500).send({
          message: err
        }))
    })
  },
  isAdmin: (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.customer_type === 1) {
      next()
    } else {
      res.status(403).send({
        message: '관리자가 아닙니다.'
      })
    }
  }
}


export function authentication(connection: Connection, app: Application) {
  const repository = connection.getRepository(Customer)

  app.post('/api/signin', (req, res, next) => {
    const info = req.body as SignInInfo
    if (info.email && info.password) {
      const sha256 = crypto.createHash('sha256')
      repository.findOne({
        where: {
          email: info.email,
          password: sha256.update(info.password).digest()
        }
      }).then(user => {
        if (user) {
          const token = jwt.sign({ id: user.ssn }, jwtSecret, {
            expiresIn: sessionExpiresIn
          })
          res.status(200).json({
            ...user,
            password: undefined,
            accessToken: token
          })
        }
        else res.status(401).json({ message: '사용자가 없거나 비밀번호가 틀립니다.' })
      })
    }
    else
      res.status(403).json({ message: '이메일과 비밀번호를 입력해주세요.' })
  })

  app.post('/api/signup', (req, res, next) => {
    const data = req.body as Customer
    let query = `CALL \`CreateCustomer\`(${data.ssn}, '${data.name}', '${data.address}', '${data.birthday}', '${data.email}', '${data.tel}', '${data.job}', 0x${password(data.password)}, 0)`;
    connection.query(query)
      .then(result => {
        const data = result[0][0]
        if (data.ssn) {
          const user = result[0][0] as Customer
          const token = jwt.sign({ id: user.ssn }, jwtSecret, {
            expiresIn: sessionExpiresIn
          })
          res.status(200).json({
            ...user,
            password: undefined,
            accessToken: token
          })
        } else {
          let msg: string | undefined
          for (let key in data) {
            msg = key
          }
          return res.status(403).json({ message: msg })
        }
      })
      .catch(err => res.status(400).json({
        message: err
      }))
  })
}


