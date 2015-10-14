function showNotification(opt) {
    var notification = chrome.notifications.create(status.toString(), opt, function(notifyId) {
        return notifyId;
    });
    setTimeout(function() {
        chrome.notifications.clear(status.toString(), function() {});
    }, 5000);
}
