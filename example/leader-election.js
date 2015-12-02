/**
 * Created by Nemo on 15/12/1.
 */

var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('localhost:2181');
var electionRootPath = '/election';

var leader = null;

client.once('connected', function () {
  console.log('Connected to the server.');
  client.remove(electionRootPath, function () {
    console.log('remove root path');
    client.create(electionRootPath, function () {
      console.log('create root path');
      listChildren(client, electionRootPath);
    })
  })
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
        console.log('Failed to list children of node: %s due to: %s.', path, error);
        return;
      }
      if (!children.length) {
        return console.warn('no members!');
      }
      var childrenMap = children.map(function (path) {
        return {
          path: path,
          index: Number.parseInt(path.replace('member', ''))
        }
      }).sort(function (a, b) {
        return a.index - b.index;
      });
      console.log('childrenMap:%j', childrenMap);

      leader = childrenMap[0];
      client.getData(electionRootPath + '/' + leader.path, function (err, data) {
        console.log('leader.path:%s,leader.name:%s', leader.path, data.toString());
      });
    }
  );
}

client.connect();

var fork = require('child_process').fork;
var members = ['nemo', 'gc', 'zbq', 'xqh'];

members.reduce(function (memo, memberName, index) {
  return memo.then(function () {
    return new Promise(function (resolve) {
      setTimeout(function () {
        fork('./example/leader-election-member', [memberName]);
        resolve(memberName);
      }, index * 1000 * 10);
    });
  });
}, Promise.resolve(null));