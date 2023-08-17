const canvas = document.getElementById("canvas");
const graphics = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const num = document.getElementById("num");
const real = document.getElementById("real");
const complex = document.getElementById("complex");
const click = document.getElementById("click");

let translatedX = 0;
let translatedY = 0;

let mouseX = 0;
let mouseY = 0;

let scale = 1;

let imageData = graphics.createImageData(width, height);

canvas.addEventListener("click", function(mouse) {
	if (click.checked) {
		translatedX = 0;
		translatedY = 0;
		scale = 1;

		real.value = (mouse.offsetX-width/2)/(width/4);
		complex.value = (mouse.offsetY-height/2)/(height/4);

		juliaSetDraw((mouse.offsetX-width/2)/(width/4), (mouse.offsetY-height/2)/(height/4), num.value);
	} else {
		mouseX = (mouse.offsetX-width/2)/(width/4);
		mouseY = (mouse.offsetY-height/2)/(height/4);

		translatedX += mouseX/scale;
		translatedY += mouseY/scale;

		scale *= 2;

		juliaSetDraw(parseFloat(real.value), parseFloat(complex.value), parseInt(num.value));
	}
});

function hslToRgb(h, s, l) {
  	let r, g, b;

  	if (s === 0) {
    	r = g = b = l;
  	} else {
    	let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    	let p = 2 * l - q;

    	r = Math.round(255 * (q < 1 ? q * q * 6 : (q - 1) * (q - 1) * 6 + 1));
    	g = Math.round(255 * (p < 1 ? p * p * 6 : (p - 1) * (p - 1) * 6 + 1));
    	b = Math.round(255 * (q < 1 ? (1 - q) * q * 6 : (1 - q) * (1 - q) * 6 + 1));
  	}

  	return [r, g, b];
}

function juliaSetDraw(real, imaginary, iterations) {
	graphics.clearRect(0, 0, width, height);

	const scalingFactor = width/4;
	//multiply by 4 in order to get the scaling right
	for (let i = 0; i <= width; i++) {
		for (let j = 0; j <= height; j++) {
			let x = ((i-width/2)/scalingFactor)/scale + translatedX;
			let y = ((j-height/2)/scalingFactor)/ scale + translatedY;

			let k = 0;

			const re = real;
			const im = imaginary;

			while (x*x + y*y <= 4 && k < iterations) {
				let x_new = (x*x-y*y)+re;
				y = (2*x*y)+im;

				x = x_new;

				k++;
			}

			if (k < iterations) {
				let index = (i + j * imageData.width) * 4;

				let rgb = hslToRgb((k/iterations*360)**1.5%360, 50, k);
				
				imageData.data[index] = rgb[2];
				imageData.data[index+1] = rgb[0];
				imageData.data[index+2] = rgb[1];
				imageData.data[index+3] = k*2;
			}
		}
	}

	graphics.putImageData(imageData, 0, 0);
}

//-.307 - .733i
juliaSetDraw(parseFloat(real.value), parseFloat(complex.value), parseInt(num.value));