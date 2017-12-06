!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof module&&module.exports?module.exports=function(e,i){return void 0===i&&(i="undefined"!=typeof window?require("jquery"):require("jquery")(e)),t(i),i}:t(jQuery)}(function(t){function e(t){return t=t||navigator.userAgent,t.indexOf("MSIE ")>-1||t.indexOf("Trident/")>-1}function i(t){var e=/%|px|em|cm|vh|vw/;return parseInt(String(t).split(e)[0])}var s=t(window),o=t(document),n="uxAside",a=n.toLowerCase(),r={CLOSING:"closing",CLOSED:"closed",OPENING:"opening",OPENED:"opened",DESTROYED:"destroyed"},l=function(){var t,e=document.createElement("fakeelement"),i={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"animationend",WebkitAnimation:"webkitAnimationEnd"};for(t in i)if(void 0!==e.style[t])return i[t]}(),h=!!/Mobi/.test(navigator.userAgent),d=0,u=function(t,e){this.init(t,e)};return u.prototype={constructor:u,init:function(e,i){var s=this;this.$element=t(e),void 0!==this.$element[0].id&&""!==this.$element[0].id?this.id=this.$element[0].id:(this.id=n+Math.floor(1e7*Math.random()+1),this.$element.attr("id",this.id)),this.classes=void 0!==this.$element.attr("class")?this.$element.attr("class"):"",this.content=this.$element.html(),this.state=r.CLOSED,this.options=i,this.width=0,this.timer=null,this.timerTimeout=null,this.progressBar=null,this.isPaused=!1,this.isFullscreen=!1,this.headerHeight=0,this.modalHeight=0,this.hasScroll=null,this.$overlay=t('<div class="'+n+'-overlay" style="background-color:'+i.overlayColor+'"></div>'),this.$navigate=t('<div class="'+n+'-navigate"><div class="'+n+'-navigate-caption">Use</div><button class="'+n+'-navigate-prev"></button><button class="'+n+'-navigate-next"></button></div>'),this.group={name:this.$element.attr("data-"+a+"-group"),index:null,ids:[]},this.$element.attr("aria-hidden","true"),this.$element.attr("aria-labelledby",this.id),this.$element.attr("role","dialog"),this.$element.hasClass("uxAside")||this.$element.addClass("uxAside"),void 0===this.group.name&&""!==i.group&&(this.group.name=i.group,this.$element.attr("data-"+a+"-group",i.group)),!0===this.options.loop&&this.$element.attr("data-"+a+"-loop",!0),t.each(this.options,function(t,e){var o=s.$element.attr("data-"+a+"-"+t);try{void 0!==o&&(i[t]=""===o||"true"==o||"false"!=o&&("function"==typeof e?new Function(o):o))}catch(t){}}),!1!==i.appendTo&&this.$element.appendTo(i.appendTo),!0===i.iframe?(this.$element.html('<div class="'+n+'-wrap"><div class="'+n+'-content"><iframe class="'+n+'-iframe"></iframe>'+this.content+"</div></div>"),null!==i.iframeHeight&&this.$element.find("."+n+"-iframe").css("height",i.iframeHeight)):this.$element.html('<div class="'+n+'-wrap"><div class="'+n+'-content">'+this.content+"</div></div>"),this.$wrap=this.$element.find("."+n+"-wrap"),null===i.zindex||isNaN(parseInt(i.zindex))||(this.$element.css("z-index",i.zindex),this.$navigate.css("z-index",i.zindex-1),this.$overlay.css("z-index",i.zindex-2)),""!==i.radius&&this.$element.css("border-radius",i.radius),""!==i.padding&&this.$element.find("."+n+"-content").css("padding",i.padding),""!==i.theme&&this.$element.addClass(n+"--theme-"+i.theme),!0===i.rtl&&this.$element.addClass(n+"-rtl"),!0===i.openFullscreen&&(this.isFullscreen=!0,this.$element.addClass("isFullscreen")),!0===i.openTall&&(this.isTall=!0,this.$element.addClass("isTall")),this.createHeader(),this.recalcWidth(),this.recalcVerticalPos(),this.recalcHorizontalPos()},createHeader:function(){this.$header=t('<div class="'+n+'-header"><h2 class="'+n+'-header-title">'+this.options.title+'</h2><div class="'+n+'-header-subtitle">'+this.options.subtitle+'</div><div class="'+n+'-header-buttons"></div></div>'),!0===this.options.closeButton&&this.$header.find("."+n+"-header-buttons").append('<a href="javascript:void(0)" class="'+n+"-button "+n+'-button-close" data-'+a+"-close></a>"),!0===this.options.fullscreen&&this.$header.find("."+n+"-header-buttons").append('<a href="javascript:void(0)" class="'+n+"-button "+n+'-button-fullscreen" data-'+a+"-fullscreen></a>"),""!==this.options.buttons&&this.$header.find("."+n+"-header-buttons").append(this.options.buttons),!0!==this.options.timeoutProgressbar||isNaN(parseInt(this.options.timeout))||!1===this.options.timeout||0===this.options.timeout||this.$header.prepend('<div class="'+n+'-progressbar"><div style="background-color:'+this.options.timeoutProgressbarColor+'"></div></div>'),""===this.options.title&&this.$header.addClass(n+"-noTitle"),""===this.options.subtitle&&this.$header.addClass(n+"-noSubtitle"),(""!==this.options.title||!0===this.options.closeButton||this.options.fullscreen||this.options.timeoutProgressbar)&&(null===this.options.icon&&null===this.options.iconText||(this.$header.prepend('<i class="'+n+'-header-icon"></i>'),null!==this.options.icon&&this.$header.find("."+n+"-header-icon").addClass(this.options.icon).css("color",this.options.iconColor),null!==this.options.iconText&&this.$header.find("."+n+"-header-icon").html(this.options.iconText)),null!==this.options.headerColor&&(!0===this.options.borderBottom&&this.$element.css("border-bottom","3px solid "+this.options.headerColor),this.$header.css("background",this.options.headerColor)),this.$element.css("overflow","hidden").prepend(this.$header))},setGroup:function(e){var i=this,s=this.group.name||e;if(this.group.ids=[],void 0!==e&&e!==this.group.name&&(s=e,this.group.name=s,this.$element.attr("data-"+a+"-group",s)),void 0!==s&&""!==s){var o=0;t.each(t("."+n+"[data-"+a+"-group="+s+"]"),function(e,s){i.group.ids.push(t(this)[0].id),i.id==t(this)[0].id&&(i.group.index=o),o++})}},toggle:function(){this.state==r.OPENED&&this.close(),this.state==r.CLOSED&&this.open()},open:function(e){function i(){s.state=r.OPENED,s.$element.trigger(r.OPENED),s.options.onOpened&&"function"==typeof s.options.onOpened&&s.options.onOpened(s)}var s=this;if(this.state==r.CLOSED){if(function(){s.$element.off("mousedown","[data-"+a+"-close]").on("mousedown","[data-"+a+"-close]",function(e){e.preventDefault();var i=t(e.currentTarget).attr("data-"+a+"-transitionOut");void 0!==i?s.close({transition:i}):s.close()}),s.$element.off("mousedown","[data-"+a+"-fullscreen]").on("mousedown","[data-"+a+"-fullscreen]",function(t){t.preventDefault(),!0===s.isFullscreen?(s.isFullscreen=!1,s.$element.removeClass("isFullscreen")):(s.isFullscreen=!0,s.$element.addClass("isFullscreen")),s.options.onFullscreen&&"function"==typeof s.options.onFullscreen&&s.options.onFullscreen(s),s.$element.trigger("fullscreen",s)}),s.$navigate.off("click","."+n+"-navigate-next").on("click","."+n+"-navigate-next",function(t){s.next(t)}),s.$element.off("click","[data-"+a+"-next]").on("click","[data-"+a+"-next]",function(t){s.next(t)}),s.$navigate.off("click","."+n+"-navigate-prev").on("click","."+n+"-navigate-prev",function(t){s.prev(t)}),s.$element.off("click","[data-"+a+"-prev]").on("click","[data-"+a+"-prev]",function(t){s.prev(t)})}(),this.setGroup(),this.state=r.OPENING,this.$element.trigger(r.OPENING),this.$element.attr("aria-hidden","false"),!1===this.options.contentTransition&&s.$element.addClass(n+"-no-transition"),!0===this.options.iframe){this.$element.find("."+n+"-content").addClass(n+"-content-loader"),this.$element.find("."+n+"-iframe").on("load",function(){t(this).parent().removeClass(n+"-content-loader")});var d=null;try{d=""!==t(e.currentTarget).attr("href")?t(e.currentTarget).attr("href"):null}catch(t){}if(null===this.options.iframeURL||null!==d&&void 0!==d||(d=this.options.iframeURL),null===d||void 0===d)throw new Error("Failed to find iframe URL");this.$element.find("."+n+"-iframe").attr("src",d)}(this.options.bodyOverflow||h)&&(t("html").addClass(n+"-isOverflow"),h&&t("body").css("overflow","hidden")),this.options.onOpening&&"function"==typeof this.options.onOpening&&this.options.onOpening(this),function(){if(s.group.ids.length>1){s.$navigate.appendTo("body"),s.$navigate.addClass(s.options.transitionInOverlay),!0===s.options.navigateCaption&&s.$navigate.find("."+n+"-navigate-caption").show();var o=s.$element.outerWidth();!1!==s.options.navigateArrows?"closeScreenEdge"===s.options.navigateArrows?(s.$navigate.find("."+n+"-navigate-prev").css("left",0).show(),s.$navigate.find("."+n+"-navigate-next").css("right",0).show()):(s.$navigate.find("."+n+"-navigate-prev").css("margin-left",-(o/2+84)).show(),s.$navigate.find("."+n+"-navigate-next").css("margin-right",-(o/2+84)).show()):(s.$navigate.find("."+n+"-navigate-prev").hide(),s.$navigate.find("."+n+"-navigate-next").hide());0===s.group.index&&0===t("."+n+"[data-"+a+'-group="'+s.group.name+'"][data-'+a+"-loop]").length&&!1===s.options.loop&&s.$navigate.find("."+n+"-navigate-prev").hide(),s.group.index+1===s.group.ids.length&&0===t("."+n+"[data-"+a+'-group="'+s.group.name+'"][data-'+a+"-loop]").length&&!1===s.options.loop&&s.$navigate.find("."+n+"-navigate-next").hide()}!0===s.options.overlay?s.$overlay.appendTo("body"):t(s.options.overlay).length>0&&s.$overlay.appendTo(t(s.options.overlay)),s.options.transitionInOverlay&&s.$overlay.addClass(s.options.transitionInOverlay);var r=s.options.transitionIn;"object"==typeof e&&(void 0===e.transition&&void 0===e.transitionIn||(r=e.transition||e.transitionIn)),""!==r?(s.$element.addClass("transitionIn "+r).show(),s.$wrap.one(l,function(){s.$element.removeClass(r+" transitionIn"),s.$overlay.removeClass(s.options.transitionInOverlay),s.$navigate.removeClass(s.options.transitionInOverlay),i()})):(s.$element.show(),i()),!0!==s.options.pauseOnHover||!0!==s.options.pauseOnHover||!1===s.options.timeout||isNaN(parseInt(s.options.timeout))||!1===s.options.timeout||0===s.options.timeout||(s.$element.off("mouseenter").on("mouseenter",function(t){t.preventDefault(),s.isPaused=!0}),s.$element.off("mouseleave").on("mouseleave",function(t){t.preventDefault(),s.isPaused=!1}))}(),!1===this.options.timeout||isNaN(parseInt(this.options.timeout))||!1===this.options.timeout||0===this.options.timeout||(!0===this.options.timeoutProgressbar?(this.progressBar={hideEta:null,maxHideTime:null,currentTime:(new Date).getTime(),el:this.$element.find("."+n+"-progressbar > div"),updateProgress:function(){if(!s.isPaused){s.progressBar.currentTime=s.progressBar.currentTime+10;var t=(s.progressBar.hideEta-s.progressBar.currentTime)/s.progressBar.maxHideTime*100;s.progressBar.el.width(t+"%"),t<0&&s.close()}}},this.options.timeout>0&&(this.progressBar.maxHideTime=parseFloat(this.options.timeout),this.progressBar.hideEta=(new Date).getTime()+this.progressBar.maxHideTime,this.timerTimeout=setInterval(this.progressBar.updateProgress,10))):this.timerTimeout=setTimeout(function(){s.close()},s.options.timeout)),this.options.overlayClose&&!this.$element.hasClass(this.options.transitionOut)&&this.$overlay.click(function(){s.close()}),this.options.focusInput&&this.$element.find(":input:not(button):enabled:visible:first").focus(),function t(){s.recalcLayout(),s.timer=setTimeout(t,100)}(),function(){if(s.options.history){var t=document.title;document.title=t+" - "+s.options.title,document.location.hash=s.id,document.title=t}}(),o.on("keydown."+n,function(t){s.options.closeOnEscape&&27===t.keyCode&&s.close()})}},close:function(e){function i(){s.state=r.CLOSED,s.$element.trigger(r.CLOSED),!0===s.options.iframe&&s.$element.find("."+n+"-iframe").attr("src",""),(s.options.bodyOverflow||h)&&(t("html").removeClass(n+"-isOverflow"),h&&t("body").css("overflow","auto")),s.options.onClosed&&"function"==typeof s.options.onClosed&&s.options.onClosed(s),!0===s.options.restoreDefaultContent&&s.$element.find("."+n+"-content").html(s.content),0===t("."+n+":visible").length&&t("html").removeClass(n+"-isAttached"),!0===s.options.removeOnClose&&(s.$element.remove(),s.destroy())}var s=this;if(this.state==r.OPENED||this.state==r.OPENING){o.off("keydown."+n),this.state=r.CLOSING,this.$element.trigger(r.CLOSING),this.$element.attr("aria-hidden","true"),clearTimeout(this.timer),clearTimeout(this.timerTimeout),s.options.onClosing&&"function"==typeof s.options.onClosing&&s.options.onClosing(this);var a=this.options.transitionOut;"object"==typeof e&&(void 0===e.transition&&void 0===e.transitionOut||(a=e.transition||e.transitionOut)),""!==a?(this.$element.attr("class",[this.classes,n,a,this.options.theme?n+"--theme-"+this.options.theme:"",!0===this.isFullscreen?"isFullscreen":"",!0===this.isTall?"isTall":"",this.options.rtl?n+"-rtl":""].join(" ")),this.$overlay.attr("class",n+"-overlay "+this.options.transitionOutOverlay),!1!==s.options.navigateArrows&&this.$navigate.attr("class",n+"-navigate "+this.options.transitionOutOverlay),this.$element.one(l,function(){s.$element.hasClass(a)&&s.$element.removeClass(a+" transitionOut").hide(),s.$overlay.removeClass(s.options.transitionOutOverlay).remove(),s.$navigate.removeClass(s.options.transitionOutOverlay).remove(),i()})):(this.$element.hide(),this.$overlay.remove(),this.$navigate.remove(),i())}},next:function(e){var i=this,s="fadeInRight",o="fadeOutLeft",r=t("."+n+":visible"),l={};l.out=this,void 0!==e&&"object"!=typeof e?(e.preventDefault(),r=t(e.currentTarget),s=r.attr("data-"+a+"-transitionIn"),o=r.attr("data-"+a+"-transitionOut")):void 0!==e&&(void 0!==e.transitionIn&&(s=e.transitionIn),void 0!==e.transitionOut&&(o=e.transitionOut)),this.close({transition:o}),setTimeout(function(){for(var e=t("."+n+"[data-"+a+'-group="'+i.group.name+'"][data-'+a+"-loop]").length,o=i.group.index+1;o<=i.group.ids.length;o++){try{l.in=t("#"+i.group.ids[o]).data().uxAside}catch(t){}if(void 0!==l.in){t("#"+i.group.ids[o]).uxAside("open",{transition:s});break}if(o==i.group.ids.length&&e>0||!0===i.options.loop)for(var r=0;r<=i.group.ids.length;r++)if(l.in=t("#"+i.group.ids[r]).data().uxAside,void 0!==l.in){t("#"+i.group.ids[r]).uxAside("open",{transition:s});break}}},200),t(document).trigger(n+"-group-change",l)},prev:function(e){var i=this,s="fadeInLeft",o="fadeOutRight",r=t("."+n+":visible"),l={};l.out=this,void 0!==e&&"object"!=typeof e?(e.preventDefault(),r=t(e.currentTarget),s=r.attr("data-"+a+"-transitionIn"),o=r.attr("data-"+a+"-transitionOut")):void 0!==e&&(void 0!==e.transitionIn&&(s=e.transitionIn),void 0!==e.transitionOut&&(o=e.transitionOut)),this.close({transition:o}),setTimeout(function(){for(var e=t("."+n+"[data-"+a+'-group="'+i.group.name+'"][data-'+a+"-loop]").length,o=i.group.index;o>=0;o--){try{l.in=t("#"+i.group.ids[o-1]).data().uxAside}catch(t){}if(void 0!==l.in){t("#"+i.group.ids[o-1]).uxAside("open",{transition:s});break}if(0===o&&e>0||!0===i.options.loop)for(var r=i.group.ids.length-1;r>=0;r--)if(l.in=t("#"+i.group.ids[r]).data().uxAside,void 0!==l.in){t("#"+i.group.ids[r]).uxAside("open",{transition:s});break}}},200),t(document).trigger(n+"-group-change",l)},destroy:function(){var e=t.Event("destroy");this.$element.trigger(e),o.off("keydown."+n),clearTimeout(this.timer),clearTimeout(this.timerTimeout),!0===this.options.iframe&&this.$element.find("."+n+"-iframe").remove(),this.$element.html(this.$element.find("."+n+"-content").html()),this.$element.off("click","[data-"+a+"-close]"),this.$element.off("click","[data-"+a+"-fullscreen]"),this.$element.off("."+n).removeData(n).attr("style",""),this.$overlay.remove(),this.$navigate.remove(),this.$element.trigger(r.DESTROYED),this.$element=null},getState:function(){return this.state},getGroup:function(){return this.group},setWidth:function(t){this.options.width=t,this.recalcWidth();var e=this.$element.outerWidth();!0!==this.options.navigateArrows&&"closeToModal"!=this.options.navigateArrows||(this.$navigate.find("."+n+"-navigate-prev").css("margin-left",-(e/2+84)).show(),this.$navigate.find("."+n+"-navigate-next").css("margin-right",-(e/2+84)).show())},setTop:function(t){this.options.top=t,this.recalcVerticalPos(!1)},setBottom:function(t){this.options.bottom=t,this.recalcVerticalPos(!1)},setLeft:function(t){this.options.left=t,this.recalcHorizontalPos(!1)},setRight:function(t){this.options.right=t,this.recalcHorizontalPos(!1)},setHeader:function(t){t?this.$element.find("."+n+"-header").show():(this.headerHeight=0,this.$element.find("."+n+"-header").hide())},setTitle:function(t){this.options.title=t,0===this.headerHeight&&this.createHeader(),0===this.$header.find("."+n+"-header-title").length&&this.$header.append('<h2 class="'+n+'-header-title"></h2>'),this.$header.find("."+n+"-header-title").html(t)},setSubtitle:function(t){""===t?(this.$header.find("."+n+"-header-subtitle").remove(),this.$header.addClass(n+"-noSubtitle")):(0===this.$header.find("."+n+"-header-subtitle").length&&this.$header.append('<p class="'+n+'-header-subtitle"></p>'),this.$header.removeClass(n+"-noSubtitle")),this.$header.find("."+n+"-header-subtitle").html(t),this.options.subtitle=t},setIcon:function(t){0===this.$header.find("."+n+"-header-icon").length&&this.$header.prepend('<i class="'+n+'-header-icon"></i>'),this.$header.find("."+n+"-header-icon").attr("class",n+"-header-icon "+t),this.options.icon=t},setIconText:function(t){this.$header.find("."+n+"-header-icon").html(t),this.options.iconText=t},setHeaderColor:function(t){!0===this.options.borderBottom&&this.$element.css("border-bottom","3px solid "+t),this.$header.css("background",t),this.options.headerColor=t},setZindex:function(t){isNaN(parseInt(this.options.zindex))||(this.options.zindex=t,this.$element.css("z-index",t),this.$navigate.css("z-index",t-1),this.$overlay.css("z-index",t-2))},setFullscreen:function(t){t?(this.isFullscreen=!0,this.$element.addClass("isFullscreen")):(this.isFullscreen=!1,this.$element.removeClass("isFullscreen"))},setTransitionIn:function(t){this.options.transitionIn=t},setTransitionOut:function(t){this.options.transitionOut=t},startLoading:function(){this.$element.find("."+n+"-loader").length||this.$element.append('<div class="'+n+'-loader fadeIn"></div>'),this.$element.find("."+n+"-loader").css({top:this.headerHeight,borderRadius:this.options.radius})},stopLoading:function(){var t=this.$element.find("."+n+"-loader");t.length||(this.$element.prepend('<div class="'+n+'-loader fadeIn"></div>'),t=this.$element.find("."+n+"-loader").css("border-radius",this.options.radius)),t.removeClass("fadeIn").addClass("fadeOut"),setTimeout(function(){t.remove()},600)},recalcWidth:function(){var t=this;if(this.$element.css("max-width",this.options.width),e()){var i=t.options.width;i.toString().split("%").length>1&&(i=t.$element.outerWidth()),t.$element.css({left:"50%",marginLeft:-i/2})}},recalcVerticalPos:function(t){null!==this.options.top&&!1!==this.options.top?(this.$element.css("margin-top",this.options.top),0===this.options.top&&this.$element.css({borderTopRightRadius:0,borderTopLeftRadius:0})):!1===t&&this.$element.css({marginTop:"",borderRadius:this.options.radius}),null!==this.options.bottom&&!1!==this.options.bottom?(this.$element.css("margin-bottom",this.options.bottom),0===this.options.bottom&&this.$element.css({borderBottomRightRadius:0,borderBottomLeftRadius:0})):!1===t&&this.$element.css({marginBottom:"",borderRadius:this.options.radius})},recalcHorizontalPos:function(t){null!==this.options.left&&!1!==this.options.left?(this.$element.css("margin-left",this.options.left),0===this.options.left&&this.$element.css({borderTopLeftRadius:0,borderBottomLeftRadius:0})):!1===t&&this.$element.css({marginLeft:"",borderRadius:this.options.radius}),null!==this.options.right&&!1!==this.options.right?(this.$element.css("margin-right",this.options.right),0===this.options.right&&this.$element.css({borderTopRightRadius:0,borderBottomRightRadius:0})):!1===t&&this.$element.css({marginRight:"",borderRadius:this.options.radius})},recalcLayout:function(){var o=this,a=s.height()-o.options.offsets.top-o.options.offsets.bottom,l=this.$element.outerHeight(),h=this.$element.outerWidth(),d=this.$element.find("."+n+"-content")[0].scrollHeight,u=d+this.headerHeight,c=this.$element.innerHeight()-this.headerHeight,p=(parseInt(-(this.$element.innerHeight()+1)/2),this.$wrap.scrollTop()),m=0;e()&&(h>=s.width()||!0===this.isFullscreen?this.$element.css({left:"",marginLeft:""}):this.$element.css({left:"50%",marginLeft:-h/2})),!0===this.options.borderBottom&&""!==this.options.title&&(m=3),this.$element.find("."+n+"-header").length&&this.$element.find("."+n+"-header").is(":visible")?(this.headerHeight=parseInt(this.$element.find("."+n+"-header").innerHeight()),this.$element.css("overflow","hidden")):(this.headerHeight=0,this.$element.css("overflow","")),this.$element.find("."+n+"-loader").length&&this.$element.find("."+n+"-loader").css("top",this.headerHeight),l!==this.modalHeight&&(this.modalHeight=l,this.options.onResize&&"function"==typeof this.options.onResize&&this.options.onResize(this)),this.state!=r.OPENED&&this.state!=r.OPENING||(!0===this.options.iframe&&(a<this.options.iframeHeight+this.headerHeight+m||!0===this.isFullscreen?this.$element.find("."+n+"-iframe").css("height",a-(this.headerHeight+m)):this.$element.find("."+n+"-iframe").css("height",this.options.iframeHeight)),l==a?this.$element.addClass("isAttached"):this.$element.removeClass("isAttached"),!1===this.isFullscreen&&this.$element.width()>=s.width()?this.$element.find("."+n+"-button-fullscreen").hide():this.$element.find("."+n+"-button-fullscreen").show(),this.recalcButtons(),!1===this.isFullscreen&&(a=a-(i(this.options.top)||0)-(i(this.options.bottom)||0)),u>a?(this.options.top>0&&null===this.options.bottom&&d<a&&this.$element.addClass("isAttachedBottom"),this.options.bottom>0&&null===this.options.top&&d<a&&this.$element.addClass("isAttachedTop"),t("html").addClass(n+"-isAttached"),this.$element.css("height",a)):(this.$element.css("height",d+(this.headerHeight+m)),this.$element.removeClass("isAttachedTop isAttachedBottom"),t("html").removeClass(n+"-isAttached")),function(){if(d>c&&u>a){var t=l-(o.headerHeight+m);o.hasScroll!==t&&(o.hasScroll=t,o.$element.addClass("hasScroll"),o.$wrap.css("height",t))}else o.hasScroll&&(o.hasScroll=!1,o.$element.removeClass("hasScroll"),o.$wrap.css("height","auto"))}(),function(){c+p<d-30?o.$element.addClass("hasShadow"):o.$element.removeClass("hasShadow")}())},recalcButtons:function(){var t=this.$header.find("."+n+"-header-buttons").innerWidth()+10;!0===this.options.rtl?this.$header.css("padding-left",t):this.$header.css("padding-right",t)}},s.off("hashchange."+n+" load."+n).on("hashchange."+n+" load."+n,function(e){var i=document.location.hash;if(0===d)if(""!==i){t.each(t("."+n),function(e,s){var o=t(s).uxAside("getState");"opened"!=o&&"opening"!=o||"#"+t(s)[0].id!==i&&t(s).uxAside("close")});try{var s=t(i).data();void 0!==s&&("load"===e.type?!1!==s.uxAside.options.autoOpen&&t(i).uxAside("open"):setTimeout(function(){t(i).uxAside("open")},200))}catch(t){}}else t.each(t("."+n),function(e,i){if(void 0!==t(i).data().uxAside){var s=t(i).uxAside("getState");"opened"!=s&&"opening"!=s||t(i).uxAside("close")}});else d=0}),o.off("click","[data-"+a+"-open]").on("click","[data-"+a+"-open]",function(e){e.preventDefault();var i=t("."+n+":visible"),s=t(e.currentTarget).attr("data-"+a+"-open"),o=t(e.currentTarget).attr("data-"+a+"-transitionIn"),r=t(e.currentTarget).attr("data-"+a+"-transitionOut");void 0!==r?i.uxAside("close",{transition:r}):i.uxAside("close"),setTimeout(function(){void 0!==o?t(s).uxAside("open",{transition:o}):t(s).uxAside("open")},200)}),o.off("keyup."+n).on("keyup."+n,function(e){if(t("."+n+":visible").length){var i=t("."+n+":visible")[0].id,s=t("#"+i).uxAside("getGroup"),o=e||window.event,a=o.target||o.srcElement;void 0===i||void 0===s.name||o.ctrlKey||o.metaKey||o.altKey||"INPUT"===a.tagName.toUpperCase()||"TEXTAREA"==a.tagName.toUpperCase()||(37===o.keyCode?t("#"+i).uxAside("prev",o):39===o.keyCode&&t("#"+i).uxAside("next",o))}}),t.fn[n]=function(e,i){if(!t(this).length&&"object"==typeof e){var s={$el:document.createElement("div"),id:this.selector.split("#"),class:this.selector.split(".")};if(s.id.length>1){try{s.$el=document.createElement(id[0])}catch(t){}s.$el.id=this.selector.split("#")[1].trim()}else if(s.class.length>1){try{s.$el=document.createElement(s.class[0])}catch(t){}for(var o=1;o<s.class.length;o++)s.$el.classList.add(s.class[o].trim())}document.body.appendChild(s.$el),this.push(t(this.selector))}for(var a=this,r=0;r<a.length;r++){var l=t(a[r]),h=l.data(n),c=t.extend({},t.fn[n].defaults,l.data(),"object"==typeof e&&e);if(h||e&&"object"!=typeof e){if("string"==typeof e&&void 0!==h)return h[e].apply(h,[].concat(i))}else l.data(n,h=new u(l,c));c.autoOpen&&(isNaN(parseInt(c.autoOpen))?!0===c.autoOpen&&h.open():setTimeout(function(){h.open()},c.autoOpen),d++)}return this},t.fn[n].defaults={title:"",subtitle:"",headerColor:"#88A0B9",theme:"",appendTo:".body",icon:null,iconText:null,iconColor:"",rtl:!1,width:600,top:null,bottom:null,borderBottom:!0,padding:0,radius:3,zindex:999,iframe:!1,iframeHeight:400,iframeURL:null,focusInput:!0,group:"",loop:!1,navigateCaption:!0,navigateArrows:!0,history:!1,restoreDefaultContent:!1,autoOpen:0,removeOnClose:!1,bodyOverflow:!1,fullscreen:!1,openFullscreen:!1,closeOnEscape:!0,closeButton:!0,buttons:"",overlay:!0,overlayClose:!0,overlayColor:"rgba(0, 0, 0, 0.4)",timeout:!1,timeoutProgressbar:!1,pauseOnHover:!1,timeoutProgressbarColor:"rgba(255,255,255,0.5)",contentTransition:!0,transitionIn:"comingIn",transitionOut:"comingOut",transitionInOverlay:"fadeIn",transitionOutOverlay:"fadeOut",offsets:{top:0,right:0,bottom:0,left:0},onFullscreen:function(){},onResize:function(){},onOpening:function(){},onOpened:function(){},onClosing:function(){},onClosed:function(){}},t.fn[n].Constructor=u,t.fn.uxAside});