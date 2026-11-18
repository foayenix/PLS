const dayInMs = 86400000;

export function reviewState(attempts) {
  const results = new Map();
  for (const attempt of [...attempts].sort((a, b) => a.date.localeCompare(b.date))) {
    const previous = results.get(attempt.questionId);
    const streak = attempt.correct ? (previous?.streak ?? 0) + 1 : 0;
    const interval = streak ? Math.min(14, 2 ** (streak - 1)) * dayInMs : 4 * 60 * 60 * 1000;
    results.set(attempt.questionId, { streak, due: Date.parse(attempt.date) + interval });
  }
  return results;
}

export function chooseCards(cards, reviews, mode, length, now, random = Math.random) {
  const candidates = cards.filter(card => mode === 'mixed' || mode === card.kind);
  const queue = candidates.map(card => {
    const review = reviews.get(card.id);
    const tier = !review ? 1 : review.due <= now ? 0 : 2;
    return { card, tier, due: review?.due ?? now, tie: random() };
  }).sort((a, b) => a.tier - b.tier || a.due - b.due || a.tie - b.tie);

  if (mode !== 'mixed') return queue.slice(0, length).map(item => item.card);

  const kinds = { flash: 0, debug: 0 };
  const picked = [];
  while (queue.length && picked.length < length) {
    const tier = queue[0].tier;
    const preferred = kinds.flash <= kinds.debug ? 'flash' : 'debug';
    const index = queue.findIndex(item => item.tier === tier && item.card.kind === preferred);
    const [{ card }] = queue.splice(index === -1 ? 0 : index, 1);
    kinds[card.kind] += 1;
    picked.push(card);
  }
  return picked;
}
