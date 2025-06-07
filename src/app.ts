import {
  createBot,
  createProvider,
  createFlow,
  addKeyword
} from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const testHelloFlow = addKeyword<Provider, Database>([
  'informacion sellos',
  'información sellos',
  'informacion sellitos',
  'información sellitos'
])
  .addAnswer('https://lasermorelos.mx/assets/pdfs/cat2025v1.pdf')
  .addAnswer(
    '¡Hola! Gracias por escribirnos. Con gusto te mandamos el catálogo de los sellitos autoentintables que tenemos 😃 Contamos con envíos al interior de la república Mexicana en $160 ya sea de uno o de varios.'
  )
  .addAnswer('Proceso de compra:')
  .addAnswer(
    'Para registrar tu pedido es con el comprobante de pago, durante el proceso se te envía el diseño y cómo quedó antes de enviarlo.'
  )
  .addAnswer('Te estaría llegando tu pedido en 1 semana aproximadamente. ✨')

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
