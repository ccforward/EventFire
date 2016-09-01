# 自定义事件库 EventFire

轻量级的事件库，支持 Node.js 和 Broswer

# alpha 版

### usage alpha版

```js
var EventFire = require('./index')
// 或者
// import EventFire from './index';

var e = new EventFire()


var fn = function(ev) {
    console.log(1111); 
}
var fn2 = function(ev) {
    console.log(2222); 
}

var fn3 = function(ev) {
    console.log(3333); 
}

// 添加监听
e.once('event1', fn);
e.on('event2', fn2);

// 匹配正则的监听
e.once(/^eventreg/, function(){
    console.log('this is a regexp fn')
});

console.log(e.listeners('event1'))
console.log(e.listeners('event2'))

// 触发事件
e.fire('event1')
e.fire('event1')

e.fire('event2')

// 触发正则匹配的事件
e.fire('eventregabc')
e.fire('eventreg123')

// 解绑所有事件
e.offAll()

e.fire('event1')
e.fire('event1')

e.fire('event2')
```

### version
0.0.1