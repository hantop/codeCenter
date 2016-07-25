/**
 * Created by Administrator on 2016/1/1.
 */

var app = angular.module("myApp", [])
    .controller('ctrl', function ($scope) {

        //默认字段
        $scope.formData = {
            rd: "rmb"
        };
        //聊天列表数组
        $scope.chartList = [];

        /**
         * 将聊天内容存进数组中
         */
        $scope.pushChart = function () {
            var val = $.trim($('#txt1').val());
            if (val.length == 0) {
                return;
            }

            $scope.chartList.push(val);
        };

    })
    .filter('money', function () {
        return function (money, rd, num) {


            rd = rd || "rmb";
            num = num || 3;

            if (!money) {
                return "";
            }
            var reg = /[\d\.]/gi;
            if (!reg.test(money)) {
                return "非法金额";
            }

            if (money >= 999999999999999) {
                return "金额太大";
            }

            var m = fmoney(money, num);

            return rd == "rmb" ? "￥" + m : "$" + m;


            function fmoney(s, n) {
                n = n > 0 && n <= 20 ? n : 2;
                s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
                var l = s.split(".")[0].split("").reverse(),
                    r = s.split(".")[1];
                t = "";
                for (i = 0; i < l.length; i++) {
                    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
                }
                return t.split("").reverse().join("") + "." + r;
            }

        };
    })
    .filter("fileSize", function () {

        return function (val) {
            var reg = /\D/gi;
            if (reg.test(val) || !val) {
                return "";
            }
            var str = "B";
            if (val < 1024) {
                str = "B";
            } else if (val >= 1024 && val < 1024 * 1024) {
                str = "KB";
            } else if (val >= 1024 * 1024 && val < 1024 * 1024 * 1024) {
                str = "MB";
            } else if (val >= 1024 * 1024 * 1024 && val < 1024 * 1024 * 1024 * 1024) {
                str = "GB";
            } else if (val >= 1024 * 1024 * 1024 * 1024 && val < 1024 * 1024 * 1024 * 1024 * 1024) {
                str = "TB";
            } else {
                str = "error";
            }

            if (str != "error") {
                return val + str;
            } else {
                return "文件过大，无法计算";
            }
        };

    })
    .filter("myEm", ['$sce', function ($sce) {
        return function (val) {
            var reg = /【em_(\d+)】/gi;

            console.dir($sce);
            return $sce.trustAsHtml(val.replace(reg, "<img src='images\/em\/em_$1.jpg' width='30px'/>"));
        };

    }])
    ;


$(function () {

    $('.list').on('click', 'span', function () {
        var em = $(this).data('em');
        $('.list').hide();
        insertAtCursor($('#txt1').get(0), '【' + em + '】');
    });

    $('#emBtn').click(function () {
        var flag = $('.list').is(':hidden');

        if (flag) {
            $('.list').show();
        } else {
            $('.list').hide();
        }

    });
    /**
     * 将内容插入到光标所在的位置
     * @param myField
     * @param myValue
     */
    function insertAtCursor(myField, myValue) {
//IE support
        if (document.selection) {
            myField.focus();
            sel = document.selection.createRange();
            sel.text = myValue;
            sel.select();
        }
//MOZILLA/NETSCAPE support
        else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;
// save scrollTop before insert www.keleyi.com
            var restoreTop = myField.scrollTop;
            myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
            if (restoreTop > 0) {
                myField.scrollTop = restoreTop;
            }
            myField.focus();
            myField.selectionStart = startPos + myValue.length;
            myField.selectionEnd = startPos + myValue.length;
        } else {
            myField.value += myValue;
            myField.focus();
        }
    }

});
