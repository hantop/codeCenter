/**
 * Created by 汤文辉 on 2016-08-06.
 */

//构造方法1：new Buffer(size); size为number类型
//var bf = new Buffer(5);
//console.log(bf);

//构造方法2：new Buffer(Array);
//var bf = new Buffer([1,2,3,4,5]);
//console.log(bf);

//构造方法3：new Buffer(string,[encoding]);
var str = "汤文辉";
var bf = new Buffer(str, "UTF-8");//由此可看出，js中是一个中文字符占了3个字节
console.log(bf);
console.log(str.length);
console.log(bf.length);
console.log(bf.toString());

