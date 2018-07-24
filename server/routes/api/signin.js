const User = require('../../models/User')

const UserSession = require('../../models/UserSession')

module.exports = (app) => {
  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req
    const {
      firstName,
      lastName,
      password
    } = body

    let { email } = body

    if (!firstName) {
      res.end({
        success: false,
        message: 'Error: FirstName can not be blank'
      })
    }

    if (!lastName) {
      res.end({
        success: false,
        message: 'Error: LastName can not be blank'
      })
    }

    if (!email) {
      res.end({
        success: false,
        message: 'Error: Email can not be blank'
      })
    }

    if (!password) {
      res.end({
        success: false,
        message: 'Error: Password can not be blank'
      })
    }
    email = email.toLowerCase()

    User.find({email: email}, (err, previousUser) => {
      if (err) {
        res.send('Error: Server error')
      } else if (previousUser.length > 0) {
        res.end('Error: Account already existed')
      }
      const newUser = new User()
      newUser.firstName = firstName
      newUser.lastName = lastName
      newUser.email = email
      newUser.password = newUser.generateHash(password)

      newUser.save((err, user) => {
        if (err) {
          res.send('Error: Server error')
        }
        res.end({
          success: true,
          message: 'Signed up'
        })
      })
    })
  })

  app.post('/api/account/signin', (req, res, next) => {
    const { body } = req
    const { password } = body
    let { email } = body

    if (!email) {
      res.end({
        success: false,
        message: 'Error: Email can not be blank'
      })
    }

    if (!password) {
      res.end({
        success: false,
        message: 'Error: Password can not be blank'
      })
    }
    email = email.toLowerCase()
    User.find({email: email}, (err, user) => {
      if (err) {
        res.end({
          success: false,
          message: 'Error Server error'})
      } else if (!user) {
        res.end({
          success: false,
          message: 'Error Account doent exist'})
      } else {
        if (!user[0].validatePassword(password)) {
          res.end({
            success: false,
            message: 'Error Passsword is incorrect'
          })
        } else {
          const userSession = new UserSession()
          userSession.userId = user._id
          userSession.save((err, doc) => {
            if (err) {
              return res.end({
                success: false,
                message: 'Error Save session'
              })
            }
            return res.end({
              success: true,
              message: 'Logined',
              token: doc._id
            })
          })
        }
      }
    })
  })

  app.get('/api/account/verify', (req, res, next) => {
    const { query } = req
    const { token } = query

    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        return res.end({
          success: false,
          message: 'Error Save session'
        })
      } else if (sessions.length !== 1) {
        return res.end({
          success: false,
          message: 'Error Invalid'
        })
      } else {
        return res.end({
          success: true,
          message: 'Good!'
        })
      }
    })
  })

  app.get('/api/account/logout', (req, res, next) => {
    const { query } = req
    const { token } = query

    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, { $set: {
      isDeleted: true
    } }, null,
    (err, sessions) => {
      if (err) {
        return res.end({
          success: false,
          message: 'Error Save session'
        })
      } else if (sessions.length !== 1) {
        return res.end({
          success: false,
          message: 'Error Invalid'
        })
      } else {
        return res.end({
          success: true,
          message: 'Good!'
        })
      }
    })
  })
}
