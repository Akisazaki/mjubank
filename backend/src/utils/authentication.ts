import passport from 'passport'
import { Strategy } from 'passport-local'
import { Connection } from 'typeorm'
import { Customer } from '../model/entity/customer'


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
    }
  }
}

function usePassport(connection: Connection) {
  const repository = connection.getRepository(Customer)
  passport.use(new Strategy(async (email, password, done) => {
    if (email && password) {
      const user = await repository.findOne({
        where: {
          email: email,
          password: password
        }
      })
      if (user)
        return done(null, user)
      else
        return done(404)
    }
    else
      return done(400)
  }))
}

export default usePassport