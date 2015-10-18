$(document).ready(function() {

    var bg = chrome.extension.getBackgroundPage();

    $('.start').click(function() {
        if ($(this).hasClass('playing')) {
            bg.pause();
            $('.start').removeClass('playing').removeClass('pause').addClass('play');
        } else {
            bg.play();
            $('.start').addClass('playing').removeClass('play').addClass('pause');
        }
    });

    $('.previous').click(function() {
        bg.previous();
        init();
    });

    $('.next').click(function() {
        bg.next();
        init();
    });

    $('.progress').click(function(event) {
        var distance = event.pageX - $(this).offset().left;
        var audio = bg.audio;
        audio.currentTime = distance * (audio.duration / 135);
        updateProgress();
    });

    var init = function() {
        updateProgress();
        $('.album-cover .img img').attr({
            'src': bg.cover,
            'alt': bg.artist
        });
        $('.track-info .title').html(bg.name);
        $('.track-info .artist').html(bg.artist);
        if (!bg.isPlaying) {
            $('.start').removeClass('playing').removeClass('pause').addClass('play');
        } else {
            $('.start').addClass('playing').removeClass('play').addClass('pause');
        }
    }


    var updateProgress = function() {
        $('.progress-wrapper .elapsed').css({
            'width': bg.ratio + '%'
        });
    }

    bg.audio.ontimeupdate = function(event) {     
        for (var i = 0, l = bg.lyric.length; i < l; i++) {
            if (bg.audio.currentTime > bg.lyric[i][0]) {
                //console.log(bg.lyric[i][1]);
                $('.track-info .lyric-container').html(bg.lyric[i][1]);
            };
        }       
    }

    init();
    setInterval(updateProgress, 500);

});
