/* eslint-disable prefer-promise-reject-errors */
import app from './server'
import http from 'http'
import config from '@config'


export default {
  StatrServer () {
    return new Promise((resolve, reject) => {
      app.set('port', config.BuiltInServerPort)
      var server = http.createServer(app)
      server.listen(config.BuiltInServerPort)
      server.on('error', (error) => {
        switch (error.code) {
          case 'EACCES':
            reject('权限不足内置服务器启动失败，请使用管理员权限运行。')
            break
          case 'EADDRINUSE':
            reject('内置服务器端口已被占用，请检查。')
            break
          default:
            reject(error)
        }
      })
      server.on('listening', () => {
        resolve('服务端运行中')
      })
    })
  }
}
