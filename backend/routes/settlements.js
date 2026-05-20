const express = require('express');
const router = express.Router();

// Статические данные для контактов и прочего
const settlementsData = {
  zapovednoe: {
    name: 'ДПК «Заповедное»',
    address: 'Московская область, Рузский район, д. Заповедное',
    phone: '+7 (495) 123-45-67',
    email: 'zapovednoe@dpk.ru',
    mapEmbed: 'https://yandex.ru/map-widget/v1/?ll=36.123,55.123&z=15',
    about: 'Посёлок «Заповедное» основан в 2010 году...',
    rules: 'Устав и правила...'
  },
  kolosok: {
    name: 'ДПК «Колосок»',
    address: 'Московская область, Истринский район, д. Колосок',
    phone: '+7 (495) 987-65-43',
    email: 'kolosok@dpk.ru',
    mapEmbed: 'https://yandex.ru/map-widget/v1/?ll=37.123,55.987&z=15',
    about: 'Посёлок «Колосок» славится своей природой...',
    rules: 'Правила внутреннего распорядка...'
  }
};

router.get('/:settlement', (req, res) => {
  const settlement = req.params.settlement;
  if (!settlementsData[settlement]) return res.status(404).json({ message: 'Посёлок не найден' });
  res.json(settlementsData[settlement]);
});

module.exports = router;