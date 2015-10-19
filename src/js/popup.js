$(document).ready(function() {

    var bg = chrome.extension.getBackgroundPage();

    $('#playPause').click(function() {
        if ($(this).hasClass('playing')) {
            bg.pause();
            $(this).removeClass('playing').removeClass('goog-flat-button-checked');
            $('#song_indicator').addClass('paused-indicator').removeClass('playing-indicator');
        } else {
            bg.play();
            $(this).addClass('playing').addClass('goog-flat-button-checked');
            $('#song_indicator').removeClass('paused-indicator').addClass('playing-indicator');
        }
    });

    $('#rew').click(function() {
        bg.previous();
        init();
    });

    $('#ff').click(function() {
        bg.next();
        init();
    });

    $('#slider').click(function(event) {
        var distance = event.pageX - $(this).offset().left;
        var audio = bg.audio;
        audio.currentTime = distance * (audio.duration / $(this).width());
        updateProgress();
    });

    $('.breadcrumb-part').click(function() {
        if ($("#navigate").is(':visible') && $('.tab-text').text() == "播放列表") {
            closeNav();
        } else {
            $('.tab-text').text("播放列表");
            $('#navigate').empty();
            for (var i = 0, l = bg.playlist.length; i < l; i++) {
                var item = bg.playlist[i];
                $('#navigate').append('<div data-id="' + i + '" class="album_row bold" title="">' + item.title + '</div>');
            }
            $("#navigate").slideDown();
            $('#close_nav').show();
            $('#search').show();
            $('#search').select();
        }
    });


    $(document).on('click', "#navigate .album_row", function() {
        var id = $(this).data('id');
        bg.changeMusic(id);
    });

    $('#close_nav').click(function() {
        closeNav();
    });

    $("#search").change(function() {
        var filter = $(this).val();
        if (filter) {
            $("#navigate").find(".album_row:not(:Contains(" + filter + "))").hide();
            $("#navigate").find(".album_row:Contains(" + filter + ")").show();
        } else {
            $("#navigate").find(".album_row").show();
        }
        return false;
    });

    $("#search").keyup(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            console.log($(".album_row.ind_track"));
            if ($(".album_row.ind_track").length == 0) {
                $(".album_row:visible").first().click();
            } else {
                $(".album_row:visible").first().dblclick();
            }
            e.preventDefault();
        } else {
            $(this).change();
        }
    });

    var init = function() {
        updateProgress();
        $('#album_art_img').attr({
            'src': bg.cover,
            'alt': bg.artist
        });
        $('#song_title').html(bg.name);
        $('#artist').html(bg.artist);
        if (!bg.isPlaying) {
            $('#playPause').removeClass('playing').removeClass('goog-flat-button-checked');
            $('#song_indicator').addClass('paused-indicator').removeClass('playing-indicator');
        } else {
            $('#playPause').addClass('playing').addClass('goog-flat-button-checked');
            $('#song_indicator').removeClass('paused-indicator').addClass('playing-indicator');
        }
    }


    var updateProgress = function() {
        $('#played_slider').css({
            'width': bg.ratio + '%'
        });
        $('#current_time').html(formatSeconds(bg.audio.currentTime));
        setTimeout(function() {
            $('#total_time').html(formatSeconds(bg.audio.duration));
        }, 250);
    }

    var formatSeconds = function(seconds) {
        var minute = parseInt(Math.floor(seconds / 60));
        var second = parseInt(seconds) - minute * 60;
        return minute + ':' + second;
    }

    var closeNav = function() {
        $('.tab-text').html('<span>正在播放</span>');
        $("#navigate").slideUp();
        $('#close_nav').hide();
        $('#search').hide();
    }


    bg.audio.ontimeupdate = function(event) {
        for (var i = 0, l = bg.lyric.length; i < l; i++) {
            if (bg.audio.currentTime > bg.lyric[i][0]) {
                //console.log(bg.lyric[i][1]);
                $('#lyric').html(bg.lyric[i][1]);
            };
        }
    }

    ! function() {
        init();
        setInterval(updateProgress, 500);
    }();

});
