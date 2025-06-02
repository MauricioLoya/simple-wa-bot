import {
  createBot,
  createProvider,
  createFlow,
  addKeyword
} from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const testHelloFlow = addKeyword<Provider, Database>(['testhello'])
  .addAnswer('https://lasermorelos.mx/assets/pdfs/cat2025v1.pdf')
  .addAnswer(
    'Hola buenas tardes! Gracias por escribirnos! Los sellos tienen un costo desde $250, el área del grabado es de 3 cm x 1cm por lo cual recomendamos máximo 3 renglones, el costo del envío es de $160 ya sea de uno o de varios, para registrar tu pedido es con el comprobante de pago, durante el proceso se te envía el diseño y cómo quedó antes de enviarlo! Te adjuntamos los modelos disponibles, Están de 4 a 8 días hábiles'
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
