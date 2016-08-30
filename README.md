# 自定义事件库 EventFire


### usage

```js
var EventFire = require('./index')

var e = new EventFire()


var fn = function(ev) {
    console.log(1111); 
}
var fn2 = function(ev) {
    console.log(2222); 
}
e.on('event1', fn);
e.on('event2', fn2);


e.off('event1')
e.fire('event2')
```

### version
0.0.1