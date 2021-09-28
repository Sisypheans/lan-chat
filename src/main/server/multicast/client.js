import config from '@config'

const dgram = require('dgram');
var client = dgram.createSocket('udp4');


client.on('close', ()=>{
    console.log('client closed');
});

client.on('error', (err) =>{
    console.log('client error' + err);
});

client.on('listening', ()=>{
    console.log('client listening...');
    client.setBroadcast(true);
    client.setMulticastTTL(128);
    client.addMembership(config.multicastIp);
});

client.on('message', (msg, rinfo) => {
    console.log(`receive server message from ${rinfo.address}: ${rinfo.port}: ${msg}`);
});
client.bind(config.multicastPort);  // 监听组播数据的端口