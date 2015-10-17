//各种需要用到的变量
var audio = $('#music').get(0);
var item = null;
var isPlaying = false;
var currentMusic = 0;
var prevMusic = -1;
var repeat = parseInt(localStorage.repeat);
var ratio = 0;
var name = '';
var artist = '';
var cover = '';
var playlist = null;
var lyric = null;
var currentLyric = '';


$.ajax({
    url: 'http://kotori.sinaapp.com/xiami/collect/117450176',
    type: 'get',
    dataType: 'json',
    async: false,
    success: function(data) {
        playlist = data;
    },
    error: function() {
        showNotification({
            type: "basic",
            title: 'Message',
            message: 'Kotori API Error',
            iconUrl: 'images/icon-128.png'
        });
    }
});


console.log('<<<Kotoriの电台>>>');
console.log('Version : 20150719');
console.log('Current Music: ' + currentMusic + ' Repeat: ' + repeat);


//载入图片和音乐文件
var loadMusic = function(i) {

    currentMusic = localStorage.currentMusic = i;
    //console.log(localStorage.currentMusic);
    item = playlist[i];

    $.ajax({
        type: "get",
        async: false,
        dataType: "json",
        url: 'https://kotori.sinaapp.com/xiami/single/' + item.id,
        success: function(data) {

            if (data.url != null) {
                //console.log(data);
                src = data.url;
                //加载各种东西
                audio.setAttribute("src", src);
                cover = data.img;
                artist = data.artist_name;
                name = data.name;
                lyric = data.lyric;

                if (isPlaying) {
                    play();
                   /*
                    showNotification({
                        type: "basic",
                        title: name,
                        message: artist,
                        iconUrl: cover
                    });
                   */
                }

                console.log('Song Title: ' + data.name + ' Song Artist: ' + data.artist_name);
            } else {

                showNotification({
                    type: "basic",
                    title: 'Message',
                    message: '歌曲获取失败，请重试。',
                    iconUrl: 'images/icon-128.png'
                });

            }
        },
    });
}

var changeMusic = function(i) {
    loadMusic(i);
}

var randomNum = function(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

var autoChange = function() {
    var nextMusic = 0;
    switch (repeat) {
        case 0:
            prevMusic = currentMusic;
            nextMusic = randomNum(0, playlist.length);
            changeMusic(nextMusic);
            break;
        case 1:
            audio.currentTime = 0.0;
            play();
            break;
        case 2:
            if (currentMusic == playlist.length - 1) {
                changeMusic(0);
            } else {
                changeMusic(currentMusic + 1);
            }
            break;
    }
}

var updateProgress = function() {
    if (audio.currentTime == audio.duration) {
        autoChange();
    }
    ratio = audio.currentTime / audio.duration * 100;

}

var showLyric = function() {
    var time = Math.round(audio.currentTime);
    var currentLyric = getLyric(time);
    if (currentLyric != '') {
        console.log(currentLyric);

        showCoexistNotification({
            type: "basic",
            title: 'Kotori Music Player',
            message: currentLyric,
            iconUrl: cover
        });

    }
}

var getLyric = function(second) {
    return typeof(lyric['time' + second]) == 'undefined' ? '' : lyric['time' + second];
}

var continous = function() {
    if (parseInt(ratio) == 100) {
        next();
    }
}

var play = function() {
    audio.play();
    timeout = setInterval(updateProgress, 500);
    setInterval(continous, 500);
    setInterval(showLyric, 1000);
    isPlaying = true;
}


var pause = function() {
    audio.pause();
    clearInterval(timeout);
    isPlaying = false;
}

var next = function() {
    if (repeat == 0) {
        prevMusic = currentMusic;
        nextMusic = randomNum(0, playlist.length);
        changeMusic(nextMusic);
    } else if (currentMusic == playlist.length - 1) {
        changeMusic(0);
    } else {
        changeMusic(currentMusic + 1);
    }
}

var previous = function() {
    if (repeat == 0 && prevMusic != -1) {
        changeMusic(prevMusic);
        prevMusic = randomNum(0, playlist.length);
    } else if (currentMusic == 0) {
        changeMusic(playlist.length - 1);
    } else {
        changeMusic(currentMusic - 1);
    }
}

//初始化操作
loadMusic(currentMusic);
