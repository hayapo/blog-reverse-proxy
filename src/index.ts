import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key]
}

const blogHost = "blog-hayapo-dev.pages.dev"

const app = new Hono<{ Bindings: Bindings }>()

app.use(trimTrailingSlash())

app.get('/blog', (c) => {
  return fetch(`https://${blogHost}/blog`)
})

app.get('/blog/:entry', (c) => {
  const { entry } = c.req.param()
  return fetch(`https://${blogHost}/blog/${entry}`)
})

app.get('/site.webmanifest', (c) => {
  return fetch(`https://${blogHost}/site.webmanifest`)
})

app.get("/:type{(?:public|_astro|favicon)}/:filename", async (c) => {
  const { type, filename } = c.req.param()
  return fetch(`https://${blogHost}/${type}/${filename}`)
})

export default app