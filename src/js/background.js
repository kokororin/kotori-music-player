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
var lyricUrl = null;
var lyric = null;
var collectID = getCollectID();

$.ajax({
    url: 'http://kotori.sinaapp.com/xiami/collect/' + collectID,
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
                lyricUrl = data.lyric;

                if (isPlaying) {
                    play();
                    
                     showNotification({
                         type: "basic",
                         title: name,
                         message: artist,
                         iconUrl: cover
                     });
                    
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
        //autoChange();
        next();
    }
    ratio = audio.currentTime / audio.duration * 100;
}


var getLyric = function() {
    if (lyricUrl == null) {
        return;
    }
    $.ajax({
        url: lyricUrl,
        type: 'get',
        dataType: 'text',
        async: false,
        success: function(data) {
            lyric = parseLyric(data);
        },
        error: function() {
            showNotification({
                type: "basic",
                title: 'Message',
                message: 'Lyric Fetch Error',
                iconUrl: 'images/icon-128.png'
            });
        }
    });
}

var parseLyric = function(text) {
    //get each line from the text
    var lines = text.split('\n'),
        //this regex mathes the time [00.12.78]
        pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
        result = [];

    // Get offset from lyrics
    var offset = getOffset(text);

    //exclude the description parts or empty parts of the lyric
    while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    };
    //remove the last empty item
    lines[lines.length - 1].length === 0 && lines.pop();
    //display all content on the page
    lines.forEach(function(v, i, a) {
        var time = v.match(pattern),
            value = v.replace(pattern, '');
        time.forEach(function(v1, i1, a1) {
            //convert the [min:sec] to secs format then store into result
            var t = v1.slice(1, -1).split(':');
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]) + parseInt(offset) / 1000, value]);
        });
    });
    //sort the result by time
    result.sort(function(a, b) {
        return a[0] - b[0];
    });
    return result;
}

var getOffset = function(text) {
    //Returns offset in miliseconds.
    var offset = 0;
    try {
        // Pattern matches [offset:1000]
        var offsetPattern = /\[offset:\-?\+?\d+\]/g,
            // Get only the first match.
            offset_line = text.match(offsetPattern)[0],
            // Get the second part of the offset.
            offset_str = offset_line.split(':')[1];
        // Convert it to Int.
        offset = parseInt(offset_str);
    } catch (err) {
        //alert("offset error: "+err.message);
        offset = 0;
    }
    return offset;
}


var play = function() {
    audio.play();
    getLyric();
    timeout = setInterval(updateProgress, 500);
    //setInterval(showLyric, 1000);
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
