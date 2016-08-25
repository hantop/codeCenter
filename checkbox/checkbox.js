/**
 *
 * 单选框选择插件
 * Created by Administrator on 16/8/20.
 */

(function(win,doc,$){

    $(doc).ready(function(){

        var ids = [],i=0;

        $('i.checkbox').each(function(){

            ids.push($(this).attr('id'));

        });

        var len = ids.length;

        for(;i<len;i++){


            (function(id){


                $(doc).find('[for="'+id+'"]').click(function(){

                    $('#'+id).trigger('click');

                });


            })(ids[i]);

        }

        $('body').on('click','i.checkbox',function(){


            var self = $(this);

            var isDisabled = $(this).attr('disabled')!= undefined || $(this).hasClass("disabled");

            if(isDisabled)return;

            if($(this).hasClass('radio')){

                var name = $(this).attr('name').trim();

                if(name.length!=0){

                    $('i.checkbox[name="'+name+'"]').attr('data-checked',false);

                }


            }

            var checked = self.attr('data-checked')=="true";

            $(this).attr('data-checked',!checked);

            $(this).trigger("change",[!checked]);




        }).__proto__.val = function(){

            return $(this).attr('data-checked')=="true";
        };

    });


})(window,document,$);