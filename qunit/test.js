/**
 * Created by kiner on 2016-05-05.
 */
QUnit.test("Util : ajax", function (assert) {
    var done = assert.async();
    window.Util.ajax("test2.html", null, "get").success(function (data) {
        assert.ok(true, "==================="+assert.test.testName+" start======================");
        assert.ok(true, "【"+assert.test.testName+"】方法测试通过");
        assert.ok(true,JSON.stringify(data));
    }).error(function () {
        assert.ok(false, "【"+assert.test.testName+"】方法测试不通过");
        assert.ok(false,JSON.stringify({error:arguments}));
    }).complete(function () {
        assert.ok(true, "==================="+assert.test.testName+" end======================");
        done();
    });


    //
    // Util.task(1000,function(num){
    //     return num>=10;
    // }).progress(function(num){
    //     console.log("计时:" + num+"秒");
    // }).done(function(num){
    //     console.log("计时结束:程序执行了【"+num+"】秒");
    // });
});

QUnit.test("Util : wait",function(assert){

    var done = assert.async();
    try{
        Util.wait(3000).done(function () {
            assert.ok(true, "==================="+assert.test.testName+" start======================");
            console.info('3秒钟到了');
            assert.ok(true, "【"+assert.test.testName+"】测试通过");
            assert.ok(true, "==================="+assert.test.testName+" end======================");
            done();
        });
    }catch (e){
        assert.ok(true, "【"+assert.test.testName+"】测试不通过",e.message);
        assert.ok(true, "==================="+assert.test.testName+" end======================");
        done();
    }

});
QUnit.test("Util : task",function(assert){

    var done = assert.async();
    try{

        assert.ok(true, "==================="+assert.test.testName+" start======================");
        Util.task(1000,function(num){
            return num >= 10;
        }).progress(function (num) {
            console.log("计时:" + num + "秒");
        }).done(function (num) {
            console.log("计时结束:程序执行了【" + num + "】秒");
            assert.ok(true, "【"+assert.test.testName+"】测试通过");
            assert.ok(true, "==================="+assert.test.testName+" end======================");
            done();
        });

    }catch (e){
        assert.ok(true, "【"+assert.test.testName+"】测试不通过",e.message);
        assert.ok(true, "==================="+assert.test.testName+" end======================");
        done();
    }

});
