/**
 * 树形菜单
 * Created by kiner on 2016-05-18.
 */

try {
    $.trim("");
} catch (e) {
    // console.log("错误:"+e.message);
    $ = undefined;
}

/**
 * 注意：本插件运用了rem屏幕适配方案，一律采用rem作为单位，若项目中不是采用这种方案的，请在kinerTreeMenu.css中修改样式，此段代码不会影响功能使用，仅会影响控件样式
 */
(function (doc, win) {
    // if (window.isScreenAdpat) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl["style"].fontSize = 20 * (clientWidth / 720) + 'px';
            // win.remDefineCallback&&win.remDefineCallback(clientWidth,720,20);//屏幕宽度  设计图宽度  设计图字体大小
        };
    //alert(doc.addEventListener)
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    //doc.addEventListener('DOMContentLoaded', recalc, false);
    recalc();
    // }

})(document, window);

;(function (win, doc, $) {

    win.kinerTreeMenu = win.kinerTreeMenu || (function(){
            return function (options) {

                // console.log(this);
                this.opt = this.extend(true,{},kinerTreeMenu.defaultOpt,options);

                // console.log(this);
                this.init();

            };
        })();

    //菜单总数
    win.kinerTreeMenu.total = 0;

    //实例的第一个菜单
    win.kinerTreeMenu.FIRST_MENU = 0;

    //实例的最后一个菜单
    win.kinerTreeMenu.LAST_MENU = -1;

    /**
     * 菜单id列表
     * @type {{}}
     */
    win.kinerTreeMenu.prototype.menuIds = {};

    /**
     * 菜单示例列表
     * @type {Array}
     */
    win.kinerTreeMenu.prototype.menuList = [];

    /**
     * 默认参数
     */
    win.kinerTreeMenu.defaultOpt = {
        target: "",
        data: [],
        init: function () {
        },
        openCallback: function () {
        },
        linkCallback: function () {
        }
    };

    win.kinerTreeMenu.prototype.bodyBoxs = [];

    /**
     * 初始化菜单
     * @param options
     */
    win.kinerTreeMenu.prototype.init = function (options) {

        var that = this;

        if(options){

            this.opt = this.extend(true,{},this.opt,options);
        }

        this.getAllId(this.opt.data);



        var target = this.opt.target;
        this.body = this.getEle(target);

        // console.log("kiner",this.body);

        this.each(this.body, function (ele, index) {
            win.kinerTreeMenu.LAST_MENU++;
            var bodyBox = doc.createElement("div");
            bodyBox.className = "kinerTreeMenu";

            if(this.opt.title){
                var title = doc.createElement('div');
                title.className = "kinerTreeMenuTitle";
                that.opt.title.link&&title.setAttribute("data-link",that.opt.title.link);
                var textBox = doc.createElement('span');
                textBox.className = "textBox";
                var text = doc.createElement('span');
                text.className = "titleContent";
                var mainTitle = doc.createElement('h2');
                mainTitle.className = "menuTitle";
                mainTitle.innerHTML = that.opt.title.text;
                var subText = doc.createElement('h4');
                subText.className = "subTitle";
                subText.innerHTML = that.opt.title.subText;
                if(that.opt.title.link)title["data-link"] = that.opt.title.link;
                if (that.opt.title.icon && that.trim(that.opt.title.icon).length != 0){

                    var oI = doc.createElement('i');
                    oI.className = "kinerTreeMenuIcon";
                    oI["style"]["background-image"] = "url('" + that.opt.title.icon + "')";
                    that.append(title, oI);

                }else{
                    textBox["style"]["textAlign"] = "center";
                    textBox["style"]["display"] = "block";
                    textBox["style"]["marginLeft"] = 0;
                }

                that.bind(title,'click',function(){

                    that.opt.title.action&&that.opt.title.action(title,that.opt,that.opt.title.link);

                });

                that.append(textBox,mainTitle);
                that.append(textBox,subText);
                that.append(title,textBox);
                that.append(bodyBox,title);
            }


            var id = this.opt.id || "mainMenu_";
            id += index+"_"+(new Date().getTime())+(Math.ceil(Math.random() * 100000));
            bodyBox.id = id;
            that.opt.id = id;
            that.menuList.push({
                id: id,
                ele:ele,
                obj:that
            });
            that.render(bodyBox, that.opt.data);

            bodyBox["style"]["height"] = ele.offsetHeight - 30 + "px";
            bodyBox["data-opt"] = that.opt;

            // console.log(ele);



            that.append(ele, bodyBox);
            that.bodyBoxs.push({
                id: id,
                obj: bodyBox
            });
        });
    };

    /**
     * 获取所有id
     * @param data
     */
    win.kinerTreeMenu.prototype.getAllId = function (data) {
        var that = this;

        this.each(data, function (d, index) {

            win.kinerTreeMenu.total++;
            if (d.id && d.id.length != 0) {
                that.menuIds[d.id] = d;
            } else {
                var id = that.createId(win.kinerTreeMenu.total);
                that.menuIds[id] = d;
            }

            if (d.subMenus && d.subMenus.length != 0) {
                that.getAllId(d.subMenus);
            }

        });

    };

    /**
     * 获取元素
     * @param selector
     * @returns {*}
     */
    win.kinerTreeMenu.prototype.getEle = function (selector) {
        var that = this;
        // console.dir(selector);
        if (that.type(selector) === "string") {
            if (selector.indexOf("#") != -1) {
                selector = selector.replace("#", "");
                return [doc.getElementById(selector)];
            } else if (selector.indexOf(".") != -1) {
                selector = selector.replace(".", "");
                return that.getByCls(doc, selector);
            } else {
                return doc.getElementsByTagName(selector);
            }
        } else {
            // console.log(that.isArray(selector));
            if (that.isArray(selector)) {
                return selector;
            } else {
                return [selector];
            }
        }
    };

    /**
     * 获取总数
     * @returns {*|number}
     */
    win.kinerTreeMenu.prototype.getTotal = function () {
        return win.kinerTreeMenu.total;
    };

    /**
     * 菜单渲染
     * @param ele 菜单容器  必填
     * @param data  菜单数据对象  必填
     * @param level 当前菜单等级  可选
     * @param parentData    父级菜单数据  可选
     * @param parentId      父级菜单id  可选
     * @param parentIndex   父级菜单索引  可选
     * @param showThis      是否显示当前等级菜单
     */
    win.kinerTreeMenu.prototype.render = function (ele, data, level, parentData, parentId, parentIndex, showThis) {

        var that = this;
        var res = doc.createElement("div");
        res.className = "menuBox";
        if (level != undefined) {
            level++;
            that.addClass(res, "subMenuBox");
            res.setAttribute("data-show", "false");
            res["style"]["marginLeft"] = (level * 3) + "px";
            res["style"]["display"] = 'none';
        } else {
            level = 1;
        }
        // console.log(showThis);


        parentIndex = parentIndex || 1;

        res.setAttribute("data-level", level);

        that.bind(res, "mouseover", function (e) {
            that.sp(e);
            that.addClass(this, "current");
        });
        that.bind(res, "mouseout", function (e) {
            that.sp(e);
            that.removeClass(this, "current");
        });

        var count = 0;

        this.each(data, function (d, index) {

            count++;
            res.setAttribute("data-index", count + "");


            var item = doc.createElement("div");
            item.className = "kinerMenuItem";
            item["data-id"] = that.getKeyByVal(that.menuIds, d);
            item["data-parentId"] = parentId || "noParent";
            if (d.link)item["data-link"] = d.link;
            d.link && item.setAttribute("data-link", d.link);
            item.setAttribute("data-id", item["data-id"]);
            item.setAttribute("data-parentId", parentId || "noParent");
            item["data-parentData"] = parentData;
            item["data-menu"] = d;
            var title = doc.createElement("h2");
            title.className = "title";

            title.title = d.title;
            var t = doc.createElement('span');
            t.innerHTML = d.title;
            if (d.beforeRender) {
                var tem = d.beforeRender && d.beforeRender.call(that, t, d, level + "_" + count);
                if (tem) {
                    t = tem;
                }
            } else if (that.opt.beforeRender) {
                var tem = that.opt.beforeRender && that.opt.beforeRender.call(that, t, d, level + "_" + count);
                if (tem) {
                    t = tem;
                }
            }
            if (d.icon && that.trim(d.icon).length != 0) {

                var oI = doc.createElement('i');
                oI.className = "kinerTreeMenuIcon";
                oI["style"]["background-image"] = "url('" + d.icon + "')";
                that.append(title, oI);

            }else{
                console.log(t);
                t["style"]["marginLeft"] = ".6rem";
            }
            that.append(title,t);
            that.append(item, title);

            // item.classList.add("closed");
            if (d.disabled) {
                that.addClass(title, "disabled");
            }

            if (d.subMenus && d.subMenus.length != 0) {


                if (d.subMenuShow == true) {
                    that.render(item, d.subMenus, level, d, item["data-id"], count, true);
                } else {
                    that.render(item, d.subMenus, level, d, item["data-id"], count, false);
                }

            } else {
                that.addClass(item, "noSubMenu");
            }



            that.bind(item, "click", function (e) {
                var self = this;
                that.sp(e);
                if (d.disabled) {
                    return false;
                }
                var thisLevel = "";
                if(self.parentNode){
                    thisLevel = parseInt(self.parentNode.getAttribute("data-level"));
                }
                if (d.subMenus && d.subMenus.length != 0) {
                    that.each(self.children, function (ele, index) {
                        if (ele.getAttribute("data-level") == thisLevel + 1) {

                            if (ele.getAttribute("data-show") == "false") {
                                ele.setAttribute("data-show", "true");
                                that.addClass(ele.parentNode, "showed");
                                that.removeClass(ele.parentNode, "closed");
                                ele["style"]["display"] = 'block';
                            } else {
                                ele.setAttribute("data-show", "false");
                                ele["style"]["display"] = 'none';
                                that.addClass(ele.parentNode, "closed");
                                that.removeClass(ele.parentNode, "showed");
                            }
                        }
                    })
                }
                // console.log(that.opt.id);
                that.opt.action && that.opt.action.call(that, item, d, parentData, d.link);
                d.action && d.action.call(that, item, d, parentData, d.link);
            });


            that.append(res, item);

            if (d.afterRender) {
                d.afterRender.call(that, item, d, level + "_" + count);
            } else if (that.opt.afterRender) {
                that.opt.afterRender.call(that, item, d, level + "_" + count);
            }


        });

        that.append(ele, res);
        if (showThis) {
            res["style"]["display"] = 'block';
            res.setAttribute("data-show","true");
            that.addClass(res.parentNode,"showed");
        }else{
            res.setAttribute("data-show","false");
            that.addClass(res.parentNode,"closed");
        }

    };


    /**
     * 循环数组或类数组对象
     * @param arr
     * @param callback
     */
    win.kinerTreeMenu.prototype.each = function (arr, callback) {
        if(arr==undefined||arr==null){
            return false;
        }
        var i, len = arr.length;
        for (i = 0; i < len; i++) {
            var result = callback && callback.call(this, arr[i], i);
            if (result == false) {
                break;
            }
        }
    };

    /**
     * 以for-in形式循环数组或类数组对象
     * @param arr
     * @param callback
     */
    win.kinerTreeMenu.prototype.foreach = function (arr, callback) {
        if(arr==undefined||arr==null){
            return false;
        }
        for (var i in arr) {
            var result = callback && callback.call(this, arr[i], i);
            if (result == false) {
                break;
            }
        }
    };

    /**
     * 阻止事件冒泡
     * @param e
     */
    win.kinerTreeMenu.prototype.sp = function (e) {
        e = e || window.event;
        if (e.stopPropagation) { //W3C阻止冒泡方法
            e.stopPropagation();
        } else {
            e.cancelBubble = true; //IE阻止冒泡方法
        }
    };


    /**
     * 往目标元素中追加元素
     * @param ele
     * @param child
     */
    win.kinerTreeMenu.prototype.append = function (ele, child) {
        ele.appendChild(child);

    };

    /**
     * 根据class获取元素数组
     * @param ele
     * @param cls
     * @returns {Array}
     */
    win.kinerTreeMenu.prototype.getByCls = function (ele, cls) {

        var that = this, classes = [];
        if (that.isArray(ele)) {
            that.each(ele, function (e) {
                that.each(e.getElementsByTagName('*'), function (e2, index) {
                    // console.log(that.hasClass(ele, cls)+"---"+cls);
                    if (that.hasClass(e2, cls)) {

                        classes.push(e2);

                    }

                });
            });
        } else {
            that.each(ele.getElementsByTagName('*'), function (e2, index) {
                // console.log(that.hasClass(ele, cls)+"---"+cls);
                if (that.hasClass(e2, cls)) {

                    classes.push(e2);

                }

            });

        }


        return classes;

    };

    /**
     * 判断是否存在摸个class
     * @param elem
     * @param cls
     * @returns {boolean}
     */
    win.kinerTreeMenu.prototype.hasClass = function (elem, cls) {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false;
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    };
    /**
     * 添加一个class
     * @param ele
     * @param classes
     */
    win.kinerTreeMenu.prototype.addClass = function (ele, classes) {

        if (ele.classList) {
            ele.classList.add(classes);
        } else {
            if (ele.className && ele.className.length != 0) {
                var cls = ele.className.split(" ");
                cls.push(classes);
                ele.className = cls.join(" ");
            } else {
                ele.className = classes;
            }
        }

    };
    /**
     * 移除class
     * @param ele
     * @param classes
     */
    win.kinerTreeMenu.prototype.removeClass = function (ele, classes) {

        if (ele.classList) {
            ele.classList.remove(classes);
        } else {
            var cls = ele.className.split(" "), arrs = [];
            for (var i = 0; i < cls.length; i++) {
                if (cls[i] != classes) {
                    arrs.push(cls[i]);
                }
            }
            ele.className = arrs.join(" ");
        }

    };

    /**
     * 根据索引获取菜单id
     * @param index
     * @returns {*}
     */
    win.kinerTreeMenu.prototype.getIdByIndex = function (index) {
        return this.menuList[index].id;
    };

    /**
     * 事件绑定
     * @param elem
     * @param type
     * @param handler
     */
    win.kinerTreeMenu.prototype.bind = function (elem, type, handler) {
        if (window.addEventListener) {// 标准浏览器
            elem.addEventListener(type, handler, false);
        } else if (window.attachEvent) {// IE浏览器
            elem.attachEvent("on" + type, handler);
        }
    };

    /**
     * 关闭所有菜单
     */
    win.kinerTreeMenu.prototype.closeAll = function (id) {
        var that = this;
        this.each(that.getByCls(id ? doc.getElementById(id) : this.bodyBoxs[0].obj, "menuBox"), function (ele, index) {
            ele.setAttribute("data-show", "false");
            that.removeClass(ele.parentNode, "showed");
            that.addClass(ele.parentNode, "closed");
            if (ele.getAttribute('data-level') != "1") {
                ele["style"].display = 'none';
            }
        });
    };

    /**
     * 打开所有菜单
     */
    win.kinerTreeMenu.prototype.openAll = function (id) {
        var that = this;
        this.each(that.getByCls(id ? that.getBodyBoxById(id).obj : this.bodyBoxs[0].obj, "menuBox"), function (ele, index) {
            ele.setAttribute("data-show", "true");
            that.removeClass(ele.parentNode, "closed");
            that.addClass(ele.parentNode, "showed");
            if (ele.getAttribute('data-level') != "1") {
                ele["style"].display = 'block';
            }
        });
    };

    win.kinerTreeMenu.prototype.getBodyBoxById = function (id) {
        var that = this;
        var body = null;
        // console.log(id);
        that.each(that.bodyBoxs, function (ele, index) {
            if (ele.id == id) {
                body = ele;
                // console.log("kiner",ele);
                return false;
            }
        });
        return body;
    };



    //残生随机数作为id
    function getRandomNum(index) {
        var time = new Date().getTime();
        var rnum = Math.ceil(Math.random() * 100000);
        return "kinerTreeMenu_" + index + "_" + time+""+rnum;
    }

    //检测id是否存在
    var checkId = function (id) {
        return win.kinerTreeMenu.prototype.menuIds[id] == undefined ? false : win.kinerTreeMenu.prototype.menuIds[id];
    };
    /**
     * 随机产生id
     * @param index
     */
    win.kinerTreeMenu.prototype.createId = function (index) {

        var tempId = getRandomNum(index);
        if (checkId(tempId)) {
            return this.createId();
        } else {
            return tempId;
        }

    };

    /**
     * 根据值获取键
     * @param arr
     * @param val
     * @returns {string}
     */
    win.kinerTreeMenu.prototype.getKeyByVal = function (arr, val) {

        var myKey = "";
        this.foreach(arr, function (value, key) {
            if (value === val) {
                myKey = key;
                return false;
            }
        });

        return myKey;

    };

    /**
     * 已经打开的菜单列表
     * @returns {Array}
     */
    win.kinerTreeMenu.prototype.openedList = function (id) {
        var arr = [];
        this.each(this.getByCls(id ? this.getBodyBoxById(id).obj : this.bodyBoxs[0].obj, "showed"), function (ele, index) {
            if (ele["data-menu"])
                arr.push(ele["data-menu"]);
        });
        return arr;
    };
    /**
     * 已经关闭的菜单列表
     * @returns {Array}
     */
    win.kinerTreeMenu.prototype.closeedList = function (id) {
        var arr = [];
        this.each(this.getByCls(id ? this.getBodyBoxById(id).obj : this.bodyBoxs[0].obj, "closed"), function (ele, index) {
            if (ele["data-menu"])
                arr.push(ele["data-menu"]);
        });
        return arr;
    };


    /**
     * 判断类型
     * @param obj
     * @returns {string}
     */
    win.kinerTreeMenu.prototype.type = function (obj) {
        return typeof obj;
    };

    /**
     * 判断对象是否是方法
     * @param obj
     * @returns {boolean}
     */
    win.kinerTreeMenu.prototype.isFunction = function (obj) {
        return win.kinerTreeMenu.type(obj) === "function";
    };

    /**
     * 判断对象是不是window对象
     * @param obj
     * @returns {boolean}
     */
    win.kinerTreeMenu.prototype.isWindow = function (obj) {
        return obj === win;
    };

    /**
     * 判断对象是不是纯粹的json对象
     * @param obj
     * @returns {*}
     */
    win.kinerTreeMenu.prototype.isPlainObject = function (obj) {

        var that = this;

        function hasOwn(property) {
            return this.prototype.hasOwnProperty(property);
        }

        if (!obj || that.type(obj) !== "object" || obj.nodeType || that.isWindow(obj)) {
            return false;
        }

        try {
            // Not own constructor property must be Object
            if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.

        var key;
        for (key in obj) {
        }

        return key === undefined || hasOwn.call(obj, key);
    };

    /**
     * 判断对象是不是数组
     * @param obj
     * @returns {boolean}
     */
    win.kinerTreeMenu.prototype.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    win.kinerTreeMenu.prototype.trim = function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    };

    /**
     * 对象扩展方法
     * @returns {*|{}}
     */
    win.kinerTreeMenu.prototype.extend = function () {

        var that = this;
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        //如果第一个值为bool值，那么就将第二个参数作为目标参数，同时目标参数从2开始计数
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }
        // 当目标参数不是object 或者不是函数的时候，设置成object类型的
        if (typeof target !== "object" && !that.isFunction(target)) {
            target = {};
        }
        //如果extend只有一个函数的时候，那么将跳出后面的操作
        if (length === i) {
            target = this;
            --i;
        }
        for (; i < length; i++) {
            // 仅处理不是 null/undefined values
            if ((options = arguments[i]) != null) {
                // 扩展options对象
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    // 如果目标对象和要拷贝的对象是恒相等的话，那就执行下一个循环。
                    if (target === copy) {
                        continue;
                    }
                    // 如果我们拷贝的对象是一个对象或者数组的话
                    if (deep && copy && ( that.isPlainObject(copy) || (copyIsArray = that.isArray(copy)) )) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && that.isArray(src) ? src : [];
                        } else {
                            clone = src && that.isPlainObject(src) ? src : {};
                        }
                        //不删除目标对象，将目标对象和原对象重新拷贝一份出来。
                        target[name] = that.extend(deep, clone, copy);
                        // 如果options[name]的不为空，那么将拷贝到目标对象上去。
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        // 返回修改的目标对象
        return target;

    };

    //将对象挂接在jquery上，是的控件无论是否有jquery的情况都可以使用
    if ($) {

        $.fn.kinerTreeMenu = function (options) {
            options.target = $(this).get();
            return new win.kinerTreeMenu(options);
        };


    }

})(window, document, $);