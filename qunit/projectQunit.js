/**
 * Created by kiner on 2016-05-05.
 */

(function (win, doc, $, _) {

    win.Test = win.Test || {};

    win.Test.state = {};
    win.Test.testResult = {
        passedCount: 0,
        failCount: 0,
        totalCount: 0
    };
    win.Test.broadcast = function () {
    };
    win.Test._status = {
        started: "started",
        doing: "doing",
        success: "success",
        failed: "failed",
        completed: "completed",
        error: "error"
    };

    win.Test.allCompletedCallback = function () {
        $('#result').html("总共测试了:" + win.Test.testResult.totalCount + "个<br/>成功:" + win.Test.testResult.passedCount + "个<br/>失败:" + win.Test.testResult.failCount + "个");
    };

    win.Test.setState = function (id, status, data) {
        win.Test.state[id] = status;
        win.Test.broadcast && win.Test.broadcast.call(win.Test, id, status, data);
    };

    win.Test.setResult = function (id, result, status) {
        win.Test.testResult[id] = {
            result: result,
            status: status
        };
    };

    win.Test.getRandomNum = function () {

        var time = new Date().getTime();
        var rnum = Math.ceil(Math.random() * 100000);
        return "QUnitTest_" + time + "" + rnum;
    };


    win.Test.checkId = function (id) {
        return win.Test.testResult[id] == undefined ? false : win.Test.testResult[id];
    };

    win.Test.createId = function () {

        var tempId = this.getRandomNum();
        if (this.checkId(tempId)) {
            return this.createId();
        } else {
            return tempId;
        }

    };

    win.Test._testPage = function (options) {

        var opt = $.extend(true, {
            allCompletedCallback: null,//当页测试完毕回调
            actions: []//页面功能测试列表
        }, options);

        win.Test.testResult.totalCount += opt.actions.length;

        for (var i = 0, len = opt.actions.length; i < len; i++) {

            var action = opt.actions[i];
            (function (action) {
                action.id = action.id || win.Test.createId();
                // QUnit.config.testId.push(action.id);
                // QUnit.config.moduleId.push(action.id);
                var passFlag = true, errorStatus = win.Test._status.success;
                QUnit.kinerTest(action.id,action.name, function () {
                    var that = this;
                    win.Test.broadcast = function (id, status, args) {
                        switch (status) {
                            case win.Test._status.started:
                            {
                                QUnit.addMsg(action.id, "==========================开始测试【" + action.name + "(" + id + ")】===============================");
                                QUnit.addMsg(action.id,"执行操作为：");
                                QUnit.addMsg(action.id,action.action,"preText");
                                break;
                            }
                            case win.Test._status.doing:
                            {
                                QUnit.addMsg(action.id,"正在异步测试【" + action.name + "(" + id + ")】中...");
                                args &&QUnit.addMsg(action.id, "输出结果:");
                                args &&QUnit.addMsg(action.id,JSON.stringify(args),"html");
                                break;
                            }
                            case win.Test._status.success:
                            {
                                win.Test.testResult.passedCount++;
                                _.assert.ok(true, "【" + action.name + "(" + id + ")】测试通过");
                                args && QUnit.addMsg(action.id, "【" + action.name + "(" + id + ")】测试结果为:");
                                args && QUnit.addMsg(action.id,JSON.stringify(args),"html");
                                break;
                            }
                            case win.Test._status.failed:
                            {
                                win.Test.testResult.failCount++;
                                passFlag = false;
                                errorStatus = win.Test._status.failed;
                                _.assert.notOk(true, "【" + action.name + "(" + id + ")】测试未通过");
                                args && QUnit.addMsg(action.id,"【" + action.name + "(" + id + ")】测试结果为:");
                                args && QUnit.addMsg(action.id, JSON.stringify(args),"html");
                                break;
                            }
                            case win.Test._status.completed:
                            {
                                QUnit.addMsg(action.id,"==========================结束测试【" + action.name + "(" + id + ")】===============================");
                                win.Test.allCompletedCallback();
                                break;
                            }
                            case win.Test._status.error:
                            {
                                action.error && action.error(args);
                                win.Test.testResult.failCount++;
                                passFlag = false;
                                errorStatus = win.Test._status.error;
                                _.assert.notOk(true, "【" + action.name + "(" + id + ")】测试案例出错");
                                args && QUnit.addMsg(action.id, "【" + action.name + "(" + id + ")】测试结果为:");
                                args && QUnit.addMsg(action.id, JSON.stringify(args),"preText");
                                window.error("测试案例出错：",e,JSON.stringify(e));
                                win.Test.allCompletedCallback();
                                break;
                            }
                        }
                        win.Test.setResult(action.id, passFlag, errorStatus);
                    };

                    try {
                        win.Test.setState(action.id, win.Test._status.started);
                        win.Test.setState(action.id, win.Test._status.doing);
                        action.action.call(that, action);
                        if (action.validateFn()) {
                            action.success&&action.success();
                            win.Test.setState(action.id, win.Test._status.success);
                        } else {
                            action.fail()&&action.fail();
                            win.Test.setState(action.id, win.Test._status.failed);
                        }
                    } catch (e) {
                        win.Test.setState(action.id, win.Test._status.error, e.message);
                    }
                    action.completed&&action.completed();
                    win.Test.setState(action.id, win.Test._status.completed);


                });
            })(action);


        }

    };

    win.Test._testPageAsync = function (options) {
        var opt = $.extend(true, {
            allCompletedCallback: null,//当页测试完毕回调
            actions: []//页面功能测试列表
        }, options);

        win.Test.testResult.totalCount += opt.actions.length;
        for (var i = 0, len = opt.actions.length; i < len; i++) {

            var action = opt.actions[i];
            (function (action) {
                var passFlag = true, errorStatus = win.Test._status.success;
                action.id = action.id || win.Test.createId();
                // QUnit.config.testId.push(action.id);
                // QUnit.config.moduleId.push(action.id);
                QUnit.kinerAsyncTest(action.id,action.name, function () {
                    var that = this;
                    win.Test.broadcast = function (id, status, args) {
                        switch (status) {
                            case win.Test._status.started:
                            {
                                QUnit.addMsg(action.id, "==========================开始测试【" + action.name + "(" + id + ")】===============================");
                                QUnit.addMsg(action.id,"执行操作为：");
                                QUnit.addMsg(action.id,action.action,"preText");
                                break;
                            }
                            case win.Test._status.doing:
                            {
                                QUnit.addMsg(action.id, "正在异步测试【" + action.name + "(" + id + ")】中...");
                                args && QUnit.addMsg(action.id, "输出结果:");
                                args && QUnit.addMsg(action.id, JSON.stringify(args),"text");
                                break;
                            }
                            case win.Test._status.success:
                            {
                                if((action.validateFn&&action.validateFn(args))||action.validateFn==undefined){
                                    action.success&&action.success(args);
                                    win.Test.testResult.passedCount++;
                                    _.assert.ok(true, "【" + action.name + "(" + id + ")】测试通过");
                                    args && QUnit.addMsg(action.id, "【" + action.name + "(" + id + ")】测试结果为:");
                                    args && QUnit.addMsg(action.id, args,"text");
                                }else{
                                    win.Test.testResult.failCount++;
                                    passFlag = false;
                                    errorStatus = win.Test._status.failed;
                                    _.assert.notOk(true, "【" + action.name + "(" + id + ")】测试未通过");
                                    args && QUnit.addMsg(action.id, "【" + action.name + "(" + id + ")】测试结果为:");
                                    args && QUnit.addMsg(action.id, JSON.stringify(args),"text");
                                }

                                break;
                            }
                            case win.Test._status.failed:
                            {
                                win.Test.testResult.failCount++;
                                passFlag = false;
                                errorStatus = win.Test._status.failed;
                                action.fail&&action.fail(args);
                                _.assert.notOk(true, "【" + action.name + "(" + id + ")】测试未通过");
                                args && QUnit.addMsg(action.id, "【" + action.name + "(" + id + ")】测试结果为:");
                                args && QUnit.addMsg(action.id, JSON.stringify(args),"text");
                                break;
                            }
                            case win.Test._status.completed:
                            {
                                QUnit.start();
                                action.completed && action.completed(args);
                                QUnit.addMsg(action.id, "==========================结束测试【" + action.name + "(" + id + ")】===============================");
                                win.Test.allCompletedCallback();
                                break;
                            }
                            case win.Test._status.error:
                            {
                                action.error && action.error(args);
                                QUnit.start();
                                win.Test.testResult.failCount++;
                                passFlag = false;
                                errorStatus = win.Test._status.error;
                                _.assert.notOk(true, "【" + action.name + "(" + id + ")】测试案例出错");
                                args && QUnit.addMsg(action.id, "【" + action.name + "(" + id + ")】测试结果为:");
                                args && QUnit.addMsg(action.id, JSON.stringify(args),"preText");
                                window.error("测试案例出错：",e,JSON.stringify(e));
                                win.Test.allCompletedCallback();
                                break;
                            }
                        }

                        win.Test.setResult(action.id, passFlag, errorStatus);
                    };
                    try {
                        action.action.call(that, action);
                    } catch (e) {
                        win.Test.setState(action.id, win.Test._status.error, e.message);
                    }


                });


            })(action);


        }
    };

})(window, document, $, QUnit);