/** Sample lines cycled through the contrast-checker preview. */
export const PREVIEW_QUOTES = [
  "May the Force be with you.",
  "Life is like a box of chocolates. You never know what you're gonna get.",
  "No amount of money ever bought a second of time.",
  "I'm gonna make him an offer he can't refuse.",
  "Keep your friends close, but your enemies closer.",
  "I am Iron Man.",
  "The world ain't all sunshine and rainbows.",
  "Houston, we have a problem.",
  "Until you start believing in yourself, you ain't gonna have a life.",
  "The hardest choices require the strongest wills.",
  "It ain't about how hard you hit. It's about how hard you can get hit and keep moving forward.",
];

export function randomPreviewQuote(): string {
  return PREVIEW_QUOTES[Math.floor(Math.random() * PREVIEW_QUOTES.length)];
}
