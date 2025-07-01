export const hogwartsRooms = {
	RAVENCLAW: {
		name: "Torre de Ravenclaw",
		background: "url('bgs/ravenclaw_bg.avif')",
		song: "music/Raven_song.mp3",
		enemyType: "eagle",
		colorTheme: "#0E1A40",
		spawnPoints: [
			{ x: 10, y: 10 },
			{ x: 90, y: 10 },
			{ x: 50, y: 20 },
		],
	},
	GRYFFINDOR: {
		name: "Sala Común de Gryffindor",
		background: "url('bgs/gryffindor_bg.avif')",
		song: "music/Gry_song.mp3",
		enemyType: "lion",
		colorTheme: "#740001",
		spawnPoints: [
			{ x: 15, y: 15 },
			{ x: 85, y: 15 },
			{ x: 50, y: 20 },
		],
	},
	SLYTHERIN: {
		name: "Mazmorras de Slytherin",
		background: "url('bgs/slytherin_bg.webp')",
		song: "music/Sly_song.mp3",
		enemyType: "snake",
		colorTheme: "#1A472A",
		spawnPoints: [
			{ x: 30, y: 10 },
			{ x: 70, y: 10 },
			{ x: 50, y: 30 },
		],
	},
	HUFFLEPUFF: {
		name: "Cocina de Hufflepuff",
		background: "url('bgs/hufflepuff_bg.webp')",
		song: "music/Huff_song.mp3",
		enemyType: "badger",
		colorTheme: "#FFDB00",
		spawnPoints: [
			{ x: 25, y: 25 },
			{ x: 75, y: 25 },
			{ x: 0, y: 25 },
		],
	},
};

export class RoomHandler {
	constructor(options) {
		this.parentContainer = document.body;
		this.createEnemy = options.createEnemy;
		this.currentRoom = null;
		this.rooms = Object.values(hogwartsRooms);
	}

	changeRoom(houseName) {
		this.currentRoom = hogwartsRooms[houseName];

		document.body.style.background = `${this.currentRoom.background} no-repeat center fixed`;
		document.body.style.backgroundSize = "cover";

		this.firstEnemies();
	}

	firstEnemies() {
		setTimeout(() => {
			this.currentRoom.spawnPoints.forEach((point) => {
				this.createEnemy(
					(window.innerWidth * point.x) / 100,
					(window.innerHeight * point.y) / 100,
					this.currentRoom.enemyType
				);
			});
		}, 2000);
	}
}
