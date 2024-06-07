
const symbols = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'TAB',
    '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '{', '}', ';', `'`, ':', '"', '|', '\\', '',
    '<', '>', '?', '/', '*', '-', '+', '.', 'Insert', 'Home', 'Del', 'End', 'Page Up', 'Page Down', 'Ctrl', 'Alt', 'Shift'
];


// Получаем контейнер для символа
let container;


function load() {
    container = document.getElementById('container');
    // Запускаем движение символов каждые 2 секунды
    setInterval(moveSymbol, 2000);
}
// Функция, которая создает и перемещает символ
function moveSymbol() {
    // Создаем новый символ
    const symbol = document.createElement('div');
    //symbol.textContent = '✨'; // Замените этот символ на любой другой
    symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)]; // Выбираем случайный символ из массива
    symbol.style.position = 'absolute';
    symbol.style.top = '0'; // Начальная позиция сверху
    symbol.style.left = `${Math.floor(Math.random() * (container.offsetWidth - 50))}px`; // Случайное положение по горизонтали
    container.appendChild(symbol);

    // Определяем скорость движения символа
    const speed = 2; // Скорость в пикселях за кадр

    // Функция, которая двигает символ
    function animate() {
        // Получаем текущую позицию символа
        let top = parseInt(symbol.style.top);

        // Проверяем, достиг ли символ дна экрана
        if (top + symbol.offsetHeight >= container.offsetHeight) {
            // Удаляем символ и создаем новый
            container.removeChild(symbol);
            moveSymbol();
        } else {
            // Двигаем символ вниз
            symbol.style.top = `${top + speed}px`;
            requestAnimationFrame(animate);
        }
    }

    // Запускаем анимацию
    animate();
}


