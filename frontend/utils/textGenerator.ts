const easyTexts = [
  "The quick brown fox jumps over the lazy dog. This is a simple sentence that contains all letters of the alphabet.",
  "Cats and dogs are popular pets. They bring joy and companionship to many families around the world.",
  "The sun rises in the east and sets in the west. This is a basic fact about our planet Earth.",
  "Books are windows to different worlds. Reading helps us learn new things and expand our imagination.",
  "Water is essential for all life on Earth. We should always remember to stay hydrated throughout the day.",
  "Music has the power to heal and inspire. It connects people across cultures and generations.",
  "Exercise is important for maintaining good health. Regular physical activity strengthens both body and mind.",
  "Cooking is both an art and a science. Great chefs combine creativity with precise technique.",
];

const mediumTexts = [
  "Technology has revolutionized the way we communicate, work, and live our daily lives. From smartphones to artificial intelligence, innovation continues to shape our future in unprecedented ways.",
  "Climate change represents one of the most significant challenges facing humanity today. Scientists worldwide are working tirelessly to develop sustainable solutions and renewable energy sources.",
  "The art of cooking combines creativity, science, and tradition. Master chefs understand that perfect timing, quality ingredients, and passionate dedication are essential for culinary excellence.",
  "Space exploration has captured human imagination for centuries. Modern astronauts and engineers push the boundaries of what's possible, seeking answers to fundamental questions about our universe.",
  "Education serves as the foundation for personal growth and societal progress. Effective learning environments foster critical thinking, creativity, and collaborative problem-solving skills.",
  "Photography captures moments in time, preserving memories and emotions for future generations. Digital cameras have democratized this art form, making it accessible to millions worldwide.",
  "Architecture reflects the values and aspirations of civilizations. From ancient pyramids to modern skyscrapers, buildings tell stories about human ingenuity and cultural evolution.",
  "Literature provides insight into the human condition, exploring themes of love, loss, hope, and redemption through compelling narratives and memorable characters.",
];

const hardTexts = [
  "Quantum mechanics fundamentally challenges our classical understanding of reality, introducing concepts like superposition, entanglement, and wave-particle duality that defy intuitive comprehension yet accurately describe subatomic phenomena.",
  "Neuroplasticity demonstrates the brain's remarkable capacity for reorganization throughout life, enabling recovery from injury, adaptation to new environments, and continuous learning through synaptic modifications and neural pathway restructuring.",
  "Cryptocurrency blockchain technology employs cryptographic hash functions, distributed consensus mechanisms, and immutable ledger systems to create decentralized financial networks that operate independently of traditional banking institutions.",
  "Epigenetic modifications influence gene expression without altering DNA sequences, involving methylation patterns, histone modifications, and non-coding RNA regulation that can be inherited across generations and affected by environmental factors.",
  "Artificial intelligence algorithms utilize machine learning techniques, neural network architectures, and statistical pattern recognition to process vast datasets, enabling autonomous decision-making and predictive analytics across diverse applications.",
  "Bioengineering integrates principles from biology, chemistry, physics, and engineering to develop innovative solutions for medical diagnostics, therapeutic interventions, and regenerative medicine applications.",
  "Astrophysics investigates celestial phenomena through electromagnetic radiation analysis, gravitational wave detection, and computational modeling to understand stellar evolution, galactic dynamics, and cosmological structures.",
  "Nanotechnology manipulates matter at the atomic and molecular scale, creating materials with unprecedented properties for applications in electronics, medicine, energy storage, and environmental remediation.",
];

const punctuationTexts = [
  "Hello, world! How are you today? I'm doing well, thank you. Let's practice typing with punctuation: periods, commas, question marks, and exclamation points.",
  "Programming languages use various symbols: semicolons (;), brackets [], parentheses (), and curly braces {}. Don't forget about quotation marks \"like these\" and apostrophes in contractions like don't, won't, and can't.",
  "Mathematical expressions often include: addition (+), subtraction (-), multiplication (*), division (/), and percentages (%). We also use symbols like @ for email addresses and # for hashtags.",
  "Special characters are everywhere: ampersands (&), dollar signs ($), underscores (_), hyphens (-), and forward slashes (/). Web addresses use colons (:) and double slashes (//) frequently.",
];

const numberTexts = [
  "The year 2024 marks significant technological advancement. In 1969, humans first landed on the moon. By 2030, experts predict major breakthroughs in artificial intelligence and renewable energy.",
  "Recipe measurements: 2 cups flour, 1.5 teaspoons salt, 3/4 cup sugar, and 0.25 cups oil. Bake at 350°F for 25-30 minutes. Serves 8-10 people.",
  "Stock prices fluctuated today: AAPL rose 2.5% to $175.32, GOOGL dropped 1.8% to $2,847.91, and TSLA gained 4.2% reaching $891.45 per share.",
  "Scientific notation examples: 6.022 × 10²³ (Avogadro's number), 3.14159 (pi), 2.998 × 10⁸ m/s (speed of light), and 9.81 m/s² (Earth's gravity).",
];

export function generateText(difficulty: "easy" | "medium" | "hard"): string {
  let texts: string[];
  
  switch (difficulty) {
    case "easy":
      // Mix easy texts with some punctuation practice
      texts = [...easyTexts, ...punctuationTexts.slice(0, 2)];
      break;
    case "medium":
      // Mix medium texts with punctuation and numbers
      texts = [...mediumTexts, ...punctuationTexts, ...numberTexts.slice(0, 2)];
      break;
    case "hard":
      // Mix hard texts with all special character types
      texts = [...hardTexts, ...punctuationTexts, ...numberTexts];
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

export function calculateRawWPM(totalKeystrokes: number, timeInMinutes: number): number {
  const wordsTyped = totalKeystrokes / 5;
  return timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;
}

export function calculateNetWPM(correctCharacters: number, timeInMinutes: number): number {
  const wordsTyped = correctCharacters / 5;
  return timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;
}

export function calculateAccuracy(totalCharacters: number, errors: number): number {
  return totalCharacters > 0 ? Math.round(((totalCharacters - errors) / totalCharacters) * 100) : 100;
}

export function calculateAccuracyFromSets(correctChars: Set<number>, incorrectChars: Set<number>): number {
  const total = correctChars.size + incorrectChars.size;
  return total > 0 ? Math.round((correctChars.size / total) * 100) : 100;
}
