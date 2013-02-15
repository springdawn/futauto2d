var j = jQuery.noConflict();
var Futauto = {

    startTime: null,

    startResTime: null,

    currentRes: {
        res: null,
        time: null
    },

    nextRes: {
        res: null,
        time: null
    },

    next2Res: {
        res: null,
        time: null
    },

    duration: 500,

    // スタートボタンを表示する
    displayButton: function() {
        return j(document.createElement("button")).html("Push!").addClass("futauto2d_start_button").prependTo(document.body);
    },

    // ストップボタンを表示する
    displayStopButton: function() {
        return j(document.createElement("button")).html("Stop").addClass("futauto2d_stop_button").prependTo(document.body);
    },

    // スタートボタンが押されたとき
    pushed: function() {
        Futauto.startTime = new Date().valueOf();
        Futauto.findCurrentRes(j(document).scrollTop());
        if(Futauto.currentRes.res) {
            Futauto.startResTime = Futauto.currentRes.time;
            Futauto.findNextRes(Futauto.currentRes.res, "next");
            Futauto.findNextRes(Futauto.nextRes.res, "next2");
        }
        if(Futauto.nextRes) {
            Futauto.loop();
        }
    },

    // 繰り返し処理
    loop: function() {
        if(Futauto.currentRes.res && Futauto.nextRes.res) {
            var nowTime = new Date().valueOf();
            var runningGap = (nowTime-Futauto.startTime)-(Futauto.currentRes.time-Futauto.startResTime);
            var delay = Futauto.nextRes.time-Futauto.currentRes.time-runningGap;
            if(Futauto.next2Res.res && Futauto.nextRes.time==Futauto.next2Res.time) {
                setTimeout(Futauto.resToNext, delay);
            } else {
                setTimeout(Futauto.moveToNext, delay);
            }
        }
    },

    // 表示位置にもっとも近いレスを取得する
    findCurrentRes: function(position) {
        Futauto.getResTime(j("table").filter(function(i){return this.offsetTop>=position}).first().addClass("start_res"), "current");
    },

    // レスの時間を取得する
    getResTime: function(res, type) {
        if(!res) return;
        var mat = res.text().match(/\d{2}\/\d{2}\/\d{2}\([月火水木金土日]\)\d{2}:\d{2}:\d{2}/);
        if(!mat) return;
        var dateStr = "20"+mat[0].replace(/\//g,"-").replace(/\([月火水木金土日]\)/,"T")+"+0900";
        if(type=="current") {
            Futauto.currentRes.res = res;
            Futauto.currentRes.time = new Date(dateStr).valueOf();
        } else if(type=="next") {
            Futauto.nextRes.res = res;
            Futauto.nextRes.time = new Date(dateStr).valueOf();
        } else if(type="next2") {
            Futauto.next2Res.res = res;
            Futauto.next2Res.time = new Date(dateStr).valueOf();
        }
    },

    // 次のレスを取得する
    findNextRes: function(res, type) {
        if(!res) return;
        Futauto.getResTime(res.next(), type);
    },

    // 次のレスへスクロールアニメーション
    moveToNext: function() {
        j(document.body).animate({scrollTop:Futauto.nextRes.res.offset().top}, Futauto.duration);
        Futauto.resToNext();
    },

    // レス送り
    resToNext: function() {
        Futauto.currentRes = Futauto.nextRes;
        Futauto.nextRes = {};
        Futauto.next2Res = {};
        Futauto.findNextRes(Futauto.currentRes.res, "next");
        Futauto.findNextRes(Futauto.nextRes.res, "next2");
        Futauto.loop();
    }

};
