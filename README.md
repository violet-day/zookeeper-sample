# zookeeper学习的一些demo

## 服务注册
* `node example/service-center.js`,会创建services节点,并且创建多个children
* 同时,也可以通过`node example/service-register.js`创建节点
* 杀掉children节点之后,会触法got watcher event

## leader选举
* `node example/leader-election.js`,会创建/election节点,并且创建依次创建member节点
* member节点创建之后,会依次离开
* 有节点离开之后,重新选举


## Reference

* [分布式服务框架 Zookeeper -- 管理分布式环境中的数据](https://www.ibm.com/developerworks/cn/opensource/os-cn-zookeeper/)
* [node-zookeeper-client](https://github.com/alexguan/node-zookeeper-client)