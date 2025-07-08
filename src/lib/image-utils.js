export const availableImages = [
  '/stock-photos/card.jpeg',
  '/stock-photos/money.jpeg',
  '/stock-photos/poker.jpeg',
  '/stock-photos/southflorida.jpeg',
  '/stock-photos/southfloridanight.jpeg',
  '/stock-photos/TexasSign.jpeg',
  '/stock-photos/vegasnugget.jpeg',
  '/stock-photos/vegassign.jpeg',
  '/stock-photos/vegasskyline.jpeg',
  '/stock-photos/VegasStreet.jpeg',
];

// This function picks a random image from the list
export const getRandomImage = () => {
  return availableImages[Math.floor(Math.random() * availableImages.length)];
};