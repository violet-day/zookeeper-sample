/**
 * Created by Nemo on 15/12/1.
 */

var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('localhost:2181');
var lockRootPath = '/locks';
var memberName = process.argv[2];

client.once('connected', function () {
  client.create(lockRootPath + '/lock', null, zookeeper.ACL.OPEN_ACL_UNSAFE, zookeeper.CreateMode.EPHEMERAL_SEQUENTIAL, function (error, path) {
    if (error) {
      console.error('Failed to create node: %s due to: %s.', path, error);
      return;
    }
    console.log('create path', path, memberName);
    client.getChildren(lockRootPath, function (err, children) {
      if (err) {
        return console.log(err);
      }
      //还没有锁,直接执行action
      if (!children.length) {
        doAction();
        return;
      }
      children.sort();
      var shortPath = path.replace(lockRootPath + '/', '');
      if (children[0] === shortPath) {
        //最小的和当前path相等,获得锁
        doAction();
      } else {
        var lower = children[children.indexOf(shortPath) - 1];
        client.exists(lockRootPath + '/' + lower, function (event) {
          console.log('Got watcher event: %s', event);
          if (event.getName() === 'NODE_DELETED') {
            doAction();
          }
        }, function (err, stat) {
          if (!stat) {
            doAction();
          }
        })
      }
    })
  });
});

var doAction = function () {
  setTimeout(function () {
    console.log('doAction by ' + memberName);
    client.close();
  }, Math.random(10) * 20 * 1000);
};
client.connect();