/**
 * Created by Nemo on 15/12/1.
 */

var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('localhost:2181');
var serviceRootPath = '/services';


var data = {pid: process.pid, message: 'hello,I\'m ' + process.pid, path: '/' + process.pid};


client.once('connected', function () {
  console.log('Connected to the server.');
  client.create(serviceRootPath + data.path, new Buffer(JSON.stringify(data)), zookeeper.ACL.OPEN_ACL_UNSAFE, zookeeper.CreateMode.EPHEMERAL, function (error) {
    if (error) {
      console.error('Failed to create node: %s due to: %s.', data.path, error);
    } else {
      console.log('Node: %s is successfully created.', data.path);
    }
  });
});


client.connect();