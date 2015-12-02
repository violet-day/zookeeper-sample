/**
 * Created by Nemo on 15/12/1.
 */

var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('localhost:2181');
var electionRootPath = '/election';
var memberName = process.argv[2];

client.once('connected', function () {
  console.log('Connected to the server.');
  client.create(electionRootPath + '/member', new Buffer(memberName), zookeeper.ACL.OPEN_ACL_UNSAFE, zookeeper.CreateMode.EPHEMERAL_SEQUENTIAL, function (error, path) {
    if (error) {
      console.error('Failed to create node: %s due to: %s.', data.path, error);
    } else {
      console.log('Node: %s:%s is successfully created.', path, memberName);
    }

    setTimeout(function () {
      console.log('memberName:%s closed', memberName);
      client.close();
    }, 1000 * 30);
  });
});


client.connect();