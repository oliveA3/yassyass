import { RoomHandler, hogwartsRooms } from "./rooms.js";
import { Player } from "./player.js";
import { BulletHandler } from "./bullet.js";
import { Controls } from "./controls.js";
import { Smoke } from "./smoke.js";
import { EnemyHandler } from "./enemies.js";

export class Game {
	constructor() {
		// 1. Sistema básico
		this.container = $(".container");
		this.updateQueue = [];

		// 2. Controles
		this.controls = new Controls();

		// 3. Enemigos
		this.enemyHandler = new EnemyHandler({
			parentContainer: this.container,
			startUpdating: this.startUpdating.bind(this),
			player: null, // Temporalmente null
		});

		// 4. BulletHandler
		this.bulletHandler = new BulletHandler({
			parentContainer: this.container,
			startUpdating: this.startUpdating.bind(this),
			enemyHandler: this.enemyHandler,
		});

		// 5. Smoke
		this.smoke = new Smoke({
			parentContainer: this.container,
			startUpdating: this.startUpdating.bind(this),
		});

		this.roomHandler = new RoomHandler({
			parentContainer: this.container,
			createEnemy: (x, y, type) =>
				this.enemyHandler.createEnemy(x, y, type),
		});

		this.changeToHouse("HUFFLEPUFF");

		// 6. Player (ahora que todo está listo)
		this.player = new Player({
			parentContainer: this.container,
			startUpdating: this.startUpdating.bind(this),
			controls: this.controls,
			createBullet: this.bulletHandler.createBullet.bind(
				this.bulletHandler
			),
			createSmoke: this.smoke.create.bind(this.smoke),
		});

		// 7. Actualizar EnemyHandler con referencia al player
		this.enemyHandler.player = this.player;

		// Iniciar juego
		this.update();
	}

	changeToHouse(houseName) {
		this.roomHandler.changeRoom(houseName);

		// Obtener el tipo de enemigo de la habitación
		const enemyType = hogwartsRooms[houseName].enemyType;

		// Configurar el spawn de enemigos
		this.enemyHandler.setEnemyType(enemyType);

		setTimeout(() => {
			if (!this.spawnUpdating) {
				this.startUpdating(() => {
					this.enemyHandler.spawnEnemies();
				});
				this.spawnUpdating = true;
			}
		}, 4000)
	}

	// Adding a function to the update queue.
	startUpdating(func) {
		this.updateQueue.push(func);
	}

	// Updating the queue
	update() {
		if (this.player && this.player.currentHealth <= 0) {
			// Juego terminado, puedes agregar lógica de reinicio aquí
			return;
		}
		for (var i = 0; i < this.updateQueue.length; i++) {
			this.updateQueue[i]();
		}
		window.requestAnimationFrame(this.update.bind(this));
	}
}
