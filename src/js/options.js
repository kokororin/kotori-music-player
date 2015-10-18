$(document).ready(function() {
    var bg = chrome.extension.getBackgroundPage();
    $('#collectID').val(bg.getCollectID());

    $('#saveBtn').click(function(event) {
        var collectID = $('#collectID').val();
        $.ajax({
            url: 'http://kotori.sinaapp.com/xiami/collect/' + collectID,
            type: 'get',
            dataType: 'json',
            success: function(data) {
            	bg.setCollectID(collectID);
                alert('设置保存成功。点击确定立即应用。');
                chrome.runtime.reload();
            },
            error: function() {
                alert('SB就是SB，输个id都能输错。')
            }
        });

    });

});
