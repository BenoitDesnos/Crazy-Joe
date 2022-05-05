const canvas = document.getElementById("canvas");
const header = document.querySelector("header");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/road-car.png";

// general settings
let gamePlaying = false;

const speed = 16;
const size = [88, 175];
const left = -150;
const right = 150;
const carPosStart = canvas.height / 1.3;

// car settings

let index = 0,
  bestScore = 0,
  currentScore = 0,
  carGap = 400,
  currentScoreDisplay = 0,
  car,
  carsColor = 0,
  cars = [],
  levels,
  speedAcceleratorCars,
  speedAcceleratorRoad,
  roadPosition = canvas.width / 2 - size[0] / 2,
  midPosition = canvas.width / 2 - size[0] / 2,
  directionLeft = roadPosition + left,
  directionRight = roadPosition + right;

// randomize cars apparitions 2 cars following on the same road prevented

let random = Math.random();
const carLoc = () => {
  if (random < 0.2) {
    random = Math.random() + 0.2;
    return midPosition + left;
  } else if (random <= 0.8) {
    random = Math.floor(Math.random() * 2);
    return midPosition;
  } else {
    random = Math.random() - 0.2;
    return midPosition + right;
  }
};
// local storage onload
(() => {
  if (localStorage.best) {
    bestScore = localStorage.best;
  }
})();

//
const setup = () => {
  currentScore = 0;
  levels = 20;
  speedAcceleratorCars = 2.4;
  speedAcceleratorRoad = 1.9;
  carsColor = 0;
  cars = Array(3)
    .fill()
    .map((a, i) => [carLoc(), -canvas.height * 2 + i * (carGap + size[1])]);
  window.removeEventListener("keydown", controls);
};
// background first part
const render = () => {
  // make the road and the cars moving
  index++;

  // background first part
  if (gamePlaying) {
    window.addEventListener("keydown", controls);
    ctx.drawImage(
      img,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      (index * (speed / speedAcceleratorRoad)) % canvas.height,
      canvas.width,
      canvas.height
    );

    // background second part
    ctx.drawImage(
      img,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      ((index * (speed / speedAcceleratorRoad)) % canvas.height) -
        canvas.height,
      canvas.width,
      canvas.height
    );
  } else {
    window.removeEventListener("keydown", controls);
    ctx.drawImage(
      img,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
  roadPosition = Math.min(directionRight, roadPosition);
  roadPosition = Math.max(directionLeft, roadPosition);

  // cars display
  if (gamePlaying) {
    cars.map((car) => {
      //Augmente difficulté tous les 20 points & change couleurs voitures tous les 40 points
      if (currentScore > levels) {
        levels += 20;
        carsColor++;
        speedAcceleratorCars -= 0.2;
        speedAcceleratorRoad -= 0.16;
        console.log("test");
      }
      car[1] += speed / speedAcceleratorCars;
      switch (carsColor) {
        case 2:
        case 3:
          ctx.drawImage(
            img,
            size[0] + 57,
            canvas.height,
            ...size,
            car[0],
            car[1],
            ...size
          );
          break;
        case 4:
        case 5:
          ctx.drawImage(
            img,
            size[0] + 57,
            canvas.height + size[1] + 40,
            ...size,
            car[0],
            car[1],
            ...size
          );
          break;
        case 6:
        case 7:
        case 8:
        case 9:
          ctx.drawImage(
            img,
            0,
            canvas.height + size[1] + 40,
            ...size,
            car[0],
            car[1],
            ...size
          );
          break;

        default:
          ctx.drawImage(
            img,
            0,
            canvas.height,
            ...size,
            car[0],
            car[1],
            ...size
          );
          break;
      }
      // take one point+create new car
      if (cars[2][1] >= canvas.height) {
        currentScore++;

        // check if it's the best score
        bestScore = Math.max(bestScore, currentScore);

        // dans le tableau cars carLoc se lance deux fois, ne sachant pas pourquoi j'ai crée une variable afin que la fonction ne se lance qu'une seule fois
        let carLocPlayedOnce = carLoc();

        carGap = Math.floor(Math.random() * 150 + 250);

        // remove & create new car
        cars = [
          [carLocPlayedOnce, cars[cars.length - 3][1] - carGap - +size[1]],
          ...cars.slice(0, -1),
        ];
      }

      // if hit cars, end
      if (
        [
          cars[2][1] >= canvas.height - size[1] * 2,
          cars[2][0] === roadPosition,
        ].every((elem) => elem)
      ) {
        currentScoreDisplay = currentScore;
        gamePlaying = false;
        setup();
      }
    });
  }
  // draw our Car
  if (gamePlaying) {
    ctx.drawImage(
      img,
      0,
      canvas.height,
      ...size,
      roadPosition,
      carPosStart,
      ...size
    );
  } else {
    ctx.drawImage(
      img,
      0,
      canvas.height,
      ...size,
      roadPosition,
      carPosStart,
      ...size
    );
    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    ctx.fillText(`Votre Score : ${currentScoreDisplay}`, 90, 285);
    ctx.fillText("Appuyez sur entrée ", 70, 500);
    ctx.fillText("pour commencer", 105, 540);
    ctx.font = "bold 30px courier";
    localStorage.best = bestScore;
  }
  document.getElementById("bestScore").innerHTML = `Meilleur : ${bestScore}`;
  document.getElementById(
    "currentScore"
  ).innerHTML = `Actuel : ${currentScore}`;
  window.requestAnimationFrame(render);
};
//  driving car

function controls(e) {
  if (e.key == "ArrowLeft") {
    roadPosition += left;
  } else if (e.key == "ArrowRight") {
    roadPosition += right;
  }
}

// launch setup
setup();
img.onload = render;
document.body.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    if (gamePlaying) {
      gamePlaying = false;
    } else {
      gamePlaying = true;
    }
  }
});
// redCar
/*  ctx.drawImage(
   img,
   0,
   canvas.height,
   ...size,
   roadPosition,
   carPosStart,
   ...size
 ); */
// blueCar
/* ctx.drawImage(
   img,
   size[0] + 57,
   canvas.height,
   ...size,
   roadPosition,
   carPosStart,
   ...size
 ); */

// greenCar
/* ctx.drawImage(
   img,
   size[0] + 57,
   canvas.height + size[1] + 40,
   ...size,
   roadPosition,
   carPosStart,
   ...size
 ); */
// yellow car
/* ctx.drawImage(
   img,
   0,
   canvas.height + size[1] + 40,
   ...size,
   roadPosition,
   carPosStart,
   ...size
 ); */
