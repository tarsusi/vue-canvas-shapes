import Shape from '@/models/Shape';

let seed = 1;
const rgbCharacters = '0123456789abcdef'.split('');

export const generateRandomRectangle = (maxWidth: number, maxHeight: number): Shape => {
  const randomXPos = Math.random() * maxWidth;
  const randomYPos = Math.random() * maxHeight;
  const randomWidth = Math.random() * (maxWidth / 5 - maxWidth / 6) - maxWidth / 6;
  const randomHeight = Math.random() * (maxHeight / 3 - maxHeight / 5) - maxHeight / 5;
  const randomId = Math.sin(seed++) * 10000;
  const randomColor = `#${Array.from(
    { length: 6 },
    () => rgbCharacters[Math.floor(Math.random() * rgbCharacters.length)],
  ).join('')}`;

  return {
    id: randomId - Math.floor(randomId),
    label: 'Sample Rectangle',
    color: randomColor,
    coordinates: [
      {
        x: randomXPos,
        y: randomYPos,
      },
      {
        x: randomXPos + randomWidth,
        y: randomYPos,
      },
      {
        x: randomXPos + randomWidth,
        y: randomYPos + randomHeight,
      },
      {
        x: randomXPos,
        y: randomYPos + randomHeight,
      },
    ],
  };
};
