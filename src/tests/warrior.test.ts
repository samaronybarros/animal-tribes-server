import * as chai from 'chai'
import * as request from 'supertest'
import * as jsonwebtoken from 'jsonwebtoken'

import app from '../index'
import config from '@local/config'

import { clearDB, createWarrior } from './helpers'
import { IWarrior } from '@local/models/warrior-model'
import { Tribe } from '@local/models/tribe-model'

const expect = chai.expect

const queryGetWarrior = `
  { 
    warrior { 
      id 
      name 
      warriorname 
      tribe 
    } 
  }
`

const queryGetAllWarriors = `
  { 
    warriors { 
      id 
      name 
      warriorname 
      tribe 
    } 
  }
`

const mutationSignup = (
  name: string,
  warriorname: string,
  password: string
) => `
  mutation {
    signup(
      name: "${name}",
      warriorname: "${warriorname}", 
      password: "${password}") 
    {
      warriorname
      name
    }
  }
`

const mutationLogin = (warriorname: string, password: string) => `
  mutation {
    login (warriorname: "${warriorname}", password: "${password}") 
    {
      token
      warrior {
        warriorname
        tribe
      }
    }
  }
`

const mutationUpdateTribe = (tribe: Tribe) => `
  mutation {
    updateTribe (tribe: "${tribe}") 
    {
      warriorname
      tribe
    }
  }
`

describe('Warrior', () => {
  beforeEach(clearDB)

  describe('QUERY Warrior', () => {
    let warrior: IWarrior
    let server: request.SuperTest<request.Test>
    let token: string
    beforeEach(async () => {
      server = request(app)
      warrior = await createWarrior()
      await createWarrior({ name: 'another name' })
      token = jsonwebtoken.sign({ id: warrior?.id }, config.jwtSecret!, {
        expiresIn: '1d',
      })
    })

    it('should get warrior', (done) => {
      server
        .post('/graphql')
        .set('Authorization', token)
        .send({ query: queryGetWarrior })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body).to.be.an('object')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.warrior)
            .to.haveOwnProperty('id')
            .equal(warrior?.id)
          expect(res.body.data.warrior)
            .to.haveOwnProperty('name')
            .equal(warrior?.name)
          expect(res.body.data.warrior)
            .to.haveOwnProperty('warriorname')
            .equal(warrior?.warriorname)
          expect(res.body.data.warrior)
            .to.haveOwnProperty('tribe')
            .equals(Tribe.LION)

          done()
        })
    })

    it('should not get warrior with an invalid token', (done) => {
      server
        .post('/graphql')
        .set('Authorization', 'wrong')
        .send({ query: queryGetWarrior })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body.errors).to.be.an('array')
          expect(res.body.errors[0]).to.be.an('object')
          expect(res.body.errors[0].message).equal('jwt malformed')
          expect(res.body.data.warrior).to.be.null

          done()
        })
    })

    it('should get all warriors', (done) => {
      server
        .post('/graphql')
        .set('Authorization', token)
        .send({ query: queryGetAllWarriors })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          const randomWarrior = Math.floor(
            Math.random() * res.body.data.warriors.length
          )

          expect(res.body).to.be.an('object')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.warriors)
            .to.be.an('array')
            .to.have.length(2)
          expect(res.body.data.warriors[randomWarrior]).to.haveOwnProperty('id')
          expect(res.body.data.warriors[randomWarrior]).to.haveOwnProperty(
            'name'
          )
          expect(res.body.data.warriors[randomWarrior]).to.haveOwnProperty(
            'warriorname'
          )
          expect(res.body.data.warriors[randomWarrior]).to.haveOwnProperty(
            'tribe'
          )

          done()
        })
    })

    it('should not get all warriors with an invalid token', (done) => {
      server
        .post('/graphql')
        .set('Authorization', 'wrong')
        .send({ query: queryGetAllWarriors })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body.errors).to.be.an('array')
          expect(res.body.errors[0]).to.be.an('object')
          expect(res.body.errors[0].message).equal('jwt malformed')
          expect(res.body.data.warriors).to.be.null

          done()
        })
    })
  })

  describe('MUTATION Warrior', () => {
    let server: request.SuperTest<request.Test>
    let warrior: IWarrior
    let token: string
    beforeEach(async () => {
      server = request(app)
      warrior = await createWarrior()
      token = jsonwebtoken.sign({ id: warrior?.id }, config.jwtSecret!, {
        expiresIn: '1d',
      })
      await createWarrior()
    })

    it('should signup a warrior', (done) => {
      server
        .post('/graphql')
        .send({
          query: mutationSignup('name', 'warriorname', 'password'),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body).to.be.an('object')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.signup).to.be.an('object')
          expect(res.body.data.signup)
            .to.haveOwnProperty('warriorname')
            .equals('warriorname')

          done()
        })
    })

    it('should not signup a warrior without warriorname', (done) => {
      server
        .post('/graphql')
        .send({
          query: mutationSignup('name', '', 'password'),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body.errors).to.be.an('array')
          expect(res.body.errors[0]).to.be.an('object')
          expect(res.body.errors[0].message.name).equal('ValidationError')
          expect(res.body.errors[0].message.message).equal(
            'warriorname is a required field'
          )
          expect(res.body.data.signup).to.be.null

          done()
        })
    })

    it('should not signup a warrior without name', (done) => {
      server
        .post('/graphql')
        .send({
          query: mutationSignup('', 'warriorname', 'password'),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body.errors).to.be.an('array')
          expect(res.body.errors[0]).to.be.an('object')
          expect(res.body.errors[0].message.name).equal('ValidationError')
          expect(res.body.errors[0].message.message).equal(
            'name is a required field'
          )
          expect(res.body.data.signup).to.be.null

          done()
        })
    })

    it('should not signup a warrior without password', (done) => {
      server
        .post('/graphql')
        .send({
          query: mutationSignup('name', 'warriorname', ''),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body.errors).to.be.an('array')
          expect(res.body.errors[0]).to.be.an('object')
          expect(res.body.errors[0].message.name).equal('ValidationError')
          expect(res.body.errors[0].message.message).equal(
            'password is a required field'
          )
          expect(res.body.data.signup).to.be.null

          done()
        })
    })

    it('should login a warrior', (done) => {
      server
        .post('/graphql')
        .send({
          query: mutationLogin('testname', 'testpass'),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body).to.be.an('object')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.login).to.be.an('object')
          expect(res.body.data.login).to.haveOwnProperty('token')
          expect(res.body.data.login).to.haveOwnProperty('warrior')
          expect(res.body.data.login.warrior)
            .to.haveOwnProperty('warriorname')
            .equals('testname')
          expect(res.body.data.login.warrior)
            .to.haveOwnProperty('tribe')
            .equals(Tribe.LION)

          done()
        })
    })

    it('should not login a warrior with wrong credentials', (done) => {
      server
        .post('/graphql')
        .send({
          query: mutationLogin('wrong', 'wrong'),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body).to.be.an('object')
          expect(res.body.data.login).to.be.null

          done()
        })
    })

    it('should update tribe to a warrior', (done) => {
      server
        .post('/graphql')
        .set('Authorization', token)
        .send({
          query: mutationUpdateTribe(Tribe.LION),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body).to.be.an('object')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.updateTribe).to.be.an('object')
          expect(res.body.data.updateTribe)
            .to.haveOwnProperty('warriorname')
            .equals(warrior.warriorname)
          expect(res.body.data.updateTribe)
            .to.haveOwnProperty('tribe')
            .equals(Tribe.LION)

          done()
        })
    })

    it('should not update tribe to a warrior without token', (done) => {
      server
        .post('/graphql')
        .set('Authorization', 'wrong')
        .send({
          query: mutationUpdateTribe(Tribe.LION),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body.errors).to.be.an('array')
          expect(res.body.errors[0]).to.be.an('object')
          expect(res.body.errors[0].message.message).equal('jwt malformed')
          expect(res.body.data.updateTribe).to.be.null

          done()
        })
    })
    after(clearDB)
  })
})
