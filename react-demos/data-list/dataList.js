/**
 * Created by Administrator on 16/9/6.
 */
(function(){
    "use strict";

    window.EventEmitter = {
        _events: {},
        dispatch: function (event, data) {
            if (!this._events[event]) return; // no one is listening to this event
            for (var i = 0; i < this._events[event].length; i++)
                this._events[event][i](data);
        },
        subscribe: function (event, callback) {
            if (!this._events[event]) this._events[event] = []; // new event
            this._events[event].push(callback);
        },
        unSubscribe: function (event) {
            if (this._events && this._events[event]) {
                delete this._events[event];
            }
        }
    };


    var DataList = React.createClass({

        /**
         * 设置初始化对象参数
         * @returns {{loading: boolean, error: boolean, errorMessage: string, data: {datalist: Array, isClose: boolean, title: string}}}
         */
        getInitialState: function () {
            return {
                createId: null,
                loading: true,  //是否正在加载数据的标识
                error: false,    //加载数据是否出错
                errorMessage: "成功",  //错误信息
                action: null,
                data: {              //数据主题
                    dataList: [],
                    "isClose": false,
                    "title": "标题",
                    "click2close": false,
                    "showResult": false,
                    "select2close": false,
                    "isAnimation": false
                },
                status: {
                    preVal: null,
                    curText: null,
                    curVal: null
                }
            };
        },
        /**
         * 在render之后，react会使用render返回的虚拟DOM来创建真实DOM，完成之后调用此方法。
         * 在此方法中,我们对我们访问的json数据进行接收处理
         */
        componentDidMount() {

            var state = this.state;


            this.state.createId = (function () {
                return (new Date()).getTime() + Math.floor(Math.random() * 999999);
            })();

            this.props.promise.then(
                value => (
                    state.loading = false, state.error = false, state.errorMessage = "请求成功", state.data.dataList = value, this.setState(state)
                ),
                error =>(
                    state.loading = false, state.error = true, state.errorMessage = "请求出错", this.setState(state)
                )
            );
            window.ReactReady&&window.ReactReady();

        },

        /**
         *  当状态更新时触发
         */
        componentDidUpdate: function () {

            var self = this;

            if (this.state.action == "select") {

                if (this.props.select2close == "true" || this.state.data.select2close) {

                    this.hide();

                }
                var top = ($(self.refs[self.classes.kinerSelectBox]).find(".kiner-select-box-list").find('.current').index()) * $(self.refs[self.classes.kinerSelectBox]).find(".kiner-select-box-list").find('.current').height();

                top -= ($(self.refs[self.classes.kinerSelectBox]).find('.kiner-select-box-data-list').height() - $(self.refs[self.classes.kinerSelectBox]).find('.kiner-select-box-title').height() - $(self.refs[self.classes.kinerSelectBox]).find(".kiner-select-box-list").find('.current').height()) / 2;


                $(self.refs[self.classes.kinerSelectBoxList]).animate({
                    scrollTop: top
                }, 300);

                if (this.state.status.preVal != this.state.status.curVal) {
                    EventEmitter.dispatch("change", this.getTargetData(this.state.status.curVal, this.state.data.dataList));
                    this.state.status.preVal = this.state.status.curVal;
                }

                this.state.action = null;
            }


        },

        /**
         *  根据key至查找目标对象数组中的指定对象
         */
        getTargetData: function (val, arr) {

            var target = null;

            arr.map(function (obj) {

                if (obj.key == val) {
                    target = obj;
                    return false;
                }

            });

            return target;

        },

        time: 0,


        classes: {
            "kinerSelectBox": "kiner-select-box",
            "kinerSelectBoxMask": "kiner-select-box-mask",
            "kinerSelectBoxDataList": "kiner-select-box-data-list",
            "kinerSelectBoxTitle": "kiner-select-box-title",
            "mainTitle": "main-title",
            "kinerSelectBoxList": "kiner-select-box-list",
            "close": "close",
            "current": "current",
            "result": "result"
        },

        show: function (isAnimation) {

            var opts = this.state.data, time = isAnimation === false ? 0 : this.time, self = this;


            $(self.refs[self.classes.kinerSelectBoxDataList]).slideUp(0);
            $(self.refs[self.classes.kinerSelectBoxMask]).fadeOut(0);
            $(self.refs[self.classes.kinerSelectBox]).show();

            $(self.refs[self.classes.kinerSelectBoxMask]).stop().fadeIn(time, function () {

                $(self.refs[self.classes.kinerSelectBoxDataList]).stop().slideDown(time, function () {

                    if ($(self.refs[self.classes.kinerSelectBoxList]).find('.current').length != 0) {


                        var top = ($(self.refs[self.classes.kinerSelectBox]).find(".kiner-select-box-list").find('.current').index()) * $(self.refs[self.classes.kinerSelectBox]).find(".kiner-select-box-list").find('.current').height();

                        top -= ($(self.refs[self.classes.kinerSelectBox]).find('.kiner-select-box-data-list').height() - $(self.refs[self.classes.kinerSelectBox]).find('.kiner-select-box-title').height() - $(self.refs[self.classes.kinerSelectBox]).find(".kiner-select-box-list").find('.current').height()) / 2;

                        $(self.refs[self.classes.kinerSelectBoxList]).animate({
                            scrollTop: top
                        }, 300);

                        EventEmitter.dispatch("shown", self);

                    }


                });

            });

        },

        hide: function (isAnimation) {

            var opts = this.state.data, time = isAnimation === false ? 0 : this.time, self = this;

            $(self.refs[self.classes.kinerSelectBoxDataList]).stop().slideUp(time, function () {

                $(self.refs[self.classes.kinerSelectBoxMask]).stop().fadeOut(time, function () {

                    $(self.refs[self.classes.kinerSelectBoxList]).scrollTop(0);

                    $(self.refs[self.classes.kinerSelectBox]).hide();
                    EventEmitter.dispatch("hidden", self);

                });

            });


        },

        selectHandler: function (obj) {

            var state = this.state.status;
            state.curVal = obj.key;
            state.curText = obj.value;
            state.show = true;


            this.state.action = "select";

            EventEmitter.dispatch("selected", this.getTargetData(this.state.status.curVal, this.state.data.dataList));

            this.setState(state);


        },

        closeHandler: function (type) {

            if(type=="mask"){

                if(this.props.click2close == "true" || this.state.data.click2close == true){
                    this.hide();
                }
            }else{
                this.hide();
            }



        },

        /**
         * 页面渲染
         * @returns {XML}
         */
        render: function () {

            var self = this;

            //更具状态的变化可以知道我们所需的数据是否已经加载完成
            if (this.state.loading) {
                console.log("正在加载数据中...");
            } else {
//                console.log("加载数据结束...");
            }

            //判断加载数据过程中是否出错
            if (this.state.error) {
                console.error((this.state.errorMessage));
//                return null;
            }


            //将获取回来的数据应用于插件中
            var opts = this.state.data;

            //若开启动画模式,则规定动画时间为300ms
            if (this.props.isAnimation=="true" || opts.isAnimation == "true") {
                this.time = 300;
            }


            var classes = this.classes;


            //默认值
            var defValue = this.state.status.curVal || this.props.value || false;

            var closeEle = null, resultPanel = null;

            var isClose = this.props.isClose=="true" || opts.isClose,
                showResult = this.props.showResult=="true" || opts.showResult;

            //根据是否需要关闭按钮动态显示
            if (isClose) {
                closeEle = <span className={classes.close} onClick={this.closeHandler}>
                ×
                </span>;
            }

            if (showResult) {


                var curObj = this.getTargetData(defValue, opts.dataList);

                var text = curObj ? "(" + curObj.value + ")" : "";


                resultPanel = <span className={classes.result}>
                    {text}
                </span>;


            }

            //对外提供方法
            EventEmitter.subscribe("show", this.show);
            EventEmitter.subscribe("hide", this.hide);


            return (
                <div key={this.state.createId} id={this.state.createId} className={classes.kinerSelectBox}
                     ref={classes.kinerSelectBox} data-value={defValue}
                     style={{display: (this.state.status.show ? "block" : "none")}}>

                    <div className={classes.kinerSelectBoxMask} ref={classes.kinerSelectBoxMask}
                         onClick={this.closeHandler.bind(this,"mask")}></div>
                    <div className={classes.kinerSelectBoxDataList} ref={classes.kinerSelectBoxDataList}>

                        <h2 className={classes.kinerSelectBoxTitle}>
                                <span className={classes.mainTitle}>
                                    {this.props.title || opts.title}
                                </span>
                            {resultPanel}
                            {closeEle}
                        </h2>
                        <ul className={classes.kinerSelectBoxList} ref={classes.kinerSelectBoxList}>
                            {
                                opts.dataList.map(function (obj) {
                                    var li = null;

                                    if (defValue && defValue == obj.key) {
                                        li = <li className={classes.current} key={obj.key} data-value={obj.key}
                                                 onClick={self.selectHandler.bind(self, obj)}>{obj.value}</li>;
                                    } else {
                                        li = <li key={obj.key} data-value={obj.key}
                                                 onClick={self.selectHandler.bind(self, obj)}>{obj.value}</li>;
                                    }

                                    return li;
                                })
                            }
                        </ul>

                    </div>

                </div>
            );

        }
    });

    ReactDOM.render(
        <DataList promise={$.getJSON('./data.json')} value="3" title="贷款日期"
                  select2close="true" click2close="true" showResult="true"
                  isAnimation="true" isClose="true"/>,
        $('#box').get(0)
    );




})();

