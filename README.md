# 自定义事件库 EventFire

# alpha 版

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

var fn3 = function(ev) {
    console.log(3333); 
}
e.once('event1', fn);
e.on('event2', fn2);

e.once(/^eventreg/, function(){
    console.log('this is a regexp fn')
});

console.log(e.listeners('event1'))
console.log(e.listeners('event2'))

e.fire('event1')
e.fire('event1')

e.fire('event2')

e.fire('eventregabc')
e.fire('eventreg123')


e.offAll()

e.fire('event1')
e.fire('event1')

e.fire('event2')
```

### version
0.0.1