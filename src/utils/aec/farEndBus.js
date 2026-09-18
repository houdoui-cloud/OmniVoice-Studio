const subscribers = new Set();

export function subscribeFarEnd(callback) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

export function publishFarEnd(data) {
  for (const sub of subscribers) {
    try {
      sub(data);
    } catch {}
  }
}
