const GAME_STATUS = { MENU: 0, PAUSE: 1, PLAY: 2, GAMEOVER: 3 }


const GAME_SYMBOLS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'TAB',
    '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '{', '}', ';', `'`, ':', '"', '|', '\\', '',
    '<', '>', '?', '/', '*', '-', '+', '.', 'Insert', 'Home', 'Delete', 'End', 'PageUp', 'PageDown', 'Control', 'Alt', 'Shift'
];


// Получаем контейнер для символа
let container;
let symbols = [];
let moveSymbolsArray = []

let data =
{
    timeStart: '00:00:00',
    timeDuration: '00:00:00',
    score: 0,
    wrongPressed: 0,
    symbolsOnScreen: 0,
    symbolsPressed: 0
}

let keyboardTraining;

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
    setInterval(MoveSymbol, 2000);
    // Обработчик события нажатия клавиши
    document.addEventListener('keydown', function (event) {
        const pressedSymbol = event.key.toUpperCase();
        console.log('Код нажатой клавиши:', event.key);
        for (let i = 0; i < symbols.length; i++) {
            if (symbols[i].divSymbol.textContent.toUpperCase() === pressedSymbol) {

                if (container.contains(symbols[i].divSymbol))
                    container.removeChild(symbols[i].divSymbol);
                clearInterval(symbols[i].interval)
                //container.removeChild(symbols[i]);
                //console.log(symbols[i])
                symbols.splice(i, 1);
                event.preventDefault();
                event.stopPropagation();
                break;
            }
        }
    });
}

// Функция, которая создает и перемещает символ
function MoveSymbol() {
    //data.symbolsOnScreen++;
    // Создаем новый символ
    this.divSymbol = document.createElement('div');
    let symbol = this.divSymbol;
    symbol.textContent = GAME_SYMBOLS[Math.floor(Math.random() * GAME_SYMBOLS.length)]; // Выбираем случайный символ из массива
    symbol.style.position = 'absolute';
    symbol.style.top = '0'; // Начальная позиция сверху
    symbol.style.left = `${Math.floor(Math.random() * (container.offsetWidth - 50))}px`; // Случайное положение по горизонтали
    container.appendChild(symbol);
    //symbols.push(symbol);

    // Определяем скорость движения символа
    const speed = 1; // Скорость в пикселях за кадр

    const interval = setInterval(() => {
        let top = parseInt(symbol.style.top);
        // Проверяем, достиг ли символ дна экрана
        if (top + symbol.offsetHeight >= container.offsetHeight) {
            // Удаляем символ и создаем новый
            console.log('Удаление символа при достижении края:' + symbol)
            clearInterval(interval);
            //document.body.removeChild(movingObject);
            container.removeChild(symbol);
            // data.symbolsOnScreen--;

        } else {
            // Двигаем символ вниз
            symbol.style.top = `${top + speed}px`;
            //The window.requestAnimationFrame() method tells the browser you wish to perform an
            // animation. It requests the browser to call a user-supplied callback function before
            // the next repaint.
            //window.requestAnimationFrame(animate);
        }
    }, 50); // Интервал движения - 50 миллисекунд
    symbols.push({
        divSymbol: this.divSymbol,
        interval: interval
    })

}






