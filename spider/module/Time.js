/**
 * Created by 汤文辉 on 2016-08-04.
 */

function getTime(type,date){
    date = date || (new Date());
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    var h = date.getHours();
    var mi = date.getMinutes();
    var s = date.getSeconds();

    m = m<10?"0"+m:m;
    d = d<10?"0"+d:d;
    h = h<10?"0"+h:h;
    mi = mi<10?"0"+mi:mi;
    s = s<10?"0"+s:s;

    return type==1?(y+"_"+m+"_"+d+"_"+h+"_"+mi+"_"+s):(y+"-"+m+"-"+d+" "+h+":"+mi+":"+s);

}

module.exports = getTime;
