$(function () {
    "use strict";
   $(".js-slide").click(function(){
       $(this).siblings(".sp-item-more").toggleClass("hide");
        $(this).siblings(".fa").toggleClass("icon-caret-right");
   });
});