(() => {

	if (history.scrollRestoration) {
		history.scrollRestoration = 'manual';
	} else {
		window.onbeforeunload = function () {
			window.scrollTo(0, 0);
		}
	}

	let yOffset = 0;
	let prevScrollHeight = 0; // 이전 section 높이의 합
	let currentScene = 0; // 현재 보고있는 section
	let enterNewScene = false; // 새로운 section이 시작되는 순간 true
	let workPortFolio = document.querySelector(".workPortFolio");
	let gytjq = document.querySelector(".profileImg");
	const sceneInfo = [
		{
			type: 'sticky',
			heightNum: 4, // 브라우저 높이의 5배 설정
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				messageC: document.querySelector('#scroll-section-0 .main-message.c'),
				bigTitA: document.querySelector('#scroll-section-0 .main-message.a .bigTit'),
				bigTitB: document.querySelector('#scroll-section-0 .main-message.b .bigTit'),
				bigTitC: document.querySelector('#scroll-section-0 .main-message.c .bigTit'),
				// messageD: document.querySelector('#scroll-section-0 .main-message.d')
			},
			values: {
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],

				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				// messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],

				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],

				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				// messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]

				bigTitA_translateX_in: [10, 0, { start: 0.1, end: 0.2 }],
				bigTitB_translateX_in: [10, 0, { start: 0.3, end: 0.4 }],
				bigTitC_translateX_in: [10, 0, { start: 0.5, end: 0.6 }]
			}
		},
		{
			// type: 'normal',
			type: 'normal',
			heightNum: 4,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-1'),
			},
		},
	]

	function setLayout() {
		// 각 스크롤 섹션의 높이 설정
		sceneInfo.forEach(element => {
			if (element.type == 'sticky') {
				element.scrollHeight = element.heightNum * window.innerHeight;
			} else if (element.type == 'normal') {
				element.scrollHeight = element.objs.container.offsetHeight;
			}
			element.objs.container.style.height = `${element.scrollHeight}px`
		});


		yOffset = window.pageYOffset;
		let totalScrollHeight = 0;
		for (let i = 0; i < sceneInfo.length; i++) {
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if (totalScrollHeight >= yOffset) {
				currentScene = i;
				break;
			}
		}
		document.body.setAttribute('id', `show-scene-${currentScene}`)

		// let portFolioList = workPortFolio.children;
		// workPortFolio.style.width = (window.innerWidth * portFolioList.length) + "px";
	}

	function calcValues(values, currentYoffset) {
		let rv;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYoffset / sceneInfo[currentScene].scrollHeight;
		if (values.length === 3) {
			// start ~ end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;
			if (currentYoffset >= partScrollStart && currentYoffset <= partScrollEnd) {
				rv = (currentYoffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			} else if (currentYoffset < partScrollStart) {
				rv = values[0];
			} else if (currentYoffset > partScrollEnd) {
				rv = values[1];
			}

		} else {
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}
		return rv;
	}

	function playAnimation() {
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		switch (currentScene) {
			case 0:
				// console.log('0 play');
				if (scrollRatio <= 0.22) {
					// in

					gytjq.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					gytjq.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
					objs.bigTitA.style.transform = `translateX(${calcValues(values.bigTitA_translateX_in, currentYOffset)}%)`
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.bigTitB.style.transform = `translateX(${calcValues(values.bigTitB_translateX_in, currentYOffset)}%)`
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.bigTitC.style.transform = `translateX(${calcValues(values.bigTitC_translateX_in, currentYOffset)}%)`
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.83) {
					// in
				} else {
					gytjq.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
				}

				break;

			case 1:
				break;
			case 2:
				if (scrollRatio <= 0.25) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.57) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				}

				if (scrollRatio <= 0.83) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				}

				break;

			case 3:
				// console.log('3 play');
				break;
		}
	}


	function scrollLoop() {
		prevScrollHeight = 0;

		enterNewScene = false;
		for (let i = 0; i < currentScene; i++) {
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}
		if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true;
			currentScene++;
			document.body.setAttribute('id', `show-scene-${currentScene}`)
		}
		if (yOffset < prevScrollHeight) {
			enterNewScene = true;
			if (currentScene === 0) {
				// 모바일에서 yOffset이 마이너스가 되는것을 방지
				return false;
			}
			currentScene--;
			document.body.setAttribute('id', `show-scene-${currentScene}`)
		}
		if (enterNewScene) {
			return false;
		}

		if (currentScene == 1) {
			workPortFolio.classList.add("on");
		} else {
			workPortFolio.classList.remove("on");
		}
		playAnimation();
	}


	window.addEventListener('scroll', () => {
		yOffset = window.pageYOffset;
		scrollLoop();
	})

	// window.addEventListener('DOMContentLoaded', setLayout);
	window.addEventListener('load', setLayout);
	window.addEventListener('resize', setLayout);



	let mainVisual_txt = document.querySelector(".mainVisual_txt");
	setTimeout(() => {
		mainVisual_txt.classList.add("on");
		$(".scroll-section").addClass("on")
	}, 100);






	let slider = $('.workPortFolio .slider');
	slider.slick({
		infinite: true,
		dots: false,
		arrows: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		swipe: false
	});


	slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
		var current = currentSlide + 1
		let bgColor = slider.find("article").eq(nextSlide + 1).data("color")
		document.documentElement.style.setProperty("--portfolioBg", `${bgColor}`);
	});

	$(workPortFolio).find(".arrows button").on("click", function (e) {
		let className = e.currentTarget.className;
		switch (className) {
			case "next":
				slider.slick("slickNext");
				break;
			case "prev":
				slider.slick("slickPrev");
				break;
		}

	})

})();