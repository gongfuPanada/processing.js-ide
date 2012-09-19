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

(function (window)  {
    function IDE()  {
        var buttonTemplate = Handlebars.compile($("#button-template").html());
        var titleDiv = $("#IDE-title");
        var buttonsDiv = $("#IDE-buttons");
        var messageDiv = $("#IDE-message");
        
        //set up default message options
        var messageShow = function(div)  {
            div.setAttribute("style","display:block");
        };
        var messageHide = function(div)  {
            div.setAttribute("style","display:none");
        };
        var messageTimeout = 5000;
        var messageTimer;

        //set up ace editor
        var editor = ace.edit("IDE-editor");
        editor.setTheme("ace/theme/eclipse");
        var JavaMode = require("ace/mode/java").Mode;
        editor.getSession().setMode(new JavaMode());
        editor.setHighlightActiveLine(false);
        editor.renderer.setShowPrintMargin(false);


        //code getter/setter, no argument gets code,
        //argument sets code
        IDE.prototype.code = function(code)  {
            if(!code)  {
                return editor.getSession().getValue();
            }
            else  {
                editor.getSession().setValue(code);
            }
        }

        //set up a handler for when there is a
        //change to the document that is being edited
        IDE.prototype.onChange = function(fn)  {
            editor.getSession().on('change', fn);
        }

        // button getter/adder
        // if img and fn are defined, adds a button to the ide
        // else returns the a element associated with the button
        IDE.prototype.button = function(name, img, fn)  {
            if(img && fn)  {
                var button = $(buttonTemplate({ name:name, img:img }));
                button.click(function () { fn(); });
                $(buttonsDiv).append(button);
            }
            else  {
                var b = window.document.getElementById("IDE-"+name+"_button");
                if(b)  {
                    return window.document.getElementById("IDE-"+name+"_button");
                } else  {
                    throw new Error("no button named \"" + name + "\" exists!");
                }
            }
        }

        //flash a message to the message area
        IDE.prototype.message = function(message)  {
            var messageEl = messageDiv[0];
            if(messageTimer)  {
                clearTimeout(messageTimer);
            }
            messageEl.setAttribute("style", "display:none");
            messageEl.firstChild?messageEl.firstChild.data=message:messageEl.appendChild(document.createTextNode(message));

            messageShow(messageEl);
            messageTimer = setTimeout(function()  {
                messageHide(messageEl);
            }, messageTimeout);
        };

        //set up options for displaying messages
        IDE.prototype.messageOptions = function(options)  {
            if(options.show)  {
                messageShow = options.show;
            }
            if(options.hide)  {
                messageHide = options.hide;
            }
            if(options.time)  {
                messageTimeout = options.time;
            }
        }

        //set title
        IDE.prototype.title = function(title)  {
            titleDiv.text(title);
        }

    }

    window.IDE = IDE;
})(window);
