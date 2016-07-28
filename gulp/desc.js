/**
 * Created by kiner on 2016-07-26.
 */
{
    author = "kiner";//作者名称

    authorCh = "汤文辉";//作者别名

    version = "1.0.0";//当前版本

    kinerVersion = [
        "",
        "",
        "",
        "       ❤❤❤     ❤❤❤            ❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤"+"",
        "       ❤❤❤    ❤❤❤                ❤❤❤❤❤❤❤❤❤❤❤❤❤"+"",
        "       ❤❤❤   ❤❤❤                 ❤❤❤"+"",
        "       ❤❤❤  ❤❤❤                  ❤❤❤"+"",
        "       ❤❤❤❤❤❤                    ❤❤❤"+"",
        "       ❤❤❤❤❤                     ❤❤❤"+"",
        "       ❤❤❤❤❤                     ❤❤❤❤❤❤❤❤❤❤❤❤"+"",
        "       ❤❤❤❤❤                     ❤❤❤❤❤❤❤❤❤❤❤❤"+"",
        "       ❤❤❤❤❤❤                    ❤❤❤"+"",
        "       ❤❤❤ ❤❤❤                   ❤❤❤"+"",
        "       ❤❤❤  ❤❤❤                  ❤❤❤"+"",
        "       ❤❤❤   ❤❤❤                 ❤❤❤"+"",
        "       ❤❤❤    ❤❤❤                ❤❤❤"+"",
        "       ❤❤❤     ❤❤❤            ❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤"+"",
        "       ❤❤❤       ❤❤❤         ❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤"+"",
        "",
        "                  自定义前端开发gulp工作流".blue.bold,
        "",
        "       Version:".green.bold+" "+version.yellow+"                  By:".green.bold+" "+(authorCh+"("+author+")").yellow,
        "",
        ""

    ].join("\n");

    basePath = "./project/";//根路径
    outputPath = "./output/";//产品输出路径
    tempPath = "./temp/";//临时目录

    config = {

        P_TYPE:{
            WARN: "w",
            INFO: "i",
            ERROR: "e",
            LOG: "l"
        }

    };//公共配置

    devModel = "Mobile";//开发模式  Mobile PC

    date = new Date();
    y = date.getFullYear();
    m = date.getMonth()+1;
    d = date.getDate();

    m = m<10?"0"+m:m;
    d = d<10?"0"+d:d;

    projectName = (y+"-"+m+"-"+d)+"_kinerTest";//项目名



}