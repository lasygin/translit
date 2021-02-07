// Получаем поле ввода, кнопку и блок со словами
const input = document.querySelector('input');
const button = document.querySelector('button');
const wordsList = document.getElementById('words-list');

const handler = () => {
  if(input.value) {
    // Создаем новый элемент (новое слово) + класс + текст из input
    const newWord = document.createElement('p');
    newWord.className = 'word';
    // Создаем функцию для траслитерации
    const translit = (str) => {
      /** Создадим "словарь для мепинга" где лежат пары "кириллица, латиница"
       * Мы используем "new" и создаем новый Map объект, в который записываем пары [key , value]
      */
      const ru = new Map([
        ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'], ['д', 'd'], ['е', 'e'],
        ['є', 'e'], ['ё', 'e'], ['ж', 'j'], ['з', 'z'], ['и', 'i'], ['ї', 'yi'], ['й', 'i'],
        ['к', 'k'], ['л', 'l'], ['м', 'm'], ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'],
        ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'], ['х', 'h'], ['ц', 'c'], ['ч', 'ch'],
        ['ш', 'sh'], ['щ', 'shch'], ['ы', 'y'], ['э', 'e'], ['ю', 'u'], ['я', 'ya'],
      ]);
      /**
       * Выкидываем из текста мягкий и твердый знаки, заменяя их пустой строкой
       * Используем "replace":
       * Первый параметр - регулярное выражение:
       * между /слешами/ в [квадратных скобках] те буквы, которые ищем.
       * Дальше "+" , который говорит, что мы ищем один или несколько знаков подряд (ъ / ъъ).
       * "g" - флаг, который не останавливает поиск после первого удачного, а продолжает его до конца.
       * "i" - флаг, который делает поиск независимым от регистра (ъ / Ъ).
       * Второй параметр: на что заменяем найденный символ - пустая строка.
       */
      str = str.replace(/[ъь]+/gi, '');
      /**
       * возвращаем готовую транслит строку
       * 1) Создаем массив из строки с помощью Array.from(str)
       * Он разбивает строку на символы и заносит в массив по одному символу
       * 2) Проходимся по массиву и выполняем функцию над каждой буквой с помощью "reduce"
       * У нас два параметра - reduce функция (с 2мя аргументами)
       * и начальное значение в виде '' (пустой строки).
       * Пустая строка нужна нам, чтобы фукнция начала редьюс с первой буквы.
       * Грубо говоря, первым "first" аргументом у нас будет пустая строка.
       * А первым "next" - первая буква из массива.
       * 3) Дальше мы берем наш Map объект - "ru" и используем метод get,
       * который ищет значение(латинскую букву) по полученному ключу(русская буква next).
       * ru.get(next) - маленькая русская буква, сразу находит по ключу
       * (ru.get(next.toLowerCase()) === undefined && next) - маленькая латинская буква (не находит)
       * и вставляет ее же в результат.
       * ru.get(next.toLowerCase()).toUpperCase() - большая русская буква.
       * Сначала приводит к маленькой, находит латинскую замену и приводит к латинской большой.
       */
      return Array.from(str).reduce((first, next) => first + (ru.get(next) || (ru.get(next.toLowerCase()) === undefined && next) || ru.get(next.toLowerCase()).toUpperCase()), '');
    };
    // Добавляем в блок со словами полученное транслит слово
    newWord.innerText = `${translit(input.value)}`;
    // Добавляем новое слово в блок словаря
    wordsList.appendChild(newWord);
    // Очищаем поле ввода
    input.value = '';
    // Проверяем поле со словом на overflow
    if (newWord.scrollHeight > newWord.clientHeight || newWord.scrollWidth > newWord.clientWidth) {
      // Создаем обработчик для поля со словом по наведению мыши
      newWord.addEventListener('mouseover', (event) => {
        // Создаем элемент "подсказку" + класс + текст из поля со словом
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.innerText = `${event.target.innerText}`;
        // Добавляем подсказку(span) в элемент слова(p)
        event.target.appendChild(tooltip);
        // Получаем размер и координаты поля со словом
        const coords = event.target.getBoundingClientRect();
        // Помещаем подсказку сверху по центру слова: Задаем отступ слева (центрируем)
        const left = coords.left + (event.target.offsetWidth - tooltip.offsetWidth) / 2;
        // Задаем отступ снизу (помещаем над словом)
        const top = coords.top - tooltip.offsetHeight - 5;
        // Присваиваем полученные значения подсказке
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      });
    }
    // Создаем обработчик по выходу мышки с поля со словом
    newWord.addEventListener('mouseout', () => {
      // Ищем подсказку в элементах
      const tooltip = document.getElementsByTagName('span')[0];
      // Если нашли, то удаляем ее
      if (tooltip) {
        tooltip.remove();
      }
    });
  }  
}

// Создаем обработчик по нажатию Enter
document.addEventListener("keypress", (e) => {
  if(e.key === 'Enter') {
    handler();
  }}
  );

// Создаем обработчик кнопки по клику
button.addEventListener('click', handler);
