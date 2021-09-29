import config from '@config'
import IP from 'ip'
import { ipcRenderer } from 'electron'

const dgram = require('dgram');
var client = dgram.createSocket('udp4');
var NeDB = require('nedb')
var db = new NeDB({
    filename: './data.db',
    autoload: true,
})


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

    console.log('msg:' + JSON.stringify(msg));
    console.log('rinfo:' + JSON.stringify(rinfo));

    if (rinfo.address == IP.address()) {
        console.log('its me')
        return
    }

    db.insert(JSON.parse(msg), function(err, doc) {
        console.log('insert:', doc)
    })
    
    ipcRenderer.send('asynchronous-message', msg)
    // db.find({}).sort({ctime: -1, _id: 1}).limit(1).exec(function (err, docs) {
    //     var preId = docs[0].preId;
    // });
    // if (preId != message.data.preId) {
    //     对比()
    // } else {
    //     db.insert(message.data, function(err, doc) {
    //         console.log('insert:', doc)
    //     })
    // }
})

client.bind(config.multicastPort);  // 监听组播数据的端口

export default {
    sendMsg (message) {
        console.log('message:'+message)
        var preId = null;
        db.find({}).sort({ctime: -1, _id: 1}).limit(1).exec(function (err, docs) {
            console.log('docs:' + JSON.stringify(docs));
            preId = docs[0]._id;

        })
        console.log('preId'+preId)
        // if (!preId) preId = null;
        var time = (new Date()).getTime()
        var data = {
            "preId":preId,
            "ip":IP.address(),
            "mac":"mac",
            "msg":message,
            "type":"0",
            "ctime":time
        }

        console.log('data:' + JSON.stringify(data));

        db.insert(data, function(err, doc) {
            console.log('insert:', doc)
        })

        client.send(JSON.stringify(data), config.multicastPort, config.multicastIp)
    }
  }
  