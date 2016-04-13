/**
 * The configuration object used with #slideTo
 */
function SlideCfg() {
	/**
	 * the element to be scrolled by the drag
	 */
	this.el = null;
	/**
	 * Stores the destination x
	 */
	this.destinationX = 0;
	/**
	 * Friction multiplier (how much we decelerate at each iteration)
	 */
	this.frictionMultiplier = .2;
	/**
	 * Marks a state where we've released the mouse, and we let the scrolled
	 * element slide
	 */
	this.isSliding = false;
	/**
	 * The timeout value of the movement (in ms)
	 */
	this.timeout = 30;
	/**
	 * This will be executed on finish
	 */
	this.callback;
}

/**
 * Call this method with a #SlideCfg object whose element points to a scrollable
 * container.
 */
function slideTo(slideCfg) {
	delta = slideCfg.destinationX - slideCfg.el.scrollLeft();
	delta *= slideCfg.frictionMultiplier;
	old = slideCfg.el.scrollLeft();
	slideCfg.el.scrollLeft(old + delta);
	if (Math.abs(delta) < 1 || old == slideCfg.el.scrollLeft()) {
		slideCfg.isSliding = false;
		slideCfg.el.scrollLeft(slideCfg.destinationX)
	}
	if (slideCfg.isSliding) {
		setTimeout(function() {
			slideTo(slideCfg)
		}, slideCfg.timeout);
	}else if (slideCfg.callback){
		slideCfg.callback();
	}
}