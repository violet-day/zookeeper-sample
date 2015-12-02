/**
 * Created by Nemo on 15/12/2.
 */

var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('localhost:2181');
var syncRootPath = '/synchronizing';

client.once('connected', function () {
  client.create(syncRootPath + '/member_', new Buffer(process.pid), zookeeper.ACL.OPEN_ACL_UNSAFE, zookeeper.CreateMode.PERSISTENT_SEQUENTIAL, function () {
    client.getChildren(syncRootPath, function (err, children) {
      if (children.length > 3) {
        client.create(syncRootPath + '/start', zookeeper.ACL.OPEN_ACL_UNSAFE, zookeeper.CreateMode.PERSISTENT, function () {

        });
      }
    });
  });
});


client.connect();