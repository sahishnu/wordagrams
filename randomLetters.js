const DICE = [
  'MMLLBY',
  'VFGKPP',
  'HHNNRR',
  'DFRLLW',
  'RRDLGG',
  'XKBSZN',
  'WHHTTP',
  'CCBTJD',
  'CCMTTS',
  'OIINNY',
  'AEIOUU',
  'AAEEOO'
];

const out = [];
DICE.map(die => {
  const random = Math.floor(Math.random() * die.length);
  out.push(die[random]);
})

console.log(out.join(''));