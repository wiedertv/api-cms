import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { json, urlencoded } from 'body-parser'
import { spawn } from 'child_process'
import * as moment from 'moment-timezone'
import { AppModule } from './app.module'

async function bootstrap () {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))
  const config = app.get(ConfigService)
  const port: number = config.get('port')
  moment.tz.add('Europe/Madrid|WET WEST WEMT CET CEST|0 -10 -20 -10 -20|010101010101010101210343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343|-25Td0 19B0 1cL0 1dd0 b1z0 18p0 3HX0 17d0 1fz0 1a10 1io0 1a00 1in0 17d0 iIn0 Hd0 1cL0 bb0 1200 2s20 14n0 5aL0 Mp0 1vz0 17d0 1in0 17d0 1in0 17d0 1in0 17d0 6hX0 11B0 XHX0 1a10 1fz0 1a10 19X0 1cN0 1fz0 1a10 1fC0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|62e5')
  const options = new DocumentBuilder().setTitle('Malta API').setDescription('Mateo 7-12 "Así que, todas las cosas que queráis que los hombres hagan con vosotros, así también haced vosotros con ellos; porque esto es la ley y los profetas"').setVersion('1').addBearerAuth().build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('*explorer', app, document)
  await app.listen(port)
  if (process.env.NODE_ENV === 'test') {
    const cp = spawn('npm', ['run', 'test:e2e'])
    cp.stdout.on('data', (data) => {
      try {
        const parsed = JSON.parse(data.toString())
        if (parsed.testResults && parsed.testResults instanceof Array) {
          for (const res of parsed.testResults) {
            Logger.log(res.status)
            Logger.log(res.message)
          }
        } else {
          Logger.log(parsed)
        }
      } catch (err) {
        Logger.log(data.toString())
      }
    })
    cp.on('exit', (code) => {
      Logger.log(`test ended with code ${code}`)
      process.exit(code)
    })
  }
  Logger.log(`This application is in ${process.env.NODE_ENV} env`, 'Bootstrap')
  Logger.log(`The application is running on localhost:${port} and the URI is ${config.get<string>('uri')}`, 'Bootstrap')
}
bootstrap()
