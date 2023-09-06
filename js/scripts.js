const formDifficultyButtonElement = document.querySelector(".form-difficulty__submit");
const modalDifficultyFormElement = document.querySelector(".modal-difficulty");
const formGenerationButtonElement = document.querySelector(".form-generations__submit");
const modalGenerationFormElement = document.querySelector(".modal-generations");
const gameBoardElement = document.querySelector(".game-board");
let cardsElements = "";
const totalPointsElement = document.querySelector(".info-game__total");
const roundElement = document.querySelector(".info-game__round");
const multiplierElement = document.querySelector(".info-game__multiplier");
const failsElement = document.querySelector(".info-game__fails");
const modalRoundElement = document.querySelector(".modal-round");
const modalFinalElement = document.querySelector(".modal-final");
const endGameInfoElement = document.querySelector(".info-win");
const buttonPlayAgainElement = document.getElementById("info-win__button");
const tbodyTableElement = document.querySelector(".modal-final__table__tbody");
const tfootTableElement = document.querySelector(".modal-final__table__tfoot");

let totalPoints = 0;
let multiplier = 1;
let fails = 0;
let correct = 0;
let movements = 0;
let round = 0;

//Establecemos dos variables que contendrán el número mínimo y máximo que se corresponden a los id´s de los Pokémon seleccionados en función de la generación elegida, para posteriormente generar la array con las cartas obtenidas
let minPokemonId = 0;
let maxPokemonId = 0;

//Asigmanos valores a las constantes minPokemonId y maxPokemonId en función de la generación seleccionada

formGenerationButtonElement.addEventListener("click", e => {
  e.preventDefault();
  if (e.target.previousElementSibling.children[0].checked) {
    minPokemonId = 1;
    maxPokemonId = 151;
  } else if (e.target.previousElementSibling.children[2].checked) {
    minPokemonId = 152;
    maxPokemonId = 251;
  } else {
    minPokemonId = 906;
    maxPokemonId = 1012;
  }
  modalGenerationFormElement.classList.remove("show");
  modalDifficultyFormElement.classList.add("show");
});

//Generamos una variable con el número de cartas que cambiará en función de la dificultad del juego
let numberOfCards = 0;

//Generamos una variables con los segundos que permanecerán giradas las cartas al inicio del juego, y que variará en función de la dificultad seleccionada
let showCardTime = 2000;

//Función para establecer el número de cartas y el tiempo que se giran en función de la dificultad seleccionada
const setDifficulty = value => {
  if (value === "easy") {
    showCardTime = 5000;
    numberOfCards = 3;
  } else if (value === "normal") {
    showCardTime = 3000;
    numberOfCards = 6;
  } else {
    showCardTime = 2000;
    numberOfCards = 9;
  }
};

//Asignamos la función para elegir la dificultad al inicio del juego
formDifficultyButtonElement.addEventListener("click", e => {
  e.preventDefault();
  setDifficulty(e.target.previousElementSibling.value);
  restartGame();
  modalDifficultyFormElement.classList.remove("show");
});

//Vamos a generar un número aleatorio entre el máximo y el mínimo seleccionados en función de la dificultad, que son las id´s de los pokémon que están disponibles para jugar
const generateRandomNumber = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//Función para mostrar pokémon
const showCard = card => {
  card.classList.add("card--show");
};

//Función para calcular los puntos
const calculatePoints = () => {
  totalPoints = totalPoints + multiplier * 10;
  totalPointsElement.textContent = totalPoints;
};

//Función para mostrar la pantalla de fin de ronda
const showRoundInfo = () => {
  modalRoundElement.classList.add("show");
  const infoTotalPoints = document.createElement("p");
  infoTotalPoints.textContent = `Has conseguido ${totalPoints} puntos`;
  endGameInfoElement.append(infoTotalPoints);
  const movementsFails = document.createElement("p");
  movementsFails.textContent = `Has hecho un total de ${movements} movimientos con ${fails} fallos`;
  endGameInfoElement.append(movementsFails);
};

//Creamos una array donde almacenamos las puntuaciones de cada ronda
let roundPointsArray = [];

//Calculamos la puntuación final
let totalScore = 0;
const calcTotalScore = () => {
  totalScore = roundPointsArray.reduce((acc, number) => {
    return acc + number;
  });
};

//Función para mostrar la pantalla de fin de juego
const showFinalScore = array => {
  modalFinalElement.classList.add("show");
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < array.length; i++) {
    const newTr = document.createElement("tr");
    const tdRound = document.createElement("td");
    tdRound.textContent = "Round " + (i + 1);
    const tdPoints = document.createElement("td");
    tdPoints.textContent = array[i];
    newTr.append(tdRound);
    newTr.append(tdPoints);
    fragment.append(newTr);
  }
  tbodyTableElement.append(fragment);
  const trFoot = document.createElement("tr");
  const thTotal = document.createElement("th");
  thTotal.textContent = "Total";
  const tdTotal = document.createElement("td");
  calcTotalScore();
  tdTotal.textContent = totalScore;
  trFoot.append(thTotal);
  trFoot.append(tdTotal);
  tfootTableElement.append(trFoot);
};

//Mostrar información al finalizar la ronda o la partida
const showModalEndGame = () => {
  if (round !== 5) {
    showRoundInfo();
  } else {
    showFinalScore(roundPointsArray);
  }
};

//Función para reiniciar array después de que se hayan girado las cartas para que el usuario no pueda hacer click en más cartas mientras haya dos giradas
const resetIdReceivedArray = () => {
  setTimeout(() => {
    idReceivedArray = [];
    clearTimeout(resetIdReceivedArray);
  }, 600);
};

//Función para comprobar si las cartas son iguales cuando se han girado dos cartas
let idReceivedArray = [];
const checkIfIdentical = card => {
  idReceivedArray.push(card.dataset.pokemonid);
  if (idReceivedArray.length !== 2) {
    return;
  }
  //Si las dos cartas son iguales asignamos un data-correct igual a true a la cards
  if (idReceivedArray[0] === idReceivedArray[1]) {
    for (let card of cardsElements) {
      if (card.dataset.pokemonid === idReceivedArray[0] && card.dataset.pokemonid === idReceivedArray[1]) {
        card.setAttribute("data-correct", true);
      }
    }
    calculatePoints();
    multiplier++;
    correct++;
    //Si las cartas no coinciden las giramos
  } else {
    for (let card of cardsElements) {
      if (!card.dataset.correct) {
        hideCards(card);
      }
    }
    fails++;
    multiplier = 1;
    failsElement.textContent = fails;
  }
  movements++;

  //Cuando se hayan girado todas las cartas se muestra la pantalla de fin de juego
  if (correct === idToPlayArray.length / 2) {
    //Añadimos la puntuación a la array de puntuaciones
    roundPointsArray.push(totalPoints);
    showModalEndGame();
  }

  //Función para mostrar el multiplicador de puntos a medida que se acumulan aciertos
  if (multiplier === 1) {
    multiplierElement.parentElement.classList.add("hide");
  } else {
    multiplierElement.parentElement.classList.remove("hide");
    multiplierElement.textContent = "x" + multiplier;
  }
  //Reiniciamos la array de cartas giradas
  resetIdReceivedArray();
};

//Función para girar carta al hacer click
const selectCard = card => {
  card.addEventListener("click", e => {
    console.log(card.className === "card card--show");
    //Evitamos que el usuario pueda hacer click cuando haya dos cartas giradas y se esté comprobando si son iguales
    if (idReceivedArray.length === 2) {
      return;
      //Evitamos que el usuario pueda hacer click cuando la carta esté girada
    } else if (card.className === "card card--show") {
      return;
    } else {
      showCard(e.target);
      checkIfIdentical(e.target);
    }
  });
};

//Creamos las card con las imágenes cuyo nombre de archivo coincida con los id´s almacenados en la array
let idToPlayArray = [];
const insertCardInBoard = array => {
  const fragment = document.createDocumentFragment();
  array.forEach(number => {
    const newDivCard = document.createElement("div");
    newDivCard.classList.add("card");
    newDivCard.setAttribute("data-pokemonid", number);
    const newDivCardFront = document.createElement("div");
    newDivCardFront.classList.add("card__front");
    const newDivCardBack = document.createElement("div");
    newDivCardBack.classList.add("card__back");
    const newImg = document.createElement("img");
    newImg.classList.add("card__image");
    newImg.src = "assets/images/" + number + ".png";
    newDivCardFront.append(newImg);
    newDivCard.append(newDivCardFront, newDivCardBack);
    fragment.append(newDivCard);
  });
  gameBoardElement.append(fragment);

  //Creamos el elemento cardElement para que se incluyan los nuevos div generados
  cardsElements = document.querySelectorAll(".card");
  for (let card of cardsElements) {
    selectCard(card);
  }
};

//Guardamos las id´s obtenidas en un array, duplicando cada uno de los id´s obtenidos. Evitamos que las cartas salgan repetidas.
const getInitialCards = () => {
  for (let i = 1; i <= numberOfCards; i++) {
    const idToAdd = generateRandomNumber(maxPokemonId, minPokemonId);
    if (!idToPlayArray.includes(idToAdd)) {
      idToPlayArray.push(idToAdd);
      idToPlayArray.unshift(idToAdd);
    } else {
      idToPlayArray = [];
      return getInitialCards();
    }
  }
  //Desordenar array
  idToPlayArray.sort(() => Math.random() - 0.5);
  insertCardInBoard(idToPlayArray);
};

//Función para girar carta y ocultar pokémon
const hideCards = card => {
  setTimeout(() => {
    card.classList.remove("card--show");
    card.removeAttribute("data-correct");
    clearTimeout(hideCards);
  }, 500);
};

//Función para mostrar las cartas durante x segundos (variables en función de la dificultad elegida) al inicio y volverlas a ocultar
const showAllCardsAtStar = () => {
  cardsElements.forEach(card => card.classList.add("card--show"));
};
const hideAllCardsAtStar = () => {
  cardsElements.forEach(card => card.classList.remove("card--show"));
};

const showHideCardsAtStart = () => {
  showAllCardsAtStar();
  setTimeout(hideAllCardsAtStar, showCardTime);
};

//Función para restaurar contadores, cartas, etc
const restartGame = () => {
  gameBoardElement.textContent = "";
  endGameInfoElement.textContent = "";
  totalPoints = 0;
  totalPointsElement.textContent = totalPoints;
  round++;
  roundElement.textContent = round + "/5";
  multiplier = 1;
  multiplierElement.parentElement.classList.add("hide");
  fails = 0;
  failsElement.textContent = fails;
  correct = 0;
  movements = 0;
  idToPlayArray = [];
  getInitialCards();
  showHideCardsAtStart();
};

//Añadimos el evento al hacer click en el botón "jugar de nuevo"
buttonPlayAgainElement.addEventListener("click", () => {
  modalRoundElement.classList.remove("show");
  restartGame();
});
