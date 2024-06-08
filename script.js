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
        console.log(KeyToSVG_ID(data.lastKeyPressed))
        if (pressedSymbol in keyboardFillColors)
            qwertyKeyboard.contentDocument.querySelector("#" + KeyToSVG_ID(pressedSymbol)).style.fill = keyboardFillColors[pressedSymbol];

    });
    // Обработчик события нажатия клавиши
    document.addEventListener('keydown', function (event) {
        data.symbolsPressed++;
        const pressedSymbol = event.key.toUpperCase();
        data.lastKeyPressed = pressedSymbol
        console.log('Код нажатой клавиши:', event.key);
        let wrong = true;
        //if (KeyToSVG_ID(data.lastKeyPressed))
        console.log(KeyToSVG_ID(data.lastKeyPressed))
        //console.log(document.getElementById(KeyToSVG_ID(data.lastKeyPressed)))//.style.color = 'red';        
        const qwertyKey = qwertyKeyboard.contentDocument.querySelector('#' + KeyToSVG_ID(data.lastKeyPressed));

        keyboardFillColors[pressedSymbol] = qwertyKey.style.fill
        qwertyKey.style.fill = COLOR_PRESSED_KEY;

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
                event.stopPropagation();
                event.preventDefault();
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

function KeyToSVG_ID(key) {
    switch (key) {
        case 'F1':
            return 'path107';
        case 'F2':
            return 'path109';
        case 'F3':
            return 'path111';
        case 'F4':
            return 'path113';
        case 'F5':
            return 'path115';
        case 'F6':
            return 'path117';
        case 'F7':
            return 'path119';
        case 'F8':
            return 'path121';
        case 'F9':
            return 'path123';
        case 'F10':
            return 'path125';
        case 'F11':
            return 'path127';
        case 'F12':
            return 'path129';
        case 'INSERT':
            return 'path131';
        case 'HOME':
            return 'path133';
        case 'DELETE':
            return 'path135';
        case 'DELETE':
            return 'path137';
        case 'PAGEUP':
            return 'path139';
        case 'PAGEDOWN':
            return 'path141';
        default:
            return 'path133';

    }
}