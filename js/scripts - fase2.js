const cardElement = document.querySelectorAll(".card");

//Función para asignar el atributo data-id a cada card, en función del número de la pokédex y adquiriendo el número del nombre del archivo
//Primero obtenemos el id del pokémon desde el nombre del archivo
const getPokemonId = src => {
  const regex = /\/(\d+)\.png$/; //expresión regular que busca un número seguido por ".png" al final de la cadena
  const matches = src.match(regex);
  if (matches && matches.length === 2) {
    return matches[1];
  } else {
    alert("No se han podido obtener los id´s de todos los Pokémon");
  }
};

//Añadimos un atributo data con el id obtenido a caja tarjeta
const addDataAtribute = () => {
  for (let card of cardElement) {
    const pokemonId = getPokemonId(card.children[0].children[0].src);
    card.setAttribute("data-pokemonid", pokemonId); // ¿está bien utilizado?
  }
};

//Función para girar carta y mostrar pokémon
const showCard = card => {
  card.classList.add("card--show");
};

//Función para girar carta y ocultar pokémon
const hiddeCard = card => {
  card.classList.remove("card--show");
};

//Función para comprobar si las cartas son iguales cuando se han girado dos cartas
let idReceivedArray = [];
checkIfIdentical = card => {
  idReceivedArray.push(card.dataset.pokemonid);
  console.log(idReceivedArray);
  if (idReceivedArray.length !== 2) {
    return;
  }
  //Si las dos cartas son iguales asignamos un data-correct igual a true a la card
  if (idReceivedArray[0] === idReceivedArray[1]) {
    for (let card of cardElement) {
      if (card.dataset.pokemonid === idReceivedArray[0] && card.dataset.pokemonid === idReceivedArray[1]) {
        card.setAttribute("data-correct", true);
      }
    }
    //Si las cartas no coinciden las giramos
  } else {
    for (let card of cardElement) {
      if (!card.dataset.correct) {
        setTimeout(() => {
          hiddeCard(card);
        }, 2000);
      }
    }
  }
  //Reiniciamos la array de cartas giradas
  idReceivedArray = [];
};

//Función para girar carta al hacer click
for (let card of cardElement) {
  card.addEventListener("click", e => {
    showCard(e.target);
    checkIfIdentical(e.target);
  });
}

//Función para mostrar las cartas durante 2 segundos al iniciar el juego
const showCardAtStart = cardElement => {
  for (let card of cardElement) {
    showCard(card);
    setTimeout(() => {
      hiddeCard(card);
    }, 2000);
  }
};

showCardAtStart(cardElement);
addDataAtribute();

//¿Por qué no funciona setTimeout(hiddeCard(card), 2000);
