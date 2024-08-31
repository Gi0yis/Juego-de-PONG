// Variables para las raquetas y la pelota
let raquetaJugadorX, raquetaJugadorY;
let raquetaComputadoraX, raquetaComputadoraY;
let pelotaX, pelotaY;
let pelotaDiametro = 20;
let pelotaVelocidadX = 5, pelotaVelocidadY = 5;
let pelotaAngulo = 0;  // Ángulo de rotación de la pelota
let velocidadRotacion = 0.1;  // Velocidad de rotación de la pelota
let raquetaAncho = 10, raquetaAlto = 100;
let velocidadComputadora = 3;

// Variables para la puntuación
let puntuacionJugador = 0, puntuacionComputadora = 0;

// Variables para los marcos
let marcoAncho = 10;

// Variables para los sonidos, la narración y el fondo
let sonidoRebote, sonidoGol, narradorActivo;
let fondo1, fondo2, fondoActual;
let mensajesComputadoraGanando = ["Tú ere manco como Yair 17", "Que nub", "Por jugar free fire", "JA, JA, JA", "manco"];
let mensajesComputadoraPerdiendo = ["El diablooo, que insano", "Eso tilino"];
let mensajesEmpate = ["Demuestra que eres insano", "Vamos un jugador de free nunca se rinde"];

function preload() {
    // Cargar imágenes y sonidos
    fondo1 = loadImage('sprites/fondo1.png');
    fondo2 = loadImage('sprites/fondo2.png');
    fondoActual = fondo1;  // Iniciar con el primer fondo
    barraJugador = loadImage('sprites/barra1.png');
    barraComputadora = loadImage('sprites/barra2.png');
    bola = loadImage('sprites/bola.png');
    sonidoRebote = loadSound('audios/446100__justinvoke__bounce.wav');
    sonidoGol = loadSound('audios/173859__jivatma07__j1game_over_mono.wav');
}

function setup() {
    createCanvas(800, 400);
    resetPelota();
    raquetaJugadorX = 10;
    raquetaJugadorY = height / 2 - raquetaAlto / 2;
    raquetaComputadoraX = width - raquetaAncho - 10;
    raquetaComputadoraY = height / 2 - raquetaAlto / 2;
}

function draw() {
    // Mostrar el fondo actual
    image(fondoActual, 0, 0, width, height);

    fill(color("#2B3FD6"));
    rect(0, 0, width, marcoAncho);
    rect(0, height - marcoAncho, width, marcoAncho);

    image(barraJugador, raquetaJugadorX, raquetaJugadorY, raquetaAncho, raquetaAlto);
    image(barraComputadora, raquetaComputadoraX, raquetaComputadoraY, raquetaAncho, raquetaAlto);

    let velocidadTotal = sqrt(pelotaVelocidadX ** 2 + pelotaVelocidadY ** 2);
    pelotaAngulo += velocidadTotal * velocidadRotacion;

    push();
    translate(pelotaX, pelotaY);
    rotate(pelotaAngulo);
    image(bola, -pelotaDiametro / 2, -pelotaDiametro / 2, pelotaDiametro, pelotaDiametro);
    pop();

    pelotaX += pelotaVelocidadX;
    pelotaY += pelotaVelocidadY;

    // Rebote de la pelota en los marcos superior e inferior
    if (pelotaY - pelotaDiametro / 2 < marcoAncho || 
        pelotaY + pelotaDiametro / 2 > height - marcoAncho) {
        pelotaVelocidadY *= -1;
    }

    // Rebote en la raqueta del jugador
    if (pelotaX - pelotaDiametro / 2 < raquetaJugadorX + raquetaAncho &&
        pelotaY > raquetaJugadorY && pelotaY < raquetaJugadorY + raquetaAlto) {
        if (pelotaVelocidadX < 0) {  // Solo rebota si la pelota se mueve hacia la raqueta
            calcularRebote(raquetaJugadorY);
            pelotaVelocidadX *= -1;
            sonidoRebote.play();
        }
        // Ajuste para evitar que la pelota quede atrapada
        pelotaX = raquetaJugadorX + raquetaAncho + pelotaDiametro / 2;
    }

    // Rebote en la raqueta de la computadora
    if (pelotaX + pelotaDiametro / 2 > raquetaComputadoraX &&
        pelotaY > raquetaComputadoraY && pelotaY < raquetaComputadoraY + raquetaAlto) {
        if (pelotaVelocidadX > 0) {  // Solo rebota si la pelota se mueve hacia la raqueta
            calcularRebote(raquetaComputadoraY);
            pelotaVelocidadX *= -1;
            sonidoRebote.play();
        }
        // Ajuste para evitar que la pelota quede atrapada
        pelotaX = raquetaComputadoraX - pelotaDiametro / 2;
    }

    // Puntuación y reinicio de la pelota si se sale del campo
    if (pelotaX < 0) {
        puntuacionComputadora++;
        sonidoGol.play();
        narrarPuntuacion();
        cambiarFondoYDificultad();
        resetPelota();
    } else if (pelotaX > width) {
        puntuacionJugador++;
        sonidoGol.play();
        narrarPuntuacion();
        cambiarFondoYDificultad();
        resetPelota();
    }

    // Movimiento de la raqueta del jugador
    if (keyIsDown(UP_ARROW)) {
        raquetaJugadorY -= 10;
    }
    if (keyIsDown(DOWN_ARROW)) {
        raquetaJugadorY += 10;
    }
    raquetaJugadorY = constrain(raquetaJugadorY, marcoAncho, height - raquetaAlto - marcoAncho);

    // Movimiento de la raqueta de la computadora
    if (pelotaY > raquetaComputadoraY + raquetaAlto / 2) {
        raquetaComputadoraY += velocidadComputadora;
    } else if (pelotaY < raquetaComputadoraY + raquetaAlto / 2) {
        raquetaComputadoraY -= velocidadComputadora;
    }
    raquetaComputadoraY = constrain(raquetaComputadoraY, marcoAncho, height - raquetaAlto - marcoAncho);

    // Mostrar puntuación
    textSize(32);
    fill(color("#2B3FD6"));
    text(puntuacionJugador, width / 2 - 50, 50);
    text(puntuacionComputadora, width / 2 + 30, 50);
}

function calcularRebote(raquetaY) {
    let puntoImpacto = pelotaY - raquetaY;
    let impactoNormalizado = (puntoImpacto / raquetaAlto) - 0.5;
    let anguloRebote = impactoNormalizado * (PI / 3);
    let velocidad = 15;
    pelotaVelocidadY = velocidad * sin(anguloRebote);
    // Evitar que la pelota tenga una velocidad Y nula
    if (abs(pelotaVelocidadY) < 2) {
        pelotaVelocidadY = 2 * Math.sign(pelotaVelocidadY);
    }
}

function resetPelota() {
    pelotaX = width / 2;
    pelotaY = height / 2;
    pelotaVelocidadX *= -1;
    pelotaVelocidadY = random([-5, 5]);  // Evitar que la pelota se mueva en línea recta
    pelotaAngulo = 0;
}

function narrarPuntuacion() {
    if (narradorActivo) {
        window.speechSynthesis.cancel();
    }
    let narrador = new SpeechSynthesisUtterance();
    narrador.text = `${puntuacionJugador} a ${puntuacionComputadora}`;
    
    if (puntuacionComputadora > puntuacionJugador) {
        let mensaje = mensajesComputadoraGanando[Math.floor(Math.random() * mensajesComputadoraGanando.length)];
        narrador.text += `. ${mensaje}`;
    } else if (puntuacionJugador > puntuacionComputadora) {
        let mensaje = mensajesComputadoraPerdiendo[Math.floor(Math.random() * mensajesComputadoraPerdiendo.length)];
        narrador.text += `. ${mensaje}`;
    } else {
        let mensaje = mensajesEmpate[Math.floor(Math.random() * mensajesEmpate.length)];
        narrador.text += `. ${mensaje}`;
    }

    narrador.lang = 'es-ES';
    narradorActivo = narrador;
    window.speechSynthesis.speak(narrador);
}

function cambiarFondoYDificultad() {
    let totalPuntos = puntuacionJugador;

    // Cambiar el fondo cada 10 puntos
    if (totalPuntos == 0) {
        image(fondoActual, 0, 0, width, height);
    } else if (totalPuntos % 10 === 0) {
        fondoActual = (fondoActual === fondo1) ? fondo2 : fondo1;

        // Aumentar la velocidad de la pelota y la computadora
        pelotaVelocidadX += Math.sign(pelotaVelocidadX);  // Aumentar la magnitud de la velocidad
        velocidadComputadora += 1;  // Aumentar la velocidad de la raqueta de la computadora
    }
}