/**
 * Created by Nemo on 15/12/2.
 */

var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('localhost:2181');
var lockRootPath = '/locks';

var leader = null;

client.once('connected', function () {
  console.log('Connected to the server.');
  client.remove(lockRootPath, function () {
    console.log('remove root path');
    client.create(lockRootPath, function () {
      console.log('create root path');
      listChildren(client, lockRootPath);
    })
  })
});


function listChildren(client, path) {
  client.getChildren(
    path,
    function (event) {
      listChildren(client, path);
    },
    function (error, children, stat) {
      if (error) {
        console.log('Failed to list children of node: %s due to: %s.', path, error);
        return;
      }
    }
  );
}

client.connect();

var fork = require('child_process').fork;
var members = ['nemo', 'gc', 'zbq', 'xqh'];

members.forEach(function (memberName) {
  setTimeout(function () {
    fork('./example/lock-prepare', [memberName]);
  }, Math.random(10) * 20 * 1000);
});

