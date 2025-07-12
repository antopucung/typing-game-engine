const easyTexts = [
  "The quick brown fox jumps over the lazy dog. This is a simple sentence that contains all letters of the alphabet.",
  "Cats and dogs are popular pets. They bring joy and companionship to many families around the world.",
  "The sun rises in the east and sets in the west. This is a basic fact about our planet Earth.",
  "Books are windows to different worlds. Reading helps us learn new things and expand our imagination.",
  "Water is essential for all life on Earth. We should always remember to stay hydrated throughout the day.",
];

const mediumTexts = [
  "Technology has revolutionized the way we communicate, work, and live our daily lives. From smartphones to artificial intelligence, innovation continues to shape our future in unprecedented ways.",
  "Climate change represents one of the most significant challenges facing humanity today. Scientists worldwide are working tirelessly to develop sustainable solutions and renewable energy sources.",
  "The art of cooking combines creativity, science, and tradition. Master chefs understand that perfect timing, quality ingredients, and passionate dedication are essential for culinary excellence.",
  "Space exploration has captured human imagination for centuries. Modern astronauts and engineers push the boundaries of what's possible, seeking answers to fundamental questions about our universe.",
  "Education serves as the foundation for personal growth and societal progress. Effective learning environments foster critical thinking, creativity, and collaborative problem-solving skills.",
];

const hardTexts = [
  "Quantum mechanics fundamentally challenges our classical understanding of reality, introducing concepts like superposition, entanglement, and wave-particle duality that defy intuitive comprehension yet accurately describe subatomic phenomena.",
  "Neuroplasticity demonstrates the brain's remarkable capacity for reorganization throughout life, enabling recovery from injury, adaptation to new environments, and continuous learning through synaptic modifications and neural pathway restructuring.",
  "Cryptocurrency blockchain technology employs cryptographic hash functions, distributed consensus mechanisms, and immutable ledger systems to create decentralized financial networks that operate independently of traditional banking institutions.",
  "Epigenetic modifications influence gene expression without altering DNA sequences, involving methylation patterns, histone modifications, and non-coding RNA regulation that can be inherited across generations and affected by environmental factors.",
  "Artificial intelligence algorithms utilize machine learning techniques, neural network architectures, and statistical pattern recognition to process vast datasets, enabling autonomous decision-making and predictive analytics across diverse applications.",
];

export function generateText(difficulty: "easy" | "medium" | "hard"): string {
  let texts: string[];
  
  switch (difficulty) {
    case "easy":
      texts = easyTexts;
      break;
    case "medium":
      texts = mediumTexts;
      break;
    case "hard":
      texts = hardTexts;
      break;
    default:
      texts = mediumTexts;
  }
  
  return texts[Math.floor(Math.random() * texts.length)];
}

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function calculateWPM(charactersTyped: number, timeInMinutes: number): number {
  const wordsTyped = charactersTyped / 5; // Standard: 5 characters = 1 word
  return timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;
}

export function calculateAccuracy(totalCharacters: number, errors: number): number {
  return totalCharacters > 0 ? Math.round(((totalCharacters - errors) / totalCharacters) * 100) : 100;
}
