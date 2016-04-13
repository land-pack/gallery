var postPositions;
var paginatorNumberPositions;
var postsPadding = 0;

// 10 lmargin 40borders | metrics of the .post.well
var MARGIN_AND_BORDERS = 20;

var postSlideCfg = new SlideCfg();

var paginationSlideCfg = new SlideCfg();

var isScroller = true;
/**
 * The previously active post
 */
var prevActivePost = null;
/**
 * The index of the currently active post
 */
var activePostIndex = 0;
/**
 * If !=0 it will let the gallery autochange itself. The var's value will
 * specify the timeout's length in seconds.
 */
var autoAdvance = 0;
/**
 * The var that holds the timeout object
 */
var autoAdvanceTimeout;
/**
 * The show operation should wait on this image to finish loading
 */
var imgToWaitOn;

/**
 * Gets executed when mouse dragging of the scrollpane has finished. It
 * calculates the currently active post's Index
 */
var slideAfterDragCallback = function() {
	var idx = 0;
	while (postPositions[idx] < postSlideCfg.el.scrollLeft()) {
		idx++;
	}
	idx--;
	activePostIndex = idx == postPositions.size - 1 ? postPositions.size - 1
			: idx + 1;
	autoAdvance = 0;
	gotoPage(activePostIndex);
}
/**
 * Slides the paginator to the given idx
 *
 * @param idx
 */
function gotoPage(idx) {
	// console.log(idx);
	$('.post-pagination li.active').removeClass('active');
	$('.post-pagination li a[href="#post-' + posts[idx].id + '"]').parent()
			.addClass('active');
	pos = Math.max(0, paginatorNumberPositions[idx]
			- $('.post-pagination .number-container').width() / 2);
	paginationSlideCfg.isSliding = true;
	paginationSlideCfg.destinationX = pos;
	slideTo(paginationSlideCfg);
}
/**
 * Swithces the post display to show the post at idx
 *
 * @param idx
 * @returns {Boolean}
 */
function gotoPost(idx) {
	gotoPage(idx);
	if (isScroller) {
		postSlideCfg.isSliding = true;
		postSlideCfg.destinationX = postPositions[idx]
				- $('#posts-container').width() / 2;
		slideTo(postSlideCfg);
	} else {
		if (prevActivePost) {
			prevActivePost.fadeOut();
		}
		prevActivePost = $('.layer-posts #post-' + posts[idx].id);
		prevActivePost.fadeIn(afterPostSelect);
	}
	activePostIndex = idx;

	return false;
}
/**
 * Executed after the effect in gotoPost has finished
 */
function afterPostSelect() {
	if (autoAdvance != 0) {
		autoAdvanceTimeout = setTimeout(gotoNextPost, autoAdvance * 1000, true);
	}
}

function gotoPrevPost() {
	var nupidx = activePostIndex == 0 ? posts.length - 1 : activePostIndex - 1;
	if (nupidx != activePostIndex) {
		gotoPost(nupidx);
	}
	return false;
}

function gotoNextPost() {
	var nupidx = activePostIndex < posts.length - 1 ? activePostIndex + 1 : 0;
	if (nupidx != activePostIndex) {
		gotoPost(nupidx);
	}
	return false;
}
/**
 * Initilizes the dimensions of the post containers
 *
 * @returns The sum of their widhts
 */
function initPostPositions() {
	postPositions = Array();
	var posts = $('#posts');
	els = posts.children();
	w = postsPadding;
	for (i = 0; i < els.size(); i++) {
		elw = $(els[i]).width();
		centerDelta = +(elw + MARGIN_AND_BORDERS) / 2;
		postPositions.push(w + centerDelta);
		w += elw + MARGIN_AND_BORDERS;
	}
	return w;
}

function initPagination() {
	mul = $('.post-pagination .number-container ul');
	els = mul.children();
	paginatorNumberPositions = Array();
	for (i = 0; i < els.size(); i++) {
		paginatorNumberPositions.push($(els[i]).width() + 2 /* for border */
				+ (i > 0 ? paginatorNumberPositions[i - 1] : 0))
	}
	mul.width(paginatorNumberPositions[els.size() - 1]);
}

/**
 * Toggles the details of a post
 */
function toggleDetails(id, btnA) {
	btn = $('i', btnA);
	show = btn.hasClass('icon-chevron-left');
	if (show) {
		btn.removeClass('icon-chevron-left');
		btn.addClass('icon-chevron-right');
		btn.prop('title', 'Hide details');
	} else {
		btn.addClass('icon-chevron-left');
		btn.removeClass('icon-chevron-right');
		btn.prop('title', 'Show details');
	}
	$('#img-info-' + id).toggleClass('active');
}

/**
 * Populates a template with the given postData
 *
 * @param idx
 *            The index of the postData in the array
 * @param postData
 *            The postdata to generate the ui element for
 * @returns The newly created UI element to be put somewhere
 */
function renderPost(idx, postData) {
	if (postData.image_blob_key != undefined && postData.image_blob_key != null
			&& postData.image_blob_key.length > 0) {
		var post = $('#post-template').clone();
		var imgURL = postData.image_blob_key;
		$(post).prop('id', 'post-' + postData.id)
		$(post).width(postData.width);
		img = $('img', post);
		pushdown = (515 - postData.height) / 2;
		img.css('margin-top', pushdown + 'px');
		img.prop('src', imgURL);
		imgToWaitOn = img;
		// img.prop('src', 'http://lorempixum.com/' + postData.width + '/'
		// + postData.height+'/');
		img.prop('title', postData.title);
		img.prop('alt', postData.title);
		img.width(postData.width);
		img.height(postData.height);
		$('.img-info', post).width(postData.width - 30);
		$('.img-info', post).prop('id', 'img-info-' + postData.id);
		$('.img-info > h4', post).html(postData.title);
		$('.img-info > div', post).html(postData.description);
		$('.details-button', post).click(function() {
			toggleDetails(postData.id, this);
			return false;
		});
		fsbtn = $('.fullscreen-button', post);
		$('.img-info-container', post).click(function() {
			// console.log('switch');
			if (!draggerConfig.cancelClick) {
				switchCategory(true);
			}
			draggerConfig.cancelClick = false;
		});

		if (pushdown > 0) {
			var ctrlsMenu = $('.img-controls', post);
			var top = -1030;// parseInt(ctrlsMenu.css('top').split('px')[0]);
			ctrlsMenu.css('top', (top + pushdown) + 'px');
		}
		fsbtn.click(function() {
			showFullscreen(idx);
			return false;
		});

		return post;
	} else {
		return '<div class="post text-post well" id="post-' + postData.id
				+ '">' + '<h3>' + postData.title + '</h3>' + '<article>'
				+ postData.description + '</article >' + '</div>';
	}

	return null;
}
/**
 * The index of the currently viewed image in fullscreen mode
 */
var fullscreenImageIndex = -1;

function fullscreenNext(event) {
	event.stopImmediatePropagation();
	fullscreenImageIndex++;
	if (fullscreenImageIndex >= posts.length) {
		fullscreenImageIndex = 0;
	}
	showFullscreen(fullscreenImageIndex);
}

function fullscreenPrev(event) {
	event.stopImmediatePropagation();
	fullscreenImageIndex--;
	if (fullscreenImageIndex < 0) {
		fullscreenImageIndex = posts.length - 1;
	}
	showFullscreen(fullscreenImageIndex);
}

/**
 * Shows the fullscreen version in an overlay
 *
 * @param idx
 *            The index of the image in the posts array
 */
function showFullscreen(idx) {
	fullscreenImageIndex = idx;
	postData = posts[idx];
	imageURL = postData.image_fs_blob_key;
	var fi = $("#fullscreen-image");
	// information width percent
	var infoWP;
	if (postData.title && postData.title.trim() != '' || postData.description
			&& postData.description.trim() != '') {
		$('h3', fi).html(postData.title).show();
		$('article', fi).html(postData.description).show();
		infoWP = .2;
	} else {
		$('h3', fi).hide();
		$('article', fi).hide();
		infoWP = 0;
	}
	windowW = $(window).width() * (1 - infoWP);
	windowH = $(window).height();
	var w = windowW * .80;
	var mult = 1;
	if (postData.width && postData.width / windowW > postData.height / windowH) {
		mult = 1 / (postData.width / windowW);
	} else {
		mult = 1 / (postData.height / windowH);
		// //console.log('ERROR FULLSCREEN');
	}
	w = postData.width * mult * .95;
	// console.log('mult: ' + mult + ' w: ' + w);
	var ic = $(".image-container", fi);
	ic.css('right', ((windowW - w) / 2) + 'px');
	ic
			.css('top', ((windowH - w * postData.height / postData.width) / 2)
					+ 'px');
	ic.html('<img src="' + imageURL + '" alt="' + postData.title + '" title="'
			+ postData.title + '" style="width: ' + w + 'px"/>');
	fi.fadeIn();
}

function renderPagination(posts) {
	$('.post-pagination.pagination').html('');
	var pgn = '<ul>';
	pgn += '<li><a href="#" onclick="return gotoPrevPost();"><i class="icon-chevron-left" ></i></a></li>';
	pgn += '<li><div class="number-container"><ul>';
	$.each(posts, function(idx, post) {
		pgn += '<li><a href="#post-' + post.id + '" onclick="return gotoPost('
				+ idx + ');">' + (idx + 1) + '</a></li>';
	});
	pgn += '</ul></div></li>';
	pgn += '<li><a href="#" onclick="return gotoNextPost();"><i class="icon-chevron-right" ></i></a></li>';
	pgn += '</ul>';
	$('.post-pagination.pagination').append(pgn);
}

function showPosts() {
	if ($('#posts').css('position') !== 'static') {
		// if it's not already shown
		$('#loader').hide();
		// scrolls to the 1st pos
		$('#posts').css('position', 'static');
		$('#posts').css('right', '');
		if (!simpleNavigation && posts.length > 0) {
			gotoPost(0);
			if (posts.length > 1) {
				// show paginator only if we have posts
				$('.post-pagination').css('position', 'static');
			}
		}
		setTimeout(function() {
			// this fixes some displaying issues on chromium/webkit
			$('#posts').text();
			$('#posts').html();
		}, '2000');
	}
}

function hidePosts() {
	$('.post-pagination').css('position', 'fixed');
	$('.post-pagination').css('right', '5000px');
	$('#posts').css('position', 'fixed');
	$('#posts').css('right', '5000px');
	$('#loader').show();
}

var simpleNavigation = false;

function renderPosts(category, posts) {
	prevActivePost = null;
	imgToWaitOn = null;
	hidePosts();
	activePostIndex = 0;
	// cancel the old autoadvance
	if (autoAdvanceTimeout) {
		clearTimeout(autoAdvanceTimeout);
	}
	// set the new value
	autoAdvance = category.auto_advance;
	$('#posts').html('');
	$.each(posts, function(idx, post) {
		$('#posts').append(renderPost(idx, post));
	});
	if (category.navigation_type == "SCROLL") {
		simpleNavigation = false;
		if (autoAdvance == 0) {
			dragEnabled = true;
			renderPagination(posts);
		} else {
			dragEnabled = false;
		}
		$('#posts-container').removeClass('layer-posts');
		$('#posts-container').removeClass('simple-scroll');
		$('#posts-container').addClass('scroll-posts');
		isScroller = true;
	} else {
		dragEnabled = false;
		if (category.navigation_type == 'LAYERS') {
			simpleNavigation = false;
			if (autoAdvance == 0) {
				renderPagination(posts);
			}
			$('#posts-container').removeClass('simple-scroll');
			$('#posts-container').removeClass('scroll-posts');
			$('#posts-container').addClass('layer-posts');
			$('.layer-posts .post').hide();
			isScroller = false;
		} else {
			simpleNavigation = true;
			$('#posts-container').removeClass('layer-posts');
			$('#posts-container').removeClass('scroll-posts');
			$('#posts-container').addClass('simple-scroll');
		}
	}
	// assign listeners
	if (category.fullscreen === false) {
		$('ul.img-controls').hide();
	} else {
		$('ul.img-controls').show();
	}
	// setup the postit & paginator sliders
	postSlideCfg.el = $('#posts-container');
	postSlideCfg.callback = afterPostSelect;
	paginationSlideCfg.el = $('.post-pagination .number-container');

	// initializes the positions of the posts
	postsWidth = initPostPositions();
	if (category.navigation_type == "LAYERS") {
		$('#posts').css('width', '100%');
	} else {
		$('#posts').width(postsWidth);
	}

	if (!simpleNavigation) {
		// if not simple navigation then initialize paginator
		initPagination();
	}

	// keep in mind the widths
	if (!simpleNavigation) {
		paginationWidth = $('.post-pagination').width();
	}

	// remove the loader
	if (imgToWaitOn == null) {
		showPosts();
	} else {
		// show Posts when the last image has loaded
		imgToWaitOn.load(showPosts);
		// or after 2s ( because http://is.gd/HAaxV1 - see caveats)
		setTimeout(showPosts, '2000');
	}
	// show hide the like button (if there are any images on the screen)
	if($('.img-data').length > 1){
		$('.fb-like').show()
	}else{
		$('.fb-like').hide()
	}
}
/**
 * Cancels the autoadvance feature when a user interacts with the body content
 */
$(window).load(function() {
	$('#body_content').click(function() {
		// autoAdvance = 0;
		// if (autoAdvanceTimeout) {
		// clearTimeout(autoAdvanceTimeout);
		// }
	});
});