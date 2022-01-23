const infoUser = new URLSearchParams(window.location.search);



const CATEGORIES_OPTIONS = {
  'celebrities': {
    1: 'Jack Sparrow',
    2: 'Antonio Banderas',
    3: 'Leonardo DiCaprio',
    4: 'George Clooney',
    5: 'Paco Leon',
    6: 'Pau Gasol',
    7: 'Marc Marquez',
    9: 'Cristiano Ronaldo',
    10: 'Lionel Messi',
    11: 'Angela Merkel',
    12: 'Ana de Armas',
    13: 'Angelina Jolie',
    14: 'Ana Morgade',
    15: 'Cristina Pedroche',
    16: 'Belen Esteban',
    17: 'Isabel Pantoja',
    18: 'Almudena Grandes',
    19: 'Pilar Rubio',
    20: 'Aitana'
  },
  'movies': {
    1: 'El Señor de los Anillos',
    2: 'Harry Potter',
    3: 'Star Wars',
    4: 'Alguien volo sobre el nido del cuco',
    5: 'Los otros',
    6: 'El horfanato',
    7: 'Las brujas de zugarramurdi',
    9: 'En tierra hostil',
    10: 'Los Goonies',
    11: 'Regreso al futuro',
    12: 'Venganza',
    13: 'A todo gas',
    14: 'Lo que el viento se llevo',
    15: 'La vida es bella',
    16: 'Cadena perpetua',
    17: 'El caballero oscuro',
    18: 'Big Fish',
    19: 'El club de los poetas muertos',
    20: 'Good morning Vietnam'
  },
  'songs': {
    1: 'Antes muerta que sencilla',
    2: 'Asereje',
    3: 'Por la raja de tu falda',
    4: 'Zapatillas',
    5: 'El informe del forense',
    6: 'A toda mecha',
    7: 'Sirenas',
    9: 'Californication',
    10: 'Smoke on the water',
    11: 'Paint in black',
    12: 'Yesterday',
    13: 'Yellow submarnie',
    14: 'American idiot',
    15: 'Lose yourself',
    16: 'Tu calorro',
    17: 'Sarandonga',
    18: 'Dont stop me know',
    19: 'Bohemian rapsody',
    20: 'Sarri sarri'
  }
}

let wordToDiscover = "";
let protectedWord = '';
let protectedArray;
let lettersToGet = 0;
let lettersDiscovered = [];
let maxLifes = 0;
let gameFinished = false;
const hiddenWord = document.getElementById('contLetras');
const hangmanDraw = document.getElementById('dibujohangman');
let letterToCheck = document.getElementById('teclado');
let showCategory = document.getElementById('showCategory');
let letFalladas = document.getElementById('letFalladas');

const CATEGORY = {
  'celebrities': CATEGORIES_OPTIONS['celebrities'],
  'movies': CATEGORIES_OPTIONS['movies'],
  'songs': CATEGORIES_OPTIONS['songs']
}

class Game{
  constructor(){
    this.name = "";
    this.move = '';
    this.rounds = 0;
    this.lifes = 0;
    this.alive = true;
  }

  updateLifes = () => {
    this.lifes -= 1;
  }

  startGame = () => {
    this.name = "";
    this.move = "";
    this.rounds = 0;
    this.lifes = 0;
  }

  setPlayerName = (playerName) => {
    this.name = playerName;
  }

  setPlayerMove = (playerMove) => {
    this.move = playerMove;
  }

  finishGame = () => {
    const showFinalMessage = this.lifes === 0 ? `Sorry ${this.name}... you didn't pass our game` : `Congratulations ${this.name}!! You've sourvived`;
    hiddenWord.innerHTML = showFinalMessage;
    gameFinished = true;
  }
}

class Hangman extends Game{
  constructor(){
    super();
  }

  startGame = () => {
    this.name = "";
    this.move = "";
    this.rounds = 0;
    this.lifes = 0;
    protectedWord = "";
  }

  getUserName = () => {
    const userName = infoUser.get('getName');
    
    return userName;
  }

  getUserCategory = () => {
    const userCategory = infoUser.get('categories');
    showCategory.innerHTML = userCategory.toUpperCase();

    return userCategory;
  }

  getUserLevel = () => {
    const userLevel = infoUser.get('difficulty');

    return userLevel;
  }

  setMaximumLifes = (userLevel) => { 
    switch (userLevel){
      case 'easy': 
        this.lifes = 7;
        maxLifes = 7;
        break;
      case 'medium': 
        this.lifes = 5;
        maxLifes = 5;
        break;
      case 'hard': 
        this.lifes = 3;
        maxLifes = 3;
        break
    }
  }

  getWordtoKnow = (category) => {
    const regex = new RegExp (/[A-Za-z]/g);
    const choosedCat =  CATEGORY[category];
    const randomNum = Math.ceil(Math.random()*21);
    const choosedWord = choosedCat[randomNum];
    wordToDiscover = choosedWord.toUpperCase();
    const lettersToGetArray = wordToDiscover.split(' ').join('')
    lettersToGet = lettersToGetArray.length;
    console.log(lettersToGet);
  }

  protectAndShowWord = (word) => {
    const showInstead = "_"
    const regex = new RegExp (/[A-Za-z]/g);
    protectedWord = word.replaceAll(regex, showInstead)
    protectedArray = protectedWord.split('');
    hiddenWord.innerHTML = protectedWord;
  }

  getLetter = (letter) => {
    if (gameFinished){
      alert('THE GAME HAS FINISHED, GO BACK TO MENU'); 

    } else {
      this.move = letter;
      this.checkIfLetterIs(this.move);
    }   
  }

  checkIfLetterIs = (letter) => {
    const isLetter = wordToDiscover.includes(letter) ? true : false;

    if (lettersDiscovered.includes(letter)){
      alert('ALREADY CHOOSEN LETTER');

    } else if (isLetter){
      alert('CORRECT!')
      
      for (let i = 0; i < wordToDiscover.length; i++){
        if (wordToDiscover[i] === letter) {
           protectedArray[i] = letter
           lettersDiscovered.push(letter);
        }
      }
      console.log(lettersDiscovered);

      hiddenWord.innerHTML = protectedArray.join('');
      this.checkFinish();

    } else {
      alert('YOU FAILED')
      letFalladas.innerHTML += letter;
      this.updateLifes();
      this.changeDraw(this.lifes);
      this.checkFinish();
    }
  }

  checkFinish = () => {
    this.lifes === 0 || lettersDiscovered.length === lettersToGet ? this.finishGame() : this.nextRound();
  }

  nextRound = () => {
    this.move = "";
    this.rounds += 1;
  } 

  changeDraw = (status) =>{
    if (maxLifes === 7){
      switch (status) {
        case 0: 
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado7.png')";
          break;
        case 1:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado6.png')";
          break;
        case 2:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado5.png')";
          break;
        case 3:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado4.png')";
          break;
        case 4:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado3.png')";
          break;
        case 5:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado2.png')";
          break;  
        case 6:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado1.png')";
          break; 
        case 7:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado0.png')";
          break;   
      }
    } else if (maxLifes === 5){
      switch (status) {
        case 0: 
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado07.png')";
          break;
        case 1:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado6.png')";
          break;
        case 2:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado5.png')";
          break;
        case 3:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado3.png')";
          break;
        case 4:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado1.png')";
          break;
        case 5:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado0.png')";
          break;
      }
    } else if (maxLifes === 3){
      switch (status) {
        case 0: 
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado07.png')";
          break;
        case 1:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado5.png')";
          break;
        case 2:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado3.png')";
          break;
        case 3:
          hangmanDraw.style.backgroundImage = "url('./images/ahorcado0.png')";
          break;
      }
    }
  }
}


const myHangman = new Hangman();

myHangman.startGame();
myHangman.setPlayerName(myHangman.getUserName());
myHangman.getWordtoKnow(myHangman.getUserCategory());
myHangman.setMaximumLifes(myHangman.getUserLevel());
myHangman.protectAndShowWord(wordToDiscover);
myHangman.changeDraw(myHangman.lifes);

// FUNCIONES CLICK LETRA

let letterA = document.getElementById('A')
letterA.onclick = () => myHangman.getLetter('A');
let letterB = document.getElementById('B')
letterB.onclick = () => myHangman.getLetter('B');
let letterC = document.getElementById('C')
letterC.onclick = () => myHangman.getLetter('C');
let letterD = document.getElementById('D')
letterD.onclick = () => myHangman.getLetter('D');
let letterE = document.getElementById('E')
letterE.onclick = () => myHangman.getLetter('E');
let letterF = document.getElementById('F')
letterF.onclick = () => myHangman.getLetter('F');
let letterG = document.getElementById('G')
letterG.onclick = () => myHangman.getLetter('G');
let letterH = document.getElementById('H')
letterH.onclick = () => myHangman.getLetter('H');
let letterI = document.getElementById('I')
letterI.onclick = () => myHangman.getLetter('I');
let letterJ = document.getElementById('J')
letterJ.onclick = () => myHangman.getLetter('J');
let letterK = document.getElementById('K')
letterK.onclick = () => myHangman.getLetter('K');
let letterL= document.getElementById('L')
letterL.onclick = () => myHangman.getLetter('L');
let letterM = document.getElementById('M')
letterM.onclick = () => myHangman.getLetter('M');
let letterN = document.getElementById('N')
letterN.onclick = () => myHangman.getLetter('N');
let letterÑ = document.getElementById('Ñ')
letterÑ.onclick = () => myHangman.getLetter('Ñ');
let letterO = document.getElementById('O')
letterO.onclick = () => myHangman.getLetter('O');
let letterP = document.getElementById('P')
letterP.onclick = () => myHangman.getLetter('P');
let letterQ = document.getElementById('Q')
letterQ.onclick = () => myHangman.getLetter('Q');
let letterR = document.getElementById('R')
letterR.onclick = () => myHangman.getLetter('R');
let letterS = document.getElementById('S')
letterS.onclick = () => myHangman.getLetter('S');
let letterT = document.getElementById('T')
letterT.onclick = () => myHangman.getLetter('T');
let letterU = document.getElementById('U')
letterU.onclick = () => myHangman.getLetter('U');
let letterV = document.getElementById('V')
letterV.onclick = () => myHangman.getLetter('V');  
let letterW = document.getElementById('W')
letterW.onclick = () => myHangman.getLetter('W');
let letterX = document.getElementById('X')
letterX.onclick = () => myHangman.getLetter('X');
let letterY = document.getElementById('Y')
letterY.onclick = () => myHangman.getLetter('Y');
let letterZ = document.getElementById('Z')
letterZ.onclick = () => myHangman.getLetter('Z');



