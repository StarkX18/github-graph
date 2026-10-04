export function newEntryId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyEntry() {
  return {
    id: newEntryId(),
    quantity: '',
    description: '',
    link: '',
    image: '',
  };
}

export function entriesFromDay(day) {
  if (Array.isArray(day.entries) && day.entries.length > 0) {
    return day.entries.map((entry) => ({
      id: entry.id || newEntryId(),
      quantity: String(entry.quantity ?? ''),
      description: entry.description ?? '',
      link: entry.link ?? '',
      image: entry.image ?? '',
    }));
  }

  if (day.value > 0) {
    return [
      {
        id: newEntryId(),
        quantity: String(day.value),
        description: day.note ?? '',
        link: '',
        image: '',
      },
    ];
  }

  return [createEmptyEntry()];
}

export function serializeEntries(formEntries) {
  return formEntries
    .map((entry) => {
      const quantity = parseFloat(entry.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) return null;
      return {
        id: entry.id || newEntryId(),
        quantity,
        description: entry.description.trim(),
        link: entry.link.trim(),
        image: entry.image.trim(),
      };
    })
    .filter(Boolean);
}

export function hasValidEntries(formEntries) {
  return serializeEntries(formEntries).length > 0;
}

export function readImageFile(file, maxBytes = 800_000) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }
    if (file.size > maxBytes) {
      reject(new Error('Image must be under 800 KB'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(file);
  });
}
