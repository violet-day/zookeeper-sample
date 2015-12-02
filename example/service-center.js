/**
 * Created by Nemo on 15/12/1.
 */

var Promise = require("bluebird");
var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('localhost:2181');
Promise.promisifyAll(client);

var serviceRootPath = '/services';

client.once('connected', function () {
  console.log('Connected to the server.');
  Promise.coroutine(function *() {
    var stat = yield client.existsAsync(serviceRootPath);
    if (!stat) {
      yield client.createAsync(serviceRootPath);
    }
    listChildren(client, serviceRootPath);
  })()
    .catch(function (err) {
      console.log(err);
    });
});

function listChildren(client, path) {
  client.getChildren(
    path,
    function (event) {
      console.log('Got watcher event: %s', event);
      listChildren(client, path);
    },
    function (error, children, stat) {
      if (error) {
        console.log(
          'Failed to list children of node: %s due to: %s.',
          path,
          error
        );
        return;
      }
      console.log('Children of node: %s are: %j.', path, children);
    }
  );
}

client.connect();


var fork = require('child_process').fork;
var cpus = require('os').cpus();

for(var i = 0; i < cpus.length; i++) {
  fork('./example/service-register');
}