/*
TODO:
- колір ліній в залежності від довжини
- вплив курсора миші: притягування та відштовхування
*/

function animationDots(options){
	const DOT_SIZE = 6;
	const INTERVAL_MS = 20;
	options.distanceY = Math.sqrt(options.distanceX * options.distanceX * 3 / 4);
	options.canvas.onmousemove = null;
	if (window.ADobj && window.ADobj.timerId) clearInterval(window.ADobj.timerId);
	if (!window.ADobj) {
		let wrap = options.canvas.parentElement;
		wrap.addEventListener('mousemove', canvasMouseMove);
		wrap.addEventListener('mouseleave', canvasMouseLeave);
	}

	window.ADobj = {};
	let ctx;
	initCanvas();
	createDots();
	ctxClear();
	drawLines();
	drawDots();
	window.ADobj.timestamp = Date.now();
	window.ADobj.timerId = setInterval(swingFrame, INTERVAL_MS);


	function initCanvas(){
		options.canvas.width = options.canvas.clientWidth;
		options.canvas.height = options.canvas.clientHeight;
		ctx = options.canvas.getContext('2d');
		ctx.DrawDot = function(x, y){
			if (arguments.length === 1) {
				y = x.y;
				x = x.x;
			}
			ctx.beginPath();
			ctx.arc(x, y, DOT_SIZE / 2, Math.PI * 2, false);
			ctx.fill();
			ctx.closePath();
		};
		ctx.DrawLine = function(x1, y1, x2, y2){
			if (arguments.length === 2) {
				x2 = y1.x;
				y2 = y1.y;
				y1 = x1.y;
				x1 = x1.x;
			}
			if (options.linesColors) {
				let l = lineLength(x1, y1, x2, y2) / options.distanceX / 1.5;
				let c = Math.min(Math.pow(l, 0.2) * 255, 250);
				ctx.strokeStyle = `rgb(${c}, ${c}, ${c})`;
			} else ctx.strokeStyle = '#eee';
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			ctx.closePath();
		};
	}

	function createDots(){
		let dots = window.ADobj.dots = [];
		let dst = options.distance;
		let w = options.canvas.width + options.distanceX * 2;
		let h = options.canvas.height + options.distanceY * 2;
		options.countX = Math.ceil(w / options.distanceX);
		options.countY = Math.ceil(h / options.distanceY);
		let n = options.countX * options.countY;
		for (let i = 0; i < n; i++) {
			let ns = options.noiseSize;
			let row = Math.trunc(i / options.countX);
			let xOrig = (i % options.countX) * options.distanceX - options.distanceX * (row % 2 ? 0.8 : 0.3);
			let yOrig = (Math.trunc(i / options.countX) - 0.7) * options.distanceY;
			let xNoise = options.noise ? rnd(-ns, ns) : 0;
			let yNoise = options.noise ? rnd(-ns, ns) : 0;
			let dot = {
				xOrig, yOrig,
				xNoise, yNoise,
				xSwing: 0, ySwing: 0,
				xMouse: 0, yMouse: 0,
				get x(){ return this.xOrig + this.xNoise + this.xSwing + this.xMouse; },
				get y(){ return this.yOrig + this.yNoise + this.ySwing + this.yMouse; }
			};
			if (options.swing) {
				dot.swingAngle = rnd(0, 360);
				dot.swingSpeed = rnd(options.swigSpeed.min, options.swigSpeed.max);
			}
			dots.push(dot);
		}
	}

	function ctxClear(){
		ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
	}

	function drawDots(){
		for (let dot of window.ADobj.dots) {
			ctx.fillStyle = '#888';
			ctx.DrawDot(dot.x, dot.y);
		}
	}

	function drawLines(){
		let dots = window.ADobj.dots;
		ctx.lineWidth = 1;
		for (let y = 0; y < options.countY; y++) {
			for (let x = 0; x < options.countX; x++) {
				let i = y * options.countX + x;
				let dot0 = dots[i];
				if (x < options.countX - 1) ctx.DrawLine(dot0, dots[i + 1]);
				if (y < options.countY - 1) {
					i += options.countX;
					ctx.DrawLine(dot0, dots[i]);
					if (y % 2 === 0 && x < options.countX - 1) ctx.DrawLine(dot0, dots[i + 1]);
					if (y % 2 === 1 && x > 0) ctx.DrawLine(dot0, dots[i - 1]);
				}
			}
		}
	}

	function swingFrame(){
		let now = Date.now();
		let deltaTime = now - window.ADobj.timestamp;
		window.ADobj.timestamp = now;
		if (options.swing) reCalcDots();
		ctxClear();
		drawLines();
		drawDots();
		function reCalcDots(){
			let ss = options.swingSize;
			for (let dot of window.ADobj.dots) {
				let angle = deg2rad(dot.swingAngle);
				let dist = dot.swingSpeed * deltaTime / 1000;
				dot.xSwing += Math.cos(angle) * dist;
				dot.ySwing += Math.sin(angle) * dist;
				if (dot.xSwing < -ss) {
					if (dot.ySwing < -ss) dot.swingAngle = rnd(-89, 89);
					else if (dot.ySwing > ss) dot.swingAngle = rnd(271, 359);
					else dot.swingAngle = rnd(-89, 89);
				} else if (dot.xSwing > ss) {
					if (dot.ySwing < -ss) dot.swingAngle = rnd(91, 179);
					else if (dot.ySwing > ss) dot.swingAngle = rnd(181, 269);
					else dot.swingAngle = rnd(91, 269);
				} else if (dot.ySwing < -ss) dot.swingAngle = rnd(1, 179);
				else if (dot.ySwing > ss) dot.swingAngle = rnd(181, 359);
			}
		}
	}

	function canvasMouseMove(e){
		if (options.mouseTurb === 0) return;
		let mX = e.layerX, mY = e.layerY;
		for (let dot of window.ADobj.dots) {
			let dist = lineLength(mX, mY, dot.x, dot.y);
			if (dist < options.mouseDistance) {
				let power = 1 - Math.sqrt(dist / options.mouseDistance);
				/*if (options.mouseTurb === 1)
					power = 1 - Math.sqrt(dist / options.mouseDistance);
				if (options.mouseTurb === -1)
					power = Math.sqrt(options.mouseDistance - dist) / options.mouseDistance;*/
				if (options.mouseTurb === 1) {
					dot.xMouse = (mX - dot.x) * power;
					dot.yMouse = (mY - dot.y) * power;
				}
				if (options.mouseTurb === -1) {
					dot.xMouse = (dot.x - mX) * power;
					dot.yMouse = (dot.y - mY) * power;
				}
			} else {
				dot.xMouse = 0;
				dot.yMouse = 0;
			}
		}
		if (!options.swing) swingFrame();
	}

	function canvasMouseLeave(){
		if (options.mouseTurb === 0) return;
		for (let dot of window.ADobj.dots) {
			dot.xMouse = 0;
			dot.yMouse = 0;
		}
	}

	function lineLength(x1, y1, x2, y2) {
		if (arguments.length === 2) {
			x2 = y1.x;
			y2 = y1.y;
			y1 = x1.y;
			x1 = x1.x;
		}
		let dx = x1 - x2;
		let dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function rnd(min, max) { return Math.random() * (max - min) + min; }
	function deg2rad(deg) { return deg / 180 * Math.PI; }
}
