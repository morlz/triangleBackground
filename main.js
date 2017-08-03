'use strict';

var bg = (function (Snap) {
	var s = Snap("#background")

	let drawTrian = (x, y, r, flip = false) => {
		var points = []

		flip = flip ? Math.PI / 6 : Math.PI / 2

		for (let i = 0; i < 3; i++) {
			let n = i * Math.PI / 1.5 + flip
			let n2 = (i + 1) * Math.PI / 1.5
			points.push(x + r * Math.cos(n), y + r * Math.sin(n))
		}

		return {
			x: x,
			y: y,
			r: r,
			moving: false,
			obj: s.polygon(points).attr({
				"fill-opacity": 0,
				stroke: "#d1d1d1",
				strokeWidth: 2
			})
		}
	}

	let rotateTriangle = (triangle) => {
		if (triangle.moving) return 1;
		triangle.obj
			.transform(`r0 ${triangle.x} ${triangle.y}`)
			.animate({
				stroke : "green"
			}, 1000, mina.linear, () => {
				triangle.obj.animate({
					transform : `r360 ${triangle.x} ${triangle.y}`,
					stroke : "#d1d1d1"
				}, 3000, mina.bounce)
			})
	}

	let createTriangles = (options = {}) => {
		var cache = [],
			nodeWidth = options.radius * Math.cos(Math.PI / 6) * 2,
			nodeHeight = nodeWidth * Math.sqrt(3) / 2,
			yCount = Math.ceil(s.node.clientHeight / (nodeHeight + options.gap.y )),
			xCount = Math.ceil(s.node.clientWidth / (nodeWidth + options.gap.x ));

		console.log(nodeWidth, nodeHeight, Math.ceil(s.node.clientHeight / nodeHeight), Math.ceil(s.node.clientWidth / nodeWidth))


		for ( let i = 0; i <= xCount; i++) {
			if (!cache[i]) cache[i] = []

			for ( let j = 0; j <= yCount; j++) {

				cache[i][j] = drawTrian(
																//x cord
					Math.round(i * nodeWidth) + 							//triangle box
					(i * options.gap.x) + 									// triangle gap x
					Math.round( nodeWidth / 2 * (j % 2) ), 					// 2n x transcale


																//y cord
					Math.round(j * nodeHeight) + 							//triangle box
					(j * options.gap.y) + 									// triangle gap y
					(options.gap.fliped * (i % 2)),							// triangle gap for fliped


					options.radius,
					!!(i % 2)
				)
			}
		}

		return cache
	}

	let swapTriangle = function (tg1, tg2) {
		if (tg1.moving || tg2.moving) return 1;
		let getPoints = (obj) => {
			var points = []

			for (var svgPointId in obj.node.points) {
				if (tg1.obj.node.points.hasOwnProperty(svgPointId)) {
					points.push(obj.node.points[svgPointId].x)
					points.push(obj.node.points[svgPointId].y)
				}
			}

			return points
		}

		tg1.moving = true

		tg1.obj.animate({
				stroke : "blue",
				"stroke-opacity" : "0.5"
			}, 500, () => {
				tg1.obj.animate({
					points: getPoints(tg2.obj)
				}, 3000, mina.easeinout, () => {
					tg1.obj.animate({
						stroke : "#d1d1d1",
						"stroke-opacity" : "1"
					}, 500)
					tg1.moving = false
				})
			})


		tg2.moving = true

		tg2.obj.animate({
				stroke : "blue",
				"stroke-opacity" : "0.5"
			}, 500, () => {
				tg2.obj.animate({
					points: getPoints(tg1.obj)
				}, 3000, mina.easeinout, () => {
					tg2.obj.animate({
						stroke : "#d1d1d1",
						"stroke-opacity" : "1"
					}, 500)
					tg2.moving = false
				})
			})


		tg1.x = [tg2.x, tg2.x = tg1.x][0];
		tg1.y = [tg2.y, tg2.y = tg1.y][0];

	}

	var cache = createTriangles({
		radius: 15,
		gap: {
			x: 0,
			y: 10,
			fliped: 7.5
		}
	})


	setInterval(() => {
		let x = Math.floor( Math.random() * cache.length )
		let y = Math.floor( Math.random() * cache[x].length )
		rotateTriangle(cache[x][y])
	}, 50);

	setInterval(() => {
		let x1 = Math.ceil( Math.random() * cache.length - 1)
		let y1 = Math.ceil( Math.random() * cache[x1].length - 1 )
		let x2 = Math.ceil( Math.random() * cache.length - 1 )
		let y2 = Math.ceil( Math.random() * cache[x1].length - 1 )

		if (cache[x2] && cache[x2][y2]) swapTriangle(cache[x1][y1], cache[x2][y2])
	}, 300);

	console.log(cache)

	return {}
})(Snap)
