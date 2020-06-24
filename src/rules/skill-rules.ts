import * as yup from 'yup'

export const skillRules = yup.object().shape({
  warriorname: yup
    .string()
    .trim()
    .required(),
})
