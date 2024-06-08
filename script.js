const GAME_STATUS = { MENU: 0, PAUSE: 1, PLAY: 2, GAMEOVER: 3 }


const GAME_SYMBOLS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'TAB',
    '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '{', '}', ';', `'`, ':', '"', '|', '\\', '',
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
    grade: 0,
    symbolsOnScreen: 0,
    symbolsPressed: 0,
    lastKeyPressed: ''
}


function load() {
    keyboardTraining = new Vue(
        {
            el: '#app',
            data
        }
    );
    container = document.getElementById('keysContainer');
    // Запускаем движение символов каждые 2 секунды
    /*
    setInterval(() => {
        let ms = new MoveSymbol();
        symbols.push(ms)
    }, 5000);
    */
    qwertyKeyboard = document.getElementById('QwertyKeyboard'); setInterval(MoveSymbol, 2000);
    checkTimeStart();
    timerStart();
    document.addEventListener('keyup', function (event) {
        const pressedSymbol = event.key.toUpperCase();
        console.log(KeySVG[data.lastKeyPressed])
        // if (pressedSymbol in keyboardFillColors)
        //     qwertyKeyboard.contentDocument.querySelector("#" + KeySVG[data.lastKeyPressed]).style.fill = keyboardFillColors[pressedSymbol];

    });
    // Обработчик события нажатия клавиши
    document.addEventListener('keydown', function (event) {
        if (keyLocked) return;
        data.symbolsPressed++;
        const pressedSymbol = event.code.toUpperCase();
        data.lastKeyPressed = pressedSymbol
        console.log('Код нажатой клавиши:', event.code);
        let wrong = true;
        //if (KeyToSVG_ID(data.lastKeyPressed))
        console.log(KeySVG[data.lastKeyPressed])
        //console.log(document.getElementById(KeyToSVG_ID(data.lastKeyPressed)))//.style.color = 'red';        
        const qwertyKey = qwertyKeyboard.contentDocument.querySelector('#' + KeySVG[data.lastKeyPressed]);

        keyboardFillColors[pressedSymbol] = qwertyKey.style.fill
        qwertyKey.style.fill = COLOR_PRESSED_KEY;
        setTimeout(() => {
            keyLocked = true;
            if (pressedSymbol in keyboardFillColors) {
                qwertyKeyboard.contentDocument.querySelector("#" + KeySVG[data.lastKeyPressed]).style.fill = keyboardFillColors[pressedSymbol];
                keyLocked = false;
            }

        }, 100);

        for (let i = symbols.length - 1; i >= 0; i--) {
            if (symbols[i].divSymbol.textContent.toUpperCase() === pressedSymbol) {
                data.score++;
                if (container.contains(symbols[i].divSymbol))
                    container.removeChild(symbols[i].divSymbol);
                clearInterval(symbols[i].interval);
                data.symbolsOnScreen--;
                //container.removeChild(symbols[i]);
                //console.log(symbols[i])
                symbols.splice(i, 1);
                event.preventDefault();
                event.stopPropagation();
                wrong = false;
                break;
            };



        }
        if (wrong) data.wrongPressed++;
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
    symbol.textContent = GAME_SYMBOLS[Math.floor(Math.random() * GAME_SYMBOLS.length)]; // Выбираем случайный символ из массива
    symbol.style.position = 'absolute';
    symbol.style.top = `${top}px`; // Начальная позиция сверху
    symbol.style.left = `${Math.floor(Math.random() * (container.offsetWidth - 100)) + left}px`; // Случайное положение по горизонтали
    container.appendChild(symbol);
    //symbols.push(symbol);

    // Определяем скорость движения символа
    const speed = 1; // Скорость в пикселях за кадр

    const interval = setInterval(() => {
        let top2 = parseInt(symbol.style.top);
        // Проверяем, достиг ли символ дна экрана
        if (top2 + symbol.offsetHeight >= container.offsetTop + container.offsetHeight) {
            // Удаляем символ и создаем новый
            console.log('Удаление символа при достижении края:' + symbol)
            clearInterval(interval);
            //document.body.removeChild(movingObject);
            container.removeChild(symbol);
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

const KeySVG = {
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
