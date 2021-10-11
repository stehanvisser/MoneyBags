const moneyBags = [
  {
    value: 500,
  },
  {
    value: 1000,
  },
  {
    value: 2000,
  },
  {
    value: 4000,
  },
  {
    value: 8000,
  },
  {
    value: 16000,
  },
  {
    value: 32000,
  },
  {
    value: 64000,
  },
  {
    value: 128000,
  },
  {
    value: 250000,
  },
  {
    value: 700,
  },
  {
    value: 1500,
  },
  {
    value: 5000,
  },
  {
    value: 10000,
  },
  {
    value: 800,
  },
  {
    value: 3000,
  },
];

const scene = {
  INIT: "init",
  SWAP: "swap",
};
let currentGameMoneyBags = [];
let selectedMoneyBag = {};
let randomMoneyBag = {};
let mainSceneElement;
let swapSceneElement;
let payoutSceneElement;

let headingElement = document.getElementById("heading");

window.onload = () => {
  initGame();
};

function initGame() {
  if (!mainSceneElement) {
    createMainScene();
  }

  currentGameMoneyBags = [...moneyBags];
  headingElement.innerHTML = "Select your money bag";
  shuffleBags(currentGameMoneyBags);
  drawMoneyBags(currentGameMoneyBags, mainSceneElement, scene.INIT);
}

function restartGame() {
  showPayoutSceneElement.remove();
  showPayoutSceneElement = "";
  initGame();
}

function createMainScene() {
  mainSceneElement = document.createElement("article");
  mainSceneElement.setAttribute("id", "main_scene");
  mainSceneElement.classList.add("moneybags-output-container");
  document.body.append(mainSceneElement);
}

function reloadGame() {
  location.reload();
}

function drawMoneyBags(moneyBags, element, state) {
  let func = "";
  let moneyBagsHtml = "";

  if (state === scene.INIT) {
    func = "moneyBagSelected";
  } else if (state === scene.SWAP) {
    func = "finalBagSelected";
  }

  moneyBags.map((moneyBag, index) => {
    moneyBagsHtml += `   <section class="moneyBag">
    <div class="number">${moneyBag?.id ? moneyBag.id : index + 1}</div>
    <img
      src="money-bag-sheet.png"
      class="pixelart moneybag-sprite"
      id="${moneyBag?.id ? moneyBag.id : index + 1}"
      onclick="${func}(event)"
    />
    <div>${moneyBag.value}</div>
  </section>`;
  });

  element.innerHTML = moneyBagsHtml;
}

function moneyBagSelected(event) {
  selectedMoneyBag = {
    id: event.target.id,
    value: currentGameMoneyBags[event.target.id - 1].value,
  };
  hideInitScene();
  setRandomMoneyBag();
  showNextScene();
}

function hideInitScene() {
  mainSceneElement.remove();
  mainSceneElement = document.getElementById("main_scene");
  headingElement.innerHTML = "";
}

function setRandomMoneyBag() {
  let randomIndex = Math.floor(Math.random() * currentGameMoneyBags.length);
  if ((randomIndex + 1).toString() === selectedMoneyBag.id) {
    setRandomMoneyBag();
    return;
  }

  randomMoneyBag = {
    id: (randomIndex + 1).toString(),
    value: currentGameMoneyBags[randomIndex].value,
  };
}

function showNextScene() {
  if (!swapSceneElement) {
    createSwapScene();
  }

  headingElement.innerHTML = `Do you want to swap your bag with bag ${randomMoneyBag.id} ?`;
  drawMoneyBags(
    [selectedMoneyBag, randomMoneyBag],
    swapSceneElement,
    scene.SWAP
  );
}

function createSwapScene() {
  swapSceneElement = document.createElement("article");
  swapSceneElement.setAttribute("id", "swap_scene");
  swapSceneElement.classList.add("swap-scene");
  document.body.append(swapSceneElement);
}

function finalBagSelected(event) {
  hideSwapScene();
  createPayoutScene();
  const moneyBags = [selectedMoneyBag, randomMoneyBag];
  const amountWon = currentGameMoneyBags[event.target.id - 1].value;
  const otherBag = moneyBags.find((bag) => bag.id !== event.target.id);

  headingElement.innerHTML = `You won R ${amountWon}. Other bag had R ${otherBag.value}`;

  showPayoutSceneElement.innerHTML =
    '<button onclick="restartGame()" class="btn"> REPLAY </button>';
}

function hideSwapScene() {
  swapSceneElement.remove();
  swapSceneElement = document.getElementById("swap_scene");
  headingElement.innerHTML = "";
}

function createPayoutScene() {
  showPayoutSceneElement = document.createElement("article");
  showPayoutSceneElement.setAttribute("id", "payout_scene");
  showPayoutSceneElement.classList.add("payout-scene");
  document.body.append(showPayoutSceneElement);
}

function shuffleBags(moneyBags) {
  let currentIndex = moneyBags.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [moneyBags[currentIndex], moneyBags[randomIndex]] = [
      moneyBags[randomIndex],
      moneyBags[currentIndex],
    ];
  }

  return moneyBags;
}
