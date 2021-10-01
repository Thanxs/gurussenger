// Elements
const $messageForm = document.querySelector('#guru-form');
const $messageFormInput = document.querySelector('.guru-input');
const $messageFormButton = document.querySelector('#guru-submit');
const $sendLocationButton = document.querySelector('#guru-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');
const $languageSwitchButton = document.querySelector('.guru-language');
const $themeSwitchButton = document.querySelector('.guru-switch-theme');
const $downButton = document.querySelector('.down-button');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;