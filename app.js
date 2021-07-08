class MyAudio{
    constructor(audioSrc, volume){
        this.volume   = 0;
        this.audioSrc = audioSrc;
        this.volume   = volume;

        this.load();
    }

    load(){
        this.audioElement = new Audio(this.audioSrc);
        this.audioElement.volume = this.volume;
        return this;
    }
    
    play(){
        // this.audioElement.addEventListener("canplaythrough", event => {
            this.duration = this.audioElement.duration;
            this.audioElement.play();
        // });
    }
}


let canvas   = document.getElementById('canvas');
let context  = canvas.getContext('2d');

let canvasBG       = '#414141';
let canvasDangerBG = 'orangered';

let width    = 400;
let height   = 400;
let gameSpeedControll = 0;

canvas.width  = width;
canvas.height = height;
canvas.style.backgroundColor = canvasBG;


class Snake{
    constructor(defaultSnakeLength=5)
    {
        this.isPause            = false;
        this.gameSpeed          = 50;
        this.defaultSnakeLength = defaultSnakeLength;
        this.snakeParts         = [];
        this.size               = 20;
        
        this.snakeFillColor   = '#ff5733',
        this.snakeStrokeColor = '#fff',
    
        this.snakeHeadFillColor   = 'yellow',
        this.snakeHeadStrokeColor = '#ff5733',
    
        this.foodFillColor   = '#ffc300',
        this.foodStrokeColor = '#fff'

        this.directionX        = 1;
        this.directionY        = 0;
        
        this.eaten             = false;

        this.foodX             = this.foodPosition(canvas.width);
        this.foodY             = this.foodPosition(canvas.height);

        /* sound start */
            this.dieAudio      = new MyAudio('./audio/die.wav', 0.1);
            this.eatenAudio    = new MyAudio('./audio/eaten.wav', 1);
            this.level_upAudio = new MyAudio('./audio/level_up.wav', 0.5);
            this.game_overAudio = new MyAudio('./audio/game_over.wav', 1);
        /* sound end */

        this.defaultSnake();
        this.keyControll();

        this.levelScroureMenegar();
        this.HTMLElement();
    }


    foodPosition(canvasWidthOrHeight=0)
    {
        let x = Math.floor(Math.random() * (canvasWidthOrHeight / this.size));
        return x*this.size;
    }


    defaultSnake(){
        for(let i=0; i<this.defaultSnakeLength; i++)
        {
            this.snakeParts.push({
                x: i*this.size,
                y: 0
            });
        }
    }


    drawSnake()
    {
        context.fillStyle   = this.snakeFillColor;
        context.strokeStyle = this.snakeStrokeColor;
        context.save();
        for(let i=0; i<this.snakeParts.length; i++)
        {
            if(i===0)
            {
                context.fillStyle   = this.snakeHeadFillColor;
                context.strokeStyle = this.snakeHeadStrokeColor;
            }else{
                context.restore();
            }

            context.fillRect(this.snakeParts[i].x, this.snakeParts[i].y, this.size, this.size);
            context.strokeRect(this.snakeParts[i].x, this.snakeParts[i].y, this.size, this.size);
        }
    }


    snakeHeadControll()
    {
        let x;
        if(this.snakeParts[0].x >= canvas.width)
        {
            x = 0;
        }else if(this.snakeParts[0].x < 0){
            x = canvas.width-this.size;
        }else{
            x = this.snakeParts[0].x + (this.directionX * this.size);
        }


        let y;
        if(this.snakeParts[0].y >= canvas.height)
        {
            y = 0;
        }else if(this.snakeParts[0].y < 0)
        {
            y = canvas.height-this.size;
        }else{
            y = this.snakeParts[0].y + (this.directionY * this.size);
        }

        this.snakeParts.unshift({x,y});

        if(!this.eaten)
        {
            this.snakeParts.pop();
        }
    };


    /* work with food and eat start */
        foodGenerate()
        {
            if(this.eaten)
            {
                this.foodX = this.foodPosition(canvas.width);
                this.foodY = this.foodPosition(canvas.height);

                this.eaten = false;
            }

            context.fillStyle   = this.foodFillColor;
            context.strokeStyle = this.foodStrokeColor;
            context.fillRect(this.foodX, this.foodY, this.size, this.size);
            context.strokeRect(this.foodX, this.foodY, this.size, this.size);
        }

        isEaten(){
            let snakeHead = this.snakeParts[0];
            if(this.foodX === snakeHead.x && this.foodY === snakeHead.y)
            {
                this.eaten = true;

                this.eatenAudio.play();
                this.updateFood();
            }
        }
    /* work with food and eat end */


    isDie(){
        let snakeHead = this.snakeParts[0];        
        let match     = this.snakeParts.filter(x=>JSON.stringify(x)==JSON.stringify(snakeHead));
        
        if((this.snakeParts.length-1)>this.defaultSnakeLength && match.length>=2)
        {
            this.togglePause();
            
            canvas.style.backgroundColor = canvasDangerBG;
            this.updateLife(-1);
            this.snakeParts.length = this.defaultSnakeLength;
            this.dieAudio.play();

            setTimeout(()=>{
                this.togglePause();
            }, this.dieAudio.duration*1000);
        }else{
            canvas.style.backgroundColor = canvasBG;
        }
    }

    update(){
        if(gameSpeedControll % this.gameSpeed == 0 && !this.isPause)
        {
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            this.drawSnake();
            this.snakeHeadControll();
            this.foodGenerate();
            this.isEaten();
            this.isDie();
        }
    }

    keyControll(){
        window.addEventListener('keyup', (e)=>{
            switch(e.key)
            {
                case "ArrowLeft":
                    this.directionX = -1;
                    this.directionY = 0;
                    break;

                case "ArrowRight":
                    this.directionX = 1;
                    this.directionY = 0;
                    break;

                case "ArrowUp":
                    this.directionX = 0;
                    this.directionY = -1;
                    break;

                case "ArrowDown":
                    this.directionX = 0;
                    this.directionY = 1;
                    break;
            }
        });
    }


    /* game pause and start */
        togglePause()
        {
            this.isPause = !this.isPause;
        }
    /* game pause and start */




    /* work with level, scoure, life etc... start */
    levelScroureMenegar()
    {
        this.level  = 1;
        this.food   = Math.floor((this.gameSpeed/3)*this.level);
        this.scoure = 0;
        this.life   = 2;
    }



    updateFood(){
        this.food--;
        if(this.food<=0)
        {
            this.updateLevel();
            this.food = Math.floor((this.gameSpeed/3)*this.level);
        }

        this.updateDom();
        this.updateScoure();
    }

    updateLevel(){
        this.level_upAudio.play();
        this.life += this.level;
        this.level++;
        this.snakeParts.length = this.defaultSnakeLength;

        this.updateSpeed();
    }

    updateSpeed(){
        this.gameSpeed -= 1;
    }

    updateScoure(){
        this.scoure += Math.floor((this.gameSpeed/2)-5);
    }

    updateLife(life=-1){
        this.life = this.life + life;
        if(this.life<=0)
        {
            this.levelScroureMenegar();
            console.log("Game Over");
            this.game_overAudio.play();
        }

        this.updateDom();
    }


    HTMLElement(){
        /* html element start */
            this.LifeElement   = document.getElementById('life');
            this.ScoureElement = document.getElementById('scoure');
            this.FoodElement   = document.getElementById('food');
            this.LevelElement  = document.getElementById('level');
        /* html element end */
        this.updateDom();
    }

    updateDom(){
        this.LifeElement.innerText   = this.life;
        this.ScoureElement.innerText = this.scoure;
        this.FoodElement.innerText   = this.food;
        this.LevelElement.innerText  = this.level;
    }
    /* work with level, scoure, life etc... end */
}







let snake = new Snake();
setInterval(()=>
{
    gameSpeedControll++;
    snake.update();
}, 1);



/* game pause and resume start*/
    let togglePause = document.getElementById('togglePause');
    togglePause.addEventListener('click', (e)=>
    {
        if(e.target.innerText === 'Start')
        {
            e.target.innerText = 'Pause';
        }else{
            e.target.innerText = 'Start';
            console.log(e.target.innerText);
        }

        snake.togglePause();
    });
/* game pause and resume end*/