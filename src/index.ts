import { Hono } from 'hono'
import { ekibanaApp } from './apps/ekibana'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello hanage-bot-v2👃')
})

app.route('/ekibana', ekibanaApp)

export default app
