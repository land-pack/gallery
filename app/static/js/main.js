
$(window).load(function() {
    var idx = catToRender;
    if (nmeCategories.length > 0) {
        if (window.location.hash.length > 1) {
            idx = parseInt(window.location.hash.split('#')[1]);
        }
        category = nmeCategories[idx];
    }
    if (idx != 0) {
        showCategory(idx);
    } else {
        renderPosts(category, posts);
    }
});

