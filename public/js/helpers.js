const localStorageTokens = {
  gurulang: 'guru-lang',
  gurutheme: 'guru-theme'
}

const language = {
  ru: 'RU',
  en: 'EN'
};

const titles = {
  ru: 'Гуруссенжер',
  en: 'Gurussenger'
};

const inputLabels = {
  ru: 'Сообщение',
  en: 'Message'
};

const actions = {
  submit: {
    ru: 'Отправить',
    en: 'Send'
  },
  location: {
    ru: 'Геолокация',
    en: 'Location'
  }
};

const currentLocationNames = {
  ru: 'Текущее местоположение',
  en: 'Current location'
};

const htmlIcons = {
  send: '<i class="material-icons right">send</i>',
  location_on: '<i class="material-icons right">location_on</i>'
};

const translate = () => {
  const title = document.querySelector('.guru-title');
  const guruSubmit = document.querySelector('#guru-submit');
  const guruLocation = document.querySelector('#guru-location');
  const guruLabel = document.querySelector('.guru-label');
  const currentLocations = document.querySelectorAll('.current-location');

  if (localStorage.getItem(localStorageTokens.gurulang) === language.ru) {
    title.textContent = titles.ru;
    guruSubmit.innerHTML = `${actions.submit.ru} ${htmlIcons.send}`;
    guruLocation.innerHTML = `${actions.location.ru} ${htmlIcons.location_on}`;
    guruLabel.textContent = inputLabels.ru;
    
    currentLocations.forEach(location => {
      location.textContent = `${currentLocationNames.ru}`;
    });
  } else {
    title.textContent = titles.en;
    guruSubmit.innerHTML = `${actions.submit.en} ${htmlIcons.send}`;
    guruLocation.innerHTML = `${actions.location.en} ${htmlIcons.location_on}`;
    guruLabel.textContent = inputLabels.en;

    currentLocations.forEach(location => {
      location.textContent = `${currentLocationNames.en}`;
    });
  }
};