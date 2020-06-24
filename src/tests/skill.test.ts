import * as chai from 'chai'
import * as request from 'supertest'
import * as jsonwebtoken from 'jsonwebtoken'

import app from '../index'
import config from '@local/config'

import { clearDB, createSkill } from './helpers'
import { ISkill } from '@local/models/skill-model'

const expect = chai.expect

const getSkillQuery = (id: string | undefined) => `
{ 
  skill (warriorId: "${id}") { 
    id 
    strength
    dexterity
    warrior {
      id 
      name 
      warriorname 
    }
  } 
}
`

const getAllSkillsQuery = `
{ 
  skills { 
    warrior {
      id 
      name 
      warriorname 
    }
    strength
    dexterity
  } 
}
`

describe('Skill', () => {
  beforeEach(clearDB)

  describe('QUERY Skill', () => {
    let skill: ISkill | undefined
    let server: request.SuperTest<request.Test>
    let token: string
    beforeEach(async () => {
      server = request(app)
      skill = await createSkill()
      token = jsonwebtoken.sign({ id: skill?.warriorId }, config.jwtSecret!, {
        expiresIn: '1d',
      })
    })

    it('should get skill from a warrior', (done) => {
      server
        .post('/graphql')
        .set('Authorization', token)
        .send({ query: getSkillQuery(skill?.warriorId) })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body).to.be.an('object')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.skill)
            .to.haveOwnProperty('id')
            .equal(skill?.id)
          expect(res.body.data.skill)
            .to.haveOwnProperty('strength')
            .equal(skill?.strength)
          expect(res.body.data.skill)
            .to.haveOwnProperty('dexterity')
            .equal(skill?.dexterity)
          expect(res.body.data.skill.warrior).to.haveOwnProperty('id')
          expect(res.body.data.skill.warrior).to.haveOwnProperty('name')
          expect(res.body.data.skill.warrior).to.haveOwnProperty('warriorname')

          done()
        })
    })

    it('should get skills of all warriors', (done) => {
      server
        .post('/graphql')
        .set('Authorization', token)
        .send({ query: getAllSkillsQuery })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body).to.be.an('object')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.skills)
            .to.be.an('array')
            .to.have.length(1)
          expect(res.body.data.skills[0])
            .to.haveOwnProperty('strength')
            .equal(skill?.strength)
          expect(res.body.data.skills[0])
            .to.haveOwnProperty('dexterity')
            .equal(skill?.dexterity)
          expect(res.body.data.skills[0].warrior).to.haveOwnProperty('id')
          expect(res.body.data.skills[0].warrior).to.haveOwnProperty('name')
          expect(res.body.data.skills[0].warrior).to.haveOwnProperty(
            'warriorname'
          )

          done()
        })
    })

    after(clearDB)
  })
})
