(function() {
    'use strict';

    // 构造器初始化
    // 使用  offAll 初始化所有的时间存储器
    var EventFire = function() {
        this._enabled = true;
        this.offAll()
    };
    const _defaultOptions = {
        once: 'boolean'
        // TODO 添加 scope
    }
    const Util = {
        isObject: function(o){
            return o && typeof o === 'object' && !Array.isArray(o) && !(o instanceof Function) && !(o instanceof RegExp)
        },
        // 分解事件名和对应函数
        separateFn: function(object, fn, scope) {
            for (var k in object){
                fn.call(scope || null, k, object[k]);
            }
        },
        // 删除fn  保留其他绑定的方法
        delFn: function(handlers, fn){
            handlers = handlers || []
            var arr = [];
            for(var i=0,len=handlers.length; i<len; i++){
                if(handlers[i] !== fn){
                    arr.push(handlers[i])
                }
            }
            return arr;
        }

    }

    /**
        1: on('event', function(){})
        2: on(['event1', 'event2'], function(){})
        3: on({event1: function(){}, event2: function(){}})
        4: on(function(){})
    */
    EventFire.prototype.on = function(arg1, arg2, arg3) {

        // 3
        if(Util.isObject(arg1)){
            separateFn(arg1, function(name, callback){
                this.on(name, callback, arg2)
            }, this);

            return this;
        }

        // 1 2 4
        if(typeof arg1 == 'function') {
            arg3 = arg2;
            arg2 = arg1;
            arg1 = null;
        }
        var eventsArr = [].concat(arg1);
        var i = 0,
            len = eventsArr.length,
            handlersList = [];
        for(; i<len; i++){
            var event = eventsArr[i];
            var eventObj = {
                fn: arg2
            }

            // TODO  添加 ES6 Symbol 的支持 typeof event === 'symbol'
            if(typeof event === 'string'){
                if(!this._handlers[event]){
                    this._handlers[event] = []
                }
                handlersList = this._handlers[event];
                eventObj.eventName = event;
            }else if(event instanceof RegExp){ // 4
                handlersList = this._handlersRegx;
                eventObj.eventPattern = event;
            }else if(event == null){
                handlersList = this._handlersAll;
            }else {
                throw Error('EventFire.on: error event name.');
            }

            for(var o in arg3 || {}){
                if(_defaultOptions[o]){
                    eventObj[o] = arg3[o]
                }
            }

            handlersList.push(eventObj);
        }

        return this;
    };

    EventFire.prototype.once = function() {
        var argsArr = Array.prototype.slice.call(arguments),
            last = argsArr.length - 1;
        if(Util.isObject(argsArr[last]) && argsArr.length > 1){
            // 把最后一个 {event1: function(){}, event2: function(){}} 形式的参数
            // 跟 {'once': true} 合并
            var newObj = {}, k;
            for(k in argsArr[last]) {
                newObj[k] = argsArr[last][k]
            }
            newObj['once'] = true;
            argsArr[last] = newObj;
        }else {
            argsArr.push({'once': true})
        }

        return this.on.apply(this, argsArr)
    };

    /**
        1: fire('event')
        2: fire('event', data)
        3: fire(['event1', 'event2'])
        4: fire(['event1', 'event2'], data)
        5: fire({event1: data1, event2: data2)
    */

    EventFire.prototype.fire = function(events, data) {
        if(!this._enabled)
            return this
        // 5
        if(Util.isObject(events)){
            Util.separateFn(events, this.fire, this);
            return this;
        }

        var eventsArr = [].concat(events),
            handlers;

        for(var i=0, len=eventsArr.length;i<len;i++){
            handlers = this.listeners(eventsArr[i])
        }
        if(!this._enabled)
            return this;

        // 5
        if(Util.isObject(events)){
            Util.separateFn(events, this.fire, this);
        }

        var eventsArr = [].concat(events),
            onceArr = [];

        for(var i=0,len=eventsArr.length; i<len; i++){
            var hanlders = this.listeners(eventsArr[i]);

            for(var x=0,hLen=hanlders.length; x<hLen; x++){
                var h = hanlders[x],
                    event = {
                        eventName: eventsArr[i]
                    }
                if(arguments.length>1){
                    event.data = data
                }
                h.fn.call(this, event)

                if(h.once){
                    onceArr.push(h)
                }
            }

            // 删除once绑定的方法

            for(var k = onceArr.length - 1; k>=0; k--){
                var fnBox = onceArr[k].eventName ?
                        this._handlers[onceArr[k].eventName] :
                        onceArr[k].eventPattern ?
                            this._handlersRegx :
                            this._handlersAll;
                fnBox.splice(fnBox.indexOf(onceArr[k]), 1);
            }
        }

        return this
    };

    /**
        1: off('event', function(){})
        2: off(['event1', 'event2'], function(){})
        3: off({event1: callback1, event2: callback2)
        4: off(callback)
        5: off('event')
    */
    EventFire.prototype.off = function(events, fn) {
        // 4
        if(arguments.length == 1 && typeof events === 'function'){
            fn = arguments[0]

            for(var h in this._handlers){
                this._handlers[h] = Util.delFn(this.handlers[h], fn)

                if(this._handlers[h].length === 0)
                    delete this._handlers[h];
            }

            this._handlersAll = Util.delFn(this._handlersAll, fn)
            this._handlersRegx = Util.delFn(this._handlersRegx, fn)

        // TODO  添加 ES6 Symbol的支持  typeof events === 'symbol'
        }else if(arguments.length == 1 && typeof events == 'string'){ // 5
            delete this._handlers[events]

        }else if(arguments.length == 2){ // 1 2
            var eventsArr = [].concat(events);

            for(var i=0,len=eventsArr.length; i<len; i++){
                var ev = eventsArr[i];

                this._handlers[ev] = Util.delFn(this._handlers[ev], fn);

                if((this._handlers[ev] || []).length == 0){
                    delete this._handlers[ev];
                }
            }

        }else if(Util.isObject(events)){ // 3
            Util.separateFn(events, this.off, this)
        }

        return this;
    };

    EventFire.prototype.offAll = function() {
        this._handlers = {};
        this._handlersAll = [];
        this._handlersRegx = [];
        return this;
    };

    EventFire.prototype.listeners = function(eventName) {
        if(!eventName)
            throw Error('EventFire.listeners: no eventName.')
        var handlers = this._handlersAll || [];

        handlers = handlers.concat(this._handlers[eventName] || []);

        for(var i=0,len=this._handlersRegx.length;i<len;i++){
            var h = this._handlersRegx[i];

            if(~eventName.search(h.eventPattern)){
                handlers.push(h)
            }
        }

        return handlers;
    };

    EventFire.prototype.enable = function() {
        this._enabled = true;
        return this;
    };

    EventFire.prototype.disable = function() {
        this._enabled = false;
        return this;
    };

    EventFire.prototype.destory = function() {
        this.offAll();
        this._enabled = false;
        this._handlers = null;
        this._handlersAll = null;
        this._handlersRegx = null;

        this.on = this.once = this.fire = this.off = this.offAll = this.listeners = Function.prototype;
    };

    
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports)
            exports = module.exports = EventFire;
        exports.EventFire = EventFire;
    } else if (typeof define === 'function' && define.amd)
        define('emmett', [], function() {
            return EventFire;
        });
    else
        this.EventFire = EventFire;



})(this)
