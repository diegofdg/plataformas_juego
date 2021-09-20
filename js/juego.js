var canvas;
var ctx;
var FPS = 50;

var anchoF = 50;
var altoF = 50;

var muro = '#044f14';
var tierra = '#c6892f';

var protagonista;

var escenario = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,2,0,0,2,2,0,0,0,0,2,2,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,0,0,0,0],
    [0,2,2,2,2,2,2,0,2,2,0,0,0,0,0],
    [0,2,2,2,2,2,0,0,0,2,2,2,2,2,0],
    [0,0,0,2,2,0,0,0,0,0,2,2,0,2,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var jugador = function(){
    this.x = 100;
    this.y = 100;

    this.vy = 0;
    this.vx = 0;

    this.gravedad = 0.5;
    this.friccion = 0.1;

    this.salto = 10;
    this.velocidad = 3;
    this.velocidadMaxima = 15;

    this.suelo = false;

    this.pulsaIzquierda = false;
    this.pulsaDerecha = false;

    this.colision = function(x,y){
        var colisiona = false;

        if(escenario[(parseInt(this.y/altoF))][(parseInt(this.x/anchoF))]===0){
            colisiona = true;
        }
        return colisiona;
    }

    this.fisica = function(){
        if(this.suelo === false){
            this.vy += this.gravedad;
        }

        if(this.pulsaDerecha === true && this.vx <= this.velocidadMaxima){
            this.vx += this.velocidad;
        }

        if(this.pulsaIzquierda === true && this.vx >= (0 - this.velocidadMaxima)){
            this.vx -= this.velocidad;
        }

        if(this.vx > 0){
            this.vx -= this.friccion;

            if(this.vx < 0){
                this.vx = 0;
            }
        }

        if(this.vx < 0){
            this.vx += this.friccion;

            if(this.vx > 0){
                this.vx = 0;
            }
        }

        if(this.vy > 0){
            if(this.colision(this.x, this.y + altoF) === true){
                this.suelo = true;
                this.vy = 0;
            }
        }

        this.y += this.vy;
        this.x += this.vx;
    }

    this.dibuja = function(){
        this.fisica();

        ctx.fillStyle = '#820c01';
        ctx.fillRect(this.x, this.y, anchoF, altoF);
    }

    this.arriba = function(){
        if(this.suelo === true){
            this.vy -= this.salto;
            this.suelo =false;
        }
    }

    this.derecha = function(){                
        this.pulsaDerecha = true;
    }

    this.izquierda = function(){
        this.pulsaIzquierda = true;
    }

    this.sueltaDerecha = function(){
        this.pulsaDerecha = false;
    }
    
    this.sueltaIzquierda = function(){
        this.pulsaIzquierda = false;
    }
}

function dibujaEscenario(){
    var color;
  
    for(y=0;y<10;y++){
        for(x=0;x<15;x++){    
            if(escenario[y][x]==0)
            color = muro;
    
            if(escenario[y][x]==2)
            color = tierra;
    
            ctx.fillStyle = color;
            ctx.fillRect(x*anchoF,y*altoF,anchoF,altoF);
        }
    }    
}

function borraCanvas(){
    canvas.width = 750;
    canvas.height = 500;    
}

function inicializa(){    
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    protagonista = new jugador();

    document.addEventListener('keydown', function(tecla){
        if(tecla.key === 'ArrowUp'){
            protagonista.arriba();
            console.log('arriba');
        }
        if(tecla.key === 'ArrowDown'){
            console.log('abajo');
        }
        if(tecla.key === 'ArrowLeft'){
            protagonista.izquierda();
            console.log('pulsa izquierda');
        }
        if(tecla.key === 'ArrowRight'){
            protagonista.derecha();
            
        }
    });

    document.addEventListener('keyup', function(tecla){        
        if(tecla.key === 'ArrowLeft'){
            protagonista.sueltaIzquierda();
            console.log('suelta izquierda');
        }
        if(tecla.key === 'ArrowRight'){
            protagonista.sueltaDerecha();
            console.log('suelta derecha');
        }
    });

    setInterval(function(){
        principal();
    },1000/FPS);
}

function principal(){    
    borraCanvas();  
    dibujaEscenario();
    protagonista.dibuja();    
}