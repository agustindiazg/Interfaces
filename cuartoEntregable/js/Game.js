class Game {

    constructor() {
        this.player = {};
        this.obstacles = [];
        this.rewards = [];
        this.puntaje = 0;
        this.cantNewObjects = 2;
        this.aggregation = 5;
        this.lastObstacle = 1;
        this.lastReward = 1;
        this.stop = false;
        this.first = true;
        this.keyCodes = {   37 : "movePlayerLeft" , 39 : "movePlayerRight" ,
                            40 : "movePlayerDown", 38 : "movePlayerUp"
                        }

    };

    movePlayer(eventKey){
         this[this.keyCodes[eventKey]]();
    }

    startGame(){
        $('#gameOver').remove();
        this.puntaje = 0;
        this.cantNewObjects = 2;
        $('#score').html(this.puntaje);
        this.stop = false;
        if (this.first){
            this.generatePlayer();
            this.first = false;
        }
        this.checkStatus();
        this.generateNewObstacles(4);
        this.ObstacleWave();
        this.generateRewards();
        $('#game').addClass('game-bg-animation ');
    }

    checkRewards(){
        let oneCrashed = false;
        this.rewards.forEach(reward => {
            if (this.player.isTouching(reward.getLocation())){

                if (!reward.touched) {
                    reward.touched = true;
                    this.puntaje += 100;
                    $('#score').html(this.puntaje);
                }

            }
        });
        return oneCrashed;
    }

    generateRewards(){
        let interval  = setInterval(() => {
            if (!this.stop){
                this.generateNewRewards();
            }else{
                clearInterval(interval);
            }
        }, 8500);
    }

    ObstacleWave(){
        let interval  = setInterval(() => {
            this.puntaje += this.aggregation;
            $('#score').html(this.puntaje);
            if (!this.stop){
                let cant = Object.getRandomInt(this.cantNewObjects);
                this.cantNewObjects = this.cantNewObjects * 1.02;
                this.generateNewObstacles(cant);
            }else {
                clearInterval(interval);
            }
        }, 1000);
    }

    checkStatus(){
        let interval  = setInterval(() => {
            this.checkRewards();
            let crash = this.checkObstacles();
            if (crash){
                this.stop = true;
                this.rewards = [];
                this.obstacles = [];
                $('#game').removeClass('game-bg-animation ');
                let game_over = "<h1 id='gameOver' class='gameOver'>Game Over!!</h1>";
                $("#game").append(game_over);
                clearInterval(interval);
            }
        }, 25/10000);
    };

    generatePlayer() {
        let data = {
            x:310,
            y:475,
            height:85,
            width:85,
            movementLength:40,
            elem_id : 'player',
            elem: $('#player'),
            class: "player",
        };
        this.player = new Player(data);
    }

    generateNewRewards(){
        let reward = new Reward({ x:0, y:0, height:105, width:105,
            movementLength:20,
            elem_id: 'reward'+this.lastReward,
            class: "reward",
        });
        this.lastReward++;
        this.rewards.push(reward);
    }

    generateNewObstacles(cant) {
        for (let i=0;i< cant;i++){
            let obstacle = new Obstacle(
                { x:0, y:0, movementLength:20,
                    elem_id: 'obstacle'+this.lastObstacle,
                    class: "obstacle",
                });
            this.lastObstacle++;
            this.obstacles.push(obstacle);
        }
    }

    checkObstacles(){
        let oneCrashed = false;
        this.obstacles.forEach(obstacle => {
            if (this.player.isTouching(obstacle.getLocation())){
                oneCrashed = true;
                obstacle.elem.addClass('explosion');
                // obstacle.elem.addClass('explosion');
            }
        });
        return oneCrashed;
    };

    movePlayerLeft(){
        this.player.moveLeft();
    }

    movePlayerRight(){
        this.player.moveRight();
    }

    movePlayerUp(){
        this.player.moveUp();
    }

    movePlayerDown(){
        this.player.moveDown();
    }

}