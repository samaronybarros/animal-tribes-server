import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

export interface ISkill extends mongoose.Document {
  strength: Number
  dexterity: Number
  faith: Number
  wisdom: Number
  magic: Number
  agility: Number
  warriorId: string
}

const SkillSchema = new Schema({
  strength: { type: Number },
  dexterity: { type: Number },
  faith: { type: Number },
  wisdom: { type: Number },
  magic: { type: Number },
  agility: { type: Number },

  warriorId: { type: String, required: true },
})

export default mongoose.model<ISkill>('Skill', SkillSchema)
