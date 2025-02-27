import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { baseHost, blogHost, pomodoroHost } from './hosts'

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key]
}

// const baseHost = "hayapo.dev"
// const blogHost = "blog-hayapo-dev.pages.dev"
// const pomodoroHost = "pomodoro-54z.pages.dev"
// const sampleHost = "subdirectory-hayapo-dev.pages.dev"

const app = new Hono<{ Bindings: Bindings }>()

app.use(trimTrailingSlash())

app.get('/', async (c) => {
  return fetch(`https://${baseHost}`)
})

app.get('/:type{(?:public|_astro|favicon)}/:filename', async (c) => {
  const { type, filename } = c.req.param()
  return fetch(`https://${baseHost}/${type}/${filename}`)
})

// Proxy: blog
app
  .get('/blog', async (c) => {
    return fetch(`https://${blogHost}/blog`)
  })
  .get('/blog/:entry', async (c) => {
    const { entry } = c.req.param()
    return fetch(`https://${blogHost}/blog/${entry}`)
  })
  .get('/blog/site.webmanifest', async  (c) => {
    return fetch(`https://${blogHost}/blog/site.webmanifest`)
  })
  .get('/blog/:type{(?:public|_astro|favicon)}/:filename', async (c) => {
    const { type, filename } = c.req.param()
    return fetch(`https://${blogHost}/blog/${type}/${filename}`)
  })

// Proxy: Pomodorotimer
// // TODO: pomodoroを、./pomodoro以下にデプロイしないとだめかも
app
  .get('/pomodoro', async (c) => {
    return fetch(`https://${pomodoroHost}`)
  })
  .get('/assets/:filename', async (c) => {
    const { filename } = c.req.param();
    return fetch(`https://${pomodoroHost}/assets/${filename}`)
  })
  .get('/favicon.ico', async (c) => {
    return fetch(`https://${pomodoroHost}/favicon.ico`)
  })
  .get('/:manifest{^__manifest.*}', async (c) => {
    const { manifest } = c.req.param();
    const { p, version } = c.req.query();
    const queries = new URLSearchParams();
    queries.set('p', p);
    queries.set('version', version);
    console.log(`https://${pomodoroHost}/${manifest}?${queries.toString()}`);
    return fetch(`https://${pomodoroHost}/${manifest}?${queries.toString()}`);
  })

export default app