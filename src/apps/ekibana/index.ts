import { Hono } from 'hono'

export const ekibanaApp = new Hono()

ekibanaApp.get('/', (c) => {
  return c.text('ekibana!')
})

