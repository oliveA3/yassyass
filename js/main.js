import { Game } from "./game.js";
import { mouse } from "./player.js";
import { hogwartsRooms } from "./rooms.js";

document.addEventListener("DOMContentLoaded", () => {
	const game = new Game();

	document.querySelector(".container").addEventListener("click", () => {
		const text = document.querySelector(".txt");
		text.classList.add("show");
		setTimeout(() => {
			text.classList.remove("show");
		}, 500);
	});

	$(window).on("mousemove", function (e) {
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	});


	const btns = document.querySelectorAll(".btn")
	btns.forEach(btn => {
		btn.addEventListener("click", () => {
			let houseName = btn.innerText.toUpperCase();
			game.changeToHouse(houseName);

			const audio = document.getElementById("houseSong");
			audio.src = hogwartsRooms[houseName].song;
			audio.play();
		});
	})

	/*document.querySelector(".ravenclaw-btn").addEventListener("click", () => {
		game.changeToHouse("RAVENCLAW");
	});
	document.querySelector(".gryffindor-btn").addEventListener("click", () => {
		game.changeToHouse("GRYFFINDOR");
	});
	document.querySelector(".hufflepuff-btn").addEventListener("click", () => {
		game.changeToHouse("HUFFLEPUFF");
	});
	document.querySelector(".slytherin-btn").addEventListener("click", () => {
		game.changeToHouse("SLYTHERIN");
	});*/
});