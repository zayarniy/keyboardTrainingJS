const GAME_STATUS = { MENU: 0, PAUSE: 1, PLAY: 2, GAMEOVER: 3 }


const GAME_SYMBOLS = ['F2', 'F3', 'F4', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'TAB',
    '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '{', '}', ';', `'`, ':', '"', '|', '\\',
    '<', '>', '?', '/', '*', '-', '+', '.', 'Insert', 'Home', 'Delete', 'End', 'PageUp', 'PageDown', 'Control', 'Alt', 'Shift', 'Backspace'
];
const COLOR_PRESSED_KEY = '#777777'



// Получаем контейнер для символа
let container;
let symbols = [];
let moveSymbolsArray = []
let qwertyKeyboard;
let keyboardTraining;
let keyboardFillColors = {};
let keyLocked = false;

let data =
{
    timeStart: '',
    timeDuration: '00:00:00',
    formatedTimeStart: '00:00:00',
    score: 0,
    wrongPressed: 0,
    percent: 0,
    //grade: 0,
    symbolsOnScreen: 0,
    symbolsPressed: 0,
    lastKeyPressed: '',
    timeLeft:180,
    setWrongPressScore: -500,
    setDontPressScore: -1000,
    set5GradeScore: 20000,
    set4GradeScore: 16000,
    set3GradeScore: 10000,
    set2GradeScore: 6000
}


function load() {
    keyboardTraining = new Vue(
        {
            el: '#app',
            data,
            computed:
            {
                grade() {
                    //return ((this.symbolsPressed - this.wrongPressed) / this.symbolsPressed * 2) + (this.score / 200)
                    if (this.score >= 12000) return 5;
                    if (this.score < 12000 && this.score >= 10000) return 4;
                    if (this.score < 10000 && this.score >= 8000) return 3;
                    if (this.score < 8000 && this.score >= 6000) return 2;
                    if (this.score < 6000) return 1;

                }
            }
        }
    );

    timerLineInit();
    container = document.getElementById('keysContainer');

    qwertyKeyboard = document.getElementById('QwertyKeyboard'); setInterval(MoveSymbol, 2000);
    checkTimeStart();
    timerStart();

    document.addEventListener("keydown", function (event) {
        event.preventDefault();
    })
    // Обработчик события нажатия клавиши
    document.addEventListener('keyup', function (event) {

        //event.stopPropagation();

        const _event = event;
        const pressedKeyCode = _event.code.toUpperCase();
        const pressedKey = _event.key.toUpperCase();
        data.lastKeyPressed = pressedKey
        console.log('Код нажатой клавиши:', event.code);
        if (pressedKey != 'SHIFT') data.symbolsPressed++;
        let wrong = true;
        //if (KeyToSVG_ID(data.lastKeyPressed))
        //console.log(KeyCodeSVG[data.lastKeyPressed])
        //console.log(document.getElementById(KeyToSVG_ID(data.lastKeyPressed)))//.style.color = 'red';        
        const qwertyKey = qwertyKeyboard.contentDocument.querySelector('#' + KeyCodeSVG[pressedKeyCode]);

        //keyboardFillColors[pressedSymbolCode] = qwertyKey.style.fill
        qwertyKey.style.fill = COLOR_PRESSED_KEY;
        setTimeout(() => {
            //keyLocked = true;
            if (pressedKeyCode in KeysColors) {
                qwertyKeyboard.contentDocument.querySelector("#" + KeyCodeSVG[pressedKeyCode]).style.fill = '#' + KeysColors[pressedKeyCode]
                //  keyLocked = false;
            }

        }, 100);

        for (let i = 0; i < symbols.length; i++) {
            if (symbols[i].divSymbol.textContent.toUpperCase() === pressedKey) {
                //console.log('top:' + (1000 - symbols[i].divSymbol.offsetTop))
                data.score += (-data.setDontPressScore - symbols[i].divSymbol.offsetTop);
                if (container.contains(symbols[i].divSymbol))
                    container.removeChild(symbols[i].divSymbol);
                clearInterval(symbols[i].interval);
                data.symbolsOnScreen--;
                //container.removeChild(symbols[i]);
                //console.log(symbols[i])
                symbols.splice(i, 1);
                break;
            };



        }
        if (wrong && pressedKey != 'SHIFT') {
            data.wrongPressed++;
            data.score += data.setWrongPressScore;
        }
    });
}

// Функция, которая создает и перемещает символ
function MoveSymbol() {
    //data.symbolsOnScreen++;
    // Создаем новый символ
    data.symbolsOnScreen++;
    //this.divSymbol = 
    let symbol = document.createElement('div');//this.divSymbol;
    symbol.classList.add('keyStyle');


    let top = document.getElementById('keysContainer').offsetTop;
    let left = document.getElementById('keysContainer').offsetLeft;
    let randomKey = GAME_SYMBOLS[Math.floor(Math.random() * GAME_SYMBOLS.length)];
    symbol.textContent = randomKey; // Выбираем случайный символ из массива
    symbol.style.backgroundColor = "#" + GAME_SYMBOLS_COLOR[randomKey];
    //let scoreDiv = document.createElement('span');
    //scoreDiv.classList.add('scoreStyle');
    //scoreDiv.textContent = '10';
    //symbol.appendChild(scoreDiv);

    if (symbol.textContent.length > 3) {
        symbol.style.fontSize = `${11}px`
    }
    symbol.style.position = 'absolute';
    symbol.style.top = `${top}px`; // Начальная позиция сверху
    symbol.style.left = `${Math.floor(Math.random() * (container.offsetWidth - 100)) + left}px`; // Случайное положение по горизонтали
    container.appendChild(symbol);
    //symbols.push(symbol);

    // Определяем скорость движения символа
    const speed = Math.floor(Math.random() * 4) + 1; // Скорость в пикселях за кадр

    const interval = setInterval(() => {
        let top2 = parseInt(symbol.style.top);
        // Проверяем, достиг ли символ дна экрана
        if (top2 + symbol.offsetHeight >= container.offsetTop + container.offsetHeight) {
            // Удаляем символ и создаем новый
            //console.log('Удаление символа при достижении края:' + symbol)
            clearInterval(interval);
            //document.body.removeChild(movingObject);
            container.removeChild(symbol);
            data.score += data.setDontPressScore;
            data.symbolsOnScreen--;
            // data.symbolsOnScreen--;

        } else {
            // Двигаем символ вниз
            symbol.style.top = `${top2 + speed}px`;
            //The window.requestAnimationFrame() method tells the browser you wish to perform an
            // animation. It requests the browser to call a user-supplied callback function before
            // the next repaint.
            //window.requestAnimationFrame(animate);
        }
    }, 50); // Интервал движения - 50 миллисекунд
    symbols.push({
        divSymbol: symbol,
        interval: interval
    })

}



function checkTimeFinish() {
    data.timeFinish = new Date();
    //var n = timeEnd.toLocaleTimeString();
    //document.getElementById("time_end").innerHTML=n;
}

function getDurationTime() {
    let diffInMilliseconds = new Date() - data.timeStart;
    // Преобразуем миллисекунды в часы, минуты и секунды
    let hours = String(Math.floor(diffInMilliseconds / (1000 * 60 * 60))).padStart(2, '0');
    let minutes = String(Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    let seconds = String(Math.floor((diffInMilliseconds % (1000 * 60)) / 1000)).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;

}

function tick() {
    data.timeDuration = getDurationTime();
}


function timerStart() {
    si = setInterval(tick, 1000);
}

function checkTimeStart() {

    data.timeStart = new Date();
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    //const formattedTime = taskInfo.startTime.toLocaleString('ru-RU', options).replace(',', '');
    //document.getElementById("timeStart").innerHTML = formattedTime;
    data.formatedTimeStart = data.timeStart.toLocaleString('ru-RU', options).replace(',', '');
}

let isHintVisible = false;

function toggleHint() {
    const hintContent = document.querySelector('.hint-content');
    const hintToggle = document.querySelector('.hint-toggle');

    if (isHintVisible) {
        hintContent.style.display = 'none';
        hintToggle.textContent = 'Подсказка';
        isHintVisible = false;
    } else {
        hintContent.style.display = 'block';
        hintToggle.textContent = 'Спрятать';
        isHintVisible = true;
    }
}

function timerLineInit()
{
// Set the timer duration in seconds
let timerDuration = 100; // 3 minutes
data.timeLeft=timerDuration;
const timerContainer=document.getElementById('timer-container')
// Get the timer line element
const timerLine = document.getElementById('timer-line');

// Set the initial width of the timer line to 100%
timerLine.style.width = '100%';

// Start the timer
const timer = setInterval(() => {
  // Decrease the width of the timer line by 1/180 (1% per second)
  timerLine.style.width = `${(timerLine.offsetWidth / timerContainer.offsetWidth) * 100 - 100 / timerDuration}%`;

  // Decrement the timer duration
  //timerDuration--;
  data.timeLeft--;

  // Check if the timer has reached 0
  if (data.timeLeft === 0) {
    // Stop the timer
    clearInterval(timer);
    console.log('Timer finished!');
  }
}, 1000); // Run the timer every 1 second (1000 milliseconds)

}

const KeyCodeSVG = {
    'F1': 'path107',
    'F2': 'path109',
    'F3': 'path111',
    'F4': 'path113',
    'F5': 'path115',
    'F6': 'path117',
    'F7': 'path119',
    'F8': 'path121',
    'F9': 'path123',
    'F10': 'path125',
    'F11': 'path127',
    'F12': 'path129',
    'ESC': 'path105',
    'TAB': 'path197',
    '~': 'path11',
    'BACKQUOTE': 'path11',
    '!': 'path13',
    'DIGIT1': 'path13',
    '@': 'path15',
    'DIGIT2': 'path15',
    '#': 'path17',
    'DIGIT3': 'path17',
    '$': 'path19',
    'DIGIT4': 'path19',
    '%': 'path21',
    'DIGIT5': 'path21',
    '^': 'path23',
    'DIGIT6': 'path23',
    '&': 'path25',
    'DIGIT7': 'path25',
    '*': 'path27',
    'DIGIT8': 'path27',
    '(': 'path29',
    'DIGIT9': 'path29',
    ')': 'path31',
    'DIGIT0': 'path31',
    '_': 'path33',
    'MINUS': 'path33',
    '+': 'path35',
    'EQUAL': 'path35',
    '{': 'path109',
    '}': 'path109',
    ';': 'path109',
    "'": 'path109',
    ':': 'path109',
    '"': 'path109',
    '|': 'path109',
    '\\': 'path109',
    '<': 'path109',
    '>': 'path109',
    '?': 'path109',
    '/': 'path109',
    '*': 'path109',
    '-': 'path109',
    '+': 'path109',
    '.': 'path109',
    'INSERT': 'path131',
    'HOME': 'path133',
    'DELETE': 'path143',
    'END': 'path145',
    'PAGEUP': 'path135',
    'PAGEDOWN': 'path147',
    'CONTROLLEFT': 'path563',
    'CONTROLRIGHT': 'path559',
    'ALTLEFT': 'path567',
    'ALTRIGHT': 'path865',
    'SHIFTLEFT': 'path561',
    'SHIFTRIGHT': 'path551',
    'BACKSPACE': 'path39',
    'ENTER': 'path553',
    'NUMPADENTER': 'path193',
    'ESCAPE': 'path105',
    'CAPSLOCK': 'path199',
    'ARROWLEFT': 'path149',
    'ARROWRIGHT': 'path153',
    'ARROWUP': 'path155',
    'ARROWDOWN': 'path151',
    'SPACE': 'path185',
    'BRACKETLEFT': 'path61',
    'BRACKETRIGHT': 'path63',
    'KEYQ': 'path41',
    'KEYW': 'path43',
    'KEYE': 'path45',
    'KEYR': 'path47',
    'KEYT': 'path49',
    'KEYY': 'path51',
    'KEYU': 'path53',
    'KEYI': 'path55',
    'KEYO': 'path57',
    'KEYP': 'path59',
    'KEYA': 'path65',
    'KEYS': 'path67',
    'KEYD': 'path69',
    'KEYF': 'path71',
    'KEYG': 'path73',
    'KEYH': 'path75',
    'KEYJ': 'path77',
    'KEYK': 'path79',
    'KEYL': 'path81',
    'KEYZ': 'path87',
    'KEYX': 'path89',
    'KEYC': 'path91',
    'KEYV': 'path195',
    'KEYB': 'path93',
    'KEYN': 'path95',
    'KEYM': 'path97',
    'COMMA': 'path99',
    'PERIOD': 'path101',
    'SLASH': 'path103',
    'INTLBACKSLASH': 'path37',
    'NUMLOCK': 'path157',
    'NUMPADDIVIDE': 'path159',
    'NUMPADMULTIPLY': 'path161',
    'NUMPADSUBTRACT': 'path183',
    'NUMPAD7': 'path163',
    'NUMPAD8': 'path165',
    'NUMPAD9': 'path167',
    'NUMPADADD': 'path191',
    'NUMPAD4': 'path169',
    'NUMPAD5': 'path171',
    'NUMPAD6': 'path173',
    'NUMPAD1': 'path175',
    'NUMPAD2': 'path177',
    'NUMPAD3': 'path179',
    'NUMPAD0': 'path373',
    'NUMPADDECIMAL': 'path181',
    'NUMPADENTER': 'path193',
    'SEMICOLON': 'path83',
    'QUOTE': 'path85',
    'BACKSLASH': 'path37'
}

const KeysColors = {
    'F1': 'E8C37E',
    'F2': 'E8C37E',
    'F3': 'E8C37E',
    'F4': 'E8C37E',
    'F5': 'E8C37E',
    'F6': 'E8C37E',
    'F7': 'E8C37E',
    'F8': 'E8C37E',
    'F9': 'E8C37E',
    'F10': 'E8C37E',
    'F11': 'E8C37E',
    'F12': 'E8C37E',
    'ESC': 'E8C37E',
    'TAB': '9CC4D5',
    '~': '9CC4D5',
    'BACKQUOTE': '9CC4D5',
    '!': '9CC4D5',
    'DIGIT1': '9CC4D5',
    '@': '9CC4D5',
    'DIGIT2': '9CC4D5',
    '#': '9CC4D5',
    'DIGIT3': '9CC4D5',
    '$': '9CC4D5',
    'DIGIT4': '9CC4D5',
    '%': '9CC4D5',
    'DIGIT5': '9CC4D5',
    '^': '9CC4D5',
    'DIGIT6': '9CC4D5',
    '&': '9CC4D5',
    'DIGIT7': '9CC4D5',
    '*': '9CC4D5',
    'DIGIT8': '9CC4D5',
    '(': '9CC4D5',
    'DIGIT9': '9CC4D5',
    ')': '9CC4D5',
    'DIGIT0': '9CC4D5',
    '_': '9CC4D5',
    'MINUS': '9CC4D5',
    '+': '9CC4D5',
    'EQUAL': '9CC4D5',
    '{': '9CC4D5',
    '}': '9CC4D5',
    ';': '9CC4D5',
    "'": '9CC4D5',
    ':': '9CC4D5',
    '"': '9CC4D5',
    '|': '9CC4D5',
    '\\': '9CC4D5',
    '<': '9CC4D5',
    '>': '9CC4D5',
    '?': '9CC4D5',
    '/': '9CC4D5',
    '*': '9CC4D5',
    '-': '9CC4D5',
    '+': '9CC4D5',
    '.': '9CC4D5',
    'INSERT': 'FFFFFF',
    'HOME': 'FFFFFF',
    'DELETE': 'FFFFFF',
    'END': 'FFFFFF',
    'PAGEUP': 'FFFFFF',
    'PAGEDOWN': 'FFFFFF',
    'CONTROLLEFT': '9CC4D5',
    'CONTROLRIGHT': '9CC4D5',
    'ALTLEFT': '9CC4D5',
    'ALTRIGHT': '9CC4D5',
    'SHIFTLEFT': '9CC4D5',
    'SHIFTRIGHT': '9CC4D5',
    'BACKSPACE': '9CC4D5',
    'ENTER': 'EFF1BE',
    'NUMPADENTER': 'EFF1BE',
    'ESCAPE': 'FFFFFF',
    'CAPSLOCK': 'path199',
    'ARROWLEFT': 'AAD2B1',
    'ARROWRIGHT': 'AAD2B1',
    'ARROWUP': 'AAD2B1',
    'ARROWDOWN': 'AAD2B1',
    'SPACE': '9CC4D5',
    'BRACKETLEFT': '9CC4D5',
    'BRACKETRIGHT': '9CC4D5',
    'KEYQ': '9CC4D5',
    'KEYW': '9CC4D5',
    'KEYE': '9CC4D5',
    'KEYR': '9CC4D5',
    'KEYT': '9CC4D5',
    'KEYY': '9CC4D5',
    'KEYU': '9CC4D5',
    'KEYI': '9CC4D5',
    'KEYO': '9CC4D5',
    'KEYP': '9CC4D5',
    'KEYA': '9CC4D5',
    'KEYS': '9CC4D5',
    'KEYD': '9CC4D5',
    'KEYF': '9CC4D5',
    'KEYG': '9CC4D5',
    'KEYH': '9CC4D5',
    'KEYJ': '9CC4D5',
    'KEYK': '9CC4D5',
    'KEYL': '9CC4D5',
    'KEYZ': '9CC4D5',
    'KEYX': '9CC4D5',
    'KEYC': '9CC4D5',
    'KEYV': '9CC4D55',
    'KEYB': '9CC4D5',
    'KEYN': '9CC4D5',
    'KEYM': '9CC4D5',
    'COMMA': '9CC4D5',
    'PERIOD': '9CC4D5',
    'SLASH': '9CC4D5',
    'INTLBACKSLASH': '9CC4D5',
    'NUMLOCK': 'A1A8CA',
    'NUMPADDIVIDE': 'A1A8CA',
    'NUMPADMULTIPLY': 'A1A8CA',
    'NUMPADSUBTRACT': 'A1A8CA',
    'NUMPAD7': 'A1A8CA',
    'NUMPAD8': 'A1A8CA',
    'NUMPAD9': 'A1A8CA',
    'NUMPADADD': 'A1A8CA',
    'NUMPAD4': 'A1A8CA',
    'NUMPAD5': 'A1A8CA',
    'NUMPAD6': 'A1A8CA',
    'NUMPAD1': 'A1A8CA',
    'NUMPAD2': 'A1A8CA',
    'NUMPAD3': 'A1A8CA',
    'NUMPAD0': 'A1A8CA',
    'NUMPADDECIMAL': 'A1A8CA',
    'NUMPADENTER': 'A1A8CA',
    'SEMICOLON': '9CC4D5',
    'QUOTE': '9CC4D5',
    'BACKSLASH': '9CC4D5'
}

const GAME_SYMBOLS_COLOR = {
    'F2': 'E8C37E',
    'F3': 'E8C37E',
    'F4': 'E8C37E',
    'F6': 'E8C37E',
    'F7': 'E8C37E',
    'F8': 'E8C37E',
    'F9': 'E8C37E',
    'F10': 'E8C37E',
    'F11': 'E8C37E',
    'F12': 'E8C37E',
    'TAB': '9CC4D5',
    '~': '9CC4D5',
    '!': '9CC4D5',
    '@': '9CC4D5',
    '#': '9CC4D5',
    '$': '9CC4D5',
    '%': '9CC4D5',
    '^': '9CC4D5',
    '&': '9CC4D5',
    '*': '9CC4D5',
    '(': '9CC4D5',
    ')': '9CC4D5',
    '_': '9CC4D5',
    '+': '9CC4D5',
    '{': '9CC4D5',
    '}': '9CC4D5',
    ';': '9CC4D5',
    "'": '9CC4D5',
    ':': '9CC4D5',
    '"': '9CC4D5',
    '|': '9CC4D5',
    '\\': '9CC4D5',
    '<': '9CC4D5',
    '>': '9CC4D5',
    '?': '9CC4D5',
    '/': '9CC4D5',
    '*': '9CC4D5',
    '-': '9CC4D5',
    '+': '9CC4D5',
    '.': '9CC4D5',
    'Insert': 'FFFFFF',
    'Home': 'FFFFFF',
    'Delete': 'FFFFFF',
    'End': 'FFFFFF',
    'PageUp': 'FFFFFF',
    'PageDown': 'FFFFFF',
    'Control': '9CC4D5',
    'Alt': '9CC4D5',
    'Shift': '9CC4D5',
    'Backspace': '9CC4D5'
}



