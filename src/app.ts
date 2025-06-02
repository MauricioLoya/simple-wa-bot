import {
  createBot,
  createProvider,
  createFlow,
  addKeyword
} from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
// Si tienes error de tipos con 'qrcode', instala los tipos: npm install --save-dev @types/qrcode
// O usa: const QRCode = require('qrcode')
import express from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import QRCode from 'qrcode'

const WEB_PORT = 3000
const BOT_PORT = process.env.PORT ? +process.env.PORT : 3008

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server)

// Protección con autenticación básica HTTP
app.use((req, res, next) => {
  const auth = { login: 'admin', password: 'clave123' } // Cambia estos valores
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  if (login && password && login === auth.login && password === auth.password) {
    return next()
  }
  res.set('WWW-Authenticate', 'Basic realm="QR Protected"')
  res.status(401).send('Authentication required.')
})

app.use(express.static('public'))

server.listen(WEB_PORT, () => {
  console.log(`QR web server en http://localhost:${WEB_PORT}`)
})

function sendQr(qrBase64: string) {
  io.emit('qr', qrBase64)
}

const testHelloFlow = addKeyword<Provider, Database>(['testhello']).addAnswer(
  'Hola sellos'
)

const main = async () => {
  const adapterFlow = createFlow([testHelloFlow])
  const adapterProvider = createProvider(Provider)
  const adapterDB = new Database()

  // Listener para el QR
  if (adapterProvider.on) {
    console.log('require_action', adapterProvider.on)
    adapterProvider.on('require_action', async action => {
      if (action?.payload?.qr) {
        const qrBase64 = await QRCode.toDataURL(action.payload.qr)
        sendQr(qrBase64)
      }
    })
  }

  const { httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB
  })

  httpServer(BOT_PORT)
}

main()
// Bv0-khm4d+MuVppnFd7
