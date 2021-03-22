// get elements from DOM
const input = document.querySelector('input');
const button = document.querySelector('button');
const wordsList = document.getElementById('words-list');

const handler = () => {

  // input not empty
  if(input.value) {

    // create element for future translit word
    const newWord = document.createElement('p');
    newWord.className = 'word';

    // actual translit function
    const translit = (str) => {

      // Map dictionary for letters
      const ru = new Map([
        ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'], ['д', 'd'], ['е', 'e'],
        ['є', 'e'], ['ё', 'e'], ['ж', 'j'], ['з', 'z'], ['и', 'i'], ['ї', 'yi'], ['й', 'i'],
        ['к', 'k'], ['л', 'l'], ['м', 'm'], ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'],
        ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'], ['х', 'h'], ['ц', 'c'], ['ч', 'ch'],
        ['ш', 'sh'], ['щ', 'shch'], ['ы', 'y'], ['э', 'e'], ['ю', 'u'], ['я', 'ya'],
      ]);
      
      // replace 'Ъ' and 'Ь' with empty string
      str = str.replace(/[ъь]+/gi, '');

      // do transliteration:
      // ru.get(next) - take cyrillic letter and find latin variant
      // ru.get(next.toLowerCase()) === undefined && next - can't find letter, so it's already latin
      // ru.get(next.toLowerCase()).toUpperCase() - for upper case cyrillic letter
      return Array.from(str).reduce((first, next) => first + (ru.get(next) || (ru.get(next.toLowerCase()) === undefined && next) || ru.get(next.toLowerCase()).toUpperCase()), '');
    };

    newWord.innerText = `${translit(input.value)}`;
    wordsList.appendChild(newWord);
    input.value = '';

    // check word element for overflow
    if (newWord.scrollHeight > newWord.clientHeight || newWord.scrollWidth > newWord.clientWidth) {
      newWord.addEventListener('mouseover', (event) => {
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.innerText = `${event.target.innerText}`;
        event.target.appendChild(tooltip);

        // get word coordinates
        const coords = event.target.getBoundingClientRect();
        // move tooltip in center with word
        const left = coords.left + (event.target.offsetWidth - tooltip.offsetWidth) / 2;
        // move tooltip above word
        const top = coords.top - tooltip.offsetHeight - 5;
        // do the moves!
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      });
    }

    // listener for removing tooltip
    newWord.addEventListener('mouseout', () => {
      const tooltip = document.getElementsByTagName('span')[0];
      if (tooltip) {
        tooltip.remove();
      }
    });
  }  
}

document.addEventListener("keypress", (e) => {
  if(e.key === 'Enter') {
    handler();
  }}
  );
button.addEventListener('click', handler);
