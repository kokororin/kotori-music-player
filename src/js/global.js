var getCollectID = function() {
    return localStorage['collectID'] ? localStorage['collectID'] : '117450176';
}

var setCollectID = function(collectID) {
    localStorage['collectID'] = collectID;
}

function showNotification(opt, time) {
    if (typeof(time) == 'undefined') {
        time = 5000;
    }
    chrome.notifications.clear('notifyId', function() {});
    var notification = chrome.notifications.create('notifyId', opt, function(notifyId) {
        return notifyId;
    });
    setTimeout(function() {
        chrome.notifications.clear('notifyId', function() {});
    }, time);
}


var manifest = chrome.runtime.getManifest();
var previousVersion = localStorage.getItem("version");
if (previousVersion == "" || previousVersion != manifest.version) {
    var opt = {
        type: "basic",
        title: "更新",
        message: 'Kotori Music Player' + manifest.version + "版本啦～\n此次更新修复BUG~",
        iconUrl: "images/icon-128.png"
    }
    showNotification(opt);
    localStorage.setItem("version", manifest.version);
}
