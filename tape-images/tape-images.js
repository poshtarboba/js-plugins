(function (){

	const MIN_OFFSET = 200; // если между центром картинки и центром экрана расстояние меньше этого значения - при нажатии A/Q будет переключено на следующую/предыдущую картинку, если больше - то отцентрируется текущая.

	window.addImagesNavKeys = function (selector){
		window.addEventListener('keydown', function (e){
			if (e.keyCode === 81) pressedNavKey('q'); // нажали q
			if (e.keyCode === 65) pressedNavKey('a'); // нажали a
			if (e.keyCode === 87) pressedWkey(); // нажали w
		});
		function pressedWkey(){
			let input = document.getElementById('fullHgh');
			if (input) input.checked = !input.checked;
		}
		function pressedNavKey(key){
			let images = document.querySelectorAll(selector);
			if (images.length < 1) return;
			let halfScreen = window.innerHeight / 2;
			let centerPos = halfScreen + window.scrollY;
			let imgCenters = [];
			for (let i = 0; i < images.length; i++) imgCenters.push(Math.abs(centerPos - imgCenter(images[i])));
			let min = 0;
			for (let i = 1; i < imgCenters.length; i++) if (imgCenters[i] < imgCenters[min]) min = i;
			let next = min + (imgCenters[min] > MIN_OFFSET ? 0 : (key === 'q' ? -1 : 1));
			if (next < 0) next = 0;
			if (next > imgCenters.length - 1) next = imgCenters.length - 1;
			let yPos = imgCenter(images[next]) - halfScreen;
			window.scroll(0, yPos);
		}
		function imgCenter(img){ return img.clientHeight / 2 + img.offsetTop; }
	}

})();
