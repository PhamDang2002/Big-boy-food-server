// Import the framework and instantiate it
import envConfig, { API_URL } from '@/config'
import { errorHandlerPlugin } from '@/plugins/errorHandler.plugins'
import validatorCompilerPlugin from '@/plugins/validatorCompiler.plugins'
import accountRoutes from '@/routes/account.route'
import authRoutes from '@/routes/auth.route'
import fastifyAuth from '@fastify/auth'
import fastifyCookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'
import fastifySocketIO from 'fastify-socket.io'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import path from 'path'
import { createFolder } from '@/utils/helpers'
import mediaRoutes from '@/routes/media.route'
import staticRoutes from '@/routes/static.route'
import dishRoutes from '@/routes/dish.route'
import testRoutes from '@/routes/test.route'
import { initOwnerAccount } from '@/controllers/account.controller'
import tablesRoutes from '@/routes/table.route'
import guestRoutes from '@/routes/guest.route'
import orderRoutes from '@/routes/order.route'
import { socketPlugin } from '@/plugins/socket.plugins'

const fastify = Fastify({
  logger: false
})

// Run the server!
const start = async () => {
  try {
    createFolder(path.resolve(envConfig.UPLOAD_FOLDER))
    const whitelist = ['*']
    fastify.register(cors, {
      origin: ['https://big-boy-food.vercel.app'],
      credentials: true // Cho phép trình duyệt gửi cookie đến server
    })

    fastify.register(fastifyAuth, {
      defaultRelation: 'and'
    })
    fastify.register(fastifyHelmet, {
      crossOriginResourcePolicy: {
        policy: 'cross-origin'
      }
    })
    fastify.register(fastifyCookie)
    fastify.register(validatorCompilerPlugin)
    fastify.register(errorHandlerPlugin)
    fastify.register(fastifySocketIO, {
      cors: {
        origin: ['https://big-boy-food.vercel.app'],
        methods: ['GET', 'POST'],
        credentials: true
      }
    })
    fastify.register(socketPlugin)
    fastify.register(authRoutes, {
      prefix: '/auth'
    })
    fastify.register(accountRoutes, {
      prefix: '/accounts'
    })
    fastify.register(mediaRoutes, {
      prefix: '/media'
    })
    fastify.register(staticRoutes, {
      prefix: '/static'
    })
    fastify.register(dishRoutes, {
      prefix: '/dishes'
    })
    fastify.register(tablesRoutes, {
      prefix: '/tables'
    })
    fastify.register(orderRoutes, {
      prefix: '/orders'
    })
    fastify.register(testRoutes, {
      prefix: '/test'
    })
    fastify.register(guestRoutes, {
      prefix: '/guest'
    })
    await initOwnerAccount()
    await fastify.listen({
      port: process.env.PORT ? Number(process.env.PORT) : envConfig.PORT,
      host: '0.0.0.0'
    })
    console.log(`Server đang chạy: ${API_URL}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
