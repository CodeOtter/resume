(function($) {
    $.baseClass = function(obj) {
        obj = $(obj);
        return obj.get(0).className.match(/([^ ]+)/)[1];
    };
    $.fn.addDependClass = function(className, delimiter) {
        var options = {
            delimiter: delimiter ? delimiter : '-'
        }
        return this.each(function() {
            var baseClass = $.baseClass(this);
            if (baseClass)
                $(this).addClass(baseClass + options.delimiter + className);
        });
    };
    $.fn.removeDependClass = function(className, delimiter) {
        var options = {
            delimiter: delimiter ? delimiter : '-'
        }
        return this.each(function() {
            var baseClass = $.baseClass(this);
            if (baseClass)
                $(this).removeClass(baseClass + options.delimiter + className);
        });
    };
    $.fn.toggleDependClass = function(className, delimiter) {
        var options = {
            delimiter: delimiter ? delimiter : '-'
        }
        return this.each(function() {
            var baseClass = $.baseClass(this);
            if (baseClass)
                if ($(this).is("." + baseClass + options.delimiter + className))
                    $(this).removeClass(baseClass + options.delimiter + className);
                else
                    $(this).addClass(baseClass + options.delimiter + className);
        });
    };
})(jQuery);;
(function() {
    Function.prototype.inheritFrom = function(b, c) {
        var d = function() {};
        d.prototype = b.prototype;
        this.prototype = new d();
        this.prototype.constructor = this;
        this.prototype.baseConstructor = b;
        this.prototype.superClass = b.prototype;
        if (c) {
            for (var a in c) {
                this.prototype[a] = c[a]
            }
        }
    };
    Number.prototype.jSliderNice = function(l) {
        var o = /^(-)?(\d+)([\.,](\d+))?$/;
        var d = Number(this);
        var j = String(d);
        var k;
        var c = "";
        var b = " ";
        if ((k = j.match(o))) {
            var f = k[2];
            var m = (k[4]) ? Number("0." + k[4]) : 0;
            if (m) {
                var e = Math.pow(10, (l) ? l : 2);
                m = Math.round(m * e);
                sNewDecPart = String(m);
                c = sNewDecPart;
                if (sNewDecPart.length < l) {
                    var a = l - sNewDecPart.length;
                    for (var g = 0; g < a; g++) {
                        c = "0" + c
                    }
                }
                c = "," + c
            } else {
                if (l && l != 0) {
                    for (var g = 0; g < l; g++) {
                        c += "0"
                    }
                    c = "," + c
                }
            }
            var h;
            if (Number(f) < 1000) {
                h = f + c
            } else {
                var n = "";
                var g;
                for (g = 1; g * 3 < f.length; g++) {
                    n = b + f.substring(f.length - g * 3, f.length - (g - 1) * 3) + n
                }
                h = f.substr(0, 3 - g * 3 + f.length) + n + c
            }
            if (k[1]) {
                return "-" + h
            } else {
                return h
            }
        } else {
            return j
        }
    };
    this.jSliderIsArray = function(a) {
        if (typeof a == "undefined") {
            return false
        }
        if (a instanceof Array || (!(a instanceof Object) && (Object.prototype.toString.call((a)) == "[object Array]") || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice"))) {
            return true
        }
        return false
    }
})();
(function() {
    var a = {};
    this.jSliderTmpl = function b(e, d) {
        var c = !(/\W/).test(e) ? a[e] = a[e] || b(e) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + e.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
        return d ? c(d) : c
    }
})();
(function(a) {
    this.Draggable = function() {
        this._init.apply(this, arguments)
    };
    Draggable.prototype = {
        oninit: function() {},
        events: function() {},
        onmousedown: function() {
            this.ptr.css({
                position: "absolute"
            })
        },
        onmousemove: function(c, b, d) {
            this.ptr.css({
                left: b,
                top: d
            })
        },
        onmouseup: function() {},
        isDefault: {
            drag: false,
            clicked: false,
            toclick: true,
            mouseup: false
        },
        _init: function() {
            if (arguments.length > 0) {
                this.ptr = a(arguments[0]);
                this.outer = a(".draggable-outer");
                this.is = {};
                a.extend(this.is, this.isDefault);
                var b = this.ptr.offset();
                this.d = {
                    left: b.left,
                    top: b.top,
                    width: this.ptr.width(),
                    height: this.ptr.height()
                };
                this.oninit.apply(this, arguments);
                this._events()
            }
        },
        _getPageCoords: function(b) {
            if (b.targetTouches && b.targetTouches[0]) {
                return {
                    x: b.targetTouches[0].pageX,
                    y: b.targetTouches[0].pageY
                }
            } else {
                return {
                    x: b.pageX,
                    y: b.pageY
                }
            }
        },
        _bindEvent: function(e, c, d) {
            var b = this;
            if (this.supportTouches_) {
                e.get(0).addEventListener(this.events_[c], d, false)
            } else {
                e.bind(this.events_[c], d)
            }
        },
        _events: function() {
            var b = this;
            this.supportTouches_ = (a.browser.webkit && navigator.userAgent.indexOf("Mobile") != -1);
            this.events_ = {
                click: this.supportTouches_ ? "touchstart" : "click",
                down: this.supportTouches_ ? "touchstart" : "mousedown",
                move: this.supportTouches_ ? "touchmove" : "mousemove",
                up: this.supportTouches_ ? "touchend" : "mouseup"
            };
            this._bindEvent(a(document), "move", function(c) {
                if (b.is.drag) {
                    c.stopPropagation();
                    c.preventDefault();
                    b._mousemove(c)
                }
            });
            this._bindEvent(a(document), "down", function(c) {
                if (b.is.drag) {
                    c.stopPropagation();
                    c.preventDefault()
                }
            });
            this._bindEvent(a(document), "up", function(c) {
                b._mouseup(c)
            });
            this._bindEvent(this.ptr, "down", function(c) {
                b._mousedown(c);
                return false
            });
            this._bindEvent(this.ptr, "up", function(c) {
                b._mouseup(c)
            });
            this.ptr.find("a").click(function() {
                b.is.clicked = true;
                if (!b.is.toclick) {
                    b.is.toclick = true;
                    return false
                }
            }).mousedown(function(c) {
                b._mousedown(c);
                return false
            });
            this.events()
        },
        _mousedown: function(b) {
            this.is.drag = true;
            this.is.clicked = false;
            this.is.mouseup = false;
            var c = this.ptr.offset();
            var d = this._getPageCoords(b);
            this.cx = d.x - c.left;
            this.cy = d.y - c.top;
            a.extend(this.d, {
                left: c.left,
                top: c.top,
                width: this.ptr.width(),
                height: this.ptr.height()
            });
            if (this.outer && this.outer.get(0)) {
                this.outer.css({
                    height: Math.max(this.outer.height(), a(document.body).height()),
                    overflow: "hidden"
                })
            }
            this.onmousedown(b)
        },
        _mousemove: function(b) {
            this.is.toclick = false;
            var c = this._getPageCoords(b);
            this.onmousemove(b, c.x - this.cx, c.y - this.cy)
        },
        _mouseup: function(b) {
            var c = this;
            if (this.is.drag) {
                this.is.drag = false;
                if (this.outer && this.outer.get(0)) {
                    if (a.browser.mozilla) {
                        this.outer.css({
                            overflow: "hidden"
                        })
                    } else {
                        this.outer.css({
                            overflow: "visible"
                        })
                    }
                    if (a.browser.msie && a.browser.version == "6.0") {
                        this.outer.css({
                            height: "100%"
                        })
                    } else {
                        this.outer.css({
                            height: "auto"
                        })
                    }
                }
                this.onmouseup(b)
            }
        }
    }
})(jQuery);
(function(b) {
    b.slider = function(f, e) {
        var d = b(f);
        if (!d.data("jslider")) {
            d.data("jslider", new jSlider(f, e))
        }
        return d.data("jslider")
    };
    b.fn.slider = function(h, e) {
        var g, f = arguments;

        function d(j) {
            return j !== undefined
        }

        function i(j) {
            return j != null
        }
        this.each(function() {
            var k = b.slider(this, h);
            if (typeof h == "string") {
                switch (h) {
                    case "value":
                        if (d(f[1]) && d(f[2])) {
                            var j = k.getPointers();
                            if (i(j[0]) && i(f[1])) {
                                j[0].set(f[1]);
                                j[0].setIndexOver()
                            }
                            if (i(j[1]) && i(f[2])) {
                                j[1].set(f[2]);
                                j[1].setIndexOver()
                            }
                        } else {
                            if (d(f[1])) {
                                var j = k.getPointers();
                                if (i(j[0]) && i(f[1])) {
                                    j[0].set(f[1]);
                                    j[0].setIndexOver()
                                }
                            } else {
                                g = k.getValue()
                            }
                        }
                        break;
                    case "prc":
                        if (d(f[1]) && d(f[2])) {
                            var j = k.getPointers();
                            if (i(j[0]) && i(f[1])) {
                                j[0]._set(f[1]);
                                j[0].setIndexOver()
                            }
                            if (i(j[1]) && i(f[2])) {
                                j[1]._set(f[2]);
                                j[1].setIndexOver()
                            }
                        } else {
                            if (d(f[1])) {
                                var j = k.getPointers();
                                if (i(j[0]) && i(f[1])) {
                                    j[0]._set(f[1]);
                                    j[0].setIndexOver()
                                }
                            } else {
                                g = k.getPrcValue()
                            }
                        }
                        break;
                    case "calculatedValue":
                        var m = k.getValue().split(";");
                        g = "";
                        for (var l = 0; l < m.length; l++) {
                            g += (l > 0 ? ";" : "") + k.nice(m[l])
                        }
                        break;
                    case "skin":
                        k.setSkin(f[1]);
                        break
                }
            } else {
                if (!h && !e) {
                    if (!jSliderIsArray(g)) {
                        g = []
                    }
                    g.push(slider)
                }
            }
        });
        if (jSliderIsArray(g) && g.length == 1) {
            g = g[0]
        }
        return g || this
    };
    var c = {
        settings: {
            from: 1,
            to: 10,
            step: 1,
            smooth: true,
            limits: true,
            round: 0,
            value: "5;7",
            dimension: ""
        },
        className: "jslider",
        selector: ".jslider-",
        template: jSliderTmpl('<span class="<%=className%>"><table><tr><td><div class="<%=className%>-bg"><i class="l"><i></i></i><i class="r"><i></i></i><i class="v"><i></i></i></div><div class="<%=className%>-pointer"><i></i></div><div class="<%=className%>-pointer <%=className%>-pointer-to"><i></i></div><div class="<%=className%>-label"><span><%=settings.from%></span></div><div class="<%=className%>-label <%=className%>-label-to"><span><%=settings.to%></span><%=settings.dimension%></div><div class="<%=className%>-value" style="visibility:hidden"><span></span><%=settings.dimension%></div><div class="<%=className%>-value <%=className%>-value-to"><span></span><%=settings.dimension%></div><div class="<%=className%>-scale"><%=scale%></div></td></tr></table></span>')
    };
    this.jSlider = function() {
        return this.init.apply(this, arguments)
    };
    jSlider.prototype = {
        init: function(e, d) {
            this.settings = b.extend(true, {}, c.settings, d ? d : {});
            this.inputNode = b(e).hide();
            this.settings.interval = this.settings.to - this.settings.from;
            this.settings.value = this.inputNode.attr("value");
            if (this.settings.calculate && b.isFunction(this.settings.calculate)) {
                this.nice = this.settings.calculate
            }
            if (this.settings.onstatechange && b.isFunction(this.settings.onstatechange)) {
                this.onstatechange = this.settings.onstatechange
            }
            this.is = {
                init: false
            };
            this.o = {};
            this.create()
        },
        onstatechange: function() {},
        create: function() {
            var d = this;
            this.domNode = b(c.template({
                className: c.className,
                settings: {
                    from: this.nice(this.settings.from),
                    to: this.nice(this.settings.to),
                    dimension: this.settings.dimension
                },
                scale: this.generateScale()
            }));
            this.inputNode.after(this.domNode);
            this.drawScale();
            if (this.settings.skin && this.settings.skin.length > 0) {
                this.setSkin(this.settings.skin)
            }
            this.sizes = {
                domWidth: this.domNode.width(),
                domOffset: this.domNode.offset()
            };
            b.extend(this.o, {
                pointers: {},
                labels: {
                    0: {
                        o: this.domNode.find(c.selector + "value").not(c.selector + "value-to")
                    },
                    1: {
                        o: this.domNode.find(c.selector + "value").filter(c.selector + "value-to")
                    }
                },
                limits: {
                    0: this.domNode.find(c.selector + "label").not(c.selector + "label-to"),
                    1: this.domNode.find(c.selector + "label").filter(c.selector + "label-to")
                }
            });
            b.extend(this.o.labels[0], {
                value: this.o.labels[0].o.find("span")
            });
            b.extend(this.o.labels[1], {
                value: this.o.labels[1].o.find("span")
            });
            if (!d.settings.value.split(";")[1]) {
                this.settings.single = true;
                this.domNode.addDependClass("single")
            }
            if (!d.settings.limits) {
                this.domNode.addDependClass("limitless")
            }
            this.domNode.find(c.selector + "pointer").each(function(e) {
                var g = d.settings.value.split(";")[e];
                if (g) {
                    d.o.pointers[e] = new a(this, e, d);
                    var f = d.settings.value.split(";")[e - 1];
                    if (f && new Number(g) < new Number(f)) {
                        g = f
                    }
                    g = g < d.settings.from ? d.settings.from : g;
                    g = g > d.settings.to ? d.settings.to : g;
                    d.o.pointers[e].set(g, true)
                }
            });
            this.o.value = this.domNode.find(".v");
            this.is.init = true;
            b.each(this.o.pointers, function(e) {
                d.redraw(this)
            });
            (function(e) {
                b(window).resize(function() {
                    e.onresize()
                })
            })(this)
        },
        setSkin: function(d) {
            if (this.skin_) {
                this.domNode.removeDependClass(this.skin_, "_")
            }
            this.domNode.addDependClass(this.skin_ = d, "_")
        },
        setPointersIndex: function(d) {
            b.each(this.getPointers(), function(e) {
                this.index(e)
            })
        },
        getPointers: function() {
            return this.o.pointers
        },
        generateScale: function() {
            if (this.settings.scale && this.settings.scale.length > 0) {
                var f = "";
                var e = this.settings.scale;
                var g = Math.round((100 / (e.length - 1)) * 10) / 10;
                for (var d = 0; d < e.length; d++) {
                    f += '<span style="left: ' + d * g + '%">' + (e[d] != "|" ? "<ins>" + e[d] + "</ins>" : "") + "</span>"
                }
                return f
            } else {
                return ""
            }
            return ""
        },
        drawScale: function() {
            this.domNode.find(c.selector + "scale span ins").each(function() {
                b(this).css({
                    marginLeft: -b(this).outerWidth() / 2
                })
            })
        },
        onresize: function() {
            var d = this;
            this.sizes = {
                domWidth: this.domNode.width(),
                domOffset: this.domNode.offset()
            };
            b.each(this.o.pointers, function(e) {
                d.redraw(this)
            })
        },
        limits: function(d, g) {
            if (!this.settings.smooth) {
                var f = this.settings.step * 100 / (this.settings.interval);
                d = Math.round(d / f) * f
            }
            var e = this.o.pointers[1 - g.uid];
            if (e && g.uid && d < e.value.prc) {
                d = e.value.prc
            }
            if (e && !g.uid && d > e.value.prc) {
                d = e.value.prc
            }
            if (d < 0) {
                d = 0
            }
            if (d > 100) {
                d = 100
            }
            return Math.round(d * 10) / 10
        },
        redraw: function(d) {
            if (!this.is.init) {
                return false
            }
            this.setValue();
            if (this.o.pointers[0] && this.o.pointers[1]) {
                this.o.value.css({
                    left: this.o.pointers[0].value.prc + "%",
                    width: (this.o.pointers[1].value.prc - this.o.pointers[0].value.prc) + "%"
                })
            }
            this.o.labels[d.uid].value.html(this.nice(d.value.origin));
            this.redrawLabels(d)
        },
        redrawLabels: function(j) {
            function f(l, m, n) {
                m.margin = -m.label / 2;
                label_left = m.border + m.margin;
                if (label_left < 0) {
                    m.margin -= label_left
                }
                if (m.border + m.label / 2 > e.sizes.domWidth) {
                    m.margin = 0;
                    m.right = true
                } else {
                    m.right = false
                }
                l.o.css({
                    left: n + "%",
                    marginLeft: m.margin,
                    right: "auto"
                });
                if (m.right) {
                    l.o.css({
                        left: "auto",
                        right: 0
                    })
                }
                return m
            }
            var e = this;
            var g = this.o.labels[j.uid];
            var k = j.value.prc;
            var h = {
                label: g.o.outerWidth(),
                right: false,
                border: (k * this.sizes.domWidth) / 100
            };
            if (!this.settings.single) {
                var d = this.o.pointers[1 - j.uid];
                var i = this.o.labels[d.uid];
                switch (j.uid) {
                    case 0:
                        if (h.border + h.label / 2 > i.o.offset().left - this.sizes.domOffset.left) {
                            i.o.css({
                                visibility: "hidden"
                            });
                            i.value.html(this.nice(d.value.origin));
                            g.o.css({
                                visibility: "visible"
                            });
                            k = (d.value.prc - k) / 2 + k;
                            if (d.value.prc != j.value.prc) {
                                g.value.html(this.nice(j.value.origin) + "&nbsp;&ndash;&nbsp;" + this.nice(d.value.origin));
                                h.label = g.o.outerWidth();
                                h.border = (k * this.sizes.domWidth) / 100
                            }
                        } else {
                            i.o.css({
                                visibility: "visible"
                            })
                        }
                        break;
                    case 1:
                        if (h.border - h.label / 2 < i.o.offset().left - this.sizes.domOffset.left + i.o.outerWidth()) {
                            i.o.css({
                                visibility: "hidden"
                            });
                            i.value.html(this.nice(d.value.origin));
                            g.o.css({
                                visibility: "visible"
                            });
                            k = (k - d.value.prc) / 2 + d.value.prc;
                            if (d.value.prc != j.value.prc) {
                                g.value.html(this.nice(d.value.origin) + "&nbsp;&ndash;&nbsp;" + this.nice(j.value.origin));
                                h.label = g.o.outerWidth();
                                h.border = (k * this.sizes.domWidth) / 100
                            }
                        } else {
                            i.o.css({
                                visibility: "visible"
                            })
                        }
                        break
                }
            }
            h = f(g, h, k);
            if (i) {
                var h = {
                    label: i.o.outerWidth(),
                    right: false,
                    border: (d.value.prc * this.sizes.domWidth) / 100
                };
                h = f(i, h, d.value.prc)
            }
            this.redrawLimits()
        },
        redrawLimits: function() {
            if (this.settings.limits) {
                var f = [true, true];
                for (key in this.o.pointers) {
                    if (!this.settings.single || key == 0) {
                        var j = this.o.pointers[key];
                        var e = this.o.labels[j.uid];
                        var h = e.o.offset().left - this.sizes.domOffset.left;
                        var d = this.o.limits[0];
                        if (h < d.outerWidth()) {
                            f[0] = false
                        }
                        var d = this.o.limits[1];
                        if (h + e.o.outerWidth() > this.sizes.domWidth - d.outerWidth()) {
                            f[1] = false
                        }
                    }
                }
                for (var g = 0; g < f.length; g++) {
                    if (f[g]) {
                        this.o.limits[g].fadeIn("fast")
                    } else {
                        this.o.limits[g].fadeOut("fast")
                    }
                }
            }
        },
        setValue: function() {
            var d = this.getValue();
            this.inputNode.attr("value", d);
            this.onstatechange.call(this, d)
        },
        getValue: function() {
            if (!this.is.init) {
                return false
            }
            var e = this;
            var d = "";
            b.each(this.o.pointers, function(f) {
                if (this.value.prc != undefined && !isNaN(this.value.prc)) {
                    d += (f > 0 ? ";" : "") + e.prcToValue(this.value.prc)
                }
            });
            return d
        },
        getPrcValue: function() {
            if (!this.is.init) {
                return false
            }
            var e = this;
            var d = "";
            b.each(this.o.pointers, function(f) {
                if (this.value.prc != undefined && !isNaN(this.value.prc)) {
                    d += (f > 0 ? ";" : "") + this.value.prc
                }
            });
            return d
        },
        prcToValue: function(l) {
            if (this.settings.heterogeneity && this.settings.heterogeneity.length > 0) {
                var g = this.settings.heterogeneity;
                var f = 0;
                var k = this.settings.from;
                for (var e = 0; e <= g.length; e++) {
                    if (g[e]) {
                        var d = g[e].split("/")
                    } else {
                        var d = [100, this.settings.to]
                    }
                    d[0] = new Number(d[0]);
                    d[1] = new Number(d[1]);
                    if (l >= f && l <= d[0]) {
                        var j = k + ((l - f) * (d[1] - k)) / (d[0] - f)
                    }
                    f = d[0];
                    k = d[1]
                }
            } else {
                var j = this.settings.from + (l * this.settings.interval) / 100
            }
            return this.round(j)
        },
        valueToPrc: function(j, l) {
            if (this.settings.heterogeneity && this.settings.heterogeneity.length > 0) {
                var g = this.settings.heterogeneity;
                var f = 0;
                var k = this.settings.from;
                for (var e = 0; e <= g.length; e++) {
                    if (g[e]) {
                        var d = g[e].split("/")
                    } else {
                        var d = [100, this.settings.to]
                    }
                    d[0] = new Number(d[0]);
                    d[1] = new Number(d[1]);
                    if (j >= k && j <= d[1]) {
                        var m = l.limits(f + (j - k) * (d[0] - f) / (d[1] - k))
                    }
                    f = d[0];
                    k = d[1]
                }
            } else {
                var m = l.limits((j - this.settings.from) * 100 / this.settings.interval)
            }
            return m
        },
        round: function(d) {
            d = Math.round(d / this.settings.step) * this.settings.step;
            if (this.settings.round) {
                d = Math.round(d * Math.pow(10, this.settings.round)) / Math.pow(10, this.settings.round)
            } else {
                d = Math.round(d)
            }
            return d
        },
        nice: function(d) {
            d = d.toString().replace(/,/gi, ".");
            d = d.toString().replace(/ /gi, "");
            if (Number.prototype.jSliderNice) {
                return (new Number(d)).jSliderNice(this.settings.round).replace(/-/gi, "&minus;")
            } else {
                return new Number(d)
            }
        }
    };

    function a() {
        this.baseConstructor.apply(this, arguments)
    }
    a.inheritFrom(Draggable, {
        oninit: function(f, e, d) {
            this.uid = e;
            this.parent = d;
            this.value = {};
            this.settings = this.parent.settings
        },
        onmousedown: function(d) {
            this._parent = {
                offset: this.parent.domNode.offset(),
                width: this.parent.domNode.width()
            };
            this.ptr.addDependClass("hover");
            this.setIndexOver()
        },
        onmousemove: function(e, d) {
            var f = this._getPageCoords(e);
            this._set(this.calc(f.x))
        },
        onmouseup: function(d) {
            if (this.parent.settings.callback && b.isFunction(this.parent.settings.callback)) {
                this.parent.settings.callback.call(this.parent, this.parent.getValue())
            }
            this.ptr.removeDependClass("hover")
        },
        setIndexOver: function() {
            this.parent.setPointersIndex(1);
            this.index(2)
        },
        index: function(d) {
            this.ptr.css({
                zIndex: d
            })
        },
        limits: function(d) {
            return this.parent.limits(d, this)
        },
        calc: function(e) {
            var d = this.limits(((e - this._parent.offset.left) * 100) / this._parent.width);
            return d
        },
        set: function(d, e) {
            this.value.origin = this.parent.round(d);
            this._set(this.parent.valueToPrc(d, this), e)
        },
        _set: function(e, d) {
            if (!d) {
                this.value.origin = this.parent.prcToValue(e)
            }
            this.value.prc = e;
            this.ptr.css({
                left: e + "%"
            });
            this.parent.redraw(this)
        }
    })
})(jQuery);;
(function($) {
    var PREFIX = 'data-',
        PATTERN = /^data\-(.*)$/;

    function dataset(name, value) {
        if (value !== undefined) {
            return this.attr(PREFIX + name, value);
        }
        switch (typeof name) {
            case 'string':
                return this.attr(PREFIX + name);
            case 'object':
                return set_items.call(this, name);
            case 'undefined':
                return get_items.call(this);
            default:
                throw 'dataset: invalid argument ' + name;
        }
    }

    function get_items() {
        return this.foldAttr(function(index, attr, result) {
            var match = PATTERN.exec(this.name);
            if (match) result[match[1]] = this.value;
        });
    }

    function set_items(items) {
        for (var key in items) {
            this.attr(PREFIX + key, items[key]);
        }
        return this;
    }

    function remove(name) {
        if (typeof name == 'string') {
            return this.removeAttr(PREFIX + name);
        }
        return remove_names(name);
    }

    function remove_names(obj) {
        var idx, length = obj && obj.length;
        if (length === undefined) {
            for (idx in obj) {
                this.removeAttr(PREFIX + idx);
            }
        } else {
            for (idx = 0; idx < length; idx++) {
                this.removeAttr(PREFIX + obj[idx]);
            }
        }
        return this;
    }
    $.fn.dataset = dataset;
    $.fn.removeDataset = remove_names;
})(jQuery);
(function($) {
    function each_attr(proc) {
        if (this.length > 0) {
            $.each(this[0].attributes, proc);
        }
        return this;
    }

    function fold_attr(proc, acc) {
        return fold((this.length > 0) && this[0].attributes, proc, acc);
    }

    function fold(object, proc, acc) {
        var length = object && object.length;
        if (acc === undefined) acc = {};
        if (!object) return acc;
        if (length !== undefined) {
            for (var i = 0, value = object[i];
                (i < length) && (proc.call(value, i, value, acc) !== false); value = object[++i]) {}
        } else {
            for (var name in object) {
                if (proc.call(object[name], name, object[name], acc) === false) break;
            }
        }
        return acc;
    }

    function fold_jquery(proc, acc) {
        if (acc === undefined) acc = [];
        return fold(this, proc, acc);
    }
    $.fn.eachAttr = each_attr;
    $.fn.foldAttr = fold_attr;
    $.fn.fold = fold_jquery;
    $.fold = fold;
})(jQuery);;
(function($) {
    $.fn.hoverIntent = function(f, g) {
        var cfg = {
            sensitivity: 7,
            interval: 100,
            timeout: 0
        };
        cfg = $.extend(cfg, g ? {
            over: f,
            out: g
        } : f);
        var cX, cY, pX, pY;
        var track = function(ev) {
            cX = ev.pageX;
            cY = ev.pageY;
        };
        var compare = function(ev, ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < cfg.sensitivity) {
                $(ob).unbind("mousemove", track);
                ob.hoverIntent_s = 1;
                return cfg.over.apply(ob, [ev]);
            } else {
                pX = cX;
                pY = cY;
                ob.hoverIntent_t = setTimeout(function() {
                    compare(ev, ob);
                }, cfg.interval);
            }
        };
        var delay = function(ev, ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = 0;
            return cfg.out.apply(ob, [ev]);
        };
        var handleHover = function(e) {
            var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
            while (p && p != this) {
                try {
                    p = p.parentNode;
                } catch (e) {
                    p = this;
                }
            }
            if (p == this) {
                return false;
            }
            var ev = jQuery.extend({}, e);
            var ob = this;
            if (ob.hoverIntent_t) {
                ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            }
            if (e.type == "mouseover") {
                pX = ev.pageX;
                pY = ev.pageY;
                $(ob).bind("mousemove", track);
                if (ob.hoverIntent_s != 1) {
                    ob.hoverIntent_t = setTimeout(function() {
                        compare(ev, ob);
                    }, cfg.interval);
                }
            } else {
                $(ob).unbind("mousemove", track);
                if (ob.hoverIntent_s == 1) {
                    ob.hoverIntent_t = setTimeout(function() {
                        delay(ev, ob);
                    }, cfg.timeout);
                }
            }
        };
        return this.mouseover(handleHover).mouseout(handleHover);
    };
})(jQuery);;

(function(d) {
    var g = document.createElement("input");
    d.extend(d.support, {
        placeholder: !!("placeholder" in g)
    });
    d.fn.addPlaceholder = function(g) {
        function h(a, c) {
            if (f(a.val()) || a.val() == c) a.val(c), a.addClass(b["class"]);
            a.focusin(function() {
                a.hasClass(b["class"]) && (a.removeClass(b["class"]), a.val(""))
            });
            a.focusout(function() {
                f(a.val()) && (a.val(c), a.addClass(b["class"]))
            })
        }

        function i(a, c) {
            a.addClass(b["class"]);
            var e = d("<span/>", {
                "class": a.attr("class") + " " + b["class"],
                text: c,
                css: {
                    border: "none",
                    cursor: "text",
                    background: "transparent",
                    position: "absolute",
                    top: a.position().top,
                    left: a.position().left,
                    lineHeight: a.height() + 3 + "px",
                    paddingLeft: parseFloat(a.css("paddingLeft")) + 2 + "px"
                }
            }).insertAfter(a);
            a.focusin(function() {
                a.hasClass(b["class"]) && (e.hide(), a.removeClass(b["class"]))
            });
            a.focusout(function() {
                f(a.val()) && (e.show(), a.addClass(b["class"]))
            });
            b.checkafill && function j() {
                !f(a.val()) && a.hasClass(b["class"]) && a.focusin();
                setTimeout(j, 250)
            }()
        }

        function f(a) {
            return b.allowspaces ? a === "" : d.trim(a) === ""
        }
        var b = {
            "class": "placeholder",
            allowspaces: !1,
            dopass: !0,
            dotextarea: !0,
            checkafill: !1
        };
        return this.each(function() {
            if (d.support.placeholder) return !1;
            d.extend(b, g);
            if (!(this.tagName.toLowerCase() == "input" || b.dotextarea && this.tagName.toLowerCase() == "textarea")) return !0;
            var a = d(this),
                c = this.getAttribute("placeholder"),
                e = a.is("input[type=password]");
            if (!c) return !0;
            b.dopass && e ? i(a, c) : e || h(a, c)
        })
    }
})(jQuery);;
(function(f, h, i) {
    function k(a, c) {
        var b = (a[0] || 0) - (c[0] || 0);
        return b > 0 || !b && a.length > 0 && k(a.slice(1), c.slice(1))
    }

    function l(a) {
        if (typeof a != g) return a;
        var c = [],
            b = "";
        for (var d in a) {
            b = typeof a[d] == g ? l(a[d]) : [d, m ? encodeURI(a[d]) : a[d]].join("=");
            c.push(b)
        }
        return c.join("&")
    }

    function n(a) {
        var c = [];
        for (var b in a) a[b] && c.push([b, '="', a[b], '"'].join(""));
        return c.join(" ")
    }

    function o(a) {
        var c = [];
        for (var b in a) c.push(['<param name="', b, '" value="', l(a[b]), '" />'].join(""));
        return c.join("")
    }
    var g = "object",
        m = true;
    try {
        var j = i.description || function() {
            return (new i("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")
        }()
    } catch (p) {
        j = "Unavailable"
    }
    var e = j.match(/\d+/g) || [0];
    f[h] = {
        available: e[0] > 0,
        activeX: i && !i.name,
        version: {
            original: j,
            array: e,
            string: e.join("."),
            major: parseInt(e[0], 10) || 0,
            minor: parseInt(e[1], 10) || 0,
            release: parseInt(e[2], 10) || 0
        },
        hasVersion: function(a) {
            a = /string|number/.test(typeof a) ? a.toString().split(".") : /object/.test(typeof a) ? [a.major, a.minor] : a || [0, 0];
            return k(e, a)
        },
        encodeParams: true,
        expressInstall: "expressInstall.swf",
        expressInstallIsActive: false,
        create: function(a) {
            if (!a.swf || this.expressInstallIsActive || !this.available && !a.hasVersionFail) return false;
            if (!this.hasVersion(a.hasVersion || 1)) {
                this.expressInstallIsActive = true;
                if (typeof a.hasVersionFail == "function")
                    if (!a.hasVersionFail.apply(a)) return false;
                a = {
                    swf: a.expressInstall || this.expressInstall,
                    height: 137,
                    width: 214,
                    flashvars: {
                        MMredirectURL: location.href,
                        MMplayerType: this.activeX ? "ActiveX" : "PlugIn",
                        MMdoctitle: document.title.slice(0, 47) + " - Flash Player Installation"
                    }
                }
            }
            attrs = {
                data: a.swf,
                type: "application/x-shockwave-flash",
                id: a.id || "flash_" + Math.floor(Math.random() * 999999999),
                width: a.width || 320,
                height: a.height || 180,
                style: a.style || ""
            };
            m = typeof a.useEncode !== "undefined" ? a.useEncode : this.encodeParams;
            a.movie = a.swf;
            a.wmode = a.wmode || "opaque";
            delete a.fallback;
            delete a.hasVersion;
            delete a.hasVersionFail;
            delete a.height;
            delete a.id;
            delete a.swf;
            delete a.useEncode;
            delete a.width;
            var c = document.createElement("div");
            c.innerHTML = ["<object ", n(attrs), ">", o(a), "</object>"].join("");
            return c.firstChild
        }
    };
    f.fn[h] = function(a) {
        var c = this.find(g).andSelf().filter(g);
        /string|object/.test(typeof a) && this.each(function() {
            var b = f(this),
                d;
            a = typeof a == g ? a : {
                swf: a
            };
            a.fallback = this;
            if (d = f[h].create(a)) {
                b.children().remove();
                b.html(d)
            }
        });
        typeof a == "function" && c.each(function() {
            var b = this;
            b.jsInteractionTimeoutMs = b.jsInteractionTimeoutMs || 0;
            if (b.jsInteractionTimeoutMs < 660) b.clientWidth || b.clientHeight ? a.call(b) : setTimeout(function() {
                f(b)[h](a)
            }, b.jsInteractionTimeoutMs + 66)
        });
        return c
    }
})(jQuery, "flash", navigator.plugins["Shockwave Flash"] || window.ActiveXObject);;

var isIE = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

function ControlVersion() {
    var version;
    var axo;
    var e;
    try {
        axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
        version = axo.GetVariable("$version");
    } catch (e) {}
    if (!version) {
        try {
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
            version = "WIN 6,0,21,0";
            axo.AllowScriptAccess = "always";
            version = axo.GetVariable("$version");
        } catch (e) {}
    }
    if (!version) {
        try {
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            version = axo.GetVariable("$version");
        } catch (e) {}
    }
    if (!version) {
        try {
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            version = "WIN 3,0,18,0";
        } catch (e) {}
    }
    if (!version) {
        try {
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            version = "WIN 2,0,0,11";
        } catch (e) {
            version = -1;
        }
    }
    return version;
}

function GetSwfVer() {
    var flashVer = -1;
    if (navigator.plugins != null && navigator.plugins.length > 0) {
        if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
            var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
            var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
            var descArray = flashDescription.split(" ");
            var tempArrayMajor = descArray[2].split(".");
            var versionMajor = tempArrayMajor[0];
            var versionMinor = tempArrayMajor[1];
            var versionRevision = descArray[3];
            if (versionRevision == "") {
                versionRevision = descArray[4];
            }
            if (versionRevision[0] == "d") {
                versionRevision = versionRevision.substring(1);
            } else if (versionRevision[0] == "r") {
                versionRevision = versionRevision.substring(1);
                if (versionRevision.indexOf("d") > 0) {
                    versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
                }
            }
            var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
        }
    } else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
    else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
    else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
    else if (isIE && isWin && !isOpera) {
        flashVer = ControlVersion();
    }
    return flashVer;
}

function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision) {
    versionStr = GetSwfVer();
    if (versionStr == -1) {
        return false;
    } else if (versionStr != 0) {
        if (isIE && isWin && !isOpera) {
            tempArray = versionStr.split(" ");
            tempString = tempArray[1];
            versionArray = tempString.split(",");
        } else {
            versionArray = versionStr.split(".");
        }
        var versionMajor = versionArray[0];
        var versionMinor = versionArray[1];
        var versionRevision = versionArray[2];
        if (versionMajor > parseFloat(reqMajorVer)) {
            return true;
        } else if (versionMajor == parseFloat(reqMajorVer)) {
            if (versionMinor > parseFloat(reqMinorVer))
                return true;
            else if (versionMinor == parseFloat(reqMinorVer)) {
                if (versionRevision >= parseFloat(reqRevision))
                    return true;
            }
        }
        return false;
    }
}

function AC_AddExtension(src, ext) {
    if (src.indexOf('?') != -1)
        return src.replace(/\?/, ext + '?');
    else
        return src + ext;
}

function AC_Generateobj(objAttrs, params, embedAttrs) {
    var str = '';
    if (isIE && isWin && !isOpera) {
        str += '<object ';
        for (var i in objAttrs) {
            str += i + '="' + objAttrs[i] + '" ';
        }
        str += '>';
        for (var i in params) {
            str += '<param name="' + i + '" value="' + params[i] + '" /> ';
        }
        str += '</object>';
    } else {
        str += '<embed ';
        for (var i in embedAttrs) {
            str += i + '="' + embedAttrs[i] + '" ';
        }
        str += '> </embed>';
    }
    document.write(str);
}

function AC_FL_RunContent() {
    var ret = AC_GetArgs(arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000", "application/x-shockwave-flash");
    AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_SW_RunContent() {
    var ret = AC_GetArgs(arguments, ".dcr", "src", "clsid:166B1BCA-3F9C-11CF-8075-444553540000", null);
    AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType) {
    var ret = new Object();
    ret.embedAttrs = new Object();
    ret.params = new Object();
    ret.objAttrs = new Object();
    for (var i = 0; i < args.length; i = i + 2) {
        var currArg = args[i].toLowerCase();
        switch (currArg) {
            case "classid":
                break;
            case "pluginspage":
                ret.embedAttrs[args[i]] = args[i + 1];
                break;
            case "src":
            case "movie":
                if (args[i + 1].indexOf('youtube') == -1) {
                    args[i + 1] = AC_AddExtension(args[i + 1], ext);
                } else {
                    args[i + 1] = args[i + 1] + "&version=3";
                }
                ret.embedAttrs["src"] = args[i + 1];
                ret.params[srcParamName] = args[i + 1];
                break;
            case "srcexternal":
                ret.embedAttrs["src"] = args[i + 1];
                ret.params[srcParamName] = args[i + 1];
                break;
            case "onafterupdate":
            case "onbeforeupdate":
            case "onblur":
            case "oncellchange":
            case "onclick":
            case "ondblclick":
            case "ondrag":
            case "ondragend":
            case "ondragenter":
            case "ondragleave":
            case "ondragover":
            case "ondrop":
            case "onfinish":
            case "onfocus":
            case "onhelp":
            case "onmousedown":
            case "onmouseup":
            case "onmouseover":
            case "onmousemove":
            case "onmouseout":
            case "onkeypress":
            case "onkeydown":
            case "onkeyup":
            case "onload":
            case "onlosecapture":
            case "onpropertychange":
            case "onreadystatechange":
            case "onrowsdelete":
            case "onrowenter":
            case "onrowexit":
            case "onrowsinserted":
            case "onstart":
            case "onscroll":
            case "onbeforeeditfocus":
            case "onactivate":
            case "onbeforedeactivate":
            case "ondeactivate":
            case "type":
            case "codebase":
            case "id":
                ret.objAttrs[args[i]] = args[i + 1];
                break;
            case "width":
            case "height":
            case "align":
            case "vspace":
            case "hspace":
            case "class":
            case "title":
            case "accesskey":
            case "name":
            case "tabindex":
                ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i + 1];
                break;
            default:
                ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i + 1];
        }
    }
    ret.objAttrs["classid"] = classid;
    if (mimeType) ret.embedAttrs["type"] = mimeType;
    return ret;
}

function validate() {
    return "true"
};;

(function(a, b, c) {
    function D(b) {
        var c = this,
            d = b.elements,
            e = d.tooltip,
            f = ".bgiframe-" + b.id;
        a.extend(c, {
            init: function() {
                d.bgiframe = a('<iframe class="ui-tooltip-bgiframe" frameborder="0" tabindex="-1" src="javascript:\'\';"  style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=0); -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";"></iframe>'), d.bgiframe.appendTo(e), e.bind("tooltipmove" + f, c.adjust)
            },
            adjust: function() {
                var a = b.get("dimensions"),
                    c = b.plugins.tip,
                    f = d.tip,
                    g, h;
                h = parseInt(e.css("border-left-width"), 10) || 0, h = {
                    left: -h,
                    top: -h
                }, c && f && (g = c.corner.precedance === "x" ? ["width", "left"] : ["height", "top"], h[g[1]] -= f[g[0]]()), d.bgiframe.css(h).css(a)
            },
            destroy: function() {
                d.bgiframe.remove(), e.unbind(f)
            }
        }), c.init()
    }

    function C(b, g) {
        function w(a) {
            var b = a.precedance === "y",
                c = n[b ? "width" : "height"],
                d = n[b ? "height" : "width"],
                e = a.string().indexOf("center") > -1,
                f = c * (e ? .5 : 1),
                g = Math.pow,
                h = Math.round,
                i, j, k, l = Math.sqrt(g(f, 2) + g(d, 2)),
                m = [p / f * l, p / d * l];
            m[2] = Math.sqrt(g(m[0], 2) - g(p, 2)), m[3] = Math.sqrt(g(m[1], 2) - g(p, 2)), i = l + m[2] + m[3] + (e ? 0 : m[0]), j = i / l, k = [h(j * d), h(j * c)];
            return {
                height: k[b ? 0 : 1],
                width: k[b ? 1 : 0]
            }
        }

        function v(b) {
            var c = k.titlebar && b.y === "top",
                d = c ? k.titlebar : k.content,
                e = a.browser.mozilla,
                f = e ? "-moz-" : a.browser.webkit ? "-webkit-" : "",
                g = b.y + (e ? "" : "-") + b.x,
                h = f + (e ? "border-radius-" + g : "border-" + g + "-radius");
            return parseInt(d.css(h), 10) || parseInt(l.css(h), 10) || 0
        }

        function u(a, b, c) {
            b = b ? b : a[a.precedance];
            var d = l.hasClass(r),
                e = k.titlebar && a.y === "top",
                f = e ? k.titlebar : k.content,
                g = "border-" + b + "-width",
                h;
            l.addClass(r), h = parseInt(f.css(g), 10), h = (c ? h || parseInt(l.css(g), 10) : h) || 0, l.toggleClass(r, d);
            return h
        }

        function t(f, g, h, l) {
            if (k.tip) {
                var n = a.extend({}, i.corner),
                    o = h.adjusted,
                    p = b.options.position.adjust.method.split(" "),
                    q = p[0],
                    r = p[1] || p[0],
                    s = {
                        left: e,
                        top: e,
                        x: 0,
                        y: 0
                    },
                    t, u = {},
                    v;
                i.corner.fixed !== d && (q === "shift" && n.precedance === "x" && o.left && n.y !== "center" ? n.precedance = n.precedance === "x" ? "y" : "x" : q === "flip" && o.left && (n.x = n.x === "center" ? o.left > 0 ? "left" : "right" : n.x === "left" ? "right" : "left"), r === "shift" && n.precedance === "y" && o.top && n.x !== "center" ? n.precedance = n.precedance === "y" ? "x" : "y" : r === "flip" && o.top && (n.y = n.y === "center" ? o.top > 0 ? "top" : "bottom" : n.y === "top" ? "bottom" : "top"), n.string() !== m.corner && (m.top !== o.top || m.left !== o.left) && i.update(n, e)), t = i.position(n, o), t.right !== c && (t.left = -t.right), t.bottom !== c && (t.top = -t.bottom), t.user = Math.max(0, j.offset);
                if (s.left = q === "shift" && !!o.left) n.x === "center" ? u["margin-left"] = s.x = t["margin-left"] - o.left : (v = t.right !== c ? [o.left, -t.left] : [-o.left, t.left], (s.x = Math.max(v[0], v[1])) > v[0] && (h.left -= o.left, s.left = e), u[t.right !== c ? "right" : "left"] = s.x);
                if (s.top = r === "shift" && !!o.top) n.y === "center" ? u["margin-top"] = s.y = t["margin-top"] - o.top : (v = t.bottom !== c ? [o.top, -t.top] : [-o.top, t.top], (s.y = Math.max(v[0], v[1])) > v[0] && (h.top -= o.top, s.top = e), u[t.bottom !== c ? "bottom" : "top"] = s.y);
                k.tip.css(u).toggle(!(s.x && s.y || n.x === "center" && s.y || n.y === "center" && s.x)), h.left -= t.left.charAt ? t.user : q !== "shift" || s.top || !s.left && !s.top ? t.left : 0, h.top -= t.top.charAt ? t.user : r !== "shift" || s.left || !s.left && !s.top ? t.top : 0, m.left = o.left, m.top = o.top, m.corner = n.string()
            }
        }
        var i = this,
            j = b.options.style.tip,
            k = b.elements,
            l = k.tooltip,
            m = {
                top: 0,
                left: 0,
                corner: ""
            },
            n = {
                width: j.width,
                height: j.height
            },
            o = {},
            p = j.border || 0,
            q = ".qtip-tip",
            s = !!(a("<canvas />")[0] || {}).getContext;
        i.mimic = i.corner = f, i.border = p, i.offset = j.offset, i.size = n, b.checks.tip = {
            "^position.my|style.tip.(corner|mimic|border)$": function() {
                i.init() || i.destroy(), b.reposition()
            },
            "^style.tip.(height|width)$": function() {
                n = {
                    width: j.width,
                    height: j.height
                }, i.create(), i.update(), b.reposition()
            },
            "^content.title.text|style.(classes|widget)$": function() {
                k.tip && i.update()
            }
        }, a.extend(i, {
            init: function() {
                var b = i.detectCorner() && (s || a.browser.msie);
                b && (i.create(), i.update(), l.unbind(q).bind("tooltipmove" + q, t));
                return b
            },
            detectCorner: function() {
                var a = j.corner,
                    c = b.options.position,
                    f = c.at,
                    g = c.my.string ? c.my.string() : c.my;
                if (a === e || g === e && f === e) return e;
                a === d ? i.corner = new h.Corner(g) : a.string || (i.corner = new h.Corner(a), i.corner.fixed = d);
                return i.corner.string() !== "centercenter"
            },
            detectColours: function() {
                var c, d, e, f = k.tip.css({
                        backgroundColor: "",
                        border: ""
                    }),
                    g = i.corner,
                    h = g[g.precedance],
                    m = "border-" + h + "-color",
                    p = "border" + h.charAt(0) + h.substr(1) + "Color",
                    q = /rgba?\(0, 0, 0(, 0)?\)|transparent/i,
                    s = "background-color",
                    t = "transparent",
                    u = a(document.body).css("color"),
                    v = b.elements.content.css("color"),
                    w = k.titlebar && (g.y === "top" || g.y === "center" && f.position().top + n.height / 2 + j.offset < k.titlebar.outerHeight(1)),
                    x = w ? k.titlebar : k.content;
                l.addClass(r), o.fill = d = f.css(s), o.border = e = f[0].style[p] || f.css(m) || l.css(m);
                if (!d || q.test(d)) o.fill = x.css(s) || t, q.test(o.fill) && (o.fill = l.css(s) || d);
                if (!e || q.test(e) || e === u) {
                    o.border = x.css(m) || t;
                    if (q.test(o.border) || o.border === v) o.border = e
                }
                a("*", f).add(f).css(s, t).css("border", ""), l.removeClass(r)
            },
            create: function() {
                var b = n.width,
                    c = n.height,
                    d;
                k.tip && k.tip.remove(), k.tip = a("<div />", {
                    "class": "ui-tooltip-tip"
                }).css({
                    width: b,
                    height: c
                }).prependTo(l), s ? a("<canvas />").appendTo(k.tip)[0].getContext("2d").save() : (d = '<vml:shape coordorigin="0,0" style="display:inline-block; position:absolute; behavior:url(#default#VML);"></vml:shape>', k.tip.html(d + d))
            },
            update: function(b, c) {
                var g = k.tip,
                    l = g.children(),
                    m = n.width,
                    q = n.height,
                    r = "px solid ",
                    t = "px dashed transparent",
                    v = j.mimic,
                    x = Math.round,
                    y, z, A, C, D;
                b || (b = i.corner), v === e ? v = b : (v = new h.Corner(v), v.precedance = b.precedance, v.x === "inherit" ? v.x = b.x : v.y === "inherit" ? v.y = b.y : v.x === v.y && (v[b.precedance] = b[b.precedance])), y = v.precedance, i.detectColours(), o.border !== "transparent" && o.border !== "#123456" ? (p = u(b, f, d), j.border === 0 && p > 0 && (o.fill = o.border), i.border = p = j.border !== d ? j.border : p) : i.border = p = 0, A = B(v, m, q), i.size = D = w(b), g.css(D), b.precedance === "y" ? C = [x(v.x === "left" ? p : v.x === "right" ? D.width - m - p : (D.width - m) / 2), x(v.y === "top" ? D.height - q : 0)] : C = [x(v.x === "left" ? D.width - m : 0), x(v.y === "top" ? p : v.y === "bottom" ? D.height - q - p : (D.height - q) / 2)], s ? (l.attr(D), z = l[0].getContext("2d"), z.restore(), z.save(), z.clearRect(0, 0, 3e3, 3e3), z.translate(C[0], C[1]), z.beginPath(), z.moveTo(A[0][0], A[0][1]), z.lineTo(A[1][0], A[1][1]), z.lineTo(A[2][0], A[2][1]), z.closePath(), z.fillStyle = o.fill, z.strokeStyle = o.border, z.lineWidth = p * 2, z.lineJoin = "miter", z.miterLimit = 100, p && z.stroke(), z.fill()) : (A = "m" + A[0][0] + "," + A[0][1] + " l" + A[1][0] + "," + A[1][1] + " " + A[2][0] + "," + A[2][1] + " xe", C[2] = p && /^(r|b)/i.test(b.string()) ? parseFloat(a.browser.version, 10) === 8 ? 2 : 1 : 0, l.css({
                    antialias: "" + (v.string().indexOf("center") > -1),
                    left: C[0] - C[2] * Number(y === "x"),
                    top: C[1] - C[2] * Number(y === "y"),
                    width: m + p,
                    height: q + p
                }).each(function(b) {
                    var c = a(this);
                    c[c.prop ? "prop" : "attr"]({
                        coordsize: m + p + " " + (q + p),
                        path: A,
                        fillcolor: o.fill,
                        filled: !!b,
                        stroked: !b
                    }).css({
                        display: p || b ? "block" : "none"
                    }), !b && c.html() === "" && c.html('<vml:stroke weight="' + p * 2 + 'px" color="' + o.border + '" miterlimit="1000" joinstyle="miter"  style="behavior:url(#default#VML); display:inline-block;" />')
                })), c !== e && i.position(b)
            },
            position: function(b) {
                var c = k.tip,
                    f = {},
                    g = Math.max(0, j.offset),
                    h, l, m;
                if (j.corner === e || !c) return e;
                b = b || i.corner, h = b.precedance, l = w(b), m = [b.x, b.y], h === "x" && m.reverse(), a.each(m, function(a, c) {
                    var e, i;
                    c === "center" ? (e = h === "y" ? "left" : "top", f[e] = "50%", f["margin-" + e] = -Math.round(l[h === "y" ? "width" : "height"] / 2) + g) : (e = u(b, c, d), i = v(b), f[c] = a ? p ? u(b, c) : 0 : g + (i > e ? i : 0))
                }), f[b[h]] -= l[h === "x" ? "width" : "height"], c.css({
                    top: "",
                    bottom: "",
                    left: "",
                    right: "",
                    margin: ""
                }).css(f);
                return f
            },
            destroy: function() {
                k.tip && k.tip.remove(), l.unbind(q)
            }
        }), i.init()
    }

    function B(a, b, c) {
        var d = Math.ceil(b / 2),
            e = Math.ceil(c / 2),
            f = {
                bottomright: [
                    [0, 0],
                    [b, c],
                    [b, 0]
                ],
                bottomleft: [
                    [0, 0],
                    [b, 0],
                    [0, c]
                ],
                topright: [
                    [0, c],
                    [b, 0],
                    [b, c]
                ],
                topleft: [
                    [0, 0],
                    [0, c],
                    [b, c]
                ],
                topcenter: [
                    [0, c],
                    [d, 0],
                    [b, c]
                ],
                bottomcenter: [
                    [0, 0],
                    [b, 0],
                    [d, c]
                ],
                rightcenter: [
                    [0, 0],
                    [b, e],
                    [0, c]
                ],
                leftcenter: [
                    [b, 0],
                    [b, c],
                    [0, e]
                ]
            };
        f.lefttop = f.bottomright, f.righttop = f.bottomleft, f.leftbottom = f.topright, f.rightbottom = f.topleft;
        return f[a.string()]
    }

    function A(b) {
        var c = this,
            f = b.elements.tooltip,
            g = b.options.content.ajax,
            h = ".qtip-ajax",
            i = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            j = d;
        b.checks.ajax = {
            "^content.ajax": function(a, b, d) {
                b === "ajax" && (g = d), b === "once" ? c.init() : g && g.url ? c.load() : f.unbind(h)
            }
        }, a.extend(c, {
            init: function() {
                g && g.url && f.unbind(h)[g.once ? "one" : "bind"]("tooltipshow" + h, c.load);
                return c
            },
            load: function(d, h) {
                function p(a, c, d) {
                    b.set("content.text", c + ": " + d)
                }

                function o(c) {
                    l && (c = a("<div/>").append(c.replace(i, "")).find(l)), b.set("content.text", c)
                }

                function n() {
                    m && (f.css("visibility", ""), h = e), a.isFunction(g.complete) && g.complete.apply(this, arguments)
                }
                if (d && d.isDefaultPrevented()) return c;
                var j = g.url.indexOf(" "),
                    k = g.url,
                    l, m = g.once && !g.loading && h;
                m && f.css("visibility", "hidden"), j > -1 && (l = k.substr(j), k = k.substr(0, j)), a.ajax(a.extend({
                    success: o,
                    error: p,
                    context: b
                }, g, {
                    url: k,
                    complete: n
                }));
                return c
            }
        }), c.init()
    }

    function z(b, c) {
        var i, j, k, l, m, n = a(this),
            o = a(document.body),
            p = this === document ? o : n,
            q = n.metadata ? n.metadata(c.metadata) : f,
            r = c.metadata.type === "html5" && q ? q[c.metadata.name] : f,
            s = n.data(c.metadata.name || "qtipopts");
        try {
            s = typeof s === "string" ? (new Function("return " + s))() : s
        } catch (t) {
            w("Unable to parse HTML5 attribute data: " + s)
        }
        l = a.extend(d, {}, g.defaults, c, typeof s === "object" ? x(s) : f, x(r || q)), j = l.position, l.id = b;
        if ("boolean" === typeof l.content.text) {
            k = n.attr(l.content.attr);
            if (l.content.attr !== e && k) l.content.text = k;
            else {
                w("Unable to locate content for tooltip! Aborting render of tooltip on element: ", n);
                return e
            }
        }
        j.container === e && (j.container = o), j.target === e && (j.target = p), l.show.target === e && (l.show.target = p), l.show.solo === d && (l.show.solo = o), l.hide.target === e && (l.hide.target = p), l.position.viewport === d && (l.position.viewport = j.container), j.at = new h.Corner(j.at), j.my = new h.Corner(j.my);
        if (a.data(this, "qtip"))
            if (l.overwrite) n.qtip("destroy");
            else if (l.overwrite === e) return e;
        l.suppress && (m = a.attr(this, "title")) && a(this).removeAttr("title").attr(u, m), i = new y(n, l, b, !!k), a.data(this, "qtip", i), n.bind("remove.qtip", function() {
            i.destroy()
        });
        return i
    }

    function y(s, t, w, y) {
        function R() {
            var c = [t.show.target[0], t.hide.target[0], z.rendered && G.tooltip[0], t.position.container[0], t.position.viewport[0], b, document];
            z.rendered ? a([]).pushStack(a.grep(c, function(a) {
                return typeof a === "object"
            })).unbind(F) : t.show.target.unbind(F + "-create")
        }

        function Q() {
            function p(a) {
                E.is(":visible") && z.reposition(a)
            }

            function o(a) {
                if (E.hasClass(m)) return e;
                clearTimeout(z.timers.inactive), z.timers.inactive = setTimeout(function() {
                    z.hide(a)
                }, t.hide.inactive)
            }

            function l(b) {
                if (E.hasClass(m) || C || D) return e;
                var d = a(b.relatedTarget || b.target),
                    g = d.closest(n)[0] === E[0],
                    h = d[0] === f.show[0];
                clearTimeout(z.timers.show), clearTimeout(z.timers.hide);
                if (c.target === "mouse" && g || t.hide.fixed && (/mouse(out|leave|move)/.test(b.type) && (g || h))) try {
                    b.preventDefault(), b.stopImmediatePropagation()
                } catch (i) {} else t.hide.delay > 0 ? z.timers.hide = setTimeout(function() {
                    z.hide(b)
                }, t.hide.delay) : z.hide(b)
            }

            function k(a) {
                if (E.hasClass(m)) return e;
                f.show.trigger("qtip-" + w + "-inactive"), clearTimeout(z.timers.show), clearTimeout(z.timers.hide);
                var b = function() {
                    z.toggle(d, a)
                };
                t.show.delay > 0 ? z.timers.show = setTimeout(b, t.show.delay) : b()
            }
            var c = t.position,
                f = {
                    show: t.show.target,
                    hide: t.hide.target,
                    viewport: a(c.viewport),
                    document: a(document),
                    window: a(b)
                },
                h = {
                    show: a.trim("" + t.show.event).split(" "),
                    hide: a.trim("" + t.hide.event).split(" ")
                },
                j = a.browser.msie && parseInt(a.browser.version, 10) === 6;
            E.bind("mouseenter" + F + " mouseleave" + F, function(a) {
                var b = a.type === "mouseenter";
                b && z.focus(a), E.toggleClass(q, b)
            }), t.hide.fixed && (f.hide = f.hide.add(E), E.bind("mouseover" + F, function() {
                E.hasClass(m) || clearTimeout(z.timers.hide)
            })), /mouse(out|leave)/i.test(t.hide.event) ? t.hide.leave === "window" && f.window.bind("mouseout" + F, function(a) {
                /select|option/.test(a.target) && !a.relatedTarget && z.hide(a)
            }) : /mouse(over|enter)/i.test(t.show.event) && f.hide.bind("mouseleave" + F, function(a) {
                clearTimeout(z.timers.show)
            }), ("" + t.hide.event).indexOf("unfocus") > -1 && f.document.bind("mousedown" + F, function(b) {
                var c = a(b.target),
                    d = !E.hasClass(m) && E.is(":visible");
                c[0] !== E[0] && c.parents(n).length === 0 && c.add(s).length > 1 && z.hide(b)
            }), "number" === typeof t.hide.inactive && (f.show.bind("qtip-" + w + "-inactive", o), a.each(g.inactiveEvents, function(a, b) {
                f.hide.add(G.tooltip).bind(b + F + "-inactive", o)
            })), a.each(h.hide, function(b, c) {
                var d = a.inArray(c, h.show),
                    e = a(f.hide);
                d > -1 && e.add(f.show).length === e.length || c === "unfocus" ? (f.show.bind(c + F, function(a) {
                    E.is(":visible") ? l(a) : k(a)
                }), delete h.show[d]) : f.hide.bind(c + F, l)
            }), a.each(h.show, function(a, b) {
                f.show.bind(b + F, k)
            }), "number" === typeof t.hide.distance && f.show.add(E).bind("mousemove" + F, function(a) {
                var b = H.origin || {},
                    c = t.hide.distance,
                    d = Math.abs;
                (d(a.pageX - b.pageX) >= c || d(a.pageY - b.pageY) >= c) && z.hide(a)
            }), c.target === "mouse" && (f.show.bind("mousemove" + F, function(a) {
                i = {
                    pageX: a.pageX,
                    pageY: a.pageY,
                    type: "mousemove"
                }
            }), c.adjust.mouse && (t.hide.event && E.bind("mouseleave" + F, function(a) {
                (a.relatedTarget || a.target) !== f.show[0] && z.hide(a)
            }), f.document.bind("mousemove" + F, function(a) {
                !E.hasClass(m) && E.is(":visible") && z.reposition(a || i)
            }))), (c.adjust.resize || f.viewport.length) && (a.event.special.resize ? f.viewport : f.window).bind("resize" + F, p), (f.viewport.length || j && E.css("position") === "fixed") && f.viewport.bind("scroll" + F, p)
        }

        function P(b, d) {
            function g(b) {
                function i(c) {
                    c && (delete h[c.src], clearTimeout(z.timers.img[c.src]), a(c).unbind(F)), a.isEmptyObject(h) && (z.redraw(), d !== e && z.reposition(H.event), b())
                }
                var g, h = {};
                if ((g = f.find("img:not([height]):not([width])")).length === 0) return i();
                g.each(function(b, d) {
                    if (h[d.src] === c) {
                        var e = 0,
                            f = 3;
                        (function g() {
                            if (d.height || d.width || e > f) return i(d);
                            e += 1, z.timers.img[d.src] = setTimeout(g, 700)
                        })(), a(d).bind("error" + F + " load" + F, function() {
                            i(this)
                        }), h[d.src] = d
                    }
                })
            }
            var f = G.content;
            if (!z.rendered || !b) return e;
            a.isFunction(b) && (b = b.call(s, H.event, z) || ""), b.jquery && b.length > 0 ? f.empty().append(b.css({
                display: "block"
            })) : f.html(b), z.rendered < 0 ? E.queue("fx", g) : (D = 0, g(a.noop));
            return z
        }

        function O(b, c) {
            var d = G.title;
            if (!z.rendered || !b) return e;
            a.isFunction(b) && (b = b.call(s, H.event, z));
            if (b === e) return K(e);
            b.jquery && b.length > 0 ? d.empty().append(b.css({
                display: "block"
            })) : d.html(b), z.redraw(), c !== e && z.rendered && E.is(":visible") && z.reposition(H.event)
        }

        function N(a) {
            var b = G.button,
                c = G.title;
            if (!z.rendered) return e;
            a ? (c || M(), L()) : b.remove()
        }

        function M() {
            var b = B + "-title";
            G.titlebar && K(), G.titlebar = a("<div />", {
                "class": k + "-titlebar " + (t.style.widget ? "ui-widget-header" : "")
            }).append(G.title = a("<div />", {
                id: b,
                "class": k + "-title",
                "aria-atomic": d
            })).insertBefore(G.content), t.content.title.button ? L() : z.rendered && z.redraw()
        }

        function L() {
            var b = t.content.title.button,
                c = typeof b === "string",
                d = c ? b : "Close tooltip";
            G.button && G.button.remove(), b.jquery ? G.button = b : G.button = a("<a />", {
                "class": "ui-state-default " + (t.style.widget ? "" : k + "-icon"),
                title: d,
                "aria-label": d
            }).prepend(a("<span />", {
                "class": "ui-icon ui-icon-close",
                html: "&times;"
            })), G.button.appendTo(G.titlebar).attr("role", "button").hover(function(b) {
                a(this).toggleClass("ui-state-hover", b.type === "mouseenter")
            }).click(function(a) {
                E.hasClass(m) || z.hide(a);
                return e
            }).bind("mousedown keydown mouseup keyup mouseout", function(b) {
                a(this).toggleClass("ui-state-active ui-state-focus", b.type.substr(-4) === "down")
            }), z.redraw()
        }

        function K(a) {
            G.title && (G.titlebar.remove(), G.titlebar = G.title = G.button = f, a !== e && z.reposition())
        }

        function J() {
            var a = t.style.widget;
            E.toggleClass(l, a).toggleClass(o, !a), G.content.toggleClass(l + "-content", a), G.titlebar && G.titlebar.toggleClass(l + "-header", a), G.button && G.button.toggleClass(k + "-icon", !a)
        }

        function I(a) {
            var b = 0,
                c, d = t,
                e = a.split(".");
            while (d = d[e[b++]]) b < e.length && (c = d);
            return [c || t, e.pop()]
        }
        var z = this,
            A = document.body,
            B = k + "-" + w,
            C = 0,
            D = 0,
            E = a(),
            F = ".qtip-" + w,
            G, H;
        z.id = w, z.rendered = e, z.elements = G = {
            target: s
        }, z.timers = {
            img: {}
        }, z.options = t, z.checks = {}, z.plugins = {}, z.cache = H = {
            event: {},
            target: a(),
            disabled: e,
            attr: y
        }, z.checks.builtin = {
            "^id$": function(b, c, f) {
                var h = f === d ? g.nextid : f,
                    i = k + "-" + h;
                h !== e && h.length > 0 && !a("#" + i).length && (E[0].id = i, G.content[0].id = i + "-content", G.title[0].id = i + "-title")
            },
            "^content.text$": function(a, b, c) {
                P(c)
            },
            "^content.title.text$": function(a, b, c) {
                if (!c) return K();
                !G.title && c && M(), O(c)
            },
            "^content.title.button$": function(a, b, c) {
                N(c)
            },
            "^position.(my|at)$": function(a, b, c) {
                "string" === typeof c && (a[b] = new h.Corner(c))
            },
            "^position.container$": function(a, b, c) {
                z.rendered && E.appendTo(c)
            },
            "^show.ready$": function() {
                z.rendered ? z.toggle(d) : z.render(1)
            },
            "^style.classes$": function(a, b, c) {
                E.attr("class", k + " qtip ui-helper-reset " + c)
            },
            "^style.widget|content.title": J,
            "^events.(render|show|move|hide|focus|blur)$": function(b, c, d) {
                E[(a.isFunction(d) ? "" : "un") + "bind"]("tooltip" + c, d)
            },
            "^(show|hide|position).(event|target|fixed|inactive|leave|distance|viewport|adjust)": function() {
                var a = t.position;
                E.attr("tracking", a.target === "mouse" && a.adjust.mouse), R(), Q()
            }
        }, a.extend(z, {
            render: function(b) {
                if (z.rendered) return z;
                var c = t.content.title.text,
                    f = t.position,
                    g = a.Event("tooltiprender");
                a.attr(s[0], "aria-describedby", B), E = G.tooltip = a("<div/>", {
                    id: B,
                    "class": k + " qtip ui-helper-reset " + o + " " + t.style.classes + " " + k + "-pos-" + t.position.my.abbreviation(),
                    width: t.style.width || "",
                    height: t.style.height || "",
                    tracking: f.target === "mouse" && f.adjust.mouse,
                    role: "alert",
                    "aria-live": "polite",
                    "aria-atomic": e,
                    "aria-describedby": B + "-content",
                    "aria-hidden": d
                }).toggleClass(m, H.disabled).data("qtip", z).appendTo(t.position.container).append(G.content = a("<div />", {
                    "class": k + "-content",
                    id: B + "-content",
                    "aria-atomic": d
                })), z.rendered = -1, C = D = 1, c && (M(), O(c, e)), P(t.content.text, e), z.rendered = d, J(), a.each(t.events, function(b, c) {
                    a.isFunction(c) && E.bind(b === "toggle" ? "tooltipshow tooltiphide" : "tooltip" + b, c)
                }), a.each(h, function() {
                    this.initialize === "render" && this(z)
                }), Q(), E.queue("fx", function(a) {
                    g.originalEvent = H.event, E.trigger(g, [z]), C = D = 0, z.redraw(), (t.show.ready || b) && z.toggle(d, H.event), a()
                });
                return z
            },
            get: function(a) {
                var b, c;
                switch (a.toLowerCase()) {
                    case "dimensions":
                        b = {
                            height: E.outerHeight(),
                            width: E.outerWidth()
                        };
                        break;
                    case "offset":
                        b = h.offset(E, t.position.container);
                        break;
                    default:
                        c = I(a.toLowerCase()), b = c[0][c[1]], b = b.precedance ? b.string() : b
                }
                return b
            },
            set: function(b, c) {
                function m(a, b) {
                    var c, d, e;
                    for (c in k)
                        for (d in k[c])
                            if (e = (new RegExp(d, "i")).exec(a)) b.push(e), k[c][d].apply(z, b)
                }
                var g = /^position\.(my|at|adjust|target|container)|style|content|show\.ready/i,
                    h = /^content\.(title|attr)|style/i,
                    i = e,
                    j = e,
                    k = z.checks,
                    l;
                "string" === typeof b ? (l = b, b = {}, b[l] = c) : b = a.extend(d, {}, b), a.each(b, function(c, d) {
                    var e = I(c.toLowerCase()),
                        f;
                    f = e[0][e[1]], e[0][e[1]] = "object" === typeof d && d.nodeType ? a(d) : d, b[c] = [e[0], e[1], d, f], i = g.test(c) || i, j = h.test(c) || j
                }), x(t), C = D = 1, a.each(b, m), C = D = 0, E.is(":visible") && z.rendered && (i && z.reposition(t.position.target === "mouse" ? f : H.event), j && z.redraw());
                return z
            },
            toggle: function(b, c) {
                function q() {
                    b ? (a.browser.msie && E[0].style.removeAttribute("filter"), E.css("overflow", ""), "string" === typeof h.autofocus && a(h.autofocus, E).focus(), p = a.Event("tooltipvisible"), p.originalEvent = c ? H.event : f, E.trigger(p, [z])) : E.css({
                        display: "",
                        visibility: "",
                        opacity: "",
                        left: "",
                        top: ""
                    })
                }
                if (!z.rendered)
                    if (b) z.render(1);
                    else return z;
                var g = b ? "show" : "hide",
                    h = t[g],
                    j = E.is(":visible"),
                    k = !c || t[g].target.length < 2 || H.target[0] === c.target,
                    l = t.position,
                    m = t.content,
                    o, p;
                (typeof b).search("boolean|number") && (b = !j);
                if (!E.is(":animated") && j === b && k) return z;
                if (c) {
                    if (/over|enter/.test(c.type) && /out|leave/.test(H.event.type) && c.target === t.show.target[0] && E.has(c.relatedTarget).length) return z;
                    H.event = a.extend({}, c)
                }
                p = a.Event("tooltip" + g), p.originalEvent = c ? H.event : f, E.trigger(p, [z, 90]);
                if (p.isDefaultPrevented()) return z;
                a.attr(E[0], "aria-hidden", !b), b ? (H.origin = a.extend({}, i), z.focus(c), a.isFunction(m.text) && P(m.text, e), a.isFunction(m.title.text) && O(m.title.text, e), !v && l.target === "mouse" && l.adjust.mouse && (a(document).bind("mousemove.qtip", function(a) {
                    i = {
                        pageX: a.pageX,
                        pageY: a.pageY,
                        type: "mousemove"
                    }
                }), v = d), z.reposition(c), h.solo && a(n, h.solo).not(E).qtip("hide", p)) : (clearTimeout(z.timers.show), delete H.origin, v && !a(n + '[tracking="true"]:visible', h.solo).not(E).length && (a(document).unbind("mousemove.qtip"), v = e), z.blur(c)), k && E.stop(0, 1), h.effect === e ? (E[g](), q.call(E)) : a.isFunction(h.effect) ? (h.effect.call(E, z), E.queue("fx", function(a) {
                    q(), a()
                })) : E.fadeTo(90, b ? 1 : 0, q), b && h.target.trigger("qtip-" + w + "-inactive");
                return z
            },
            show: function(a) {
                return z.toggle(d, a)
            },
            hide: function(a) {
                return z.toggle(e, a)
            },
            focus: function(b) {
                if (!z.rendered) return z;
                var c = a(n),
                    d = parseInt(E[0].style.zIndex, 10),
                    e = g.zindex + c.length,
                    f = a.extend({}, b),
                    h, i;
                E.hasClass(p) || (i = a.Event("tooltipfocus"), i.originalEvent = f, E.trigger(i, [z, e]), i.isDefaultPrevented() || (d !== e && (c.each(function() {
                    this.style.zIndex > d && (this.style.zIndex = this.style.zIndex - 1)
                }), c.filter("." + p).qtip("blur", f)), E.addClass(p)[0].style.zIndex = e));
                return z
            },
            blur: function(b) {
                var c = a.extend({}, b),
                    d;
                E.removeClass(p), d = a.Event("tooltipblur"), d.originalEvent = c, E.trigger(d, [z]);
                return z
            },
            reposition: function(c, d) {
                if (!z.rendered || C) return z;
                C = 1;
                var f = t.position.target,
                    g = t.position,
                    j = g.my,
                    l = g.at,
                    m = g.adjust,
                    n = m.method.split(" "),
                    o = E.outerWidth(),
                    p = E.outerHeight(),
                    q = 0,
                    r = 0,
                    s = a.Event("tooltipmove"),
                    u = E.css("position") === "fixed",
                    v = g.viewport,
                    w = {
                        left: 0,
                        top: 0
                    },
                    x = e,
                    y = z.plugins.tip,
                    B = {
                        horizontal: n[0],
                        vertical: n[1] = n[1] || n[0],
                        enabled: v.jquery && f[0] !== b && f[0] !== A && m.method !== "none",
                        left: function(a) {
                            var b = B.horizontal === "shift",
                                c = v.offset.left + v.scrollLeft,
                                d = j.x === "left" ? o : j.x === "right" ? -o : -o / 2,
                                e = l.x === "left" ? q : l.x === "right" ? -q : -q / 2,
                                f = y && y.size ? y.size.width || 0 : 0,
                                g = y && y.corner && y.corner.precedance === "x" && !b ? f : 0,
                                h = c - a + g,
                                i = a + o - v.width - c + g,
                                k = d - (j.precedance === "x" || j.x === j.y ? e : 0),
                                n = j.x === "center";
                            b ? (g = y && y.corner && y.corner.precedance === "y" ? f : 0, k = (j.x === "left" ? 1 : -1) * d - g, w.left += h > 0 ? h : i > 0 ? -i : 0, w.left = Math.max(v.offset.left + (g && y.corner.x === "center" ? y.offset : 0), a - k, Math.min(Math.max(v.offset.left + v.width, a + k), w.left))) : (h > 0 && (j.x !== "left" || i > 0) ? w.left -= k : i > 0 && (j.x !== "right" || h > 0) && (w.left -= n ? -k : k), w.left !== a && n && (w.left -= m.x), w.left < c && -w.left > i && (w.left = a));
                            return w.left - a
                        },
                        top: function(a) {
                            var b = B.vertical === "shift",
                                c = v.offset.top + v.scrollTop,
                                d = j.y === "top" ? p : j.y === "bottom" ? -p : -p / 2,
                                e = l.y === "top" ? r : l.y === "bottom" ? -r : -r / 2,
                                f = y && y.size ? y.size.height || 0 : 0,
                                g = y && y.corner && y.corner.precedance === "y" && !b ? f : 0,
                                h = c - a + g,
                                i = a + p - v.height - c + g,
                                k = d - (j.precedance === "y" || j.x === j.y ? e : 0),
                                n = j.y === "center";
                            b ? (g = y && y.corner && y.corner.precedance === "x" ? f : 0, k = (j.y === "top" ? 1 : -1) * d - g, w.top += h > 0 ? h : i > 0 ? -i : 0, w.top = Math.max(v.offset.top + (g && y.corner.x === "center" ? y.offset : 0), a - k, Math.min(Math.max(v.offset.top + v.height, a + k), w.top))) : (h > 0 && (j.y !== "top" || i > 0) ? w.top -= k : i > 0 && (j.y !== "bottom" || h > 0) && (w.top -= n ? -k : k), w.top !== a && n && (w.top -= m.y), w.top < 0 && -w.top > i && (w.top = a));
                            return w.top - a
                        }
                    },
                    D;
                if (a.isArray(f) && f.length === 2) l = {
                    x: "left",
                    y: "top"
                }, w = {
                    left: f[0],
                    top: f[1]
                };
                else if (f === "mouse" && (c && c.pageX || H.event.pageX)) l = {
                    x: "left",
                    y: "top"
                }, c = (c && (c.type === "resize" || c.type === "scroll") ? H.event : c && c.pageX && c.type === "mousemove" ? c : i && i.pageX && (m.mouse || !c || !c.pageX) ? {
                    pageX: i.pageX,
                    pageY: i.pageY
                } : !m.mouse && H.origin && H.origin.pageX ? H.origin : c) || c || H.event || i || {}, w = {
                    top: c.pageY,
                    left: c.pageX
                };
                else {
                    f === "event" ? c && c.target && c.type !== "scroll" && c.type !== "resize" ? f = H.target = a(c.target) : f = H.target : H.target = a(f), f = a(f).eq(0);
                    if (f.length === 0) return z;
                    f[0] === document || f[0] === b ? (q = h.iOS ? b.innerWidth : f.width(), r = h.iOS ? b.innerHeight : f.height(), f[0] === b && (w = {
                        top: !u || h.iOS ? (v || f).scrollTop() : 0,
                        left: !u || h.iOS ? (v || f).scrollLeft() : 0
                    })) : f.is("area") && h.imagemap ? w = h.imagemap(f, l, B.enabled ? n : e) : f[0].namespaceURI === "http://www.w3.org/2000/svg" && h.svg ? w = h.svg(f, l) : (q = f.outerWidth(), r = f.outerHeight(), w = h.offset(f, g.container)), w.offset && (q = w.width, r = w.height, x = w.flipoffset, w = w.offset);
                    if (h.iOS < 4.1 && h.iOS > 3.1 || h.iOS == 4.3 || !h.iOS && u) D = a(b), w.left -= D.scrollLeft(), w.top -= D.scrollTop();
                    w.left += l.x === "right" ? q : l.x === "center" ? q / 2 : 0, w.top += l.y === "bottom" ? r : l.y === "center" ? r / 2 : 0
                }
                w.left += m.x + (j.x === "right" ? -o : j.x === "center" ? -o / 2 : 0), w.top += m.y + (j.y === "bottom" ? -p : j.y === "center" ? -p / 2 : 0), B.enabled ? (v = {
                    elem: v,
                    height: v[(v[0] === b ? "h" : "outerH") + "eight"](),
                    width: v[(v[0] === b ? "w" : "outerW") + "idth"](),
                    scrollLeft: u ? 0 : v.scrollLeft(),
                    scrollTop: u ? 0 : v.scrollTop(),
                    offset: v.offset() || {
                        left: 0,
                        top: 0
                    }
                }, w.adjusted = {
                    left: B.horizontal !== "none" ? B.left(w.left) : 0,
                    top: B.vertical !== "none" ? B.top(w.top) : 0
                }, w.adjusted.left + w.adjusted.top && E.attr("class", function(a, b) {
                    return b.replace(/ui-tooltip-pos-\w+/i, k + "-pos-" + j.abbreviation())
                }), x && w.adjusted.left && (w.left += x.left), x && w.adjusted.top && (w.top += x.top)) : w.adjusted = {
                    left: 0,
                    top: 0
                }, s.originalEvent = a.extend({}, c), E.trigger(s, [z, w, v.elem || v]);
                if (s.isDefaultPrevented()) return z;
                delete w.adjusted, d === e || isNaN(w.left) || isNaN(w.top) || f === "mouse" || !a.isFunction(g.effect) ? E.css(w) : a.isFunction(g.effect) && (g.effect.call(E, z, a.extend({}, w)), E.queue(function(b) {
                    a(this).css({
                        opacity: "",
                        height: ""
                    }), a.browser.msie && this.style.removeAttribute("filter"), b()
                })), C = 0;
                return z
            },
            redraw: function() {
                if (z.rendered < 1 || D) return z;
                var a = t.position.container,
                    b, c, d, e;
                D = 1, t.style.height && E.css("height", t.style.height), t.style.width ? E.css("width", t.style.width) : (E.css("width", "").addClass(r), c = E.width() + 1, d = E.css("max-width") || "", e = E.css("min-width") || "", b = (d + e).indexOf("%") > -1 ? a.width() / 100 : 0, d = (d.indexOf("%") > -1 ? b : 1) * parseInt(d, 10) || c, e = (e.indexOf("%") > -1 ? b : 1) * parseInt(e, 10) || 0, c = d + e ? Math.min(Math.max(c, e), d) : c, E.css("width", Math.round(c)).removeClass(r)), D = 0;
                return z
            },
            disable: function(b) {
                "boolean" !== typeof b && (b = !E.hasClass(m) && !H.disabled), z.rendered ? (E.toggleClass(m, b), a.attr(E[0], "aria-disabled", b)) : H.disabled = !!b;
                return z
            },
            enable: function() {
                return z.disable(e)
            },
            destroy: function() {
                var b = s[0],
                    c = a.attr(b, u);
                z.rendered && (E.remove(), a.each(z.plugins, function() {
                    this.destroy && this.destroy()
                })), clearTimeout(z.timers.show), clearTimeout(z.timers.hide), R(), a.removeData(b, "qtip"), t.suppress && c && (a.attr(b, "title", c), s.removeAttr(u)), s.removeAttr("aria-describedby").unbind(".qtip"), delete j[z.id];
                return s
            }
        })
    }

    function x(b) {
        var c;
        if (!b || "object" !== typeof b) return e;
        "object" !== typeof b.metadata && (b.metadata = {
            type: b.metadata
        });
        if ("content" in b) {
            if ("object" !== typeof b.content || b.content.jquery) b.content = {
                text: b.content
            };
            c = b.content.text || e, !a.isFunction(c) && (!c && !c.attr || c.length < 1 || "object" === typeof c && !c.jquery) && (b.content.text = e), "title" in b.content && ("object" !== typeof b.content.title && (b.content.title = {
                text: b.content.title
            }), c = b.content.title.text || e, !a.isFunction(c) && (!c && !c.attr || c.length < 1 || "object" === typeof c && !c.jquery) && (b.content.title.text = e))
        }
        "position" in b && ("object" !== typeof b.position && (b.position = {
            my: b.position,
            at: b.position
        })), "show" in b && ("object" !== typeof b.show && (b.show.jquery ? b.show = {
            target: b.show
        } : b.show = {
            event: b.show
        })), "hide" in b && ("object" !== typeof b.hide && (b.hide.jquery ? b.hide = {
            target: b.hide
        } : b.hide = {
            event: b.hide
        })), "style" in b && ("object" !== typeof b.style && (b.style = {
            classes: b.style
        })), a.each(h, function() {
            this.sanitize && this.sanitize(b)
        });
        return b
    }

    function w() {
        w.history = w.history || [], w.history.push(arguments);
        if ("object" === typeof console) {
            var a = console[console.warn ? "warn" : "log"],
                b = Array.prototype.slice.call(arguments),
                c;
            typeof arguments[0] === "string" && (b[0] = "qTip2: " + b[0]), c = a.apply ? a.apply(console, b) : a(b)
        }
    }
    "use strict";
    var d = !0,
        e = !1,
        f = null,
        g, h, i, j = {},
        k = "ui-tooltip",
        l = "ui-widget",
        m = "ui-state-disabled",
        n = "div.qtip." + k,
        o = k + "-default",
        p = k + "-focus",
        q = k + "-hover",
        r = k + "-fluid",
        s = "-31000px",
        t = "_replacedByqTip",
        u = "oldtitle",
        v;
    g = a.fn.qtip = function(b, h, i) {
        var j = ("" + b).toLowerCase(),
            k = f,
            l = j === "disable" ? [d] : a.makeArray(arguments).slice(1),
            m = l[l.length - 1],
            n = this[0] ? a.data(this[0], "qtip") : f;
        if (!arguments.length && n || j === "api") return n;
        if ("string" === typeof b) {
            this.each(function() {
                var b = a.data(this, "qtip");
                if (!b) return d;
                m && m.timeStamp && (b.cache.event = m);
                if (j !== "option" && j !== "options" || !h) b[j] && b[j].apply(b[j], l);
                else if (a.isPlainObject(h) || i !== c) b.set(h, i);
                else {
                    k = b.get(h);
                    return e
                }
            });
            return k !== f ? k : this
        }
        if ("object" === typeof b || !arguments.length) {
            n = x(a.extend(d, {}, b));
            return g.bind.call(this, n, m)
        }
    }, g.bind = function(b, f) {
        return this.each(function(k) {
            function r(b) {
                function d() {
                    p.render(typeof b === "object" || l.show.ready), m.show.add(m.hide).unbind(o)
                }
                if (p.cache.disabled) return e;
                p.cache.event = a.extend({}, b), p.cache.target = b ? a(b.target) : [c], l.show.delay > 0 ? (clearTimeout(p.timers.show), p.timers.show = setTimeout(d, l.show.delay), n.show !== n.hide && m.hide.bind(n.hide, function() {
                    clearTimeout(p.timers.show)
                })) : d()
            }
            var l, m, n, o, p, q;
            q = a.isArray(b.id) ? b.id[k] : b.id, q = !q || q === e || q.length < 1 || j[q] ? g.nextid++ : j[q] = q, o = ".qtip-" + q + "-create", p = z.call(this, q, b);
            if (p === e) return d;
            l = p.options, a.each(h, function() {
                this.initialize === "initialize" && this(p)
            }), m = {
                show: l.show.target,
                hide: l.hide.target
            }, n = {
                show: a.trim("" + l.show.event).replace(/ /g, o + " ") + o,
                hide: a.trim("" + l.hide.event).replace(/ /g, o + " ") + o
            }, /mouse(over|enter)/i.test(n.show) && !/mouse(out|leave)/i.test(n.hide) && (n.hide += " mouseleave" + o), m.show.bind("mousemove" + o, function(a) {
                i = {
                    pageX: a.pageX,
                    pageY: a.pageY,
                    type: "mousemove"
                }
            }), m.show.bind(n.show, r), (l.show.ready || l.prerender) && r(f)
        })
    }, h = g.plugins = {
        Corner: function(a) {
            a = ("" + a).replace(/([A-Z])/, " $1").replace(/middle/gi, "center").toLowerCase(), this.x = (a.match(/left|right/i) || a.match(/center/) || ["inherit"])[0].toLowerCase(), this.y = (a.match(/top|bottom|center/i) || ["inherit"])[0].toLowerCase(), this.precedance = a.charAt(0).search(/^(t|b)/) > -1 ? "y" : "x", this.string = function() {
                return this.precedance === "y" ? this.y + this.x : this.x + this.y
            }, this.abbreviation = function() {
                var a = this.x.substr(0, 1),
                    b = this.y.substr(0, 1);
                return a === b ? a : a === "c" || a !== "c" && b !== "c" ? b + a : a + b
            }
        },
        offset: function(a, b) {
            function h(a, b) {
                c.left += b * a.scrollLeft(), c.top += b * a.scrollTop()
            }
            var c = a.offset(),
                d = b,
                e = 0,
                f = document.body,
                g;
            if (d) {
                do {
                    d.css("position") !== "static" && (g = d[0] === f ? {
                        left: parseInt(d.css("left"), 10) || 0,
                        top: parseInt(d.css("top"), 10) || 0
                    } : d.position(), c.left -= g.left + (parseInt(d.css("borderLeftWidth"), 10) || 0) + (parseInt(d.css("marginLeft"), 10) || 0), c.top -= g.top + (parseInt(d.css("borderTopWidth"), 10) || 0), ++e);
                    if (d[0] === f) break
                } while (d = d.offsetParent());
                b[0] !== f && e > 1 && h(b, 1)
            }
            return c
        },
        iOS: parseFloat(("" + (/CPU.*OS ([0-9_]{1,3})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".")) || e,
        fn: {
            attr: function(b, c) {
                if (this.length) {
                    var d = this[0],
                        e = "title",
                        f = a.data(d, "qtip");
                    if (b === e && f && "object" === typeof f && f.options.suppress) {
                        if (arguments.length < 2) return a.attr(d, u);
                        f && f.options.content.attr === e && f.cache.attr && f.set("content.text", c);
                        return this.attr(u, c)
                    }
                }
                return a.fn["attr" + t].apply(this, arguments)
            },
            clone: function(b) {
                var c = a([]),
                    d = "title",
                    e = a.fn["clone" + t].apply(this, arguments);
                b || e.filter("[" + u + "]").attr("title", function() {
                    return a.attr(this, u)
                }).removeAttr(u);
                return e
            },
            remove: a.ui ? f : function(b, c) {
                a(this).each(function() {
                    c || (!b || a.filter(b, [this]).length) && a("*", this).add(this).each(function() {
                        a(this).triggerHandler("remove")
                    })
                })
            }
        }
    }, a.each(h.fn, function(b, c) {
        if (!c || a.fn[b + t]) return d;
        var e = a.fn[b + t] = a.fn[b];
        a.fn[b] = function() {
            return c.apply(this, arguments) || e.apply(this, arguments)
        }
    }), g.version = "nightly", g.nextid = 0, g.inactiveEvents = "click dblclick mousedown mouseup mousemove mouseleave mouseenter".split(" "), g.zindex = 15e3, g.defaults = {
        prerender: e,
        id: e,
        overwrite: d,
        suppress: d,
        content: {
            text: d,
            attr: "title",
            title: {
                text: e,
                button: e
            }
        },
        position: {
            my: "top left",
            at: "bottom right",
            target: e,
            container: e,
            viewport: e,
            adjust: {
                x: 0,
                y: 0,
                mouse: d,
                resize: d,
                method: "flip flip"
            },
            effect: function(b, c, d) {
                a(this).animate(c, {
                    duration: 200,
                    queue: e
                })
            }
        },
        show: {
            target: e,
            event: "mouseenter",
            effect: d,
            delay: 90,
            solo: e,
            ready: e,
            autofocus: e
        },
        hide: {
            target: e,
            event: "mouseleave",
            effect: d,
            delay: 0,
            fixed: e,
            inactive: e,
            leave: "window",
            distance: e
        },
        style: {
            classes: "",
            widget: e,
            width: e,
            height: e
        },
        events: {
            render: f,
            move: f,
            show: f,
            hide: f,
            toggle: f,
            visible: f,
            focus: f,
            blur: f
        }
    }, h.ajax = function(a) {
        var b = a.plugins.ajax;
        return "object" === typeof b ? b : a.plugins.ajax = new A(a)
    }, h.ajax.initialize = "render", h.ajax.sanitize = function(a) {
        var b = a.content,
            c;
        b && "ajax" in b && (c = b.ajax, typeof c !== "object" && (c = a.content.ajax = {
            url: c
        }), "boolean" !== typeof c.once && c.once && (c.once = !!c.once))
    }, a.extend(d, g.defaults, {
        content: {
            ajax: {
                loading: d,
                once: d
            }
        }
    }), h.tip = function(a) {
        var b = a.plugins.tip;
        return "object" === typeof b ? b : a.plugins.tip = new C(a)
    }, h.tip.initialize = "render", h.tip.sanitize = function(a) {
        var b = a.style,
            c;
        b && "tip" in b && (c = a.style.tip, typeof c !== "object" && (a.style.tip = {
            corner: c
        }), /string|boolean/i.test(typeof c.corner) || (c.corner = d), typeof c.width !== "number" && delete c.width, typeof c.height !== "number" && delete c.height, typeof c.border !== "number" && c.border !== d && delete c.border, typeof c.offset !== "number" && delete c.offset)
    }, a.extend(d, g.defaults, {
        style: {
            tip: {
                corner: d,
                mimic: e,
                width: 6,
                height: 6,
                border: d,
                offset: 0
            }
        }
    }), h.bgiframe = function(b) {
        var c = a.browser,
            d = b.plugins.bgiframe;
        if (a("select, object").length < 1 || (!c.msie || c.version.charAt(0) !== "6")) return e;
        return "object" === typeof d ? d : b.plugins.bgiframe = new D(b)
    }, h.bgiframe.initialize = "render"
})(jQuery, window);
isTouchDevice = function() {
    var deviceAgent = navigator.userAgent.toLowerCase();
    var iOS = deviceAgent.match(/(iphone|ipod|ipad)/);
    return iOS;
};
getSupportedFeature = function(feature) {
    var prefixes = '';
    switch (feature) {
        case "transform":
            prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
            if (isTouchDevice()) return true;
            break;
    }
    for (var i = 0; i < prefixes.length; i++) {
        if (document.createElement('div').style[prefixes[i]] !== undefined) {
            return prefixes[i];
        }
    }
    return false;
};;
(function(e, t) {
    function n(t) {
        return e.less[t.split("/")[1]]
    }

    function f() {
        r.env === "development" ? (r.optimization = 0, r.watchTimer = setInterval(function() {
            r.watchMode && g(function(e, t, n, r, i) {
                t && S(t.toCSS(), r, i.lastModified)
            })
        }, r.poll)) : r.optimization = 3
    }

    function m() {
        var e = document.getElementsByTagName("style");
        for (var t = 0; t < e.length; t++) e[t].type.match(p) && (new r.Parser({
            filename: document.location.href.replace(/#.*$/, ""),
            dumpLineNumbers: r.dumpLineNumbers
        })).parse(e[t].innerHTML || "", function(n, r) {
            var i = r.toCSS(),
                s = e[t];
            s.type = "text/css", s.styleSheet ? s.styleSheet.cssText = i : s.innerHTML = i
        })
    }

    function g(e, t) {
        for (var n = 0; n < r.sheets.length; n++) w(r.sheets[n], e, t, r.sheets.length - (n + 1))
    }

    function y(e, t) {
        var n = b(e),
            r = b(t),
            i, s, o, u, a = "";
        if (n.hostPart !== r.hostPart) return "";
        s = Math.max(r.directories.length, n.directories.length);
        for (i = 0; i < s; i++)
            if (r.directories[i] !== n.directories[i]) break;
        u = r.directories.slice(i), o = n.directories.slice(i);
        for (i = 0; i < u.length - 1; i++) a += "../";
        for (i = 0; i < o.length - 1; i++) a += o[i] + "/";
        return a
    }

    function b(e, t) {
        var n = /^((?:[a-z-]+:)?\/\/(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/,
            r = e.match(n),
            i = {},
            s = [],
            o, u;
        if (!r) throw new Error("Could not parse sheet href - '" + e + "'");
        if (!r[1] || r[2]) {
            u = t.match(n);
            if (!u) throw new Error("Could not parse page url - '" + t + "'");
            r[1] = u[1], r[2] || (r[3] = u[3] + r[3])
        }
        if (r[3]) {
            s = r[3].replace("\\", "/").split("/");
            for (o = 0; o < s.length; o++) s[o] === ".." && o > 0 && (s.splice(o - 1, 2), o -= 2)
        }
        return i.hostPart = r[1], i.directories = s, i.path = r[1] + s.join("/"), i.fileUrl = i.path + (r[4] || ""), i.url = i.fileUrl + (r[5] || ""), i
    }

    function w(t, n, i, s) {
        var o = t.contents || {},
            u = t.files || {},
            a = b(t.href, e.location.href),
            f = a.url,
            c = l && l.getItem(f),
            h = l && l.getItem(f + ":timestamp"),
            p = {
                css: c,
                timestamp: h
            },
            d;
        r.relativeUrls ? r.rootpath ? t.entryPath ? d = b(r.rootpath + y(a.path, t.entryPath)).path : d = r.rootpath : d = a.path : r.rootpath ? d = r.rootpath : t.entryPath ? d = t.entryPath : d = a.path, x(f, t.type, function(e, l) {
            v += e.replace(/@import .+?;/ig, "");
            if (!i && p && l && (new Date(l)).valueOf() === (new Date(p.timestamp)).valueOf()) S(p.css, t), n(null, null, e, t, {
                local: !0,
                remaining: s
            }, f);
            else try {
                o[f] = e, (new r.Parser({
                    optimization: r.optimization,
                    paths: [a.path],
                    entryPath: t.entryPath || a.path,
                    mime: t.type,
                    filename: f,
                    rootpath: d,
                    relativeUrls: t.relativeUrls,
                    contents: o,
                    files: u,
                    dumpLineNumbers: r.dumpLineNumbers
                })).parse(e, function(r, i) {
                    if (r) return k(r, f);
                    try {
                        n(r, i, e, t, {
                            local: !1,
                            lastModified: l,
                            remaining: s
                        }, f), N(document.getElementById("less-error-message:" + E(f)))
                    } catch (r) {
                        k(r, f)
                    }
                })
            } catch (c) {
                k(c, f)
            }
        }, function(e, t) {
            throw new Error("Couldn't load " + t + " (" + e + ")")
        })
    }

    function E(e) {
        return e.replace(/^[a-z]+:\/\/?[^\/]+/, "").replace(/^\//, "").replace(/\.[a-zA-Z]+$/, "").replace(/[^\.\w-]+/g, "-").replace(/\./g, ":")
    }

    function S(e, t, n) {
        var r, i = t.href || "",
            s = "less:" + (t.title || E(i));
        if ((r = document.getElementById(s)) === null) {
            r = document.createElement("style"), r.type = "text/css", t.media && (r.media = t.media), r.id = s;
            var o = t && t.nextSibling || null;
            (o || document.getElementsByTagName("head")[0]).parentNode.insertBefore(r, o)
        }
        if (r.styleSheet) try {
            r.styleSheet.cssText = e
        } catch (u) {
            throw new Error("Couldn't reassign styleSheet.cssText.")
        } else(function(e) {
            r.childNodes.length > 0 ? r.firstChild.nodeValue !== e.nodeValue && r.replaceChild(e, r.firstChild) : r.appendChild(e)
        })(document.createTextNode(e));
        if (n && l) {
            C("saving " + i + " to cache.");
            try {
                l.setItem(i, e), l.setItem(i + ":timestamp", n)
            } catch (u) {
                C("failed to save")
            }
        }
    }

    function x(e, t, n, i) {
        function a(t, n, r) {
            t.status >= 200 && t.status < 300 ? n(t.responseText, t.getResponseHeader("Last-Modified")) : typeof r == "function" && r(t.status, e)
        }
        var s = T(),
            u = o ? r.fileAsync : r.async;
        typeof s.overrideMimeType == "function" && s.overrideMimeType("text/css"), s.open("GET", e, u), s.setRequestHeader("Accept", t || "text/x-less, text/css; q=0.9, */*; q=0.5"), s.send(null), o && !r.fileAsync ? s.status === 0 || s.status >= 200 && s.status < 300 ? n(s.responseText) : i(s.status, e) : u ? s.onreadystatechange = function() {
            s.readyState == 4 && a(s, n, i)
        } : a(s, n, i)
    }

    function T() {
        if (e.XMLHttpRequest) return new XMLHttpRequest;
        try {
            return new ActiveXObject("MSXML2.XMLHTTP.3.0")
        } catch (t) {
            return C("browser doesn't support AJAX."), null
        }
    }

    function N(e) {
        return e && e.parentNode.removeChild(e)
    }

    function C(e) {
        r.env == "development" && typeof console != "undefined" && console.log("less: " + e)
    }

    function k(e, t) {
        var n = "less-error-message:" + E(t),
            i = '<li><label>{line}</label><pre class="{class}">{content}</pre></li>',
            s = document.createElement("div"),
            o, u, a = [],
            f = e.filename || t,
            l = f.match(/([^\/]+(\?.*)?)$/)[1];
        s.id = n, s.className = "less-error-message", u = "<h3>" + (e.message || "There is an error in your .less file") + "</h3>" + '<p>in <a href="' + f + '">' + l + "</a> ";
        var c = function(e, t, n) {
            e.extract[t] && a.push(i.replace(/\{line\}/, parseInt(e.line) + (t - 1)).replace(/\{class\}/, n).replace(/\{content\}/, e.extract[t]))
        };
        e.stack ? u += "<br/>" + e.stack.split("\n").slice(1).join("<br/>") : e.extract && (c(e, 0, ""), c(e, 1, "line"), c(e, 2, ""), u += "on line " + e.line + ", column " + (e.column + 1) + ":</p>" + "<ul>" + a.join("") + "</ul>"), s.innerHTML = u, S([".less-error-message ul, .less-error-message li {", "list-style-type: none;", "margin-right: 15px;", "padding: 4px 0;", "margin: 0;", "}", ".less-error-message label {", "font-size: 12px;", "margin-right: 15px;", "padding: 4px 0;", "color: #cc7777;", "}", ".less-error-message pre {", "color: #dd6666;", "padding: 4px 0;", "margin: 0;", "display: inline-block;", "}", ".less-error-message pre.line {", "color: #ff0000;", "}", ".less-error-message h3 {", "font-size: 20px;", "font-weight: bold;", "padding: 15px 0 5px 0;", "margin: 0;", "}", ".less-error-message a {", "color: #10a", "}", ".less-error-message .error {", "color: red;", "font-weight: bold;", "padding-bottom: 2px;", "border-bottom: 1px dashed red;", "}"].join("\n"), {
            title: "error-message"
        }), s.style.cssText = ["font-family: Arial, sans-serif", "border: 1px solid #e00", "background-color: #eee", "border-radius: 5px", "-webkit-border-radius: 5px", "-moz-border-radius: 5px", "color: #e00", "padding: 15px", "margin-bottom: 15px"].join(";"), r.env == "development" && (o = setInterval(function() {
            document.body && (document.getElementById(n) ? document.body.replaceChild(s, document.getElementById(n)) : document.body.insertBefore(s, document.body.firstChild), clearInterval(o))
        }, 10))
    }
    Array.isArray || (Array.isArray = function(e) {
        return Object.prototype.toString.call(e) === "[object Array]" || e instanceof Array
    }), Array.prototype.forEach || (Array.prototype.forEach = function(e, t) {
        var n = this.length >>> 0;
        for (var r = 0; r < n; r++) r in this && e.call(t, this[r], r, this)
    }), Array.prototype.map || (Array.prototype.map = function(e) {
        var t = this.length >>> 0,
            n = new Array(t),
            r = arguments[1];
        for (var i = 0; i < t; i++) i in this && (n[i] = e.call(r, this[i], i, this));
        return n
    }), Array.prototype.filter || (Array.prototype.filter = function(e) {
        var t = [],
            n = arguments[1];
        for (var r = 0; r < this.length; r++) e.call(n, this[r]) && t.push(this[r]);
        return t
    }), Array.prototype.reduce || (Array.prototype.reduce = function(e) {
        var t = this.length >>> 0,
            n = 0;
        if (t === 0 && arguments.length === 1) throw new TypeError;
        if (arguments.length >= 2) var r = arguments[1];
        else
            do {
                if (n in this) {
                    r = this[n++];
                    break
                }
                if (++n >= t) throw new TypeError
            } while (!0);
        for (; n < t; n++) n in this && (r = e.call(null, r, this[n], n, this));
        return r
    }), Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
        var t = this.length,
            n = arguments[1] || 0;
        if (!t) return -1;
        if (n >= t) return -1;
        n < 0 && (n += t);
        for (; n < t; n++) {
            if (!Object.prototype.hasOwnProperty.call(this, n)) continue;
            if (e === this[n]) return n
        }
        return -1
    }), Object.keys || (Object.keys = function(e) {
        var t = [];
        for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
        return t
    }), String.prototype.trim || (String.prototype.trim = function() {
        return String(this).replace(/^\s\s*/, "").replace(/\s\s*$/, "")
    });
    var r, i, s;
    typeof environment == "object" && {}.toString.call(environment) === "[object Environment]" ? (typeof e == "undefined" ? r = {} : r = e.less = {}, i = r.tree = {}, r.mode = "rhino") : typeof e == "undefined" ? (r = exports, i = n("./tree"), r.mode = "node") : (typeof e.less == "undefined" && (e.less = {}), r = e.less, i = e.less.tree = {}, r.mode = "browser"), r.Parser = function(t) {
        function g() {
            a = c[u], f = o, h = o
        }

        function y() {
            c[u] = a, o = f, h = o
        }

        function b() {
            o > h && (c[u] = c[u].slice(o - h), h = o)
        }

        function w(e) {
            var t = e.charCodeAt(0);
            return t === 32 || t === 10 || t === 9
        }

        function E(e) {
            var t, n, r, i, a;
            if (e instanceof Function) return e.call(p.parsers);
            if (typeof e == "string") t = s.charAt(o) === e ? e : null, r = 1, b();
            else {
                b();
                if (!(t = e.exec(c[u]))) return null;
                r = t[0].length
            }
            if (t) return S(r), typeof t == "string" ? t : t.length === 1 ? t[0] : t
        }

        function S(e) {
            var t = o,
                n = u,
                r = o + c[u].length,
                i = o += e;
            while (o < r) {
                if (!w(s.charAt(o))) break;
                o++
            }
            return c[u] = c[u].slice(e + (o - i)), h = o, c[u].length === 0 && u < c.length - 1 && u++, t !== o || n !== u
        }

        function x(e, t) {
            var n = E(e);
            if (!!n) return n;
            T(t || (typeof e == "string" ? "expected '" + e + "' got '" + s.charAt(o) + "'" : "unexpected token"))
        }

        function T(e, t) {
            var n = new Error(e);
            throw n.index = o, n.type = t || "Syntax", n
        }

        function N(e) {
            return typeof e == "string" ? s.charAt(o) === e : e.test(c[u]) ? !0 : !1
        }

        function C(e, t) {
            return e.filename && t.filename && e.filename !== t.filename ? p.imports.contents[e.filename] : s
        }

        function k(e, t) {
            for (var n = e, r = -1; n >= 0 && t.charAt(n) !== "\n"; n--) r++;
            return {
                line: typeof e == "number" ? (t.slice(0, e).match(/\n/g) || "").length : null,
                column: r
            }
        }

        function L(e) {
            return r.mode === "browser" || r.mode === "rhino" ? e.filename : n("path").resolve(e.filename)
        }

        function A(e, t, n) {
            return {
                lineNumber: k(e, t).line + 1,
                fileName: L(n)
            }
        }

        function O(e, t) {
            var n = C(e, t),
                r = k(e.index, n),
                i = r.line,
                s = r.column,
                o = n.split("\n");
            this.type = e.type || "Syntax", this.message = e.message, this.filename = e.filename || t.filename, this.index = e.index, this.line = typeof i == "number" ? i + 1 : null, this.callLine = e.call && k(e.call, n).line + 1, this.callExtract = o[k(e.call, n).line], this.stack = e.stack, this.column = s, this.extract = [o[i - 1], o[i], o[i + 1]]
        }
        var s, o, u, a, f, l, c, h, p, d = this,
            t = t || {};
        t.contents || (t.contents = {}), t.rootpath = t.rootpath || "", t.files || (t.files = {});
        var v = function() {},
            m = this.imports = {
                paths: t.paths || [],
                queue: [],
                files: t.files,
                contents: t.contents,
                mime: t.mime,
                error: null,
                push: function(e, n) {
                    var i = this;
                    this.queue.push(e), r.Parser.importer(e, this.paths, function(t, r, s) {
                        i.queue.splice(i.queue.indexOf(e), 1);
                        var o = s in i.files;
                        i.files[s] = r, t && !i.error && (i.error = t), n(t, r, o), i.queue.length === 0 && v(i.error)
                    }, t)
                }
            };
        return this.env = t = t || {}, this.optimization = "optimization" in this.env ? this.env.optimization : 1, this.env.filename = this.env.filename || null, p = {
            imports: m,
            parse: function(e, a) {
                var f, d, m, g, y, b, w = [],
                    S, x = null;
                o = u = h = l = 0, s = e.replace(/\r\n/g, "\n"), s = s.replace(/^\uFEFF/, ""), c = function(e) {
                    var n = 0,
                        r = /(?:@\{[\w-]+\}|[^"'`\{\}\/\(\)\\])+/g,
                        i = /\/\*(?:[^*]|\*+[^\/*])*\*+\/|\/\/.*/g,
                        o = /"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'|`((?:[^`]|\\.)*)`/g,
                        u = 0,
                        a, f = e[0],
                        l;
                    for (var c = 0, h, p; c < s.length;) {
                        r.lastIndex = c, (a = r.exec(s)) && a.index === c && (c += a[0].length, f.push(a[0])), h = s.charAt(c), i.lastIndex = o.lastIndex = c;
                        if (a = o.exec(s))
                            if (a.index === c) {
                                c += a[0].length, f.push(a[0]);
                                continue
                            }
                        if (!l && h === "/") {
                            p = s.charAt(c + 1);
                            if (p === "/" || p === "*")
                                if (a = i.exec(s))
                                    if (a.index === c) {
                                        c += a[0].length, f.push(a[0]);
                                        continue
                                    }
                        }
                        switch (h) {
                            case "{":
                                if (!l) {
                                    u++, f.push(h);
                                    break
                                };
                            case "}":
                                if (!l) {
                                    u--, f.push(h), e[++n] = f = [];
                                    break
                                };
                            case "(":
                                if (!l) {
                                    l = !0, f.push(h);
                                    break
                                };
                            case ")":
                                if (l) {
                                    l = !1, f.push(h);
                                    break
                                };
                            default:
                                f.push(h)
                        }
                        c++
                    }
                    return u != 0 && (x = new O({
                        index: c - 1,
                        type: "Parse",
                        message: u > 0 ? "missing closing `}`" : "missing opening `{`",
                        filename: t.filename
                    }, t)), e.map(function(e) {
                        return e.join("")
                    })
                }([
                    []
                ]);
                if (x) return a(x, t);
                try {
                    f = new i.Ruleset([], E(this.parsers.primary)), f.root = !0
                } catch (T) {
                    return a(new O(T, t))
                }
                f.toCSS = function(e) {
                    var s, o, u;
                    return function(s, o) {
                        var u = [],
                            a;
                        s = s || {}, typeof o == "object" && !Array.isArray(o) && (o = Object.keys(o).map(function(e) {
                            var t = o[e];
                            return t instanceof i.Value || (t instanceof i.Expression || (t = new i.Expression([t])), t = new i.Value([t])), new i.Rule("@" + e, t, !1, 0)
                        }), u = [new i.Ruleset(null, o)]);
                        try {
                            var f = e.call(this, {
                                frames: u
                            }).toCSS([], {
                                compress: s.compress || !1,
                                dumpLineNumbers: t.dumpLineNumbers
                            })
                        } catch (l) {
                            throw new O(l, t)
                        }
                        if (a = p.imports.error) throw a instanceof O ? a : new O(a, t);
                        return s.yuicompress && r.mode === "node" ? n("ycssmin").cssmin(f) : s.compress ? f.replace(/(\s)+/g, "$1") : f
                    }
                }(f.eval);
                if (o < s.length - 1) {
                    o = l, b = s.split("\n"), y = (s.slice(0, o).match(/\n/g) || "").length + 1;
                    for (var N = o, C = -1; N >= 0 && s.charAt(N) !== "\n"; N--) C++;
                    x = {
                        type: "Parse",
                        message: "Syntax Error on line " + y,
                        index: o,
                        filename: t.filename,
                        line: y,
                        column: C,
                        extract: [b[y - 2], b[y - 1], b[y]]
                    }
                }
                this.imports.queue.length > 0 ? v = function(e) {
                    e = x || e, e ? a(e) : a(null, f)
                } : a(x, f)
            },
            parsers: {
                primary: function() {
                    var e, t = [];
                    while ((e = E(this.mixin.definition) || E(this.rule) || E(this.ruleset) || E(this.mixin.call) || E(this.comment) || E(this.directive)) || E(/^[\s\n]+/) || E(/^;+/)) e && t.push(e);
                    return t
                },
                comment: function() {
                    var e;
                    if (s.charAt(o) !== "/") return;
                    if (s.charAt(o + 1) === "/") return new i.Comment(E(/^\/\/.*/), !0);
                    if (e = E(/^\/\*(?:[^*]|\*+[^\/*])*\*+\/\n?/)) return new i.Comment(e)
                },
                entities: {
                    quoted: function() {
                        var e, t = o,
                            n;
                        s.charAt(t) === "~" && (t++, n = !0);
                        if (s.charAt(t) !== '"' && s.charAt(t) !== "'") return;
                        n && E("~");
                        if (e = E(/^"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/)) return new i.Quoted(e[0], e[1] || e[2], n)
                    },
                    keyword: function() {
                        var e;
                        if (e = E(/^[_A-Za-z-][_A-Za-z0-9-]*/)) return i.colors.hasOwnProperty(e) ? new i.Color(i.colors[e].slice(1)) : new i.Keyword(e)
                    },
                    call: function() {
                        var e, n, r, s, a = o;
                        if (!(e = /^([\w-]+|%|progid:[\w\.]+)\(/.exec(c[u]))) return;
                        e = e[1], n = e.toLowerCase();
                        if (n === "url") return null;
                        o += e.length;
                        if (n === "alpha") {
                            s = E(this.alpha);
                            if (typeof s != "undefined") return s
                        }
                        E("("), r = E(this.entities.arguments);
                        if (!E(")")) return;
                        if (e) return new i.Call(e, r, a, t.filename)
                    },
                    arguments: function() {
                        var e = [],
                            t;
                        while (t = E(this.entities.assignment) || E(this.expression)) {
                            e.push(t);
                            if (!E(",")) break
                        }
                        return e
                    },
                    literal: function() {
                        return E(this.entities.ratio) || E(this.entities.dimension) || E(this.entities.color) || E(this.entities.quoted) || E(this.entities.unicodeDescriptor)
                    },
                    assignment: function() {
                        var e, t;
                        if ((e = E(/^\w+(?=\s?=)/i)) && E("=") && (t = E(this.entity))) return new i.Assignment(e, t)
                    },
                    url: function() {
                        var e;
                        if (s.charAt(o) !== "u" || !E(/^url\(/)) return;
                        return e = E(this.entities.quoted) || E(this.entities.variable) || E(/^(?:(?:\\[\(\)'"])|[^\(\)'"])+/) || "", x(")"), new i.URL(e.value != null || e instanceof i.Variable ? e : new i.Anonymous(e), t.rootpath)
                    },
                    variable: function() {
                        var e, n = o;
                        if (s.charAt(o) === "@" && (e = E(/^@@?[\w-]+/))) return new i.Variable(e, n, t.filename)
                    },
                    variableCurly: function() {
                        var e, n, r = o;
                        if (s.charAt(o) === "@" && (n = E(/^@\{([\w-]+)\}/))) return new i.Variable("@" + n[1], r, t.filename)
                    },
                    color: function() {
                        var e;
                        if (s.charAt(o) === "#" && (e = E(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/))) return new i.Color(e[1])
                    },
                    dimension: function() {
                        var e, t = s.charCodeAt(o);
                        if (t > 57 || t < 43 || t === 47 || t == 44) return;
                        if (e = E(/^([+-]?\d*\.?\d+)(px|%|em|pc|ex|in|deg|s|ms|pt|cm|mm|rad|grad|turn|dpi|dpcm|dppx|rem|vw|vh|vmin|vm|ch)?/)) return new i.Dimension(e[1], e[2])
                    },
                    ratio: function() {
                        var e, t = s.charCodeAt(o);
                        if (t > 57 || t < 48) return;
                        if (e = E(/^(\d+\/\d+)/)) return new i.Ratio(e[1])
                    },
                    unicodeDescriptor: function() {
                        var e;
                        if (e = E(/^U\+[0-9a-fA-F?]+(\-[0-9a-fA-F?]+)?/)) return new i.UnicodeDescriptor(e[0])
                    },
                    javascript: function() {
                        var e, t = o,
                            n;
                        s.charAt(t) === "~" && (t++, n = !0);
                        if (s.charAt(t) !== "`") return;
                        n && E("~");
                        if (e = E(/^`([^`]*)`/)) return new i.JavaScript(e[1], o, n)
                    }
                },
                variable: function() {
                    var e;
                    if (s.charAt(o) === "@" && (e = E(/^(@[\w-]+)\s*:/))) return e[1]
                },
                shorthand: function() {
                    var e, t;
                    if (!N(/^[@\w.%-]+\/[@\w.-]+/)) return;
                    g();
                    if ((e = E(this.entity)) && E("/") && (t = E(this.entity))) return new i.Shorthand(e, t);
                    y()
                },
                mixin: {
                    call: function() {
                        var e = [],
                            n, r, u = [],
                            a = [],
                            f, l, c, h, p, d, v, m = o,
                            b = s.charAt(o),
                            w, S, C = !1;
                        if (b !== "." && b !== "#") return;
                        g();
                        while (n = E(/^[#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/)) e.push(new i.Element(r, n, o)), r = E(">");
                        if (E("(")) {
                            p = [];
                            while (c = E(this.expression)) {
                                h = null, S = c;
                                if (c.value.length == 1) {
                                    var k = c.value[0];
                                    k instanceof i.Variable && E(":") && (p.length > 0 && (d && T("Cannot mix ; and , as delimiter types"), v = !0), S = x(this.expression), h = w = k.name)
                                }
                                p.push(S), a.push({
                                    name: h,
                                    value: S
                                });
                                if (E(",")) continue;
                                if (E(";") || d) v && T("Cannot mix ; and , as delimiter types"), d = !0, p.length > 1 && (S = new i.Value(p)), u.push({
                                    name: w,
                                    value: S
                                }), w = null, p = [], v = !1
                            }
                            x(")")
                        }
                        f = d ? u : a, E(this.important) && (C = !0);
                        if (e.length > 0 && (E(";") || N("}"))) return new i.mixin.Call(e, f, m, t.filename, C);
                        y()
                    },
                    definition: function() {
                        var e, t = [],
                            n, r, u, a, f, c = !1;
                        if (s.charAt(o) !== "." && s.charAt(o) !== "#" || N(/^[^{]*\}/)) return;
                        g();
                        if (n = E(/^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/)) {
                            e = n[1];
                            do {
                                E(this.comment);
                                if (s.charAt(o) === "." && E(/^\.{3}/)) {
                                    c = !0, t.push({
                                        variadic: !0
                                    });
                                    break
                                }
                                if (!(u = E(this.entities.variable) || E(this.entities.literal) || E(this.entities.keyword))) break;
                                if (u instanceof i.Variable)
                                    if (E(":")) a = x(this.expression, "expected expression"), t.push({
                                        name: u.name,
                                        value: a
                                    });
                                    else {
                                        if (E(/^\.{3}/)) {
                                            t.push({
                                                name: u.name,
                                                variadic: !0
                                            }), c = !0;
                                            break
                                        }
                                        t.push({
                                            name: u.name
                                        })
                                    }
                                else t.push({
                                    value: u
                                })
                            } while (E(",") || E(";"));
                            E(")") || (l = o, y()), E(this.comment), E(/^when/) && (f = x(this.conditions, "expected condition")), r = E(this.block);
                            if (r) return new i.mixin.Definition(e, t, r, f, c);
                            y()
                        }
                    }
                },
                entity: function() {
                    return E(this.entities.literal) || E(this.entities.variable) || E(this.entities.url) || E(this.entities.call) || E(this.entities.keyword) || E(this.entities.javascript) || E(this.comment)
                },
                end: function() {
                    return E(";") || N("}")
                },
                alpha: function() {
                    var e;
                    if (!E(/^\(opacity=/i)) return;
                    if (e = E(/^\d+/) || E(this.entities.variable)) return x(")"), new i.Alpha(e)
                },
                element: function() {
                    var e, t, n, r;
                    n = E(this.combinator), e = E(/^(?:\d+\.\d+|\d+)%/) || E(/^(?:[.#]?|:*)(?:[\w-]|[^\x00-\x9f]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/) || E("*") || E("&") || E(this.attribute) || E(/^\([^()@]+\)/) || E(/^[\.#](?=@)/) || E(this.entities.variableCurly), e || E("(") && (r = E(this.entities.variableCurly) || E(this.entities.variable) || E(this.selector)) && E(")") && (e = new i.Paren(r));
                    if (e) return new i.Element(n, e, o)
                },
                combinator: function() {
                    var e, t = s.charAt(o);
                    if (t === ">" || t === "+" || t === "~" || t === "|") {
                        o++;
                        while (s.charAt(o).match(/\s/)) o++;
                        return new i.Combinator(t)
                    }
                    return s.charAt(o - 1).match(/\s/) ? new i.Combinator(" ") : new i.Combinator(null)
                },
                selector: function() {
                    var e, t, n = [],
                        r, u;
                    if (E("(")) return e = E(this.entity), E(")") ? new i.Selector([new i.Element("", e, o)]) : null;
                    while (t = E(this.element)) {
                        r = s.charAt(o), n.push(t);
                        if (r === "{" || r === "}" || r === ";" || r === "," || r === ")") break
                    }
                    if (n.length > 0) return new i.Selector(n)
                },
                attribute: function() {
                    var e = "",
                        t, n, r;
                    if (!E("[")) return;
                    if (t = E(/^(?:[_A-Za-z0-9-]|\\.)+/) || E(this.entities.quoted))(r = E(/^[|~*$^]?=/)) && (n = E(this.entities.quoted) || E(/^[\w-]+/)) ? e = [t, r, n.toCSS ? n.toCSS() : n].join("") : e = t;
                    if (!E("]")) return;
                    if (e) return "[" + e + "]"
                },
                block: function() {
                    var e;
                    if (E("{") && (e = E(this.primary)) && E("}")) return e
                },
                ruleset: function() {
                    var e = [],
                        n, r, u, a;
                    g(), t.dumpLineNumbers && (a = A(o, s, t));
                    while (n = E(this.selector)) {
                        e.push(n), E(this.comment);
                        if (!E(",")) break;
                        E(this.comment)
                    }
                    if (e.length > 0 && (r = E(this.block))) {
                        var f = new i.Ruleset(e, r, t.strictImports);
                        return t.dumpLineNumbers && (f.debugInfo = a), f
                    }
                    l = o, y()
                },
                rule: function() {
                    var e, t, n = s.charAt(o),
                        r, a;
                    g();
                    if (n === "." || n === "#" || n === "&") return;
                    if (e = E(this.variable) || E(this.property)) {
                        e.charAt(0) != "@" && (a = /^([^@+\/'"*`(;{}-]*);/.exec(c[u])) ? (o += a[0].length - 1, t = new i.Anonymous(a[1])) : e === "font" ? t = E(this.font) : t = E(this.value), r = E(this.important);
                        if (t && E(this.end)) return new i.Rule(e, t, r, f);
                        l = o, y()
                    }
                },
                "import": function() {
                    var e, n, r = o;
                    g();
                    var s = E(/^@import(?:-(once))?\s+/);
                    if (s && (e = E(this.entities.quoted) || E(this.entities.url))) {
                        n = E(this.mediaFeatures);
                        if (E(";")) return new i.Import(e, m, n, s[1] === "once", r, t.rootpath)
                    }
                    y()
                },
                mediaFeature: function() {
                    var e, t, n = [];
                    do
                        if (e = E(this.entities.keyword)) n.push(e);
                        else if (E("(")) {
                        t = E(this.property), e = E(this.entity);
                        if (!E(")")) return null;
                        if (t && e) n.push(new i.Paren(new i.Rule(t, e, null, o, !0)));
                        else {
                            if (!e) return null;
                            n.push(new i.Paren(e))
                        }
                    } while (e);
                    if (n.length > 0) return new i.Expression(n)
                },
                mediaFeatures: function() {
                    var e, t = [];
                    do
                        if (e = E(this.mediaFeature)) {
                            t.push(e);
                            if (!E(",")) break
                        } else if (e = E(this.entities.variable)) {
                        t.push(e);
                        if (!E(",")) break
                    } while (e);
                    return t.length > 0 ? t : null
                },
                media: function() {
                    var e, n, r, u;
                    t.dumpLineNumbers && (u = A(o, s, t));
                    if (E(/^@media/)) {
                        e = E(this.mediaFeatures);
                        if (n = E(this.block)) return r = new i.Media(n, e), t.dumpLineNumbers && (r.debugInfo = u), r
                    }
                },
                directive: function() {
                    var e, n, r, u, a, f, l, c, h, p;
                    if (s.charAt(o) !== "@") return;
                    if (n = E(this["import"]) || E(this.media)) return n;
                    g(), e = E(/^@[a-z-]+/);
                    if (!e) return;
                    l = e, e.charAt(1) == "-" && e.indexOf("-", 2) > 0 && (l = "@" + e.slice(e.indexOf("-", 2) + 1));
                    switch (l) {
                        case "@font-face":
                            c = !0;
                            break;
                        case "@viewport":
                        case "@top-left":
                        case "@top-left-corner":
                        case "@top-center":
                        case "@top-right":
                        case "@top-right-corner":
                        case "@bottom-left":
                        case "@bottom-left-corner":
                        case "@bottom-center":
                        case "@bottom-right":
                        case "@bottom-right-corner":
                        case "@left-top":
                        case "@left-middle":
                        case "@left-bottom":
                        case "@right-top":
                        case "@right-middle":
                        case "@right-bottom":
                            c = !0;
                            break;
                        case "@page":
                        case "@document":
                        case "@supports":
                        case "@keyframes":
                            c = !0, h = !0;
                            break;
                        case "@namespace":
                            p = !0
                    }
                    h && (e += " " + (E(/^[^{]+/) || "").trim());
                    if (c) {
                        if (r = E(this.block)) return new i.Directive(e, r)
                    } else if ((n = p ? E(this.expression) : E(this.entity)) && E(";")) {
                        var d = new i.Directive(e, n);
                        return t.dumpLineNumbers && (d.debugInfo = A(o, s, t)), d
                    }
                    y()
                },
                font: function() {
                    var e = [],
                        t = [],
                        n, r, s, o;
                    while (o = E(this.shorthand) || E(this.entity)) t.push(o);
                    e.push(new i.Expression(t));
                    if (E(","))
                        while (o = E(this.expression)) {
                            e.push(o);
                            if (!E(",")) break
                        }
                    return new i.Value(e)
                },
                value: function() {
                    var e, t = [],
                        n;
                    while (e = E(this.expression)) {
                        t.push(e);
                        if (!E(",")) break
                    }
                    if (t.length > 0) return new i.Value(t)
                },
                important: function() {
                    if (s.charAt(o) === "!") return E(/^! *important/)
                },
                sub: function() {
                    var e;
                    if (E("(") && (e = E(this.expression)) && E(")")) return e
                },
                multiplication: function() {
                    var e, t, n, r;
                    if (e = E(this.operand)) {
                        while (!N(/^\/[*\/]/) && (n = E("/") || E("*")) && (t = E(this.operand))) r = new i.Operation(n, [r || e, t]);
                        return r || e
                    }
                },
                addition: function() {
                    var e, t, n, r;
                    if (e = E(this.multiplication)) {
                        while ((n = E(/^[-+]\s+/) || !w(s.charAt(o - 1)) && (E("+") || E("-"))) && (t = E(this.multiplication))) r = new i.Operation(n, [r || e, t]);
                        return r || e
                    }
                },
                conditions: function() {
                    var e, t, n = o,
                        r;
                    if (e = E(this.condition)) {
                        while (E(",") && (t = E(this.condition))) r = new i.Condition("or", r || e, t, n);
                        return r || e
                    }
                },
                condition: function() {
                    var e, t, n, r, s = o,
                        u = !1;
                    E(/^not/) && (u = !0), x("(");
                    if (e = E(this.addition) || E(this.entities.keyword) || E(this.entities.quoted)) return (r = E(/^(?:>=|=<|[<=>])/)) ? (t = E(this.addition) || E(this.entities.keyword) || E(this.entities.quoted)) ? n = new i.Condition(r, e, t, s, u) : T("expected expression") : n = new i.Condition("=", e, new i.Keyword("true"), s, u), x(")"), E(/^and/) ? new i.Condition("and", n, E(this.condition)) : n
                },
                operand: function() {
                    var e, t = s.charAt(o + 1);
                    s.charAt(o) === "-" && (t === "@" || t === "(") && (e = E("-"));
                    var n = E(this.sub) || E(this.entities.dimension) || E(this.entities.color) || E(this.entities.variable) || E(this.entities.call);
                    return e ? new i.Operation("*", [new i.Dimension(-1), n]) : n
                },
                expression: function() {
                    var e, t, n = [],
                        r;
                    while (e = E(this.addition) || E(this.entity)) n.push(e);
                    if (n.length > 0) return new i.Expression(n)
                },
                property: function() {
                    var e;
                    if (e = E(/^(\*?-?[_a-z0-9-]+)\s*:/)) return e[1]
                }
            }
        }
    };
    if (r.mode === "browser" || r.mode === "rhino") r.Parser.importer = function(e, t, n, r) {
        !/^([a-z-]+:)?\//.test(e) && t.length > 0 && (e = t[0] + e), w({
            href: e,
            title: e,
            type: r.mime,
            contents: r.contents,
            files: r.files,
            rootpath: r.rootpath,
            entryPath: r.entryPath,
            relativeUrls: r.relativeUrls
        }, function(e, i, s, o, u, a) {
            e && typeof r.errback == "function" ? r.errback.call(null, a, t, n, r) : n.call(null, e, i, a)
        }, !0)
    };
    (function(e) {
        function t(t) {
            return e.functions.hsla(t.h, t.s, t.l, t.a)
        }

        function n(t, n) {
            return t instanceof e.Dimension && t.unit == "%" ? parseFloat(t.value * n / 100) : r(t)
        }

        function r(t) {
            if (t instanceof e.Dimension) return parseFloat(t.unit == "%" ? t.value / 100 : t.value);
            if (typeof t == "number") return t;
            throw {
                error: "RuntimeError",
                message: "color functions take numbers as parameters"
            }
        }

        function i(e) {
            return Math.min(1, Math.max(0, e))
        }
        e.functions = {
            rgb: function(e, t, n) {
                return this.rgba(e, t, n, 1)
            },
            rgba: function(t, i, s, o) {
                var u = [t, i, s].map(function(e) {
                    return n(e, 256)
                });
                return o = r(o), new e.Color(u, o)
            },
            hsl: function(e, t, n) {
                return this.hsla(e, t, n, 1)
            },
            hsla: function(e, t, n, i) {
                function u(e) {
                    return e = e < 0 ? e + 1 : e > 1 ? e - 1 : e, e * 6 < 1 ? o + (s - o) * e * 6 : e * 2 < 1 ? s : e * 3 < 2 ? o + (s - o) * (2 / 3 - e) * 6 : o
                }
                e = r(e) % 360 / 360, t = r(t), n = r(n), i = r(i);
                var s = n <= .5 ? n * (t + 1) : n + t - n * t,
                    o = n * 2 - s;
                return this.rgba(u(e + 1 / 3) * 255, u(e) * 255, u(e - 1 / 3) * 255, i)
            },
            hsv: function(e, t, n) {
                return this.hsva(e, t, n, 1)
            },
            hsva: function(e, t, n, i) {
                e = r(e) % 360 / 360 * 360, t = r(t), n = r(n), i = r(i);
                var s, o;
                s = Math.floor(e / 60 % 6), o = e / 60 - s;
                var u = [n, n * (1 - t), n * (1 - o * t), n * (1 - (1 - o) * t)],
                    a = [
                        [0, 3, 1],
                        [2, 0, 1],
                        [1, 0, 3],
                        [1, 2, 0],
                        [3, 1, 0],
                        [0, 1, 2]
                    ];
                return this.rgba(u[a[s][0]] * 255, u[a[s][1]] * 255, u[a[s][2]] * 255, i)
            },
            hue: function(t) {
                return new e.Dimension(Math.round(t.toHSL().h))
            },
            saturation: function(t) {
                return new e.Dimension(Math.round(t.toHSL().s * 100), "%")
            },
            lightness: function(t) {
                return new e.Dimension(Math.round(t.toHSL().l * 100), "%")
            },
            red: function(t) {
                return new e.Dimension(t.rgb[0])
            },
            green: function(t) {
                return new e.Dimension(t.rgb[1])
            },
            blue: function(t) {
                return new e.Dimension(t.rgb[2])
            },
            alpha: function(t) {
                return new e.Dimension(t.toHSL().a)
            },
            luma: function(t) {
                return new e.Dimension(Math.round((.2126 * (t.rgb[0] / 255) + .7152 * (t.rgb[1] / 255) + .0722 * (t.rgb[2] / 255)) * t.alpha * 100), "%")
            },
            saturate: function(e, n) {
                var r = e.toHSL();
                return r.s += n.value / 100, r.s = i(r.s), t(r)
            },
            desaturate: function(e, n) {
                var r = e.toHSL();
                return r.s -= n.value / 100, r.s = i(r.s), t(r)
            },
            lighten: function(e, n) {
                var r = e.toHSL();
                return r.l += n.value / 100, r.l = i(r.l), t(r)
            },
            darken: function(e, n) {
                var r = e.toHSL();
                return r.l -= n.value / 100, r.l = i(r.l), t(r)
            },
            fadein: function(e, n) {
                var r = e.toHSL();
                return r.a += n.value / 100, r.a = i(r.a), t(r)
            },
            fadeout: function(e, n) {
                var r = e.toHSL();
                return r.a -= n.value / 100, r.a = i(r.a), t(r)
            },
            fade: function(e, n) {
                var r = e.toHSL();
                return r.a = n.value / 100, r.a = i(r.a), t(r)
            },
            spin: function(e, n) {
                var r = e.toHSL(),
                    i = (r.h + n.value) % 360;
                return r.h = i < 0 ? 360 + i : i, t(r)
            },
            mix: function(t, n, r) {
                r || (r = new e.Dimension(50));
                var i = r.value / 100,
                    s = i * 2 - 1,
                    o = t.toHSL().a - n.toHSL().a,
                    u = ((s * o == -1 ? s : (s + o) / (1 + s * o)) + 1) / 2,
                    a = 1 - u,
                    f = [t.rgb[0] * u + n.rgb[0] * a, t.rgb[1] * u + n.rgb[1] * a, t.rgb[2] * u + n.rgb[2] * a],
                    l = t.alpha * i + n.alpha * (1 - i);
                return new e.Color(f, l)
            },
            greyscale: function(t) {
                return this.desaturate(t, new e.Dimension(100))
            },
            contrast: function(e, t, n, r) {
                return e.rgb ? (typeof n == "undefined" && (n = this.rgba(255, 255, 255, 1)), typeof t == "undefined" && (t = this.rgba(0, 0, 0, 1)), typeof r == "undefined" ? r = .43 : r = r.value, (.2126 * (e.rgb[0] / 255) + .7152 * (e.rgb[1] / 255) + .0722 * (e.rgb[2] / 255)) * e.alpha < r ? n : t) : null
            },
            e: function(t) {
                return new e.Anonymous(t instanceof e.JavaScript ? t.evaluated : t)
            },
            escape: function(t) {
                return new e.Anonymous(encodeURI(t.value).replace(/=/g, "%3D").replace(/:/g, "%3A").replace(/#/g, "%23").replace(/;/g, "%3B").replace(/\(/g, "%28").replace(/\)/g, "%29"))
            },
            "%": function(t) {
                var n = Array.prototype.slice.call(arguments, 1),
                    r = t.value;
                for (var i = 0; i < n.length; i++) r = r.replace(/%[sda]/i, function(e) {
                    var t = e.match(/s/i) ? n[i].value : n[i].toCSS();
                    return e.match(/[A-Z]$/) ? encodeURIComponent(t) : t
                });
                return r = r.replace(/%%/g, "%"), new e.Quoted('"' + r + '"', r)
            },
            unit: function(t, n) {
                return new e.Dimension(t.value, n ? n.toCSS() : "")
            },
            round: function(e, t) {
                var n = typeof t == "undefined" ? 0 : t.value;
                return this._math(function(e) {
                    return e.toFixed(n)
                }, e)
            },
            ceil: function(e) {
                return this._math(Math.ceil, e)
            },
            floor: function(e) {
                return this._math(Math.floor, e)
            },
            _math: function(t, n) {
                if (n instanceof e.Dimension) return new e.Dimension(t(parseFloat(n.value)), n.unit);
                if (typeof n == "number") return t(n);
                throw {
                    type: "Argument",
                    message: "argument must be a number"
                }
            },
            argb: function(t) {
                return new e.Anonymous(t.toARGB())
            },
            percentage: function(t) {
                return new e.Dimension(t.value * 100, "%")
            },
            color: function(t) {
                if (t instanceof e.Quoted) return new e.Color(t.value.slice(1));
                throw {
                    type: "Argument",
                    message: "argument must be a string"
                }
            },
            iscolor: function(t) {
                return this._isa(t, e.Color)
            },
            isnumber: function(t) {
                return this._isa(t, e.Dimension)
            },
            isstring: function(t) {
                return this._isa(t, e.Quoted)
            },
            iskeyword: function(t) {
                return this._isa(t, e.Keyword)
            },
            isurl: function(t) {
                return this._isa(t, e.URL)
            },
            ispixel: function(t) {
                return t instanceof e.Dimension && t.unit === "px" ? e.True : e.False
            },
            ispercentage: function(t) {
                return t instanceof e.Dimension && t.unit === "%" ? e.True : e.False
            },
            isem: function(t) {
                return t instanceof e.Dimension && t.unit === "em" ? e.True : e.False
            },
            _isa: function(t, n) {
                return t instanceof n ? e.True : e.False
            },
            multiply: function(e, t) {
                var n = e.rgb[0] * t.rgb[0] / 255,
                    r = e.rgb[1] * t.rgb[1] / 255,
                    i = e.rgb[2] * t.rgb[2] / 255;
                return this.rgb(n, r, i)
            },
            screen: function(e, t) {
                var n = 255 - (255 - e.rgb[0]) * (255 - t.rgb[0]) / 255,
                    r = 255 - (255 - e.rgb[1]) * (255 - t.rgb[1]) / 255,
                    i = 255 - (255 - e.rgb[2]) * (255 - t.rgb[2]) / 255;
                return this.rgb(n, r, i)
            },
            overlay: function(e, t) {
                var n = e.rgb[0] < 128 ? 2 * e.rgb[0] * t.rgb[0] / 255 : 255 - 2 * (255 - e.rgb[0]) * (255 - t.rgb[0]) / 255,
                    r = e.rgb[1] < 128 ? 2 * e.rgb[1] * t.rgb[1] / 255 : 255 - 2 * (255 - e.rgb[1]) * (255 - t.rgb[1]) / 255,
                    i = e.rgb[2] < 128 ? 2 * e.rgb[2] * t.rgb[2] / 255 : 255 - 2 * (255 - e.rgb[2]) * (255 - t.rgb[2]) / 255;
                return this.rgb(n, r, i)
            },
            softlight: function(e, t) {
                var n = t.rgb[0] * e.rgb[0] / 255,
                    r = n + e.rgb[0] * (255 - (255 - e.rgb[0]) * (255 - t.rgb[0]) / 255 - n) / 255;
                n = t.rgb[1] * e.rgb[1] / 255;
                var i = n + e.rgb[1] * (255 - (255 - e.rgb[1]) * (255 - t.rgb[1]) / 255 - n) / 255;
                n = t.rgb[2] * e.rgb[2] / 255;
                var s = n + e.rgb[2] * (255 - (255 - e.rgb[2]) * (255 - t.rgb[2]) / 255 - n) / 255;
                return this.rgb(r, i, s)
            },
            hardlight: function(e, t) {
                var n = t.rgb[0] < 128 ? 2 * t.rgb[0] * e.rgb[0] / 255 : 255 - 2 * (255 - t.rgb[0]) * (255 - e.rgb[0]) / 255,
                    r = t.rgb[1] < 128 ? 2 * t.rgb[1] * e.rgb[1] / 255 : 255 - 2 * (255 - t.rgb[1]) * (255 - e.rgb[1]) / 255,
                    i = t.rgb[2] < 128 ? 2 * t.rgb[2] * e.rgb[2] / 255 : 255 - 2 * (255 - t.rgb[2]) * (255 - e.rgb[2]) / 255;
                return this.rgb(n, r, i)
            },
            difference: function(e, t) {
                var n = Math.abs(e.rgb[0] - t.rgb[0]),
                    r = Math.abs(e.rgb[1] - t.rgb[1]),
                    i = Math.abs(e.rgb[2] - t.rgb[2]);
                return this.rgb(n, r, i)
            },
            exclusion: function(e, t) {
                var n = e.rgb[0] + t.rgb[0] * (255 - e.rgb[0] - e.rgb[0]) / 255,
                    r = e.rgb[1] + t.rgb[1] * (255 - e.rgb[1] - e.rgb[1]) / 255,
                    i = e.rgb[2] + t.rgb[2] * (255 - e.rgb[2] - e.rgb[2]) / 255;
                return this.rgb(n, r, i)
            },
            average: function(e, t) {
                var n = (e.rgb[0] + t.rgb[0]) / 2,
                    r = (e.rgb[1] + t.rgb[1]) / 2,
                    i = (e.rgb[2] + t.rgb[2]) / 2;
                return this.rgb(n, r, i)
            },
            negation: function(e, t) {
                var n = 255 - Math.abs(255 - t.rgb[0] - e.rgb[0]),
                    r = 255 - Math.abs(255 - t.rgb[1] - e.rgb[1]),
                    i = 255 - Math.abs(255 - t.rgb[2] - e.rgb[2]);
                return this.rgb(n, r, i)
            },
            tint: function(e, t) {
                return this.mix(this.rgb(255, 255, 255), e, t)
            },
            shade: function(e, t) {
                return this.mix(this.rgb(0, 0, 0), e, t)
            }
        }
    })(n("./tree")),
    function(e) {
        e.colors = {
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgrey: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkslategrey: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dimgrey: "#696969",
            dodgerblue: "#1e90ff",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#dcdcdc",
            ghostwhite: "#f8f8ff",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gray: "#808080",
            grey: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgray: "#d3d3d3",
            lightgrey: "#d3d3d3",
            lightgreen: "#90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslategray: "#778899",
            lightslategrey: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32cd32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370d8",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdf5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#d87093",
            papayawhip: "#ffefd5",
            peachpuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            skyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            slategrey: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32"
        }
    }(n("./tree")),
    function(e) {
        e.Alpha = function(e) {
            this.value = e
        }, e.Alpha.prototype = {
            toCSS: function() {
                return "alpha(opacity=" + (this.value.toCSS ? this.value.toCSS() : this.value) + ")"
            },
            eval: function(e) {
                return this.value.eval && (this.value = this.value.eval(e)), this
            }
        }
    }(n("../tree")),
    function(e) {
        e.Anonymous = function(e) {
            this.value = e.value || e
        }, e.Anonymous.prototype = {
            toCSS: function() {
                return this.value
            },
            eval: function() {
                return this
            },
            compare: function(e) {
                if (!e.toCSS) return -1;
                var t = this.toCSS(),
                    n = e.toCSS();
                return t === n ? 0 : t < n ? -1 : 1
            }
        }
    }(n("../tree")),
    function(e) {
        e.Assignment = function(e, t) {
            this.key = e, this.value = t
        }, e.Assignment.prototype = {
            toCSS: function() {
                return this.key + "=" + (this.value.toCSS ? this.value.toCSS() : this.value)
            },
            eval: function(t) {
                return this.value.eval ? new e.Assignment(this.key, this.value.eval(t)) : this
            }
        }
    }(n("../tree")),
    function(e) {
        e.Call = function(e, t, n, r) {
            this.name = e, this.args = t, this.index = n, this.filename = r
        }, e.Call.prototype = {
            eval: function(t) {
                var n = this.args.map(function(e) {
                        return e.eval(t)
                    }),
                    r;
                if (this.name in e.functions) try {
                    r = e.functions[this.name].apply(e.functions, n);
                    if (r != null) return r
                } catch (i) {
                    throw {
                        type: i.type || "Runtime",
                        message: "error evaluating function `" + this.name + "`" + (i.message ? ": " + i.message : ""),
                        index: this.index,
                        filename: this.filename
                    }
                }
                return new e.Anonymous(this.name + "(" + n.map(function(e) {
                    return e.toCSS(t)
                }).join(", ") + ")")
            },
            toCSS: function(e) {
                return this.eval(e).toCSS()
            }
        }
    }(n("../tree")),
    function(e) {
        e.Color = function(e, t) {
            Array.isArray(e) ? this.rgb = e : e.length == 6 ? this.rgb = e.match(/.{2}/g).map(function(e) {
                return parseInt(e, 16)
            }) : this.rgb = e.split("").map(function(e) {
                return parseInt(e + e, 16)
            }), this.alpha = typeof t == "number" ? t : 1
        }, e.Color.prototype = {
            eval: function() {
                return this
            },
            toCSS: function() {
                return this.alpha < 1 ? "rgba(" + this.rgb.map(function(e) {
                    return Math.round(e)
                }).concat(this.alpha).join(", ") + ")" : "#" + this.rgb.map(function(e) {
                    return e = Math.round(e), e = (e > 255 ? 255 : e < 0 ? 0 : e).toString(16), e.length === 1 ? "0" + e : e
                }).join("")
            },
            operate: function(t, n) {
                var r = [];
                n instanceof e.Color || (n = n.toColor());
                for (var i = 0; i < 3; i++) r[i] = e.operate(t, this.rgb[i], n.rgb[i]);
                return new e.Color(r, this.alpha + n.alpha)
            },
            toHSL: function() {
                var e = this.rgb[0] / 255,
                    t = this.rgb[1] / 255,
                    n = this.rgb[2] / 255,
                    r = this.alpha,
                    i = Math.max(e, t, n),
                    s = Math.min(e, t, n),
                    o, u, a = (i + s) / 2,
                    f = i - s;
                if (i === s) o = u = 0;
                else {
                    u = a > .5 ? f / (2 - i - s) : f / (i + s);
                    switch (i) {
                        case e:
                            o = (t - n) / f + (t < n ? 6 : 0);
                            break;
                        case t:
                            o = (n - e) / f + 2;
                            break;
                        case n:
                            o = (e - t) / f + 4
                    }
                    o /= 6
                }
                return {
                    h: o * 360,
                    s: u,
                    l: a,
                    a: r
                }
            },
            toARGB: function() {
                var e = [Math.round(this.alpha * 255)].concat(this.rgb);
                return "#" + e.map(function(e) {
                    return e = Math.round(e), e = (e > 255 ? 255 : e < 0 ? 0 : e).toString(16), e.length === 1 ? "0" + e : e
                }).join("")
            },
            compare: function(e) {
                return e.rgb ? e.rgb[0] === this.rgb[0] && e.rgb[1] === this.rgb[1] && e.rgb[2] === this.rgb[2] && e.alpha === this.alpha ? 0 : -1 : -1
            }
        }
    }(n("../tree")),
    function(e) {
        e.Comment = function(e, t) {
            this.value = e, this.silent = !!t
        }, e.Comment.prototype = {
            toCSS: function(e) {
                return e.compress ? "" : this.value
            },
            eval: function() {
                return this
            }
        }
    }(n("../tree")),
    function(e) {
        e.Condition = function(e, t, n, r, i) {
            this.op = e.trim(), this.lvalue = t, this.rvalue = n, this.index = r, this.negate = i
        }, e.Condition.prototype.eval = function(e) {
            var t = this.lvalue.eval(e),
                n = this.rvalue.eval(e),
                r = this.index,
                i, i = function(e) {
                    switch (e) {
                        case "and":
                            return t && n;
                        case "or":
                            return t || n;
                        default:
                            if (t.compare) i = t.compare(n);
                            else {
                                if (!n.compare) throw {
                                    type: "Type",
                                    message: "Unable to perform comparison",
                                    index: r
                                };
                                i = n.compare(t)
                            }
                            switch (i) {
                                case -1:
                                    return e === "<" || e === "=<";
                                case 0:
                                    return e === "=" || e === ">=" || e === "=<";
                                case 1:
                                    return e === ">" || e === ">="
                            }
                    }
                }(this.op);
            return this.negate ? !i : i
        }
    }(n("../tree")),
    function(e) {
        e.Dimension = function(e, t) {
            this.value = parseFloat(e), this.unit = t || null
        }, e.Dimension.prototype = {
            eval: function() {
                return this
            },
            toColor: function() {
                return new e.Color([this.value, this.value, this.value])
            },
            toCSS: function() {
                var e = this.value + this.unit;
                return e
            },
            operate: function(t, n) {
                return new e.Dimension(e.operate(t, this.value, n.value), this.unit || n.unit)
            },
            compare: function(t) {
                return t instanceof e.Dimension ? t.value > this.value ? -1 : t.value < this.value ? 1 : t.unit && this.unit !== t.unit ? -1 : 0 : -1
            }
        }
    }(n("../tree")),
    function(e) {
        e.Directive = function(t, n) {
            this.name = t, Array.isArray(n) ? (this.ruleset = new e.Ruleset([], n), this.ruleset.allowImports = !0) : this.value = n
        }, e.Directive.prototype = {
            toCSS: function(e, t) {
                return this.ruleset ? (this.ruleset.root = !0, this.name + (t.compress ? "{" : " {\n  ") + this.ruleset.toCSS(e, t).trim().replace(/\n/g, "\n  ") + (t.compress ? "}" : "\n}\n")) : this.name + " " + this.value.toCSS() + ";\n"
            },
            eval: function(t) {
                var n = this;
                return this.ruleset && (t.frames.unshift(this), n = new e.Directive(this.name), n.ruleset = this.ruleset.eval(t), t.frames.shift()), n
            },
            variable: function(t) {
                return e.Ruleset.prototype.variable.call(this.ruleset, t)
            },
            find: function() {
                return e.Ruleset.prototype.find.apply(this.ruleset, arguments)
            },
            rulesets: function() {
                return e.Ruleset.prototype.rulesets.apply(this.ruleset)
            }
        }
    }(n("../tree")),
    function(e) {
        e.Element = function(t, n, r) {
            this.combinator = t instanceof e.Combinator ? t : new e.Combinator(t), typeof n == "string" ? this.value = n.trim() : n ? this.value = n : this.value = "", this.index = r
        }, e.Element.prototype.eval = function(t) {
            return new e.Element(this.combinator, this.value.eval ? this.value.eval(t) : this.value, this.index)
        }, e.Element.prototype.toCSS = function(e) {
            var t = this.value.toCSS ? this.value.toCSS(e) : this.value;
            return t == "" && this.combinator.value.charAt(0) == "&" ? "" : this.combinator.toCSS(e || {}) + t
        }, e.Combinator = function(e) {
            e === " " ? this.value = " " : this.value = e ? e.trim() : ""
        }, e.Combinator.prototype.toCSS = function(e) {
            return {
                "": "",
                " ": " ",
                ":": " :",
                "+": e.compress ? "+" : " + ",
                "~": e.compress ? "~" : " ~ ",
                ">": e.compress ? ">" : " > ",
                "|": e.compress ? "|" : " | "
            }[this.value]
        }
    }(n("../tree")),
    function(e) {
        e.Expression = function(e) {
            this.value = e
        }, e.Expression.prototype = {
            eval: function(t) {
                return this.value.length > 1 ? new e.Expression(this.value.map(function(e) {
                    return e.eval(t)
                })) : this.value.length === 1 ? this.value[0].eval(t) : this
            },
            toCSS: function(e) {
                return this.value.map(function(t) {
                    return t.toCSS ? t.toCSS(e) : ""
                }).join(" ")
            }
        }
    }(n("../tree")),
    function(e) {
        e.Import = function(t, n, r, i, s, o) {
            var u = this;
            this.once = i, this.index = s, this._path = t, this.features = r && new e.Value(r), this.rootpath = o, t instanceof e.Quoted ? this.path = /(\.[a-z]*$)|([\?;].*)$/.test(t.value) ? t.value : t.value + ".less" : this.path = t.value.value || t.value, this.css = /css([\?;].*)?$/.test(this.path), this.css || n.push(this.path, function(t, n, r) {
                t && (t.index = s), r && u.once && (u.skip = r), u.root = n || new e.Ruleset([], [])
            })
        }, e.Import.prototype = {
            toCSS: function(e) {
                var t = this.features ? " " + this.features.toCSS(e) : "";
                return this.css ? (typeof this._path.value == "string" && !/^(?:[a-z-]+:|\/)/.test(this._path.value) && (this._path.value = this.rootpath + this._path.value), "@import " + this._path.toCSS() + t + ";\n") : ""
            },
            eval: function(t) {
                var n, r = this.features && this.features.eval(t);
                return this.skip ? [] : this.css ? this : (n = new e.Ruleset([], this.root.rules.slice(0)), n.evalImports(t), this.features ? new e.Media(n.rules, this.features.value) : n.rules)
            }
        }
    }(n("../tree")),
    function(e) {
        e.JavaScript = function(e, t, n) {
            this.escaped = n, this.expression = e, this.index = t
        }, e.JavaScript.prototype = {
            eval: function(t) {
                var n, r = this,
                    i = {},
                    s = this.expression.replace(/@\{([\w-]+)\}/g, function(n, i) {
                        return e.jsify((new e.Variable("@" + i, r.index)).eval(t))
                    });
                try {
                    s = new Function("return (" + s + ")")
                } catch (o) {
                    throw {
                        message: "JavaScript evaluation error: `" + s + "`",
                        index: this.index
                    }
                }
                for (var u in t.frames[0].variables()) i[u.slice(1)] = {
                    value: t.frames[0].variables()[u].value,
                    toJS: function() {
                        return this.value.eval(t).toCSS()
                    }
                };
                try {
                    n = s.call(i)
                } catch (o) {
                    throw {
                        message: "JavaScript evaluation error: '" + o.name + ": " + o.message + "'",
                        index: this.index
                    }
                }
                return typeof n == "string" ? new e.Quoted('"' + n + '"', n, this.escaped, this.index) : Array.isArray(n) ? new e.Anonymous(n.join(", ")) : new e.Anonymous(n)
            }
        }
    }(n("../tree")),
    function(e) {
        e.Keyword = function(e) {
            this.value = e
        }, e.Keyword.prototype = {
            eval: function() {
                return this
            },
            toCSS: function() {
                return this.value
            },
            compare: function(t) {
                return t instanceof e.Keyword ? t.value === this.value ? 0 : 1 : -1
            }
        }, e.True = new e.Keyword("true"), e.False = new e.Keyword("false")
    }(n("../tree")),
    function(e) {
        e.Media = function(t, n) {
            var r = this.emptySelectors();
            this.features = new e.Value(n), this.ruleset = new e.Ruleset(r, t), this.ruleset.allowImports = !0
        }, e.Media.prototype = {
            toCSS: function(e, t) {
                var n = this.features.toCSS(t);
                return this.ruleset.root = e.length === 0 || e[0].multiMedia, "@media " + n + (t.compress ? "{" : " {\n  ") + this.ruleset.toCSS(e, t).trim().replace(/\n/g, "\n  ") + (t.compress ? "}" : "\n}\n")
            },
            eval: function(t) {
                t.mediaBlocks || (t.mediaBlocks = [], t.mediaPath = []);
                var n = new e.Media([], []);
                return this.debugInfo && (this.ruleset.debugInfo = this.debugInfo, n.debugInfo = this.debugInfo), n.features = this.features.eval(t), t.mediaPath.push(n), t.mediaBlocks.push(n), t.frames.unshift(this.ruleset), n.ruleset = this.ruleset.eval(t), t.frames.shift(), t.mediaPath.pop(), t.mediaPath.length === 0 ? n.evalTop(t) : n.evalNested(t)
            },
            variable: function(t) {
                return e.Ruleset.prototype.variable.call(this.ruleset, t)
            },
            find: function() {
                return e.Ruleset.prototype.find.apply(this.ruleset, arguments)
            },
            rulesets: function() {
                return e.Ruleset.prototype.rulesets.apply(this.ruleset)
            },
            emptySelectors: function() {
                var t = new e.Element("", "&", 0);
                return [new e.Selector([t])]
            },
            evalTop: function(t) {
                var n = this;
                if (t.mediaBlocks.length > 1) {
                    var r = this.emptySelectors();
                    n = new e.Ruleset(r, t.mediaBlocks), n.multiMedia = !0
                }
                return delete t.mediaBlocks, delete t.mediaPath, n
            },
            evalNested: function(t) {
                var n, r, i = t.mediaPath.concat([this]);
                for (n = 0; n < i.length; n++) r = i[n].features instanceof e.Value ? i[n].features.value : i[n].features, i[n] = Array.isArray(r) ? r : [r];
                return this.features = new e.Value(this.permute(i).map(function(t) {
                    t = t.map(function(t) {
                        return t.toCSS ? t : new e.Anonymous(t)
                    });
                    for (n = t.length - 1; n > 0; n--) t.splice(n, 0, new e.Anonymous("and"));
                    return new e.Expression(t)
                })), new e.Ruleset([], [])
            },
            permute: function(e) {
                if (e.length === 0) return [];
                if (e.length === 1) return e[0];
                var t = [],
                    n = this.permute(e.slice(1));
                for (var r = 0; r < n.length; r++)
                    for (var i = 0; i < e[0].length; i++) t.push([e[0][i]].concat(n[r]));
                return t
            },
            bubbleSelectors: function(t) {
                this.ruleset = new e.Ruleset(t.slice(0), [this.ruleset])
            }
        }
    }(n("../tree")),
    function(e) {
        e.mixin = {}, e.mixin.Call = function(t, n, r, i, s) {
            this.selector = new e.Selector(t), this.arguments = n, this.index = r, this.filename = i, this.important = s
        }, e.mixin.Call.prototype = {
            eval: function(t) {
                var n, r, i, s = [],
                    o = !1,
                    u, a, f, l, c;
                i = this.arguments && this.arguments.map(function(e) {
                    return {
                        name: e.name,
                        value: e.value.eval(t)
                    }
                });
                for (u = 0; u < t.frames.length; u++)
                    if ((n = t.frames[u].find(this.selector)).length > 0) {
                        c = !0;
                        for (a = 0; a < n.length; a++) {
                            r = n[a], l = !1;
                            for (f = 0; f < t.frames.length; f++)
                                if (!(r instanceof e.mixin.Definition) && r === (t.frames[f].originalRuleset || t.frames[f])) {
                                    l = !0;
                                    break
                                }
                            if (l) continue;
                            if (r.matchArgs(i, t)) {
                                if (!r.matchCondition || r.matchCondition(i, t)) try {
                                    Array.prototype.push.apply(s, r.eval(t, i, this.important).rules)
                                } catch (h) {
                                    throw {
                                        message: h.message,
                                        index: this.index,
                                        filename: this.filename,
                                        stack: h.stack
                                    }
                                }
                                o = !0
                            }
                        }
                        if (o) return s
                    }
                throw c ? {
                    type: "Runtime",
                    message: "No matching definition was found for `" + this.selector.toCSS().trim() + "(" + (i ? i.map(function(e) {
                        var t = "";
                        return e.name && (t += e.name + ":"), e.value.toCSS ? t += e.value.toCSS() : t += "???", t
                    }).join(", ") : "") + ")`",
                    index: this.index,
                    filename: this.filename
                } : {
                    type: "Name",
                    message: this.selector.toCSS().trim() + " is undefined",
                    index: this.index,
                    filename: this.filename
                }
            }
        }, e.mixin.Definition = function(t, n, r, i, s) {
            this.name = t, this.selectors = [new e.Selector([new e.Element(null, t)])], this.params = n, this.condition = i, this.variadic = s, this.arity = n.length, this.rules = r, this._lookups = {}, this.required = n.reduce(function(e, t) {
                return !t.name || t.name && !t.value ? e + 1 : e
            }, 0), this.parent = e.Ruleset.prototype, this.frames = []
        }, e.mixin.Definition.prototype = {
            toCSS: function() {
                return ""
            },
            variable: function(e) {
                return this.parent.variable.call(this, e)
            },
            variables: function() {
                return this.parent.variables.call(this)
            },
            find: function() {
                return this.parent.find.apply(this, arguments)
            },
            rulesets: function() {
                return this.parent.rulesets.apply(this)
            },
            evalParams: function(t, n, r, i) {
                var s = new e.Ruleset(null, []),
                    o, u, a = this.params.slice(0),
                    f, l, c, h, p, d;
                if (r) {
                    r = r.slice(0);
                    for (f = 0; f < r.length; f++) {
                        u = r[f];
                        if (h = u && u.name) {
                            p = !1;
                            for (l = 0; l < a.length; l++)
                                if (!i[l] && h === a[l].name) {
                                    i[l] = u.value.eval(t), s.rules.unshift(new e.Rule(h, u.value.eval(t))), p = !0;
                                    break
                                }
                            if (p) {
                                r.splice(f, 1), f--;
                                continue
                            }
                            throw {
                                type: "Runtime",
                                message: "Named argument for " + this.name + " " + r[f].name + " not found"
                            }
                        }
                    }
                }
                d = 0;
                for (f = 0; f < a.length; f++) {
                    if (i[f]) continue;
                    u = r && r[d];
                    if (h = a[f].name)
                        if (a[f].variadic && r) {
                            o = [];
                            for (l = d; l < r.length; l++) o.push(r[l].value.eval(t));
                            s.rules.unshift(new e.Rule(h, (new e.Expression(o)).eval(t)))
                        } else {
                            c = u && u.value;
                            if (c) c = c.eval(t);
                            else {
                                if (!a[f].value) throw {
                                    type: "Runtime",
                                    message: "wrong number of arguments for " + this.name + " (" + r.length + " for " + this.arity + ")"
                                };
                                c = a[f].value.eval(n)
                            }
                            s.rules.unshift(new e.Rule(h, c)), i[f] = c
                        }
                    if (a[f].variadic && r)
                        for (l = d; l < r.length; l++) i[l] = r[l].value.eval(t);
                    d++
                }
                return s
            },
            eval: function(t, n, r) {
                var i = [],
                    s = this.frames.concat(t.frames),
                    o = this.evalParams(t, {
                        frames: s
                    }, n, i),
                    u, a, f, l;
                return o.rules.unshift(new e.Rule("@arguments", (new e.Expression(i)).eval(t))), a = r ? this.parent.makeImportant.apply(this).rules : this.rules.slice(0), l = (new e.Ruleset(null, a)).eval({
                    frames: [this, o].concat(s)
                }), l.originalRuleset = this, l
            },
            matchCondition: function(e, t) {
                return this.condition && !this.condition.eval({
                    frames: [this.evalParams(t, {
                        frames: this.frames.concat(t.frames)
                    }, e, [])].concat(t.frames)
                }) ? !1 : !0
            },
            matchArgs: function(e, t) {
                var n = e && e.length || 0,
                    r, i;
                if (!this.variadic) {
                    if (n < this.required) return !1;
                    if (n > this.params.length) return !1;
                    if (this.required > 0 && n > this.params.length) return !1
                }
                r = Math.min(n, this.arity);
                for (var s = 0; s < r; s++)
                    if (!this.params[s].name && !this.params[s].variadic && e[s].value.eval(t).toCSS() != this.params[s].value.eval(t).toCSS()) return !1;
                return !0
            }
        }
    }(n("../tree")),
    function(e) {
        e.Operation = function(e, t) {
            this.op = e.trim(), this.operands = t
        }, e.Operation.prototype.eval = function(t) {
            var n = this.operands[0].eval(t),
                r = this.operands[1].eval(t),
                i;
            if (n instanceof e.Dimension && r instanceof e.Color) {
                if (this.op !== "*" && this.op !== "+") throw {
                    name: "OperationError",
                    message: "Can't substract or divide a color from a number"
                };
                i = r, r = n, n = i
            }
            if (!n.operate) throw {
                name: "OperationError",
                message: "Operation on an invalid type"
            };
            return n.operate(this.op, r)
        }, e.operate = function(e, t, n) {
            switch (e) {
                case "+":
                    return t + n;
                case "-":
                    return t - n;
                case "*":
                    return t * n;
                case "/":
                    return t / n
            }
        }
    }(n("../tree")),
    function(e) {
        e.Paren = function(e) {
            this.value = e
        }, e.Paren.prototype = {
            toCSS: function(e) {
                return "(" + this.value.toCSS(e) + ")"
            },
            eval: function(t) {
                return new e.Paren(this.value.eval(t))
            }
        }
    }(n("../tree")),
    function(e) {
        e.Quoted = function(e, t, n, r) {
            this.escaped = n, this.value = t || "", this.quote = e.charAt(0), this.index = r
        }, e.Quoted.prototype = {
            toCSS: function() {
                return this.escaped ? this.value : this.quote + this.value + this.quote
            },
            eval: function(t) {
                var n = this,
                    r = this.value.replace(/`([^`]+)`/g, function(r, i) {
                        return (new e.JavaScript(i, n.index, !0)).eval(t).value
                    }).replace(/@\{([\w-]+)\}/g, function(r, i) {
                        var s = (new e.Variable("@" + i, n.index)).eval(t);
                        return s instanceof e.Quoted ? s.value : s.toCSS()
                    });
                return new e.Quoted(this.quote + r + this.quote, r, this.escaped, this.index)
            },
            compare: function(e) {
                if (!e.toCSS) return -1;
                var t = this.toCSS(),
                    n = e.toCSS();
                return t === n ? 0 : t < n ? -1 : 1
            }
        }
    }(n("../tree")),
    function(e) {
        e.Ratio = function(e) {
            this.value = e
        }, e.Ratio.prototype = {
            toCSS: function(e) {
                return this.value
            },
            eval: function() {
                return this
            }
        }
    }(n("../tree")),
    function(e) {
        e.Rule = function(t, n, r, i, s) {
            this.name = t, this.value = n instanceof e.Value ? n : new e.Value([n]), this.important = r ? " " + r.trim() : "", this.index = i, this.inline = s || !1, t.charAt(0) === "@" ? this.variable = !0 : this.variable = !1
        }, e.Rule.prototype.toCSS = function(e) {
            return this.variable ? "" : this.name + (e.compress ? ":" : ": ") + this.value.toCSS(e) + this.important + (this.inline ? "" : ";")
        }, e.Rule.prototype.eval = function(t) {
            return new e.Rule(this.name, this.value.eval(t), this.important, this.index, this.inline)
        }, e.Rule.prototype.makeImportant = function() {
            return new e.Rule(this.name, this.value, "!important", this.index, this.inline)
        }, e.Shorthand = function(e, t) {
            this.a = e, this.b = t
        }, e.Shorthand.prototype = {
            toCSS: function(e) {
                return this.a.toCSS(e) + "/" + this.b.toCSS(e)
            },
            eval: function() {
                return this
            }
        }
    }(n("../tree")),
    function(e) {
        e.Ruleset = function(e, t, n) {
            this.selectors = e, this.rules = t, this._lookups = {}, this.strictImports = n
        }, e.Ruleset.prototype = {
            eval: function(t) {
                var n = this.selectors && this.selectors.map(function(e) {
                        return e.eval(t)
                    }),
                    r = new e.Ruleset(n, this.rules.slice(0), this.strictImports),
                    i;
                r.originalRuleset = this, r.root = this.root, r.allowImports = this.allowImports, this.debugInfo && (r.debugInfo = this.debugInfo), t.frames.unshift(r), (r.root || r.allowImports || !r.strictImports) && r.evalImports(t);
                for (var s = 0; s < r.rules.length; s++) r.rules[s] instanceof e.mixin.Definition && (r.rules[s].frames = t.frames.slice(0));
                var o = t.mediaBlocks && t.mediaBlocks.length || 0;
                for (var s = 0; s < r.rules.length; s++) r.rules[s] instanceof e.mixin.Call && (i = r.rules[s].eval(t), r.rules.splice.apply(r.rules, [s, 1].concat(i)), s += i.length - 1, r.resetCache());
                for (var s = 0, u; s < r.rules.length; s++) u = r.rules[s], u instanceof e.mixin.Definition || (r.rules[s] = u.eval ? u.eval(t) : u);
                t.frames.shift();
                if (t.mediaBlocks)
                    for (var s = o; s < t.mediaBlocks.length; s++) t.mediaBlocks[s].bubbleSelectors(n);
                return r
            },
            evalImports: function(t) {
                var n, r;
                for (n = 0; n < this.rules.length; n++) this.rules[n] instanceof e.Import && (r = this.rules[n].eval(t), typeof r.length == "number" ? (this.rules.splice.apply(this.rules, [n, 1].concat(r)), n += r.length - 1) : this.rules.splice(n, 1, r), this.resetCache())
            },
            makeImportant: function() {
                return new e.Ruleset(this.selectors, this.rules.map(function(e) {
                    return e.makeImportant ? e.makeImportant() : e
                }), this.strictImports)
            },
            matchArgs: function(e) {
                return !e || e.length === 0
            },
            resetCache: function() {
                this._rulesets = null, this._variables = null, this._lookups = {}
            },
            variables: function() {
                return this._variables ? this._variables : this._variables = this.rules.reduce(function(t, n) {
                    return n instanceof e.Rule && n.variable === !0 && (t[n.name] = n), t
                }, {})
            },
            variable: function(e) {
                return this.variables()[e]
            },
            rulesets: function() {
                return this._rulesets ? this._rulesets : this._rulesets = this.rules.filter(function(t) {
                    return t instanceof e.Ruleset || t instanceof e.mixin.Definition
                })
            },
            find: function(t, n) {
                n = n || this;
                var r = [],
                    i, s, o = t.toCSS();
                return o in this._lookups ? this._lookups[o] : (this.rulesets().forEach(function(i) {
                    if (i !== n)
                        for (var o = 0; o < i.selectors.length; o++)
                            if (s = t.match(i.selectors[o])) {
                                t.elements.length > i.selectors[o].elements.length ? Array.prototype.push.apply(r, i.find(new e.Selector(t.elements.slice(1)), n)) : r.push(i);
                                break
                            }
                }), this._lookups[o] = r)
            },
            toCSS: function(t, n) {
                var r = [],
                    i = [],
                    s = [],
                    o = [],
                    u = [],
                    a, f, l;
                this.root || this.joinSelectors(u, t, this.selectors);
                for (var c = 0; c < this.rules.length; c++) {
                    l = this.rules[c];
                    if (l.rules || l instanceof e.Media) o.push(l.toCSS(u, n));
                    else if (l instanceof e.Directive) {
                        var h = l.toCSS(u, n);
                        if (l.name === "@charset") {
                            if (n.charset) {
                                l.debugInfo && (o.push(e.debugInfo(n, l)), o.push((new e.Comment("/* " + h.replace(/\n/g, "") + " */\n")).toCSS(n)));
                                continue
                            }
                            n.charset = !0
                        }
                        o.push(h)
                    } else l instanceof e.Comment ? l.silent || (this.root ? o.push(l.toCSS(n)) : i.push(l.toCSS(n))) : l.toCSS && !l.variable ? i.push(l.toCSS(n)) : l.value && !l.variable && i.push(l.value.toString())
                }
                o = o.join("");
                if (this.root) r.push(i.join(n.compress ? "" : "\n"));
                else if (i.length > 0) {
                    f = e.debugInfo(n, this), a = u.map(function(e) {
                        return e.map(function(e) {
                            return e.toCSS(n)
                        }).join("").trim()
                    }).join(n.compress ? "," : ",\n");
                    for (var c = i.length - 1; c >= 0; c--) s.indexOf(i[c]) === -1 && s.unshift(i[c]);
                    i = s, r.push(f + a + (n.compress ? "{" : " {\n  ") + i.join(n.compress ? "" : "\n  ") + (n.compress ? "}" : "\n}\n"))
                }
                return r.push(o), r.join("") + (n.compress ? "\n" : "")
            },
            joinSelectors: function(e, t, n) {
                for (var r = 0; r < n.length; r++) this.joinSelector(e, t, n[r])
            },
            joinSelector: function(t, n, r) {
                var i, s, o, u, a, f, l, c, h, p, d, v, m, g, y;
                for (i = 0; i < r.elements.length; i++) f = r.elements[i], f.value === "&" && (u = !0);
                if (!u) {
                    if (n.length > 0)
                        for (i = 0; i < n.length; i++) t.push(n[i].concat(r));
                    else t.push([r]);
                    return
                }
                g = [], a = [
                    []
                ];
                for (i = 0; i < r.elements.length; i++) {
                    f = r.elements[i];
                    if (f.value !== "&") g.push(f);
                    else {
                        y = [], g.length > 0 && this.mergeElementsOnToSelectors(g, a);
                        for (s = 0; s < a.length; s++) {
                            l = a[s];
                            if (n.length == 0) l.length > 0 && (l[0].elements = l[0].elements.slice(0), l[0].elements.push(new e.Element(f.combinator, "", 0))), y.push(l);
                            else
                                for (o = 0; o < n.length; o++) c = n[o], h = [], p = [], v = !0, l.length > 0 ? (h = l.slice(0), m = h.pop(), d = new e.Selector(m.elements.slice(0)), v = !1) : d = new e.Selector([]), c.length > 1 && (p = p.concat(c.slice(1))), c.length > 0 && (v = !1, d.elements.push(new e.Element(f.combinator, c[0].elements[0].value, 0)), d.elements = d.elements.concat(c[0].elements.slice(1))), v || h.push(d), h = h.concat(p), y.push(h)
                        }
                        a = y, g = []
                    }
                }
                g.length > 0 && this.mergeElementsOnToSelectors(g, a);
                for (i = 0; i < a.length; i++) t.push(a[i])
            },
            mergeElementsOnToSelectors: function(t, n) {
                var r, i;
                if (n.length == 0) {
                    n.push([new e.Selector(t)]);
                    return
                }
                for (r = 0; r < n.length; r++) i = n[r], i.length > 0 ? i[i.length - 1] = new e.Selector(i[i.length - 1].elements.concat(t)) : i.push(new e.Selector(t))
            }
        }
    }(n("../tree")),
    function(e) {
        e.Selector = function(e) {
            this.elements = e
        }, e.Selector.prototype.match = function(e) {
            var t = this.elements,
                n = t.length,
                r, i, s, o;
            r = e.elements.slice(e.elements.length && e.elements[0].value === "&" ? 1 : 0), i = r.length, s = Math.min(n, i);
            if (i === 0 || n < i) return !1;
            for (o = 0; o < s; o++)
                if (t[o].value !== r[o].value) return !1;
            return !0
        }, e.Selector.prototype.eval = function(t) {
            return new e.Selector(this.elements.map(function(e) {
                return e.eval(t)
            }))
        }, e.Selector.prototype.toCSS = function(e) {
            return this._css ? this._css : (this.elements[0].combinator.value === "" ? this._css = " " : this._css = "", this._css += this.elements.map(function(t) {
                return typeof t == "string" ? " " + t.trim() : t.toCSS(e)
            }).join(""), this._css)
        }
    }(n("../tree")),
    function(e) {
        e.UnicodeDescriptor = function(e) {
            this.value = e
        }, e.UnicodeDescriptor.prototype = {
            toCSS: function(e) {
                return this.value
            },
            eval: function() {
                return this
            }
        }
    }(n("../tree")),
    function(e) {
        e.URL = function(e, t) {
            this.value = e, this.rootpath = t
        }, e.URL.prototype = {
            toCSS: function() {
                return "url(" + this.value.toCSS() + ")"
            },
            eval: function(t) {
                var n = this.value.eval(t),
                    r;
                return typeof n.value == "string" && !/^(?:[a-z-]+:|\/)/.test(n.value) && (r = this.rootpath, n.quote || (r = r.replace(/[\(\)'"\s]/g, function(e) {
                    return "\\" + e
                })), n.value = r + n.value), new e.URL(n, this.rootpath)
            }
        }
    }(n("../tree")),
    function(e) {
        e.Value = function(e) {
            this.value = e, this.is = "value"
        }, e.Value.prototype = {
            eval: function(t) {
                return this.value.length === 1 ? this.value[0].eval(t) : new e.Value(this.value.map(function(e) {
                    return e.eval(t)
                }))
            },
            toCSS: function(e) {
                return this.value.map(function(t) {
                    return t.toCSS(e)
                }).join(e.compress ? "," : ", ")
            }
        }
    }(n("../tree")),
    function(e) {
        e.Variable = function(e, t, n) {
            this.name = e, this.index = t, this.file = n
        }, e.Variable.prototype = {
            eval: function(t) {
                var n, r, i = this.name;
                i.indexOf("@@") == 0 && (i = "@" + (new e.Variable(i.slice(1))).eval(t).value);
                if (this.evaluating) throw {
                    type: "Name",
                    message: "Recursive variable definition for " + i,
                    filename: this.file,
                    index: this.index
                };
                this.evaluating = !0;
                if (n = e.find(t.frames, function(e) {
                        if (r = e.variable(i)) return r.value.eval(t)
                    })) return this.evaluating = !1, n;
                throw {
                    type: "Name",
                    message: "variable " + i + " is undefined",
                    filename: this.file,
                    index: this.index
                }
            }
        }
    }(n("../tree")),
    function(e) {
        e.debugInfo = function(t, n) {
            var r = "";
            if (t.dumpLineNumbers && !t.compress) switch (t.dumpLineNumbers) {
                case "comments":
                    r = e.debugInfo.asComment(n);
                    break;
                case "mediaquery":
                    r = e.debugInfo.asMediaQuery(n);
                    break;
                case "all":
                    r = e.debugInfo.asComment(n) + e.debugInfo.asMediaQuery(n)
            }
            return r
        }, e.debugInfo.asComment = function(e) {
            return "/* line " + e.debugInfo.lineNumber + ", " + e.debugInfo.fileName + " */\n"
        }, e.debugInfo.asMediaQuery = function(e) {
            return "@media -sass-debug-info{filename{font-family:" + ("file://" + e.debugInfo.fileName).replace(/[\/:.]/g, "\\$&") + "}line{font-family:\\00003" + e.debugInfo.lineNumber + "}}\n"
        }, e.find = function(e, t) {
            for (var n = 0, r; n < e.length; n++)
                if (r = t.call(e, e[n])) return r;
            return null
        }, e.jsify = function(e) {
            return Array.isArray(e.value) && e.value.length > 1 ? "[" + e.value.map(function(e) {
                return e.toCSS(!1)
            }).join(", ") + "]" : e.toCSS(!1)
        }
    }(n("./tree"));
    var o = /^(file|chrome(-extension)?|resource|qrc|app):/.test(location.protocol);
    r.env = r.env || (location.hostname == "127.0.0.1" || location.hostname == "0.0.0.0" || location.hostname == "localhost" || location.port.length > 0 || o ? "development" : "production"), r.async = r.async || !1, r.fileAsync = r.fileAsync || !1, r.poll = r.poll || (o ? 1e3 : 1500);
    if (r.functions)
        for (var u in r.functions) r.tree.functions[u] = r.functions[u];
    var a = /!dumpLineNumbers:(comments|mediaquery|all)/.exec(location.hash);
    a && (r.dumpLineNumbers = a[1]), r.watch = function() {
        return r.watchMode || (r.env = "development", f()), this.watchMode = !0
    }, r.unwatch = function() {
        return clearInterval(r.watchTimer), this.watchMode = !1
    }, /!watch/.test(location.hash) && r.watch();
    var l = null;
    if (r.env != "development") try {
        l = typeof e.localStorage == "undefined" ? null : e.localStorage
    } catch (c) {}
    var h = document.getElementsByTagName("link"),
        p = /^text\/(x-)?less$/;
    r.sheets = [];
    for (var d = 0; d < h.length; d++)(h[d].rel === "stylesheet/less" || h[d].rel.match(/stylesheet/) && h[d].type.match(p)) && r.sheets.push(h[d]);
    var v = "";
    r.modifyVars = function(e) {
        var t = v;
        for (name in e) t += (name.slice(0, 1) === "@" ? "" : "@") + name + ": " + (e[name].slice(-1) === ";" ? e[name] : e[name] + ";");
        (new r.Parser).parse(t, function(e, t) {
            S(t.toCSS(), r.sheets[r.sheets.length - 1])
        })
    }, r.refresh = function(e) {
        var t, n;
        t = n = new Date, g(function(e, r, i, s, o) {
            o.local ? C("loading " + s.href + " from cache.") : (C("parsed " + s.href + " successfully."), S(r.toCSS(), s, o.lastModified)), C("css for " + s.href + " generated in " + (new Date - n) + "ms"), o.remaining === 0 && C("css generated in " + (new Date - t) + "ms"), n = new Date
        }, e), m()
    }, r.refreshStyles = m, r.refresh(r.env === "development"), typeof define == "function" && define.amd && define("less", [], function() {
        return r
    })
})(window);;;
(function($, undefined) {
    var tag2attr = {
            a: 'href',
            img: 'src',
            form: 'action',
            base: 'href',
            script: 'src',
            iframe: 'src',
            link: 'href'
        },
        key = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "fragment"],
        aliases = {
            "anchor": "fragment"
        },
        parser = {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        },
        querystring_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g,
        fragment_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g;

    function parseUri(url, strictMode) {
        var str = decodeURI(url),
            res = parser[strictMode || false ? "strict" : "loose"].exec(str),
            uri = {
                attr: {},
                param: {},
                seg: {}
            },
            i = 14;
        while (i--) {
            uri.attr[key[i]] = res[i] || "";
        }
        uri.param['query'] = {};
        uri.param['fragment'] = {};
        uri.attr['query'].replace(querystring_parser, function($0, $1, $2) {
            if ($1) {
                uri.param['query'][$1] = $2;
            }
        });
        uri.attr['fragment'].replace(fragment_parser, function($0, $1, $2) {
            if ($1) {
                uri.param['fragment'][$1] = $2;
            }
        });
        uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g, '').split('/');
        uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g, '').split('/');
        uri.attr['base'] = uri.attr.host ? uri.attr.protocol + "://" + uri.attr.host + (uri.attr.port ? ":" + uri.attr.port : '') : '';
        return uri;
    };

    function getAttrName(elm) {
        var tn = elm.tagName;
        if (tn !== undefined) return tag2attr[tn.toLowerCase()];
        return tn;
    }
    $.fn.url = function(strictMode) {
        var url = '';
        if (this.length) {
            url = $(this).attr(getAttrName(this[0])) || '';
        }
        return $.url(url, strictMode);
    };
    $.url = function(url, strictMode) {
        if (arguments.length === 1 && url === true) {
            strictMode = true;
            url = undefined;
        }
        strictMode = strictMode || false;
        url = url || window.location.toString();
        return {
            data: parseUri(url, strictMode),
            attr: function(attr) {
                attr = aliases[attr] || attr;
                return attr !== undefined ? this.data.attr[attr] : this.data.attr;
            },
            param: function(param) {
                return param !== undefined ? this.data.param.query[param] : this.data.param.query;
            },
            fparam: function(param) {
                return param !== undefined ? this.data.param.fragment[param] : this.data.param.fragment;
            },
            segment: function(seg) {
                if (seg === undefined) {
                    return this.data.seg.path;
                } else {
                    seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1;
                    return this.data.seg.path[seg];
                }
            },
            fsegment: function(seg) {
                if (seg === undefined) {
                    return this.data.seg.fragment;
                } else {
                    seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1;
                    return this.data.seg.fragment[seg];
                }
            }
        };
    };
})(jQuery);;
(function($) {
    var methods = {
        init: function(options) {
            return this.each(function() {
                var form = $(this);
                $('.warning').remove();
                (function(data) {
                    var data = $.parseJSON('{"ts":1464798490,"tk":"c7a1197ece46599b668068444276bbc5"}');
                    form.append('<input type="hidden" name="ts" value="' + data.ts + '" />');
                    form.append('<input type="hidden" name="tk" value="' + data.tk + '" />');
                    form.append('<input type="hidden" name="tp" value="" />');
                })();
            });
        }
    }
    $.fn.secureforms = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on snap.secureforms');
        }
    };
})(jQuery);;


var config;
var custom;
var isCustom = false;
var themeURL = "";
var fontsLoaded = false;
(function($) {
    $('html').addClass('wf-loading');
    setTimeout(function() {
        $('html').removeClass('wf-loading');
    }, 3000);
    $(document).ready(function(e) {
        if (isMobile) {
            less.modifyVars({
                '@theme_width': '90%',
                '@content_width': '90%',
                '@gridsystem-width': '100%',
                '@total-width': '100%'
            });
            $('#content').find('.grid_24').css("width", "100%");
        }
        customFonts = customFonts.replace(/\|+$/, "");
        var googleFontList = customFonts.split('|');
        WebFontConfig = {
            google: {
                families: googleFontList
            },
            timeout: 2000,
            active: function() {
                fontsLoaded = true;
                $('body').trigger('fontsLoaded');
            }
        };
        (function() {
            var wf = document.createElement('script');
            wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
        })();
    });
    $(function() {
        if (!fontsLoaded) {
            $('body').one('fontsLoaded', function() {
                fontsActive();
            });
        } else {
            fontsActive();
        }
        init();
        $.ajaxSetup({
            cache: false
        });
        (function(data) {
            responsive();
        })();
        $('#grid').find('.column.container').first().addClass('alpha omega');
        $('#grid').find('.column.container').each(function() {
            var $this = $(this);
            var alpha = $this.find('> .column').first();
            if (!alpha.hasClass('alpha')) {
                alpha.addClass('alpha');
            }
            var omega = $this.find('> .column').last();
            if (!omega.hasClass('omega')) {
                omega.addClass('omega test');
            }
        });
        if (window.self !== window.top) {
            if (getSupportedFeature("transform") && $(window).width() < 1100) {
                var iWidth = $(window).width();
                var scale = iWidth / 1200;
                $('#wrapper').css('overflow', 'visible');
                var newStyle = $('body').attr('style') + '-moz-transform: scale(' + scale + ', ' + scale + ');-webkit-transform: scale(' + scale + ', ' + scale + ');-o-transform: scale(' + scale + ', ' + scale + ');-ms-transform: scale(' + scale + ', ' + scale + ');transform: scale(' + scale + ', ' + scale + ');-moz-transform-origin: top center;-webkit-transform-origin: top left;-o-transform-origin: top center;-ms-transform-origin: top left;transform-origin: top left;';
                $('body').attr('style', newStyle);
                $('body').css('width', (100 / scale) + "%")
            }
        }
    });

    function init() {
        if (isMobile) {
            $("#main-navigation-links, #cover-navigation-links").attr('id', 'cover-navigation-mobile');
            $('#cover-nav-button').click(function() {
                $("#cover-navigation-mobile").trigger('open');
            });
            $("#cover-navigation-mobile").find('ul, li').removeAttr('style');
            $("#cover-navigation-mobile").find('span, .subNavIndicator').remove();
            $("#cover-navigation-mobile").mmenu({}, {
                selectedClass: "selected"
            });
            var mobileSelect = $('#cover-mobile-select');
            mobileSelect.find('#desktop-version-button').click(function() {
                //$.post('/resources/websites/php/ajax.php', "action=mobileSite&enable=false", function(result) {
                    location.reload();
                //});
            });
        } else {
            var mobileSelect = $('#cover-mobile-select');
            if (mobileSelect.find('#mobile-version-button').length) {
                mobileSelect.find('#mobile-version-button').click(function() {
                    //$.post('/resources/websites/php/ajax.php', "action=mobileSite&enable=true", function(result) {
                        location.reload();
                    //});
                });
            }
        }
        responsive(function() {
            renderNav();
            //renderZoomImages();
            //renderBlogArchive();
            //renderContactForms();
            //renderSubscribeForms();
            //renderShareButtons();
            //renderDownloads();
            //renderPhotoGrids();
            //renderVideoEmbeds();
            //$('.album-links').albumlinks();
            //$('.slideshow').not(".block").slideshow();
            //$('.billboard').billboard();
            $('form.secure').secureforms();
            $('input, textarea').addPlaceholder();
        });
        if (isMobile) {
            $(window).resize(function() {
                responsive();
            });
        }
        //this.init();
    }

    function fontsActive() {
        renderRollOvers();
        $('.buttonWrapper').each(function() {
            var btn = $(this);
            btn.find("ul.button").width(btn.find("ul.button").width() + 10);
            btn.width(btn.find("ul.button").width());
        });
        if (isMobile) {
            responsive();
        }
    }

    function responsive(callback) {
        var content = $('#content');
        content.find('.block.image, .block.imagetext').each(function() {
            var block = $(this);
            var img = block.find('img');
            var maxW = block.closest('.column').width();
            img.css({
                width: 'auto',
                height: 'auto'
            });
            if (img.width() > maxW) {
                img.height(scaleDown(img.width(), img.height(), maxW));
                img.width(maxW);
            }
        });
        content.find('.block.slideshow').each(function() {
            var block = $(this);
            var holder = block.find('.slideshow');
            var maxW = block.closest('.column').width();
            if (holder.data('width') > maxW) {
                holder.data('height', scaleDown(holder.data('width'), holder.data('height'), maxW));
                holder.data('width', maxW);
                if (holder.find('.slideshow-wrapper').length) {
                    holder.slideshow("changeSize", "max");
                }
            }
        });
        content.find('.block.videoplayer').each(function() {
            var block = $(this);
            var maxW = block.closest('.column').width();
            if (block.find('.player').length) {
                var holder = block.find('.player');
                if (holder.data('width') > maxW) {
                    holder.data('height', scaleDown(holder.data('width'), holder.data('height'), maxW));
                    holder.data('width', maxW);
                }
            } else {
                var holder = block.find('iframe');
                holder.css({
                    width: '',
                    height: ''
                });
                var maxW = block.closest('.column').width();
                if (holder.width() > maxW) {
                    holder.height(scaleDown(holder.width(), holder.height(), maxW));
                    holder.width(maxW);
                }
            }
        });
        if (callback !== null && typeof callback === "function") {
            callback();
        }
    }

    function scaleDown(oldWidth, oldHeight, newWidth) {
        var ratio = newWidth / oldWidth;
        return oldHeight * ratio;
    }

    function renderNav() {
        var nav = $('#main-navigation-links');
        nav.find('li').first().addClass('alpha');
        nav.find('li').last().addClass('omega');
        nav.find('ul > li').each(function() {
            var $this = $(this);
            if ($this.find('ul').length) {
                var subNav = $this.find('ul');
                $this.hoverIntent(function() {
                    subNav.stop(true, true).slideDown('fast');
                }, function() {
                    subNav.stop(true, true).delay(500).fadeOut('fast');
                });
                $this.find('.subNavIndicator').css('line-height', $this.css('line-height'));
            }
        });
    }

    function renderFooter() {}

    function renderRollOvers() {
        $(".rollover").each(function() {
            var rollover = $(this);
            var w = rollover.outerWidth(true) + 1;
            rollover.wrap("<div class='rollover-holder' style='position:relative;'>");
            var item = rollover.parent();
            item.width(w);
            item.attr("id", rollover.attr("name"));
            if (rollover.css('float') !== 'none') {
                item.css({
                    float: rollover.css('float')
                });
            }
            rollover.css({
                "z-index": "1",
                "position": "relative"
            });
            item.append("<div class='bg'></div>");
            var bg = item.find('.bg');
            bg.css('margin-left', rollover.css('margin-left'));
            item.hover(function() {
                if ($.browser.msie) {
                    bg.show();
                    rollover.css({
                        color: "#FFF"
                    });
                } else {
                    bg.stop(true, true).fadeIn('fast');
                    rollover.stop(true, true).animate({
                        color: "#fff"
                    }, 'fast');
                }
            }, function() {
                if ($.browser.msie) {
                    bg.hide();
                    rollover.css({
                        color: $("#grid").css("color")
                    });
                } else {
                    bg.stop(true, true).fadeOut();
                    rollover.stop(true, true).animate({
                        color: $("#grid").css("color")
                    });
                }
            });
        });
    }
}(jQuery));;
(function($) {
    $(function() {
        $('.comment, .comment-reply').each(function() {
            $this = $(this);
            $id = $this.data('id');
            $this.find('a').first().click(function(e) {
                e.preventDefault();
                $(this).parent().parent().append($('#comment-form-holder'));
                $('#comment-form-holder').data('parent', $(this).parent().parent().parent().data('id'));
                $('#comment-form-holder').find('.comment-form-title').html('Reply to Comment');
                $('#leaveComment').show();
            });
        });
        $('#leaveComment').find('a').click(function(e) {
            e.preventDefault();
            $('#comment-form-holder').data('parent', '');
            $('#comment-form-holder').insertAfter('#leaveComment');
            $('#comment-form-holder').find('.comment-form-title').html('Leave a Comment');
            $('#leaveComment').hide();
        });
    });
})(jQuery);;

function checkContactForm(form) {
    (function($) {
        form.find(".submitButton").hide();
        var action = "contactForm";
        var formArray = new Array("name", "email", "content");
        var valueArray = new Array();
        var err = "none";
        for (i = 0; i < formArray.length; i++) {
            if ($('[name=' + formArray[i] + ']', form).val() == "" || $('[name=' + formArray[i] + ']', form).val() == $('[name=' + formArray[i] + ']', form).attr('placeholder')) {
                $('[name=' + formArray[i] + ']', form).removeClass().addClass("req");
                err = "error";
            } else {
                $('[name=' + formArray[i] + ']', form).removeClass().addClass("formInput");
                valueArray.push(escape($('[name=' + formArray[i] + ']', form).val()));
            }
        }
        if (err == "none") {
            formArray.push("phone");
            valueArray.push(escape(($('[name=phone]', form).val() == $('[name=phone]', form).attr('placeholder')) ? "" : $('[name=phone]', form).val()));
            formArray.push("titleArray");
            valueArray.push(escape($('[name=titleArray]', form).val()));
            formArray.push("userID");
            valueArray.push($('[name=userID]', form).val());
            formArray.push("ts");
            valueArray.push($('[name=ts]', form).val());
            formArray.push("tk");
            valueArray.push($('[name=tk]', form).val());
            formArray.push("tp");
            valueArray.push($('[name=tp]', form).val());
            formArray.push("to");
            valueArray.push(escape($('[name=to]', form).val()));
            formArray.push("subject");
            valueArray.push(escape($('[name=subject]', form).val()));
            var info = "action=" + action;
            for (i = 0; i < formArray.length; i++) {
                info += "&" + formArray[i] + "=" + valueArray[i];
            }

        } else {
            $("#status", form).html("<div class='alert_attention'>Please fill in required fields.</div>");
            $("#status", form).slideDown();
            $(".submitButton", form).show();
        }
    }(jQuery));
};

function checkSubscribeForm(form) {
    (function($) {
        $(".submitButton", form).hide();
        var err = "";
        form.find(".required").each(function() {
            if ($(this).val() == "") {
                err = "fill in all required information";
                $(this).removeClass('formInput').addClass('req');
            } else {
                $(this).removeClass('req').addClass('formInput');
            }
        });
        if (err !== "") {
            $("#status", form).fadeIn(300);
            $("#status", form).html("<div class='alert_attention'>" + err + "</div>");
            $(".submitButton", form).show();
        } else {
            var opt = new Object();
            opt.email_address = (form.find('#email-input').val() == form.find('#email-input').attr('placeholder')) ? "" : form.find('#email-input').val();
            opt.first_name = (form.find('#first-input').val() == form.find('#first-input').attr('placeholder')) ? "" : form.find('#first-input').val();
            opt.last_name = (form.find('#last-input').val() == form.find('#last-input').attr('placeholder')) ? "" : form.find('#last-input').val();
            form.find("#anim").show();
            form.find("#input-buttons").hide();
        }
    }(jQuery));
};;

(function(a, b, c, d) {
    var e = a(b);
    a.fn.lazyload = function(c) {
        function i() {
            var b = 0;
            f.each(function() {
                var c = a(this);
                if (h.skip_invisible && !c.is(":visible")) return;
                if (!a.abovethetop(this, h) && !a.leftofbegin(this, h))
                    if (!a.belowthefold(this, h) && !a.rightoffold(this, h)) c.trigger("appear"), b = 0;
                    else if (++b > h.failure_limit) return !1
            })
        }
        var f = this,
            g, h = {
                threshold: 0,
                failure_limit: 0,
                event: "scroll",
                effect: "show",
                container: b,
                data_attribute: "original",
                skip_invisible: !0,
                appear: null,
                load: null
            };
        return c && (d !== c.failurelimit && (c.failure_limit = c.failurelimit, delete c.failurelimit), d !== c.effectspeed && (c.effect_speed = c.effectspeed, delete c.effectspeed), a.extend(h, c)), g = h.container === d || h.container === b ? e : a(h.container), 0 === h.event.indexOf("scroll") && g.bind(h.event, function(a) {
            return i()
        }), this.each(function() {
            var b = this,
                c = a(b);
            b.loaded = !1, c.one("appear", function() {
                if (!this.loaded) {
                    if (h.appear) {
                        var d = f.length;
                        h.appear.call(b, d, h)
                    }
                    a("<img />").bind("load", function() {
                        c.hide().attr("src", c.data(h.data_attribute))[h.effect](h.effect_speed), b.loaded = !0;
                        var d = a.grep(f, function(a) {
                            return !a.loaded
                        });
                        f = a(d);
                        if (h.load) {
                            var e = f.length;
                            h.load.call(b, e, h)
                        }
                    }).attr("src", c.data(h.data_attribute))
                }
            }), 0 !== h.event.indexOf("scroll") && c.bind(h.event, function(a) {
                b.loaded || c.trigger("appear")
            })
        }), e.bind("resize", function(a) {
            i()
        }), /iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion) && e.bind("pageshow", function(b) {
            b.originalEvent.persisted && f.each(function() {
                a(this).trigger("appear")
            })
        }), a(b).load(function() {
            i()
        }), this
    }, a.belowthefold = function(c, f) {
        var g;
        return f.container === d || f.container === b ? g = e.height() + e.scrollTop() : g = a(f.container).offset().top + a(f.container).height(), g <= a(c).offset().top - f.threshold
    }, a.rightoffold = function(c, f) {
        var g;
        return f.container === d || f.container === b ? g = e.width() + e.scrollLeft() : g = a(f.container).offset().left + a(f.container).width(), g <= a(c).offset().left - f.threshold
    }, a.abovethetop = function(c, f) {
        var g;
        return f.container === d || f.container === b ? g = e.scrollTop() : g = a(f.container).offset().top, g >= a(c).offset().top + f.threshold + a(c).height()
    }, a.leftofbegin = function(c, f) {
        var g;
        return f.container === d || f.container === b ? g = e.scrollLeft() : g = a(f.container).offset().left, g >= a(c).offset().left + f.threshold + a(c).width()
    }, a.inviewport = function(b, c) {
        return !a.rightoffold(b, c) && !a.leftofbegin(b, c) && !a.belowthefold(b, c) && !a.abovethetop(b, c)
    }, a.extend(a.expr[":"], {
        "below-the-fold": function(b) {
            return a.belowthefold(b, {
                threshold: 0
            })
        },
        "above-the-top": function(b) {
            return !a.belowthefold(b, {
                threshold: 0
            })
        },
        "right-of-screen": function(b) {
            return a.rightoffold(b, {
                threshold: 0
            })
        },
        "left-of-screen": function(b) {
            return !a.rightoffold(b, {
                threshold: 0
            })
        },
        "in-viewport": function(b) {
            return a.inviewport(b, {
                threshold: 0
            })
        },
        "above-the-fold": function(b) {
            return !a.belowthefold(b, {
                threshold: 0
            })
        },
        "right-of-fold": function(b) {
            return a.rightoffold(b, {
                threshold: 0
            })
        },
        "left-of-fold": function(b) {
            return !a.rightoffold(b, {
                threshold: 0
            })
        }
    })
})(jQuery, window, document);
! function(e) {
    function t(t, n, o) {
        if ("object" != typeof t && (t = {}), o) {
            if ("boolean" != typeof t.isMenu) {
                var s = o.children();
                t.isMenu = 1 == s.length && s.is(n.panelNodetype)
            }
            return t
        }
        if ("object" != typeof t.onClick && (t.onClick = {}), "undefined" != typeof t.onClick.setLocationHref && (e[r].deprecated("onClick.setLocationHref option", "!onClick.preventDefault"), "boolean" == typeof t.onClick.setLocationHref && (t.onClick.preventDefault = !t.onClick.setLocationHref)), t = e.extend(!0, {}, e[r].defaults, t), e[r].useOverflowScrollingFallback()) {
            switch (t.position) {
                case "top":
                case "right":
                case "bottom":
                    e[r].debug('position: "' + t.position + '" not supported when using the overflowScrolling-fallback.'), t.position = "left"
            }
            switch (t.zposition) {
                case "front":
                case "next":
                    e[r].debug('z-position: "' + t.zposition + '" not supported when using the overflowScrolling-fallback.'), t.zposition = "back"
            }
        }
        return t
    }

    function n(t) {
        return "object" != typeof t && (t = {}), "undefined" != typeof t.panelNodeType && (e[r].deprecated("panelNodeType configuration option", "panelNodetype"), t.panelNodetype = t.panelNodeType), t = e.extend(!0, {}, e[r].configuration, t), "string" != typeof t.pageSelector && (t.pageSelector = "> " + t.pageNodetype), t
    }

    function o() {
        c.$wndw = e(window), c.$html = e("html"), c.$body = e("body"), c.$allMenus = e(), e.each([p, f, u], function(e, t) {
            t.add = function(e) {
                e = e.split(" ");
                for (var n in e) t[e[n]] = t.mm(e[n])
            }
        }), p.mm = function(e) {
            return "mm-" + e
        }, p.add("menu ismenu panel list subtitle selected label spacer current highest hidden page blocker modal background opened opening subopened subopen fullsubopen subclose nooverflowscrolling"), p.umm = function(e) {
            return "mm-" == e.slice(0, 3) && (e = e.slice(3)), e
        }, f.mm = function(e) {
            return "mm-" + e
        }, f.add("parent style scrollTop offetLeft"), u.mm = function(e) {
            return e + ".mm"
        }, u.add("toggle open opening opened close closing closed update setPage setSelected transitionend touchstart touchend click keydown keyup resize"), e[r].support.touch || (u.touchstart = u.mm("mousedown"), u.touchend = u.mm("mouseup")), e[r]._c = p, e[r]._d = f, e[r]._e = u, e[r].glbl = c, e[r].useOverflowScrollingFallback(m)
    }

    function s(t, n) {
        if (t.hasClass(p.current)) return !1;
        var o = e("." + p.panel, n),
            s = o.filter("." + p.current);
        return o.removeClass(p.highest).removeClass(p.current).not(t).not(s).addClass(p.hidden), t.hasClass(p.opened) ? s.addClass(p.highest).removeClass(p.opened).removeClass(p.subopened) : (t.addClass(p.highest), s.addClass(p.subopened)), t.removeClass(p.hidden).removeClass(p.subopened).addClass(p.current).addClass(p.opened), "open"
    }

    function i() {
        return c.$scrollTopNode || (0 != c.$html.scrollTop() ? c.$scrollTopNode = c.$html : 0 != c.$body.scrollTop() && (c.$scrollTopNode = c.$body)), c.$scrollTopNode ? c.$scrollTopNode.scrollTop() : 0
    }

    function l(t, n, o) {
        var s = e[r].support.transition;
        "webkitTransition" == s ? t.one("webkitTransitionEnd", n) : s ? t.one(u.transitionend, n) : setTimeout(n, o)
    }

    function a(t, n, o, s) {
        "string" == typeof t && (t = e(t));
        var i = o ? u.touchstart : u.click;
        s || t.off(i), t.on(i, function(e) {
            e.preventDefault(), e.stopPropagation(), n.call(this, e)
        })
    }
    var r = "mmenu",
        d = "4.1.0";
    if (!e[r]) {
        var c = {
                $wndw: null,
                $html: null,
                $body: null,
                $page: null,
                $blck: null,
                $allMenus: null,
                $scrollTopNode: null
            },
            p = {},
            u = {},
            f = {},
            h = 0;
        e[r] = function(e, t, n) {
                return c.$allMenus = c.$allMenus.add(e), this.$menu = e, this.opts = t, this.conf = n, this.serialnr = h++, this._init(), this
            }, e[r].prototype = {
                open: function() {
                    return this._openSetup(), this._openFinish(), "open"
                },
                _openSetup: function() {
                    var e = i();
                    this.$menu.addClass(p.current), c.$allMenus.not(this.$menu).trigger(u.close), c.$page.data(f.style, c.$page.attr("style") || "").data(f.scrollTop, e).data(f.offetLeft, c.$page.offset().left);
                    var t = 0;
                    c.$wndw.off(u.resize).on(u.resize, function(e, n) {
                        if (c.$html.hasClass(p.opened) || n) {
                            var o = c.$wndw.width();
                            o != t && (t = o, c.$page.width(o - c.$page.data(f.offetLeft)))
                        }
                    }).trigger(u.resize, [!0]), this.conf.preventTabbing && c.$wndw.off(u.keydown).on(u.keydown, function(e) {
                        return 9 == e.keyCode ? (e.preventDefault(), !1) : void 0
                    }), this.opts.modal && c.$html.addClass(p.modal), this.opts.moveBackground && c.$html.addClass(p.background), "left" != this.opts.position && c.$html.addClass(p.mm(this.opts.position)), "back" != this.opts.zposition && c.$html.addClass(p.mm(this.opts.zposition)), this.opts.classes && c.$html.addClass(this.opts.classes), c.$html.addClass(p.opened), this.$menu.addClass(p.opened), c.$page.scrollTop(e), this.$menu.scrollTop(0)
                },
                _openFinish: function() {
                    var e = this;
                    l(c.$page, function() {
                        e.$menu.trigger(u.opened)
                    }, this.conf.transitionDuration), c.$html.addClass(p.opening), this.$menu.trigger(u.opening), window.scrollTo(0, 1)
                },
                close: function() {
                    var e = this;
                    return l(c.$page, function() {
                        e.$menu.removeClass(p.current).removeClass(p.opened), c.$html.removeClass(p.opened).removeClass(p.modal).removeClass(p.background).removeClass(p.mm(e.opts.position)).removeClass(p.mm(e.opts.zposition)), e.opts.classes && c.$html.removeClass(e.opts.classes), c.$wndw.off(u.resize).off(u.keydown), c.$page.attr("style", c.$page.data(f.style)), c.$scrollTopNode && c.$scrollTopNode.scrollTop(c.$page.data(f.scrollTop)), e.$menu.trigger(u.closed)
                    }, this.conf.transitionDuration), c.$html.removeClass(p.opening), this.$menu.trigger(u.closing), "close"
                },
                _init: function() {
                    if (this.opts = t(this.opts, this.conf, this.$menu), this.direction = this.opts.slidingSubmenus ? "horizontal" : "vertical", this._initPage(c.$page), this._initMenu(), this._initBlocker(), this._initPanles(), this._initLinks(), this._initOpenClose(), this._bindCustomEvents(), e[r].addons)
                        for (var n = 0; n < e[r].addons.length; n++) "function" == typeof this["_addon_" + e[r].addons[n]] && this["_addon_" + e[r].addons[n]]()
                },
                _bindCustomEvents: function() {
                    var t = this;
                    this.$menu.off(u.open + " " + u.close + " " + u.setPage + " " + u.update).on(u.open + " " + u.close + " " + u.setPage + " " + u.update, function(e) {
                        e.stopPropagation()
                    }), this.$menu.on(u.open, function(n) {
                        return e(this).hasClass(p.current) ? (n.stopImmediatePropagation(), !1) : t.open()
                    }).on(u.close, function(n) {
                        return e(this).hasClass(p.current) ? t.close() : (n.stopImmediatePropagation(), !1)
                    }).on(u.setPage, function(e, n) {
                        t._initPage(n), t._initOpenClose()
                    });
                    var n = this.$menu.find(this.opts.isMenu && "horizontal" != this.direction ? "ul, ol" : "." + p.panel);
                    n.off(u.toggle + " " + u.open + " " + u.close).on(u.toggle + " " + u.open + " " + u.close, function(e) {
                        e.stopPropagation()
                    }), "horizontal" == this.direction ? n.on(u.open, function() {
                        return s(e(this), t.$menu)
                    }) : n.on(u.toggle, function() {
                        var t = e(this);
                        return t.triggerHandler(t.parent().hasClass(p.opened) ? u.close : u.open)
                    }).on(u.open, function() {
                        return e(this).parent().addClass(p.opened), "open"
                    }).on(u.close, function() {
                        return e(this).parent().removeClass(p.opened), "close"
                    })
                },
                _initBlocker: function() {
                    var t = this;
                    c.$blck || (c.$blck = e('<div id="' + p.blocker + '" />').appendTo(c.$body)), a(c.$blck, function() {
                        c.$html.hasClass(p.modal) || t.$menu.trigger(u.close)
                    }, !0, !0)
                },
                _initPage: function(t) {
                    t || (t = e(this.conf.pageSelector, c.$body), t.length > 1 && (e[r].debug("Multiple nodes found for the page-node, all nodes are wrapped in one <" + this.conf.pageNodetype + ">."), t = t.wrapAll("<" + this.conf.pageNodetype + " />").parent())), t.addClass(p.page), c.$page = t
                },
                _initMenu: function() {
                    this.conf.clone && (this.$menu = this.$menu.clone(!0), this.$menu.add(this.$menu.find("*")).filter("[id]").each(function() {
                        e(this).attr("id", p.mm(e(this).attr("id")))
                    })), this.$menu.contents().each(function() {
                        3 == e(this)[0].nodeType && e(this).remove()
                    }), this.$menu.prependTo("body").addClass(p.menu), this.$menu.addClass(p.mm(this.direction)), this.opts.classes && this.$menu.addClass(this.opts.classes), this.opts.isMenu && this.$menu.addClass(p.ismenu), "left" != this.opts.position && this.$menu.addClass(p.mm(this.opts.position)), "back" != this.opts.zposition && this.$menu.addClass(p.mm(this.opts.zposition))
                },
                _initPanles: function() {
                    var t = this;
                    this.__refactorClass(e("." + this.conf.listClass, this.$menu), "list"), this.opts.isMenu && e("ul, ol", this.$menu).not(".mm-nolist").addClass(p.list);
                    var n = e("." + p.list + " > li", this.$menu);
                    this.__refactorClass(n.filter("." + this.conf.selectedClass), "selected"), this.__refactorClass(n.filter("." + this.conf.labelClass), "label"), this.__refactorClass(n.filter("." + this.conf.spacerClass), "spacer"), n.off(u.setSelected).on(u.setSelected, function(t, o) {
                        t.stopPropagation(), n.removeClass(p.selected), "boolean" != typeof o && (o = !0), o && e(this).addClass(p.selected)
                    }), this.__refactorClass(e("." + this.conf.panelClass, this.$menu), "panel"), this.$menu.children().filter(this.conf.panelNodetype).add(this.$menu.find("." + p.list).children().children().filter(this.conf.panelNodetype)).addClass(p.panel);
                    var o = e("." + p.panel, this.$menu);
                    o.each(function(n) {
                        var o = e(this),
                            s = o.attr("id") || p.mm("m" + t.serialnr + "-p" + n);
                        o.attr("id", s)
                    }), o.find("." + p.panel).each(function() {
                        var n = e(this),
                            o = n.is("ul, ol") ? n : n.find("ul ,ol").first(),
                            s = n.parent(),
                            i = s.find("> a, > span"),
                            l = s.closest("." + p.panel);
                        if (n.data(f.parent, s), s.parent().is("." + p.list)) {
                            var a = e('<a class="' + p.subopen + '" href="#' + n.attr("id") + '" />').insertBefore(i);
                            i.is("a") || a.addClass(p.fullsubopen), "horizontal" == t.direction && o.prepend('<li class="' + p.subtitle + '"><a class="' + p.subclose + '" href="#' + l.attr("id") + '">' + i.text() + "</a></li>")
                        }
                    });
                    var s = "horizontal" == this.direction ? u.open : u.toggle;
                    if (o.each(function() {
                            var n = e(this),
                                o = n.attr("id");
                            a(e('a[href="#' + o + '"]', t.$menu), function() {
                                n.trigger(s)
                            })
                        }), "horizontal" == this.direction) {
                        var i = e("." + p.list + " > li." + p.selected, this.$menu);
                        i.add(i.parents("li")).parents("li").removeClass(p.selected).end().each(function() {
                            var t = e(this),
                                n = t.find("> ." + p.panel);
                            n.length && (t.parents("." + p.panel).addClass(p.subopened), n.addClass(p.opened))
                        }).closest("." + p.panel).addClass(p.opened).parents("." + p.panel).addClass(p.subopened)
                    } else e("li." + p.selected, this.$menu).addClass(p.opened).parents("." + p.selected).removeClass(p.selected);
                    var l = o.filter("." + p.opened);
                    l.length || (l = o.first()), l.addClass(p.opened).last().addClass(p.current), "horizontal" == this.direction && o.find("." + p.panel).appendTo(this.$menu)
                },
                _initLinks: function() {
                    var t = this,
                        n = e("." + p.list + " > li > a", this.$menu).not("." + p.subopen).not("." + p.subclose).not('[rel="external"]').not('[target="_blank"]');
                    n.off(u.click).on(u.click, function(n) {
                        var o = e(this),
                            s = o.attr("href");
                        t.__valueOrFn(t.opts.onClick.setSelected, o) && o.parent().trigger(u.setSelected);
                        var i = t.__valueOrFn(t.opts.onClick.preventDefault, o, "#" == s.slice(0, 1));
                        i && (n.preventDefault(), n.stopPropagation()), t.__valueOrFn(t.opts.onClick.blockUI, o, !i) && c.$html.addClass(p.blocking), t.__valueOrFn(t.opts.onClick.close, o, i) && t.$menu.triggerHandler(u.close)
                    })
                },
                _initOpenClose: function() {
                    var t = this,
                        n = this.$menu.attr("id");
                    n && n.length && (this.conf.clone && (n = p.umm(n)), a(e('a[href="#' + n + '"]'), function() {
                        t.$menu.trigger(u.open)
                    }));
                    var n = c.$page.attr("id");
                    n && n.length && a(e('a[href="#' + n + '"]'), function() {
                        t.$menu.trigger(u.close)
                    }, !1, !0)
                },
                __valueOrFn: function(e, t, n) {
                    return "function" == typeof e ? e.call(t[0]) : "undefined" == typeof e && "undefined" != typeof n ? n : e
                },
                __refactorClass: function(e, t) {
                    e.removeClass(this.conf[t + "Class"]).addClass(p[t])
                }
            }, e.fn[r] = function(s, i) {
                return c.$wndw || o(), s = t(s, i), i = n(i), this.each(function() {
                    var t = e(this);
                    t.data(r) || t.data(r, new e[r](t, s, i))
                })
            }, e[r].version = d, e[r].defaults = {
                position: "left",
                zposition: "back",
                moveBackground: !0,
                slidingSubmenus: !0,
                modal: !1,
                classes: "",
                onClick: {
                    setSelected: !0
                }
            }, e[r].configuration = {
                preventTabbing: !0,
                panelClass: "Panel",
                listClass: "List",
                selectedClass: "Selected",
                labelClass: "Label",
                spacerClass: "Spacer",
                pageNodetype: "div",
                panelNodetype: "ul, ol, div",
                transitionDuration: 400
            },
            function() {
                var t = window.document,
                    n = window.navigator.userAgent,
                    o = "ontouchstart" in t,
                    s = "WebkitOverflowScrolling" in t.documentElement.style,
                    i = function() {
                        var e = document.createElement("div").style;
                        return "webkitTransition" in e ? "webkitTransition" : "transition" in e
                    }(),
                    l = function() {
                        return n.indexOf("Android") >= 0 ? 2.4 > parseFloat(n.slice(n.indexOf("Android") + 8)) : !1
                    }();
                e[r].support = {
                    touch: o,
                    transition: i,
                    oldAndroidBrowser: l,
                    overflowscrolling: function() {
                        return o ? s ? !0 : l ? !1 : !0 : !0
                    }()
                }
            }(), e[r].useOverflowScrollingFallback = function(e) {
                return c.$html ? ("boolean" == typeof e && c.$html[e ? "addClass" : "removeClass"](p.nooverflowscrolling), c.$html.hasClass(p.nooverflowscrolling)) : (m = e, e)
            }, e[r].debug = function() {}, e[r].deprecated = function(e, t) {
                "undefined" != typeof console && "undefined" != typeof console.warn && console.warn("MMENU: " + e + " is deprecated, use " + t + " instead.")
            };
        var m = !e[r].support.overflowscrolling
    }
}(jQuery);;

(function(t) {
    function e() {}

    function i(t) {
        function i(e) {
            e.prototype.option || (e.prototype.option = function(e) {
                t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e))
            })
        }

        function o(e, i) {
            t.fn[e] = function(o) {
                if ("string" == typeof o) {
                    for (var s = n.call(arguments, 1), a = 0, h = this.length; h > a; a++) {
                        var p = this[a],
                            u = t.data(p, e);
                        if (u)
                            if (t.isFunction(u[o]) && "_" !== o.charAt(0)) {
                                var f = u[o].apply(u, s);
                                if (void 0 !== f) return f
                            } else r("no such method '" + o + "' for " + e + " instance");
                        else r("cannot call methods on " + e + " prior to initialization; " + "attempted to call '" + o + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var n = t.data(this, e);
                    n ? (n.option(o), n._init()) : (n = new i(this, o), t.data(this, e, n))
                })
            }
        }
        if (t) {
            var r = "undefined" == typeof console ? e : function(t) {
                console.error(t)
            };
            return t.bridget = function(t, e) {
                i(e), o(t, e)
            }, t.bridget
        }
    }
    var n = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], i) : i(t.jQuery)
})(window),
function(t) {
    function e(e) {
        var i = t.event;
        return i.target = i.target || i.srcElement || e, i
    }
    var i = document.documentElement,
        n = function() {};
    i.addEventListener ? n = function(t, e, i) {
        t.addEventListener(e, i, !1)
    } : i.attachEvent && (n = function(t, i, n) {
        t[i + n] = n.handleEvent ? function() {
            var i = e(t);
            n.handleEvent.call(n, i)
        } : function() {
            var i = e(t);
            n.call(t, i)
        }, t.attachEvent("on" + i, t[i + n])
    });
    var o = function() {};
    i.removeEventListener ? o = function(t, e, i) {
        t.removeEventListener(e, i, !1)
    } : i.detachEvent && (o = function(t, e, i) {
        t.detachEvent("on" + e, t[e + i]);
        try {
            delete t[e + i]
        } catch (n) {
            t[e + i] = void 0
        }
    });
    var r = {
        bind: n,
        unbind: o
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", r) : "object" == typeof exports ? module.exports = r : t.eventie = r
}(this),
function(t) {
    function e(t) {
        "function" == typeof t && (e.isReady ? t() : r.push(t))
    }

    function i(t) {
        var i = "readystatechange" === t.type && "complete" !== o.readyState;
        if (!e.isReady && !i) {
            e.isReady = !0;
            for (var n = 0, s = r.length; s > n; n++) {
                var a = r[n];
                a()
            }
        }
    }

    function n(n) {
        return n.bind(o, "DOMContentLoaded", i), n.bind(o, "readystatechange", i), n.bind(t, "load", i), e
    }
    var o = t.document,
        r = [];
    e.isReady = !1, "function" == typeof define && define.amd ? (e.isReady = "function" == typeof requirejs, define("doc-ready/doc-ready", ["eventie/eventie"], n)) : t.docReady = n(t.eventie)
}(this),
function() {
    function t() {}

    function e(t, e) {
        for (var i = t.length; i--;)
            if (t[i].listener === e) return i;
        return -1
    }

    function i(t) {
        return function() {
            return this[t].apply(this, arguments)
        }
    }
    var n = t.prototype,
        o = this,
        r = o.EventEmitter;
    n.getListeners = function(t) {
        var e, i, n = this._getEvents();
        if (t instanceof RegExp) {
            e = {};
            for (i in n) n.hasOwnProperty(i) && t.test(i) && (e[i] = n[i])
        } else e = n[t] || (n[t] = []);
        return e
    }, n.flattenListeners = function(t) {
        var e, i = [];
        for (e = 0; t.length > e; e += 1) i.push(t[e].listener);
        return i
    }, n.getListenersAsObject = function(t) {
        var e, i = this.getListeners(t);
        return i instanceof Array && (e = {}, e[t] = i), e || i
    }, n.addListener = function(t, i) {
        var n, o = this.getListenersAsObject(t),
            r = "object" == typeof i;
        for (n in o) o.hasOwnProperty(n) && -1 === e(o[n], i) && o[n].push(r ? i : {
            listener: i,
            once: !1
        });
        return this
    }, n.on = i("addListener"), n.addOnceListener = function(t, e) {
        return this.addListener(t, {
            listener: e,
            once: !0
        })
    }, n.once = i("addOnceListener"), n.defineEvent = function(t) {
        return this.getListeners(t), this
    }, n.defineEvents = function(t) {
        for (var e = 0; t.length > e; e += 1) this.defineEvent(t[e]);
        return this
    }, n.removeListener = function(t, i) {
        var n, o, r = this.getListenersAsObject(t);
        for (o in r) r.hasOwnProperty(o) && (n = e(r[o], i), -1 !== n && r[o].splice(n, 1));
        return this
    }, n.off = i("removeListener"), n.addListeners = function(t, e) {
        return this.manipulateListeners(!1, t, e)
    }, n.removeListeners = function(t, e) {
        return this.manipulateListeners(!0, t, e)
    }, n.manipulateListeners = function(t, e, i) {
        var n, o, r = t ? this.removeListener : this.addListener,
            s = t ? this.removeListeners : this.addListeners;
        if ("object" != typeof e || e instanceof RegExp)
            for (n = i.length; n--;) r.call(this, e, i[n]);
        else
            for (n in e) e.hasOwnProperty(n) && (o = e[n]) && ("function" == typeof o ? r.call(this, n, o) : s.call(this, n, o));
        return this
    }, n.removeEvent = function(t) {
        var e, i = typeof t,
            n = this._getEvents();
        if ("string" === i) delete n[t];
        else if (t instanceof RegExp)
            for (e in n) n.hasOwnProperty(e) && t.test(e) && delete n[e];
        else delete this._events;
        return this
    }, n.removeAllListeners = i("removeEvent"), n.emitEvent = function(t, e) {
        var i, n, o, r, s = this.getListenersAsObject(t);
        for (o in s)
            if (s.hasOwnProperty(o))
                for (n = s[o].length; n--;) i = s[o][n], i.once === !0 && this.removeListener(t, i.listener), r = i.listener.apply(this, e || []), r === this._getOnceReturnValue() && this.removeListener(t, i.listener);
        return this
    }, n.trigger = i("emitEvent"), n.emit = function(t) {
        var e = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(t, e)
    }, n.setOnceReturnValue = function(t) {
        return this._onceReturnValue = t, this
    }, n._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, n._getEvents = function() {
        return this._events || (this._events = {})
    }, t.noConflict = function() {
        return o.EventEmitter = r, t
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return t
    }) : "object" == typeof module && module.exports ? module.exports = t : this.EventEmitter = t
}.call(this),
    function(t) {
        function e(t) {
            if (t) {
                if ("string" == typeof n[t]) return t;
                t = t.charAt(0).toUpperCase() + t.slice(1);
                for (var e, o = 0, r = i.length; r > o; o++)
                    if (e = i[o] + t, "string" == typeof n[e]) return e
            }
        }
        var i = "Webkit Moz ms Ms O".split(" "),
            n = document.documentElement.style;
        "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function() {
            return e
        }) : "object" == typeof exports ? module.exports = e : t.getStyleProperty = e
    }(window),
    function(t) {
        function e(t) {
            var e = parseFloat(t),
                i = -1 === t.indexOf("%") && !isNaN(e);
            return i && e
        }

        function i() {
            for (var t = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, e = 0, i = s.length; i > e; e++) {
                var n = s[e];
                t[n] = 0
            }
            return t
        }

        function n(t) {
            function n(t) {
                if ("string" == typeof t && (t = document.querySelector(t)), t && "object" == typeof t && t.nodeType) {
                    var n = r(t);
                    if ("none" === n.display) return i();
                    var o = {};
                    o.width = t.offsetWidth, o.height = t.offsetHeight;
                    for (var u = o.isBorderBox = !(!p || !n[p] || "border-box" !== n[p]), f = 0, c = s.length; c > f; f++) {
                        var d = s[f],
                            l = n[d];
                        l = a(t, l);
                        var m = parseFloat(l);
                        o[d] = isNaN(m) ? 0 : m
                    }
                    var y = o.paddingLeft + o.paddingRight,
                        g = o.paddingTop + o.paddingBottom,
                        v = o.marginLeft + o.marginRight,
                        b = o.marginTop + o.marginBottom,
                        _ = o.borderLeftWidth + o.borderRightWidth,
                        E = o.borderTopWidth + o.borderBottomWidth,
                        L = u && h,
                        x = e(n.width);
                    x !== !1 && (o.width = x + (L ? 0 : y + _));
                    var z = e(n.height);
                    return z !== !1 && (o.height = z + (L ? 0 : g + E)), o.innerWidth = o.width - (y + _), o.innerHeight = o.height - (g + E), o.outerWidth = o.width + v, o.outerHeight = o.height + b, o
                }
            }

            function a(t, e) {
                if (o || -1 === e.indexOf("%")) return e;
                var i = t.style,
                    n = i.left,
                    r = t.runtimeStyle,
                    s = r && r.left;
                return s && (r.left = t.currentStyle.left), i.left = e, e = i.pixelLeft, i.left = n, s && (r.left = s), e
            }
            var h, p = t("boxSizing");
            return function() {
                if (p) {
                    var t = document.createElement("div");
                    t.style.width = "200px", t.style.padding = "1px 2px 3px 4px", t.style.borderStyle = "solid", t.style.borderWidth = "1px 2px 3px 4px", t.style[p] = "border-box";
                    var i = document.body || document.documentElement;
                    i.appendChild(t);
                    var n = r(t);
                    h = 200 === e(n.width), i.removeChild(t)
                }
            }(), n
        }
        var o = t.getComputedStyle,
            r = o ? function(t) {
                return o(t, null)
            } : function(t) {
                return t.currentStyle
            },
            s = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], n) : "object" == typeof exports ? module.exports = n(require("get-style-property")) : t.getSize = n(t.getStyleProperty)
    }(window),
    function(t, e) {
        function i(t, e) {
            return t[a](e)
        }

        function n(t) {
            if (!t.parentNode) {
                var e = document.createDocumentFragment();
                e.appendChild(t)
            }
        }

        function o(t, e) {
            n(t);
            for (var i = t.parentNode.querySelectorAll(e), o = 0, r = i.length; r > o; o++)
                if (i[o] === t) return !0;
            return !1
        }

        function r(t, e) {
            return n(t), i(t, e)
        }
        var s, a = function() {
            if (e.matchesSelector) return "matchesSelector";
            for (var t = ["webkit", "moz", "ms", "o"], i = 0, n = t.length; n > i; i++) {
                var o = t[i],
                    r = o + "MatchesSelector";
                if (e[r]) return r
            }
        }();
        if (a) {
            var h = document.createElement("div"),
                p = i(h, "div");
            s = p ? i : r
        } else s = o;
        "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function() {
            return s
        }) : window.matchesSelector = s
    }(this, Element.prototype),
    function(t) {
        function e(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }

        function i(t) {
            for (var e in t) return !1;
            return e = null, !0
        }

        function n(t) {
            return t.replace(/([A-Z])/g, function(t) {
                return "-" + t.toLowerCase()
            })
        }

        function o(t, o, r) {
            function a(t, e) {
                t && (this.element = t, this.layout = e, this.position = {
                    x: 0,
                    y: 0
                }, this._create())
            }
            var h = r("transition"),
                p = r("transform"),
                u = h && p,
                f = !!r("perspective"),
                c = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "otransitionend",
                    transition: "transitionend"
                }[h],
                d = ["transform", "transition", "transitionDuration", "transitionProperty"],
                l = function() {
                    for (var t = {}, e = 0, i = d.length; i > e; e++) {
                        var n = d[e],
                            o = r(n);
                        o && o !== n && (t[n] = o)
                    }
                    return t
                }();
            e(a.prototype, t.prototype), a.prototype._create = function() {
                this._transn = {
                    ingProperties: {},
                    clean: {},
                    onEnd: {}
                }, this.css({
                    position: "absolute"
                })
            }, a.prototype.handleEvent = function(t) {
                var e = "on" + t.type;
                this[e] && this[e](t)
            }, a.prototype.getSize = function() {
                this.size = o(this.element)
            }, a.prototype.css = function(t) {
                var e = this.element.style;
                for (var i in t) {
                    var n = l[i] || i;
                    e[n] = t[i]
                }
            }, a.prototype.getPosition = function() {
                var t = s(this.element),
                    e = this.layout.options,
                    i = e.isOriginLeft,
                    n = e.isOriginTop,
                    o = parseInt(t[i ? "left" : "right"], 10),
                    r = parseInt(t[n ? "top" : "bottom"], 10);
                o = isNaN(o) ? 0 : o, r = isNaN(r) ? 0 : r;
                var a = this.layout.size;
                o -= i ? a.paddingLeft : a.paddingRight, r -= n ? a.paddingTop : a.paddingBottom, this.position.x = o, this.position.y = r
            }, a.prototype.layoutPosition = function() {
                var t = this.layout.size,
                    e = this.layout.options,
                    i = {};
                e.isOriginLeft ? (i.left = this.position.x + t.paddingLeft + "px", i.right = "") : (i.right = this.position.x + t.paddingRight + "px", i.left = ""), e.isOriginTop ? (i.top = this.position.y + t.paddingTop + "px", i.bottom = "") : (i.bottom = this.position.y + t.paddingBottom + "px", i.top = ""), this.css(i), this.emitEvent("layout", [this])
            };
            var m = f ? function(t, e) {
                return "translate3d(" + t + "px, " + e + "px, 0)"
            } : function(t, e) {
                return "translate(" + t + "px, " + e + "px)"
            };
            a.prototype._transitionTo = function(t, e) {
                this.getPosition();
                var i = this.position.x,
                    n = this.position.y,
                    o = parseInt(t, 10),
                    r = parseInt(e, 10),
                    s = o === this.position.x && r === this.position.y;
                if (this.setPosition(t, e), s && !this.isTransitioning) return this.layoutPosition(), void 0;
                var a = t - i,
                    h = e - n,
                    p = {},
                    u = this.layout.options;
                a = u.isOriginLeft ? a : -a, h = u.isOriginTop ? h : -h, p.transform = m(a, h), this.transition({
                    to: p,
                    onTransitionEnd: {
                        transform: this.layoutPosition
                    },
                    isCleaning: !0
                })
            }, a.prototype.goTo = function(t, e) {
                this.setPosition(t, e), this.layoutPosition()
            }, a.prototype.moveTo = u ? a.prototype._transitionTo : a.prototype.goTo, a.prototype.setPosition = function(t, e) {
                this.position.x = parseInt(t, 10), this.position.y = parseInt(e, 10)
            }, a.prototype._nonTransition = function(t) {
                this.css(t.to), t.isCleaning && this._removeStyles(t.to);
                for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this)
            }, a.prototype._transition = function(t) {
                if (!parseFloat(this.layout.options.transitionDuration)) return this._nonTransition(t), void 0;
                var e = this._transn;
                for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
                for (i in t.to) e.ingProperties[i] = !0, t.isCleaning && (e.clean[i] = !0);
                if (t.from) {
                    this.css(t.from);
                    var n = this.element.offsetHeight;
                    n = null
                }
                this.enableTransition(t.to), this.css(t.to), this.isTransitioning = !0
            };
            var y = p && n(p) + ",opacity";
            a.prototype.enableTransition = function() {
                this.isTransitioning || (this.css({
                    transitionProperty: y,
                    transitionDuration: this.layout.options.transitionDuration
                }), this.element.addEventListener(c, this, !1))
            }, a.prototype.transition = a.prototype[h ? "_transition" : "_nonTransition"], a.prototype.onwebkitTransitionEnd = function(t) {
                this.ontransitionend(t)
            }, a.prototype.onotransitionend = function(t) {
                this.ontransitionend(t)
            };
            var g = {
                "-webkit-transform": "transform",
                "-moz-transform": "transform",
                "-o-transform": "transform"
            };
            a.prototype.ontransitionend = function(t) {
                if (t.target === this.element) {
                    var e = this._transn,
                        n = g[t.propertyName] || t.propertyName;
                    if (delete e.ingProperties[n], i(e.ingProperties) && this.disableTransition(), n in e.clean && (this.element.style[t.propertyName] = "", delete e.clean[n]), n in e.onEnd) {
                        var o = e.onEnd[n];
                        o.call(this), delete e.onEnd[n]
                    }
                    this.emitEvent("transitionEnd", [this])
                }
            }, a.prototype.disableTransition = function() {
                this.removeTransitionStyles(), this.element.removeEventListener(c, this, !1), this.isTransitioning = !1
            }, a.prototype._removeStyles = function(t) {
                var e = {};
                for (var i in t) e[i] = "";
                this.css(e)
            };
            var v = {
                transitionProperty: "",
                transitionDuration: ""
            };
            return a.prototype.removeTransitionStyles = function() {
                this.css(v)
            }, a.prototype.removeElem = function() {
                this.element.parentNode.removeChild(this.element), this.emitEvent("remove", [this])
            }, a.prototype.remove = function() {
                if (!h || !parseFloat(this.layout.options.transitionDuration)) return this.removeElem(), void 0;
                var t = this;
                this.on("transitionEnd", function() {
                    return t.removeElem(), !0
                }), this.hide()
            }, a.prototype.reveal = function() {
                delete this.isHidden, this.css({
                    display: ""
                });
                var t = this.layout.options;
                this.transition({
                    from: t.hiddenStyle,
                    to: t.visibleStyle,
                    isCleaning: !0
                })
            }, a.prototype.hide = function() {
                this.isHidden = !0, this.css({
                    display: ""
                });
                var t = this.layout.options;
                this.transition({
                    from: t.visibleStyle,
                    to: t.hiddenStyle,
                    isCleaning: !0,
                    onTransitionEnd: {
                        opacity: function() {
                            this.isHidden && this.css({
                                display: "none"
                            })
                        }
                    }
                })
            }, a.prototype.destroy = function() {
                this.css({
                    position: "",
                    left: "",
                    right: "",
                    top: "",
                    bottom: "",
                    transition: "",
                    transform: ""
                })
            }, a
        }
        var r = document.defaultView,
            s = r && r.getComputedStyle ? function(t) {
                return r.getComputedStyle(t, null)
            } : function(t) {
                return t.currentStyle
            };
        "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property"], o) : (t.Outlayer = {}, t.Outlayer.Item = o(t.EventEmitter, t.getSize, t.getStyleProperty))
    }(window),
    function(t) {
        function e(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }

        function i(t) {
            return "[object Array]" === f.call(t)
        }

        function n(t) {
            var e = [];
            if (i(t)) e = t;
            else if (t && "number" == typeof t.length)
                for (var n = 0, o = t.length; o > n; n++) e.push(t[n]);
            else e.push(t);
            return e
        }

        function o(t, e) {
            var i = d(e, t); - 1 !== i && e.splice(i, 1)
        }

        function r(t) {
            return t.replace(/(.)([A-Z])/g, function(t, e, i) {
                return e + "-" + i
            }).toLowerCase()
        }

        function s(i, s, f, d, l, m) {
            function y(t, i) {
                if ("string" == typeof t && (t = a.querySelector(t)), !t || !c(t)) return h && h.error("Bad " + this.constructor.namespace + " element: " + t), void 0;
                this.element = t, this.options = e({}, this.options), this.option(i);
                var n = ++v;
                this.element.outlayerGUID = n, b[n] = this, this._create(), this.options.isInitLayout && this.layout()
            }

            function g(t, i) {
                t.prototype[i] = e({}, y.prototype[i])
            }
            var v = 0,
                b = {};
            return y.namespace = "outlayer", y.Item = m, y.prototype.options = {
                containerStyle: {
                    position: "relative"
                },
                isInitLayout: !0,
                isOriginLeft: !0,
                isOriginTop: !0,
                isResizeBound: !0,
                transitionDuration: "0.4s",
                hiddenStyle: {
                    opacity: 0,
                    transform: "scale(0.001)"
                },
                visibleStyle: {
                    opacity: 1,
                    transform: "scale(1)"
                }
            }, e(y.prototype, f.prototype), y.prototype.option = function(t) {
                e(this.options, t)
            }, y.prototype._create = function() {
                this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), e(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
            }, y.prototype.reloadItems = function() {
                this.items = this._itemize(this.element.children)
            }, y.prototype._itemize = function(t) {
                for (var e = this._filterFindItemElements(t), i = this.constructor.Item, n = [], o = 0, r = e.length; r > o; o++) {
                    var s = e[o],
                        a = new i(s, this);
                    n.push(a)
                }
                return n
            }, y.prototype._filterFindItemElements = function(t) {
                t = n(t);
                for (var e = this.options.itemSelector, i = [], o = 0, r = t.length; r > o; o++) {
                    var s = t[o];
                    if (c(s))
                        if (e) {
                            l(s, e) && i.push(s);
                            for (var a = s.querySelectorAll(e), h = 0, p = a.length; p > h; h++) i.push(a[h])
                        } else i.push(s)
                }
                return i
            }, y.prototype.getItemElements = function() {
                for (var t = [], e = 0, i = this.items.length; i > e; e++) t.push(this.items[e].element);
                return t
            }, y.prototype.layout = function() {
                this._resetLayout(), this._manageStamps();
                var t = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
                this.layoutItems(this.items, t), this._isLayoutInited = !0
            }, y.prototype._init = y.prototype.layout, y.prototype._resetLayout = function() {
                this.getSize()
            }, y.prototype.getSize = function() {
                this.size = d(this.element)
            }, y.prototype._getMeasurement = function(t, e) {
                var i, n = this.options[t];
                n ? ("string" == typeof n ? i = this.element.querySelector(n) : c(n) && (i = n), this[t] = i ? d(i)[e] : n) : this[t] = 0
            }, y.prototype.layoutItems = function(t, e) {
                t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout()
            }, y.prototype._getItemsForLayout = function(t) {
                for (var e = [], i = 0, n = t.length; n > i; i++) {
                    var o = t[i];
                    o.isIgnored || e.push(o)
                }
                return e
            }, y.prototype._layoutItems = function(t, e) {
                function i() {
                    n.emitEvent("layoutComplete", [n, t])
                }
                var n = this;
                if (!t || !t.length) return i(), void 0;
                this._itemsOn(t, "layout", i);
                for (var o = [], r = 0, s = t.length; s > r; r++) {
                    var a = t[r],
                        h = this._getItemLayoutPosition(a);
                    h.item = a, h.isInstant = e || a.isLayoutInstant, o.push(h)
                }
                this._processLayoutQueue(o)
            }, y.prototype._getItemLayoutPosition = function() {
                return {
                    x: 0,
                    y: 0
                }
            }, y.prototype._processLayoutQueue = function(t) {
                for (var e = 0, i = t.length; i > e; e++) {
                    var n = t[e];
                    this._positionItem(n.item, n.x, n.y, n.isInstant)
                }
            }, y.prototype._positionItem = function(t, e, i, n) {
                n ? t.goTo(e, i) : t.moveTo(e, i)
            }, y.prototype._postLayout = function() {
                var t = this._getContainerSize();
                t && (this._setContainerMeasure(t.width, !0), this._setContainerMeasure(t.height, !1))
            }, y.prototype._getContainerSize = u, y.prototype._setContainerMeasure = function(t, e) {
                if (void 0 !== t) {
                    var i = this.size;
                    i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px"
                }
            }, y.prototype._itemsOn = function(t, e, i) {
                function n() {
                    return o++, o === r && i.call(s), !0
                }
                for (var o = 0, r = t.length, s = this, a = 0, h = t.length; h > a; a++) {
                    var p = t[a];
                    p.on(e, n)
                }
            }, y.prototype.ignore = function(t) {
                var e = this.getItem(t);
                e && (e.isIgnored = !0)
            }, y.prototype.unignore = function(t) {
                var e = this.getItem(t);
                e && delete e.isIgnored
            }, y.prototype.stamp = function(t) {
                if (t = this._find(t)) {
                    this.stamps = this.stamps.concat(t);
                    for (var e = 0, i = t.length; i > e; e++) {
                        var n = t[e];
                        this.ignore(n)
                    }
                }
            }, y.prototype.unstamp = function(t) {
                if (t = this._find(t))
                    for (var e = 0, i = t.length; i > e; e++) {
                        var n = t[e];
                        o(n, this.stamps), this.unignore(n)
                    }
            }, y.prototype._find = function(t) {
                return t ? ("string" == typeof t && (t = this.element.querySelectorAll(t)), t = n(t)) : void 0
            }, y.prototype._manageStamps = function() {
                if (this.stamps && this.stamps.length) {
                    this._getBoundingRect();
                    for (var t = 0, e = this.stamps.length; e > t; t++) {
                        var i = this.stamps[t];
                        this._manageStamp(i)
                    }
                }
            }, y.prototype._getBoundingRect = function() {
                var t = this.element.getBoundingClientRect(),
                    e = this.size;
                this._boundingRect = {
                    left: t.left + e.paddingLeft + e.borderLeftWidth,
                    top: t.top + e.paddingTop + e.borderTopWidth,
                    right: t.right - (e.paddingRight + e.borderRightWidth),
                    bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
                }
            }, y.prototype._manageStamp = u, y.prototype._getElementOffset = function(t) {
                var e = t.getBoundingClientRect(),
                    i = this._boundingRect,
                    n = d(t),
                    o = {
                        left: e.left - i.left - n.marginLeft,
                        top: e.top - i.top - n.marginTop,
                        right: i.right - e.right - n.marginRight,
                        bottom: i.bottom - e.bottom - n.marginBottom
                    };
                return o
            }, y.prototype.handleEvent = function(t) {
                var e = "on" + t.type;
                this[e] && this[e](t)
            }, y.prototype.bindResize = function() {
                this.isResizeBound || (i.bind(t, "resize", this), this.isResizeBound = !0)
            }, y.prototype.unbindResize = function() {
                i.unbind(t, "resize", this), this.isResizeBound = !1
            }, y.prototype.onresize = function() {
                function t() {
                    e.resize(), delete e.resizeTimeout
                }
                this.resizeTimeout && clearTimeout(this.resizeTimeout);
                var e = this;
                this.resizeTimeout = setTimeout(t, 100)
            }, y.prototype.resize = function() {
                var t = d(this.element),
                    e = this.size && t;
                e && t.innerWidth === this.size.innerWidth || this.layout()
            }, y.prototype.addItems = function(t) {
                var e = this._itemize(t);
                return e.length && (this.items = this.items.concat(e)), e
            }, y.prototype.appended = function(t) {
                var e = this.addItems(t);
                e.length && (this.layoutItems(e, !0), this.reveal(e))
            }, y.prototype.prepended = function(t) {
                var e = this._itemize(t);
                if (e.length) {
                    var i = this.items.slice(0);
                    this.items = e.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(e, !0), this.reveal(e), this.layoutItems(i)
                }
            }, y.prototype.reveal = function(t) {
                var e = t && t.length;
                if (e)
                    for (var i = 0; e > i; i++) {
                        var n = t[i];
                        n.reveal()
                    }
            }, y.prototype.hide = function(t) {
                var e = t && t.length;
                if (e)
                    for (var i = 0; e > i; i++) {
                        var n = t[i];
                        n.hide()
                    }
            }, y.prototype.getItem = function(t) {
                for (var e = 0, i = this.items.length; i > e; e++) {
                    var n = this.items[e];
                    if (n.element === t) return n
                }
            }, y.prototype.getItems = function(t) {
                if (t && t.length) {
                    for (var e = [], i = 0, n = t.length; n > i; i++) {
                        var o = t[i],
                            r = this.getItem(o);
                        r && e.push(r)
                    }
                    return e
                }
            }, y.prototype.remove = function(t) {
                t = n(t);
                var e = this.getItems(t);
                if (e && e.length) {
                    this._itemsOn(e, "remove", function() {
                        this.emitEvent("removeComplete", [this, e])
                    });
                    for (var i = 0, r = e.length; r > i; i++) {
                        var s = e[i];
                        s.remove(), o(s, this.items)
                    }
                }
            }, y.prototype.destroy = function() {
                var t = this.element.style;
                t.height = "", t.position = "", t.width = "";
                for (var e = 0, i = this.items.length; i > e; e++) {
                    var n = this.items[e];
                    n.destroy()
                }
                this.unbindResize(), delete this.element.outlayerGUID, p && p.removeData(this.element, this.constructor.namespace)
            }, y.data = function(t) {
                var e = t && t.outlayerGUID;
                return e && b[e]
            }, y.create = function(t, i) {
                function n() {
                    y.apply(this, arguments)
                }
                return Object.create ? n.prototype = Object.create(y.prototype) : e(n.prototype, y.prototype), n.prototype.constructor = n, g(n, "options"), e(n.prototype.options, i), n.namespace = t, n.data = y.data, n.Item = function() {
                    m.apply(this, arguments)
                }, n.Item.prototype = new m, s(function() {
                    for (var e = r(t), i = a.querySelectorAll(".js-" + e), o = "data-" + e + "-options", s = 0, u = i.length; u > s; s++) {
                        var f, c = i[s],
                            d = c.getAttribute(o);
                        try {
                            f = d && JSON.parse(d)
                        } catch (l) {
                            h && h.error("Error parsing " + o + " on " + c.nodeName.toLowerCase() + (c.id ? "#" + c.id : "") + ": " + l);
                            continue
                        }
                        var m = new n(c, f);
                        p && p.data(c, t, m)
                    }
                }), p && p.bridget && p.bridget(t, n), n
            }, y.Item = m, y
        }
        var a = t.document,
            h = t.console,
            p = t.jQuery,
            u = function() {},
            f = Object.prototype.toString,
            c = "object" == typeof HTMLElement ? function(t) {
                return t instanceof HTMLElement
            } : function(t) {
                return t && "object" == typeof t && 1 === t.nodeType && "string" == typeof t.nodeName
            },
            d = Array.prototype.indexOf ? function(t, e) {
                return t.indexOf(e)
            } : function(t, e) {
                for (var i = 0, n = t.length; n > i; i++)
                    if (t[i] === e) return i;
                return -1
            };
        "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "doc-ready/doc-ready", "eventEmitter/EventEmitter", "get-size/get-size", "matches-selector/matches-selector", "./item"], s) : t.Outlayer = s(t.eventie, t.docReady, t.EventEmitter, t.getSize, t.matchesSelector, t.Outlayer.Item)
    }(window),
    function(t) {
        function e(t, e) {
            var n = t.create("masonry");
            return n.prototype._resetLayout = function() {
                this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
                var t = this.cols;
                for (this.colYs = []; t--;) this.colYs.push(0);
                this.maxY = 0
            }, n.prototype.measureColumns = function() {
                if (this.getContainerWidth(), !this.columnWidth) {
                    var t = this.items[0],
                        i = t && t.element;
                    this.columnWidth = i && e(i).outerWidth || this.containerWidth
                }
                this.columnWidth += this.gutter, this.cols = Math.floor((this.containerWidth + this.gutter) / this.columnWidth), this.cols = Math.max(this.cols, 1)
            }, n.prototype.getContainerWidth = function() {
                var t = this.options.isFitWidth ? this.element.parentNode : this.element,
                    i = e(t);
                this.containerWidth = i && i.innerWidth
            }, n.prototype._getItemLayoutPosition = function(t) {
                t.getSize();
                var e = t.size.outerWidth % this.columnWidth,
                    n = e && 1 > e ? "round" : "ceil",
                    o = Math[n](t.size.outerWidth / this.columnWidth);
                o = Math.min(o, this.cols);
                for (var r = this._getColGroup(o), s = Math.min.apply(Math, r), a = i(r, s), h = {
                        x: this.columnWidth * a,
                        y: s
                    }, p = s + t.size.outerHeight, u = this.cols + 1 - r.length, f = 0; u > f; f++) this.colYs[a + f] = p;
                return h
            }, n.prototype._getColGroup = function(t) {
                if (2 > t) return this.colYs;
                for (var e = [], i = this.cols + 1 - t, n = 0; i > n; n++) {
                    var o = this.colYs.slice(n, n + t);
                    e[n] = Math.max.apply(Math, o)
                }
                return e
            }, n.prototype._manageStamp = function(t) {
                var i = e(t),
                    n = this._getElementOffset(t),
                    o = this.options.isOriginLeft ? n.left : n.right,
                    r = o + i.outerWidth,
                    s = Math.floor(o / this.columnWidth);
                s = Math.max(0, s);
                var a = Math.floor(r / this.columnWidth);
                a -= r % this.columnWidth ? 0 : 1, a = Math.min(this.cols - 1, a);
                for (var h = (this.options.isOriginTop ? n.top : n.bottom) + i.outerHeight, p = s; a >= p; p++) this.colYs[p] = Math.max(h, this.colYs[p])
            }, n.prototype._getContainerSize = function() {
                this.maxY = Math.max.apply(Math, this.colYs);
                var t = {
                    height: this.maxY
                };
                return this.options.isFitWidth && (t.width = this._getContainerFitWidth()), t
            }, n.prototype._getContainerFitWidth = function() {
                for (var t = 0, e = this.cols; --e && 0 === this.colYs[e];) t++;
                return (this.cols - t) * this.columnWidth - this.gutter
            }, n.prototype.resize = function() {
                var t = this.containerWidth;
                this.getContainerWidth(), t !== this.containerWidth && this.layout()
            }, n
        }
        var i = Array.prototype.indexOf ? function(t, e) {
            return t.indexOf(e)
        } : function(t, e) {
            for (var i = 0, n = t.length; n > i; i++) {
                var o = t[i];
                if (o === e) return i
            }
            return -1
        };
        "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size"], e) : t.Masonry = e(t.Outlayer, t.getSize)
    }(window);