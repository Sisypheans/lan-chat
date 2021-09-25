/* eslint-disable prefer-promise-reject-errors */
import app from './server'
import http from 'http'
import config from '@config'
const port = config.BuiltInServerPort
// var server = null
app.set('port', port)

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

// const local_ip = "192.168.0.xx";
const multicast_ip = "225.0.0.100";  // 这里必须是一个组播地址(D类IP地址)


export default {
  StatrServer () {
    return new Promise((resolve, reject) => {
      // server = http.createServer(app)
      // server.listen(port)
      // server.on('error', (error) => {
      //   switch (error.code) {
      //     case 'EACCES':
      //       reject('权限不足内置服务器启动失败，请使用管理员权限运行。')
      //       break
      //     case 'EADDRINUSE':
      //       reject('内置服务器端口已被占用，请检查。')
      //       break
      //     default:
      //       reject(error)
      //   }
      // })
      // server.on('listening', () => {
      //   resolve('服务端运行中')
      // })
      server.on('close', ()=>{
        console.log('close socket');
    });
    
    server.on('listening', ()=>{
        console.log('listening...');
        server.setBroadcast(true);
        server.setMulticastTTL(128);
        server.addMembership(multicast_ip);
    });
    
    server.on('message', (msg, rinfo)=>{
        console.log(`receive client message from ${rinfo.address}: ${rinfo.port}: ${msg}`);
    });
    
    server.bind();  // 随机绑定本机一个端口
    let interfaces = require('os').networkInterfaces();
      for (var devName in interfaces) {
          var iface = interfaces[devName];
          for (var i = 0; i < iface.length; i++) {
              let alias = iface[i];
              if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal && alias.address.startsWith('192')) {
                  // console.log(alias.address);
    
                  setInterval(()=>{
                    server.send('hi, im server ' + alias.address, '8062', multicast_ip);
                }, 5000);
              }
          }
      }
    
      resolve('服务端运行中')
    })
  },
  StopServer () {
    return new Promise((resolve, reject) => {
      console.log(server)
      if (server) {
        server.close()
        server.on('close', () => {
          server = null
          resolve(1)
        })
      } else {
        reject('服务端尚未开启')
      }
    })
  }
}
