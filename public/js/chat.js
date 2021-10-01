const socket = io();

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// Autoscroll
const autoscroll = () => {
  $messages.scrollTop = $messages.scrollHeight;
};

socket.on('message', (message) => {

  if (!message) {
    return;
  }

  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  });

  $messages.insertAdjacentHTML('beforeend', html);

  autoscroll();
});

socket.on('locationMessage', (location) => {
  const html = Mustache.render(locationTemplate, {
    username: location.username,
    location: location.text,
    createdAt: moment(location.createdAt).format('h:mm a'),
    locationText: localStorage.getItem(localStorageTokens.gurulang) === language.ru
    ? currentLocationNames.ru : currentLocationNames.en
  });

  $messages.insertAdjacentHTML('beforeend', html);

  autoscroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });

  $sidebar.innerHTML = html;
});

$messageForm.addEventListener('submit', (e) => {
  
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, () => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();
  });
})

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser!');
  }

  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
    socket.emit('sendLocation', {
      latitude,
      longitude
    }, () => {
      $sendLocationButton.removeAttribute('disabled');
    });
  });
});

const initLanguage = () => {
  const { gurulang } = localStorageTokens;
  const { ru, en } = language;

  if (localStorage.getItem(gurulang) === null || localStorage.getItem(gurulang) === en) {
    $languageSwitchButton.innerHTML = ru;
    translate();
  } else {
    $languageSwitchButton.innerHTML = en;
    translate();
  }
}

initLanguage();

const switchLanguage = () => {

  if (
    localStorage.getItem(localStorageTokens.gurulang) === null
    || localStorage.getItem(localStorageTokens.gurulang) === language.en
    ) {
      
    localStorage.setItem(localStorageTokens.gurulang, language.ru);
    $languageSwitchButton.innerHTML = language.en;

    translate();
  } else {
    localStorage.setItem(localStorageTokens.gurulang, language.en);
    $languageSwitchButton.innerHTML = language.ru;

    translate();
  }
};

const initTheme = () => {
  const { gurutheme } = localStorageTokens;

  if (
    localStorage.getItem(gurutheme) === null
    || localStorage.getItem(gurutheme) === 'dark'
  ) {
    $themeSwitchButton.innerHTML = 'wb_sunny';
    document.body.classList.add('guru-dark');
    $sidebar.classList.add('sidebar-dark');
    $messageFormInput.classList.add('guru-input-light');
    $languageSwitchButton.classList.add('guru-language-dark');
    $themeSwitchButton.classList.add('guru-switch-theme-dark');
  } else {
    $themeSwitchButton.innerHTML = 'brightness_3';
    document.body.classList.remove('guru-dark');
    $sidebar.classList.add('sidebar-light');
    $messageFormInput.classList.add('guru-input-dark');
    $languageSwitchButton.classList.add('guru-language-light');
    $themeSwitchButton.classList.add('guru-switch-theme-light');
  }
};

initTheme();

const switchTheme = () => {

  const { gurutheme } = localStorageTokens;

  if (localStorage.getItem(gurutheme) === null || localStorage.getItem(gurutheme) === 'light') {
    localStorage.setItem(gurutheme, 'dark');
    $themeSwitchButton.innerHTML = 'wb_sunny';
    document.body.classList.add('guru-dark');
    $sidebar.classList.remove('sidebar-light');
    $sidebar.classList.add('sidebar-dark');

    $messageFormInput.classList.remove('guru-input-dark');
    $messageFormInput.classList.add('guru-input-light');

    $languageSwitchButton.classList.remove('guru-language-light');
    $languageSwitchButton.classList.add('guru-language-dark');


    $themeSwitchButton.classList.remove('guru-switch-theme-light');
    $themeSwitchButton.classList.add('guru-switch-theme-dark');
  } else {
    localStorage.setItem(gurutheme, 'light');
    $themeSwitchButton.innerHTML = 'brightness_3';
    document.body.classList.remove('guru-dark');
    $sidebar.classList.remove('sidebar-dark');
    $sidebar.classList.add('sidebar-light');

    $messageFormInput.classList.remove('guru-input-light');
    $messageFormInput.classList.add('guru-input-dark');

    $languageSwitchButton.classList.remove('guru-language-dark');
    $languageSwitchButton.classList.add('guru-language-light');

    $themeSwitchButton.classList.remove('guru-switch-theme-dark');
    $themeSwitchButton.classList.add('guru-switch-theme-light');
  }
}

$languageSwitchButton.addEventListener('click', switchLanguage);
$themeSwitchButton.addEventListener('click', switchTheme);

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});

$messages.addEventListener('scroll', (e) => {
  const { target: { scrollHeight, scrollTop, offsetHeight } } = e;

  if (scrollHeight - scrollTop > offsetHeight + 20) {
    $downButton.style.display = 'flex';
  } else {
    $downButton.style.display = 'none';
  }
});

$downButton.addEventListener('click', () => {
  $messages.scrollBy({
    behavior: 'smooth',
    top: $messages.scrollHeight
  })
});