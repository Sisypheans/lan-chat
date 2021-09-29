import express from 'express'
const app = express()
var NeDB = require('nedb')

var db = new NeDB({
  filename: './data.db',
  autoload: true,
})

app.get('/data', (req, res) => {
  
  db.find({}).sort({ctime: -1, _id: 1}).exec(function (err, docs) {
    res.send(docs)
  });
  console.log("find success")
})


app.post('/data', (req, res) => {
  var d = {
    "ip":"192.168.3.3",
    "mac":"aa-bb-cc-dd-ee",
    "msg":"sssss",
  }
  insert(d)
  res.send(JSON.stringify("success"))
})


function insert(d) {
  var time = (new Date()).getTime();
  db.insert({
    "preId":d.preId,
    "ip":d.ip,
    "mac":d.mac,
    "msg":d.msg,
    "type":"0",
    "ctime":time
  }, function(err, doc) {
      console.log('insert:', doc)
  })
}

export default app
