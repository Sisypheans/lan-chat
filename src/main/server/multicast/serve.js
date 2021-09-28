import config from '@config'

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

export default {
    statrMulticast() {
        return new Promise((resolve, reject) => {
            server.on('listening', () => {
                server.setBroadcast(true);
                server.setMulticastTTL(128);
                server.addMembership(multicast_ip);
                resolve('组播服务启动')
            });
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
            });
            server.on('message', (msg, rinfo) => {
                console.log(`receive client message from ${rinfo.address}: ${rinfo.port}: ${msg}`);
            });
            server.bind();
        })
    },
    sendMsg(message) {
        server.send(message, config.multicastPort, config.multicastIp);
    }
}