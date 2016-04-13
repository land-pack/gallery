/**
 * Switches from the current nme-category to the next or previous one depending
 * on the parameter given. It also checks outOfIndex
 *
 * @param next
 */
function switchCategory(next) {
	counter = $('#nme-categories .nr-nav span');
	currentCat = parseInt(counter.text().split('/')) - 1;
	if (nmeCategories.length > 1) {
		currentCat += next ? 1 : -1;
		currentCat = currentCat > nmeCategories.length - 1 ? 0
				: (currentCat < 0 ? nmeCategories.length - 1 : currentCat);
		showCategory(currentCat);
	}
}

function showCategory(catIdx) {
	counter = $('#nme-categories .nr-nav span');
	category = nmeCategories[catIdx];
	showNMEInfo(category);
	counter.text((catIdx + 1) + ' / ' + nmeCategories.length);
	try {
		history.pushState({}, catIdx + ' | ' + window.title, '/category/'
				+ category.id);
	} catch (e) {
		// fallback mode
		window.location.hash = catIdx;
	}
	$.ajax('/category/' + category.id).done(function(data) {
		posts = data.posts;
		renderPosts(category, data.posts);
	});
}

function showNMEInfo(category) {
	// console.log('showNMEInfo');
	var el = $('#nme-cat-title');
	if (category) {
		$('h4', el).html(category.title);
		$('p', el).html(category.description);
		$('.fb-like', el).remove();
		$(el)
				.append(
						'<div class="fb-like" data-send="false"'
								+ 'data-href="http://www.anabellaveress.com/category/'
								+ category.id
								+ '"'
								+ 'data-layout="button_count" data-width="40" data-show-faces="false"></div>');
		try {
			FB.XFBML.parse();
		} catch (ex) {
		}
	}
}

/**
 * Called when the user presses back/forward
 *
 * @param e
 * @returns
 */
function popFunction(e) {
	try{//antIE
		var initialPop = !popped && location.href == initialURL;
		popped = true;
		if (initialPop) {
			return;
		}
		window.location = e.currentTarget.location;
	}catch(e){

	}
}

$().ready(function() {
	// console.log('ready');
	showNMEInfo(null);
	$('#nme-cat-title').show();
	try {
		HTML5History.bind(window.history);
		window.addEventListener("popstate", popFunction);
	} catch (e) {
		console.log(e);
	}
});

var popped = ('state' in window.history && window.history.state !== null), initialURL = location.href;