/**
 * Advanced greeting utilities for dynamic user experience
 */

type GreetingOptions = {
  includeEmoji?: boolean;
  style?: 'formal' | 'casual' | 'enthusiastic';
  showTime?: boolean;
};

/**
 * Get greeting based on time of day and user preferences
 */
export const getAdvancedGreeting = (
  userName?: string, 
  options: GreetingOptions = {}
): string => {
  const { includeEmoji = true, style = 'casual', showTime = false } = options;
  
  const hour = new Date().getHours();
  const name = userName || "caro utente";
  
  // Emoji mappings based on time
  const timeEmojis = {
    morning: ['🌅', '☀️', '🌞', '🌻'],
    afternoon: ['🌤️', '☀️', '🌇', '✨'],
    evening: ['🌙', '🌆', '⭐', '🎵'],
    night: ['🌙', '🌟', '✨', '🎶']
  };
  
  // Greeting variations by style
  const greetings = {
    formal: {
      morning: `Buongiorno, ${name}`,
      afternoon: `Buon pomeriggio, ${name}`,
      evening: `Buonasera, ${name}`,
      night: `Buonanotte, ${name}`
    },
    casual: {
      morning: `Ciao ${name}! 🌅`,
      afternoon: `Hey ${name}! ☀️`,
      evening: `Sera ${name}! 🌙`,
      night: `Ciao ${name}! 🌟`
    },
    enthusiastic: {
      morning: `Buongiorno ${name}! Pronto per una giornata fantastica? 🌅`,
      afternoon: `Ciao ${name}! Come va questo pomeriggio? ☀️`,
      evening: `Sera ${name}! È il momento perfetto per la musica! 🎵`,
      night: `Hey ${name}! Musica notturna? 🌙`
    }
  };
  
  // Determine period
  let period: keyof typeof greetings.formal;
  if (hour < 6) period = 'night';
  else if (hour < 12) period = 'morning';
  else if (hour < 18) period = 'afternoon';
  else if (hour < 22) period = 'evening';
  else period = 'night';
  
  let greeting = greetings[style][period];
  
  // Add random emoji if requested
  if (includeEmoji && style === 'formal') {
    const emojis = timeEmojis[period === 'night' && hour >= 22 ? 'evening' : period];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    greeting += ` ${randomEmoji}`;
  }
  
  // Add time if requested
  if (showTime) {
    const timeString = new Date().toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    greeting += ` (${timeString})`;
  }
  
  return greeting;
};

/**
 * Get personalized subtitle based on user activity time
 */
export const getPersonalizedSubtitle = (): string => {
  const hour = new Date().getHours();
  const day = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  
  const subtitles = {
    earlyMorning: [
      "Il momento perfetto per iniziare con energia! 🚀",
      "La musica migliore per svegliarti bene ☕",
      "Inizia la giornata con il ritmo giusto 🎵"
    ],
    morning: [
      "Scopri nuova musica straordinaria 🎶",
      "La colonna sonora perfetta per la tua giornata 🌟",
      "Trova i tuoi nuovi brani preferiti ✨"
    ],
    afternoon: [
      "Un po' di musica per ricaricare le batterie 🔋",
      "Il momento ideale per esplorare nuovi suoni 🎧",
      "Prenditi una pausa musicale rigenerante 🎵"
    ],
    evening: [
      "È l'ora del relax con la tua musica preferita 🛋️",
      "Concludi la giornata con le note giuste 🎶",
      "Il momento perfetto per scoprire nuovi artisti 🌙"
    ],
    night: [
      "Musica notturna per i tuoi momenti speciali 🌟",
      "Le migliori vibes per la notte 🎵",
      "Soundtracks perfetti per le ore piccole 🌙"
    ],
    weekend: [
      "Weekend vibes: è tempo di buona musica! 🎉",
      "Rilassati e goditi i tuoi suoni preferiti 🎶",
      "Fine settimana = tempo per esplorare nuova musica! 🚀"
    ]
  };
  
  // Weekend check
  if (day === 0 || day === 6) {
    const weekendSubs = subtitles.weekend;
    return weekendSubs[Math.floor(Math.random() * weekendSubs.length)];
  }
  
  // Determine period and get random subtitle
  let period: keyof Omit<typeof subtitles, 'weekend'>;
  if (hour < 7) period = 'earlyMorning';
  else if (hour < 12) period = 'morning';
  else if (hour < 18) period = 'afternoon';
  else if (hour < 22) period = 'evening';
  else period = 'night';
  
  const periodSubs = subtitles[period];
  return periodSubs[Math.floor(Math.random() * periodSubs.length)];
};

/**
 * Get welcome message for first-time users
 */
export const getWelcomeMessage = (userName?: string): string => {
  const name = userName || "nuovo utente";
  
  const welcomeMessages = [
    `Benvenuto ${name}! 🎉 Pronto a scoprire la tua nuova musica preferita?`,
    `Ciao ${name}! 👋 Esplora migliaia di brani straordinari!`,
    `Benvenuto nella tua nuova casa musicale, ${name}! 🏠🎵`,
    `Hey ${name}! 🚀 La tua avventura musicale inizia qui!`,
  ];
  
  return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
};

/**
 * Get activity-based greeting (based on user's listening history)
 */
export const getActivityBasedGreeting = (
  userName?: string,
  _lastActivity?: 'morning' | 'afternoon' | 'evening' | 'night',
  favoriteGenre?: string
): string => {
  const name = userName || "amico";
  
  const activityGreetings = {
    morning: `Ciao ${name}! Pronto per iniziare la giornata con energia? 🌅`,
    afternoon: `Hey ${name}! Un po' di musica per il pomeriggio? ☀️`,
    evening: `Sera ${name}! È il momento del relax musicale 🌆`,
    night: `${name}, è tempo di vibes notturne! 🌙`
  };
  
  const hour = new Date().getHours();
  let currentPeriod: keyof typeof activityGreetings;
  if (hour < 12) currentPeriod = 'morning';
  else if (hour < 18) currentPeriod = 'afternoon';
  else if (hour < 22) currentPeriod = 'evening';
  else currentPeriod = 'night';
  
  let greeting = activityGreetings[currentPeriod];
  
  // Add genre-specific touch if available
  if (favoriteGenre) {
    greeting += ` Che ne dici di un po' di ${favoriteGenre}?`;
  }
  
  return greeting;
};

export default {
  getAdvancedGreeting,
  getPersonalizedSubtitle,
  getWelcomeMessage,
  getActivityBasedGreeting
};
