function beforeAfter(selector){
	
	let spanOffsetX;
	
	document.querySelectorAll(selector).forEach(function(slider){
		if (createSlider(slider)) { serviceSlider(slider); }
	});

	function createSlider(slider){
		let images = slider.querySelectorAll('img');
		if (images.length !== 2) { return false; }
		slider.classList.add('before-after-wrap');
		let divImgWrap = createDiv('img-wrap', slider);
		let divOverflow = createDiv('overflow', divImgWrap);
		divOverflow.appendChild(images[0]);
		divImgWrap.appendChild(images[1]);
		let divSeparator = createDiv('separator', divImgWrap);
		divSeparator.innerHTML = '<span></span>';
		return true;
	}
	
	function serviceSlider(slider){
		let span = slider.querySelector('.separator span');
		span.onmousedown = function(e){ dragStart(span, e.offsetX); };
		window.addEventListener('mouseup', function(){
			if (span.classList.contains('move')) { dragEnd(span); }
		});
		window.addEventListener('mousemove', function(e){
			if (span.classList.contains('move')) {
				dragging(span.parentElement, slider.querySelector('.overflow'), e.pageX - spanOffsetX + span.offsetWidth / 2);
			}
		});
		// touchScreen
		span.ontouchstart = function(e){ dragStart(span, e.offsetX); };
		window.addEventListener('touchend', function(){
			if (span.classList.contains('move')) { dragEnd(span); }
		});
		window.addEventListener('touchmove', function(e){
			if (span.classList.contains('move')) {
				dragging(span.parentElement, slider.querySelector('.overflow'), e.pageX - spanOffsetX + span.offsetWidth / 2);
			}
		});
	}

	function createDiv(cls, parent){
		let div = document.createElement('div');
		div.classList.add(cls);
		return parent.appendChild(div);
	}
	
	function dragStart(span, offsetX){
		spanOffsetX = offsetX;
		span.classList.add('move');
	}

	function dragEnd(span){
		span.classList.remove('move');
	}

	function dragging(divSeparator, divOverflow, pageX){
		let x = pageX - getOffsetX(divOverflow.parentElement);
		let w = divOverflow.parentElement.offsetWidth;
		let p = x > w - 4 ? '100%' : x < 4 ? '0' : x / w * 100 + '%';
		divOverflow.style.width = divSeparator.style.left = p;
	}

	function getOffsetX(div){
		let offsetX = 0;
		while (div && div.tagName.toLowerCase() !== 'body') {
			offsetX += div.offsetLeft;
			div = div.offsetParent;
		}
		return offsetX;
	}

}
