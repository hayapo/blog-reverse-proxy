import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key]
}

const baseHost = "hayapo.dev"
const blogHost = "blog-hayapo-dev.pages.dev"
const sampleHost = "subdirectory-hayapo-dev.pages.dev"

const app = new Hono<{ Bindings: Bindings }>()

app.use(trimTrailingSlash())

app.get('/', async (c) => {
  return fetch(`https://${baseHost}`)
})

app.get('/:type{(?:public|_astro|favicon)}/:filename', async (c) => {
  const { type, filename } = c.req.param()
  return fetch(`https://${baseHost}/${type}/${filename}`)
})

app.get('/blog', async (c) => {
  return fetch(`https://${blogHost}/blog`)
})

app.get('/blog/:entry', async (c) => {
  const { entry } = c.req.param()
    return fetch(`https://${blogHost}/blog/${entry}`)
})

app.get('/blog/site.webmanifest', async  (c) => {
  return fetch(`https://${blogHost}/blog/site.webmanifest`)
})

app.get('/blog/:type{(?:public|_astro|favicon)}/:filename', async (c) => {
  const { type, filename } = c.req.param()
  return fetch(`https://${blogHost}/blog/${type}/${filename}`)
})

export default app