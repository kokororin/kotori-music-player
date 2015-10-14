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

    var init = function() {
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

    init();
    setInterval(updateProgress, 1000);

});
