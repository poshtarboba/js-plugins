(function($){
	
	$.fn.zoomImage = function(options){
		let defaultOptions = {
			width: 600,
			height: 450
		};
		options = $.extend(defaultOptions, options);
		this.each(function(){
			$(this).on('mouseenter', mouseEnter);
			$(this).on('mouseleave', mouseLeave);
			$(this).on('mousemove', mouseMove);
		});
		return this;
		
		function mouseEnter(){
			$(document.body).append('<div id="zoomImage"><img src="' + this.dataset.src + '" alt="zoom"></div>');
			let x = $(this).offset().left + $(this).outerWidth() + 4;
			let y = $(this).offset().top;
			$('#zoomImage').css({ left: x + 'px', top: y + 'px', width: options.width + 'px', height: options.height + 'px' });
		}
		function mouseLeave(){
			$('#zoomImage').remove();
		}
		function mouseMove(e){
			let $box = $('#zoomImage');
			let $Img = $box.children('img');
			let dx = $Img.width() - $box.innerWidth();
			let dy = $Img.height() - $box.innerHeight();
			let x = Math.min(Math.max(e.offsetX / $(this).width(), 0), 1);
			let y = Math.min(Math.max(e.offsetY / $(this).height(), 0), 1);
			console.log(x, y);
			$Img.css({ left: -x * dx, top: -y * dy });
		}
	}

})(jQuery);
