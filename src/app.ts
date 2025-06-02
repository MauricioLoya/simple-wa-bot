import {
  createBot,
  createProvider,
  createFlow,
  addKeyword
} from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const testHelloFlow = addKeyword<Provider, Database>(['testhello']).addAnswer(
  'Hola sellos'
)

const main = async () => {
  const adapterFlow = createFlow([testHelloFlow])
  const adapterProvider = createProvider(Provider)
  const adapterDB = new Database()

  const { httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB
  })

  httpServer(process.env.PORT ? +process.env.PORT : 3008)
}

main()
