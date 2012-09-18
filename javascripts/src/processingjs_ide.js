/**
Copyright (C) 2011 by Semmy Purewal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
**/

$(document).ready(function()  {
    var ide = new IDE();
    ide.title("processing.js demo");

    //set up some default code
    $.get("examples/default.pjs", function (data) {
        ide.code(data);
    });

    // set the message box to fade in and fade out
    ide.messageOptions({
        show:function(div)  {
            $(div).fadeIn();
        }, 
        hide:function(div)  {
            $(div).fadeOut();
        },
        time: 3000
    });

    //RUN BUTTON CODE
    var p;  //processing object
    var error;  //processing error

    ide.button("run","images/icons/run.png", function()  {
        return false;
    });

    ide.button("run").setAttribute("href","#canvas");

    $(ide.button("run")).fancybox({
        'padding' : 0,
        'titleShow' : false,
        'type' : 'inline',
        'width' : 'auto',
        'height' : 'auto',
        'scrolling' : 'no',
        'hideOnOverlayClick' : 'true',
        'transitionIn' : 'elastic',
        'transitionOut' : 'elastic',
        'onStart' : function()  {
            var code = ide.code();
            var canvas = document.getElementById("processing_canvas");
            error = null;

            try  {
                p = new Processing(canvas, code);
                var dimensions = code.match(/\s+size\((\d+),(\d+)\)/);
                var width = parseInt(dimensions[1]);
                var height = parseInt(dimensions[2]);
                $("#processing_canvas").css('width',width);
                $("#processing_canvas").css('height',height);
            }
            catch(err)  {
                error = err;
                Processing.logger.log(err);
                $.fancybox.cancel();
                if(p)  {
                    p.exit();
                }
            }
        },
        'onComplete' : function()  {
            if(error)  {
                $.fancybox.close();
            } else  {
                $("#fancybox-content").css('height',$("#processing_canvas").css('height'));                                                                                 
                $("#fancybox-content").css('width',$("#processing_canvas").css('width'));
                $("#processing_canvas").focus();
            }
        },
        'onCleanup' : function()  {
            if(p)  {
                p.exit();
            }
        }
    });
    //END RUN BUTTON CODE
});
