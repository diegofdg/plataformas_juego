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
    this.x = 70;
    this.y = 70;

    this.vy = 0;
    this.vx = 0;

    this.gravedad = 0.5;
    this.friccion = 0.1;

    this.salto = 10;
    this.velocidad = 2;
    this.velocidadMaxima = 3;

    this.suelo = false;

    this.pulsaIzquierda = false;
    this.pulsaDerecha = false;   
    
    this.durezaRebote = 100;

    this.correccion = function(lugar){
        if(lugar === 1){
            this.y = (parseInt(this.y/altoF))*altoF;
        }
        if(lugar === 2){
            this.y = (parseInt(this.y/altoF)+1)*altoF;
        }
        if(lugar === 3){
            this.x = (parseInt(this.x/anchoF))*anchoF;
        }
        if(lugar === 4){
            this.x = (parseInt(this.x/anchoF)+1)*anchoF
        }
    }

    this.fisica = function(){
        if(this.suelo === false){
            this.vy += this.gravedad;
        } else {
            this.correccion(1);
            var rebote = parseInt(this.vy/this.durezaRebote);
            this.vy = 0 - rebote;
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

        if(this.vx > 0){
            if(this.colision(this.x + anchoF + this.vx,(this.y + 1))==true || this.colision(this.x + anchoF + this.vx,(this.y + altoF - 1))==true){
                if(this.x != parseInt(this.x/anchoF)*anchoF){
                    this.correccion(4)
                }      
                this.vx = 0;
            }
        }
        if(this.vx < 0){
            if(this.colision(this.x + this.vx,(this.y+ 1))==true || this.colision(this.x + this.vx,(this.y+ + altoF - 1))==true){
                this.correccion(3)
                this.vx = 0;
            }
        }

        this.y += this.vy;
        this.x += this.vx;

        if(this.vy >= 0){
            if((this.colision((this.x + 1),(this.y + altoF))==true) || (this.colision((this.x + anchoF - 1),(this.y + altoF))==true)){
                this.suelo = true;
            } else{
                this.suelo = false;
            }
        }
      
        if((this.colision((this.x + 1), this.y) == true) || (this.colision((this.x + anchoF - 1), this.y) == true)){
            this.correccion(2);
            this.vy = 0;      
        }
    }

    this.dibuja = function(){
        this.fisica();

        ctx.fillStyle = '#820c01';
        ctx.fillRect(this.x, this.y, anchoF, altoF);
    }

    this.colision = function(x,y){
        var colisiona = false;

        if(escenario[(parseInt(y/altoF))][(parseInt(x/anchoF))]===0){
            colisiona = true;
        }
        return colisiona;
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
    
    this.creaBloque = function(x,y){
        xBloque = parseInt(x/anchoF);
        yBloque = parseInt(y/altoF);
        colorBloque = escenario[yBloque][xBloque];
      
        if(colorBloque == 0){
            colorBloque = 2;
        } else {
            colorBloque = 0;
        }
      
        escenario[yBloque][xBloque] = colorBloque;      
    }
    
    this.previewBloque = function(){
        ctx.fillStyle = '#666666';
        ctx.fillRect(parseInt(ratonX/anchoF)*anchoF,parseInt(ratonY/altoF)*altoF,anchoF,altoF);
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

var ratonX = 0;
var ratonY = 0;

function clicRaton(e){
    console.log('raton pulsado');
}

function sueltaRaton(e){
    protagonista.creaBloque(ratonX,ratonY);
}

function posicionRaton(e){
    ratonX = e.pageX;
    ratonY = e.pageY;
}

function borraCanvas(){
    canvas.width = 750;
    canvas.height = 500;    
}

function inicializa(){    
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    protagonista = new jugador();

    canvas.addEventListener('mousedown',clicRaton,false);
    canvas.addEventListener('mouseup',sueltaRaton,false);
    canvas.addEventListener('mousemove',posicionRaton,false);

    document.addEventListener('keydown', function(tecla){
        if(tecla.key === 'ArrowUp'){
            protagonista.arriba();            
        }

        if(tecla.key === 'ArrowLeft'){
            protagonista.izquierda();        
        }

        if(tecla.key === 'ArrowRight'){
            protagonista.derecha();            
        }
    });

    document.addEventListener('keyup', function(tecla){        
        if(tecla.key === 'ArrowLeft'){
            protagonista.sueltaIzquierda();            
        }
        if(tecla.key === 'ArrowRight'){
            protagonista.sueltaDerecha();            
        }
    });

    setInterval(function(){
        principal();
    },1000/FPS);
}

function principal(){    
    borraCanvas();  
    dibujaEscenario();
    protagonista.previewBloque();
    protagonista.dibuja();    
}