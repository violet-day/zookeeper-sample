/**
 * Created by Nemo on 15/12/2.
 */

var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('localhost:2181');
var syncRootPath = '/synchronizing';

client.once('connected', function () {

  client.remove(syncRootPath, function () {
    console.log('remove root path');
    client.create(syncRootPath, function () {
      console.log('create root path');
      client.exists(syncRootPath + '/start', function (event) {
        console.log(event);
        if (event.getName() === 'NODE_CREATED') {
          console.log('start consumer');
          client.getChildren(syncRootPath, function (err, children) {
            //依次消费child
            children.filter(function (path) {
              return path != 'start';
            }).sort().reduce(function (memo, child) {
              return memo.then(function () {
                return new Promise(function (resolve, reject) {
                  setTimeout(function () {
                    console.log('consume:%s', child);
                    client.remove(syncRootPath + '/' + child, function (err) {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(child);
                      }
                    })
                  }, 5000);
                });
              })
            }, Promise.resolve(null))
              .then(function () {
                client.remove(syncRootPath + '/start', function (err) {
                  if (!err) {
                    console.log('clean start node');
                  }
                })
              })

          });

        }
      }, function (err, stat) {

      })
    })
  })
});


var fork = require('child_process').fork;


for (var i = 0; i < 4; i++) {
  fork('./example/producer');
}

client.connect();