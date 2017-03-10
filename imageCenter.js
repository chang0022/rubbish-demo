/**
 * Created by Neo on 2016/10/13.
 * Updated by Neo on 2017/03/10
 */
(function ($) {
    $.fn.imageCenter = function (options) {

        var s = $.extend({
            size: 1,
            placeholder: 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAFklEQVQImWP89OkTAwMDEwMDAwMDAwAiMgLaaYx/2AAAAABJRU5ErkJggg=='
        }, options);

        var imgDefereds = [];

        var image = this;

        var widthArray = [];


        image.each(function () {

            var src = $(this).attr('src');

            $(this).attr({
                'src': s.placeholder,
                'data-real': src
            });
            var dfd = $.Deferred();
            $(this).bind('load', function () {
                dfd.resolve();
            });
            if (this.complete) setTimeout(function () {
                dfd.resolve();
            }, 1000);

            imgDefereds.push(dfd);
            $(this).width('100%');
        });

        $.when.apply(null, imgDefereds).done(function () {
            changeSize();
            imageWH();
        });

        function imageWH() {
            assignImageValue();
        }

        function changeSize() {
            image.each(function () {
                var parent = $(this).parent();

                var width = parent.outerWidth();
                widthArray.push(width);

                var minWidth = Math.min.apply(Math, widthArray);
                var size = s.size;

                parent.height(Math.floor(minWidth * size));

            });
        }

        function assignImageValue() {
            image.each(function () {
                var parent = $(this).parent();

                var src = $(this).attr('data-real');
                var widthParent = parent.innerWidth();
                var heightParent = parent.innerHeight();

                $(this).css({
                    "width": "auto",
                    "height": "auto"
                });

                tempImage($(this), src, widthParent, heightParent);

            });
        }

        function tempImage($dom, src, width, height) {
            $('<img/>').attr('src', src).load(function () {
                var w = this.width;
                var h = this.height;
                if (w >= h) {
                    var currentWidth = parseInt((w * height) / h);
                    $dom.css({
                        'height': height,
                        'margin-left': -(currentWidth / 2 - width / 2)
                    });
                } else {
                    var currentHeight = parseInt((h * width) / w);
                    $dom.css({
                        'width': width,
                        'margin-top': -(currentHeight / 2 - height / 2)
                    });
                }
                $dom.attr('src', src);
            });
        }

        $(window).resize(function () {
            widthArray = [];
            changeSize();
            assignImageValue();
        });
    };
})(jQuery);