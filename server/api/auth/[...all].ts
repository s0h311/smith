import { defineEventHandler } from 'h3'
import { auth } from '~~/server/libs/Auth/auth'

export default defineEventHandler((event) => {
  return auth.handler(event.req)
})
