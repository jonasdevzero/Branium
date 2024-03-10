const emojiCountRegex = /\p{Emoji}/gu;

const emojiRegex =
  /^(?:(?:\p{RI}\p{RI}|\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*)|[\u{1f900}-\u{1f9ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}])+$/u;

export function isOnlyEmoji(str: string) {
  const stringToTest = str.replace(/ /g, "");
  return emojiRegex.test(stringToTest) && Number.isNaN(Number(stringToTest));
}

export function countEmojis(str: string) {
  const emojis = str.match(emojiCountRegex);

  return emojis ? emojis.length : 0;
}