(function(){

	/* .css() */
	Element.prototype.css = _Rich_css;
	HTMLCollection.prototype.css = _Rich_css;
	NodeList.prototype.css = _Rich_css;



	/* *** */
	function _runForEach(elem, callback, ...params){
		/* TODO: ... and use */
		if (typeof elem.length === 'number') for (let i=0; i<elem.length; i++) if (elem[i]) callback(elem[i], ...params);
		else callback(elem, ...params);
	}
	function _setStyle(elem, styles){
		for (let style in styles) elem.style[_unHyphen(style)] = styles[style];
	}
	function _unHyphen(str){
		if (str[0] === '-') str = str.substr(1);
		let n;
		while ((n = str.indexOf('-')) > -1) str = str.substr(0, n) + (str[n + 1] ? str[n + 1].toUpperCase() : '') + str.substr(n + 2);
		return str;
	}

	/* .css() */
	function _Rich_css(style, value){
		if (typeof style === 'string') { let key = style; style = {}; style[key] = value; }
		_runForEach(this, _setStyle, style);
	}

	/* .trigger() */
	// https://javascript.ru/forum/jquery/46210-trigger-y-kogda-i-zachem.html

})();
