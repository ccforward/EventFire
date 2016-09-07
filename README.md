[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

# 自定义事件库 EventFire

轻量级的事件库，支持 Node.js 和 Broswer

# 1.0.0

* 添加 Symbol 绑定事件
* 添加 scope 参数
* bug fix

## npm

[https://www.npmjs.com/package/EventFire](https://www.npmjs.com/package/EventFire)

## Usage 

```js
node test.js
```

or

```js
var EventFire = require('./index')
// 或者
// import EventFire from './index';


var e = new EventFire();

var dataFn = function(ev) {
    console.log(ev.data)
    console.log('event test of data parameter'); 
}
var offFn = function(ev) {
    console.log('event test of off() function'); 
}

var objFn = function(ev) {
    console.log('event test of ObjectBinding function'); 
}

e.once('event1', dataFn);
e.on('event2', offFn);

// ========== listeners Test ==========
console.log(e.listeners('event1'))
console.log(e.listeners('event2'))
// ========== listeners Test ==========


// ========== data Test ==========
e.fire('event1', {a: 111})
e.fire('event1')
// ========== data Test ==========


// ========== off Test ==========
e.fire('event2')
e.off('event2', offFn)
e.fire('event2')
// ========== off Test ==========



// ========== object Test ==========
e.on({eventObj: objFn})
e.fire('eventObj')
// ========== object Test ==========


// ========== regexp Test ========== 
e.on(/^eventreg/, function(){
    console.log('this is a regexp fn')
});
e.fire('eventregabc')
e.fire('eventreg123')
// ========== regexp Test ========== 




// ========== offAll Test ========== 
e.offAll()

e.fire('event1')
e.fire('event1')
e.fire('event2')
// ========== offAll Test ========== 


// ========== Symbol Test ========== 
var ee = new EventFire();

var sbl = Symbol('test'),
    sblCnt = 0;
var sblFn = function(){
    console.log('this is Symbol event test '+ ++sblCnt)
}
ee.on(sbl, sblFn)

ee.fire(sbl);
ee.off(sbl, sblFn);
ee.fire(sbl);

// ========== Symbol Test ========== 




// ========== scope Test ========== 
var es = new EventFire();

es.on('scope1', function(){
    console.log(this.name)
},{'once': true, 'scope': {'name': 'scope test1'} });


es.fire('scope1');
es.fire('scope1');


es.once('scope2', function(){
    console.log(this.name)
},{'scope': {'name': 'scope test2'} });


es.fire('scope2');
es.fire('scope2');

es.on({scopeObj: function(){
    console.log(this)
}}, {'scope': {'name': 'scope objectFn test'} })

es.fire('scopeObj');

// ========== scope Test ========== 

```

[downloads-image]: https://img.shields.io/npm/dm/EventFire.svg
[npm-url]: https://www.npmjs.com/package/EventFire
[npm-image]: https://img.shields.io/npm/v/EventFire.svg

[travis-url]: https://travis-ci.org/ccforward/EventFire
[travis-image]: https://travis-ci.org/ccforward/EventFire.svg?branch=master