let img, cols, rows, imgWidth, imgHeight

let scl = 50,
	inc = 0.01,
	t = 0,
	canvas

let particles = [],
	flowfield = []


class Particle {
	constructor(x, y, c) {
		this.pos = createVector(x, y)
		this.vel = createVector(random(-0.1, 0.1), random(-0.1, 0.1))
		this.acc = createVector(random(-0.1, 0.1), random(-0.1, 0.1))
		this.maxspeed = 5
		this.color = c
	}


	update() {
		this.vel.add(this.acc)
		this.vel.limit(this.maxspeed)
		this.pos.add(this.vel)
		this.acc.mult(0)
	}

	follow(vectors) {
		const x = floor(this.pos.x / scl)
		const y = floor(this.pos.y / scl)

		const index = x + y * cols
		const force = vectors[index]
		this.applyForce(force)
	}

	applyForce(force) {
		this.acc.add(force)
	}

	edges() {
		if (this.pos.x > imgWidth) this.pos.x = 0
		if (this.pos.x < 0) this.pos.x = imgWidth
		if (this.pos.y > imgHeight) this.pos.y = 0
		if (this.pos.y < 0) this.pos.y = imgHeight
	}


	display() {
		stroke(this.color)
		strokeWeight(4)
		noFill()
		point(this.pos.x, this.pos.y)
		// fill(this.color)
		// noStroke()
		// rect(this.pos.x, this.pos.y, random(5, 10), random(5, 10))
	}

}

function preload() {
	img = loadImage('assets/p6.jpg')
}


function setup() {
	
	imgWidth = img.width
	imgHeight = img.height
	canvas = createCanvas(imgWidth, imgHeight)
	
	for (let i = 0; i < 9000; i++) {
		let x = random(imgWidth)
		let y = random(imgHeight)
		let c = color( img.get(x, y) )

		let p = new Particle(x, y, c)
		
		particles.push(p)
	}

	cols = int(imgWidth / scl)
	rows = int(imgHeight / scl)

	flowfield = new Array( cols * rows )

}


function draw() {
	// clear()

	let yoff = 0 
	for (let x = 0; x < cols; x++) {
		let xoff = 0
		for (let y = 0; y < rows; y++) {
			
			let index = x + y * cols

			noiseDetail(950, .8)

			let n = noise(xoff, yoff, t)
			let angle = n * TWO_PI

			let v = p5.Vector.fromAngle( angle )
			v.setMag(1)

			flowfield[index] = v

			xoff += inc
		}
		yoff += inc
	}

	t += inc


	particles.forEach( p => {
		p.follow(flowfield)
		p.update()
		p.display()
		p.edges()
	})

}

function keyPressed() {
	if (keyCode === ENTER) {
		noLoop()

		saveCanvas(canvas, 'artsy', 'jpg')
	}
}
