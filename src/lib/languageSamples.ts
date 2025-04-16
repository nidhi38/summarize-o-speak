
// Language-specific sample texts for the AudioConverter component
export const languageSamples = {
  hi: {
    samples: [
      "नमस्ते, स्पीच कनवर्टर में आपका स्वागत है",
      "यह हिंदी में एक परीक्षण उदाहरण पाठ है",
      "आप इस ऐप का उपयोग भाषण को टेक्स्ट में और इसके विपरीत परिवर्तित करने के लिए कर सकते हैं"
    ]
  },
  ar: {
    samples: [
      "مرحبا بك في محول الكلام إلى نص",
      "هذا مثال نص باللغة العربية للاختبار",
      "يمكنك استخدام هذا التطبيق لتحويل الكلام إلى نص والعكس"
    ]
  },
  zh: {
    samples: [
      "欢迎使用语音转换器",
      "这是一个中文测试示例文本",
      "您可以使用此应用程序将语音转换为文本，反之亦然"
    ]
  },
  es: {
    samples: [
      "Bienvenido al convertidor de voz",
      "Este es un texto de ejemplo en español para probar",
      "Puedes usar esta aplicación para convertir voz a texto y viceversa"
    ]
  },
  fr: {
    samples: [
      "Bienvenue au convertisseur vocal",
      "Ceci est un exemple de texte en français pour tester",
      "Vous pouvez utiliser cette application pour convertir la parole en texte et vice versa"
    ]
  },
  de: {
    samples: [
      "Willkommen beim Sprachkonverter",
      "Dies ist ein Beispieltext auf Deutsch zum Testen",
      "Sie können diese Anwendung verwenden, um Sprache in Text und umgekehrt umzuwandeln"
    ]
  },
  ru: {
    samples: [
      "Добро пожаловать в конвертер речи",
      "Это пример текста на русском языке для тестирования",
      "Вы можете использовать это приложение для преобразования речи в текст и наоборот"
    ]
  },
  ja: {
    samples: [
      "音声コンバーターへようこそ",
      "これは日本語のテストサンプルテキストです",
      "このアプリを使用して、音声をテキストに、またはその逆に変換できます"
    ]
  },
  ko: {
    samples: [
      "음성 변환기에 오신 것을 환영합니다",
      "이것은 테스트를 위한 한국어 샘플 텍스트입니다",
      "이 앱을 사용하여 음성을 텍스트로 또는 그 반대로 변환할 수 있습니다"
    ]
  },
  it: {
    samples: [
      "Benvenuto al convertitore vocale",
      "Questo è un testo di esempio in italiano per testare",
      "Puoi utilizzare questa applicazione per convertire la voce in testo e viceversa"
    ]
  },
  pt: {
    samples: [
      "Bem-vindo ao conversor de fala",
      "Este é um texto de exemplo em português para teste",
      "Você pode usar este aplicativo para converter fala em texto e vice-versa"
    ]
  },
  en: {
    samples: [
      "Welcome to the Speech Converter",
      "This is an English sample text for testing",
      "You can use this app to convert speech to text and vice versa"
    ]
  },
  tr: {
    samples: [
      "Konuşma Dönüştürücüsüne Hoş Geldiniz",
      "Bu, test için bir Türkçe örnek metnidir",
      "Bu uygulamayı konuşmayı metne ve tam tersine dönüştürmek için kullanabilirsiniz"
    ]
  },
  pl: {
    samples: [
      "Witamy w Konwerterze Mowy",
      "To jest przykładowy tekst w języku polskim do testowania",
      "Możesz użyć tej aplikacji do konwersji mowy na tekst i odwrotnie"
    ]
  },
  nl: {
    samples: [
      "Welkom bij de Spraakconverter",
      "Dit is een Nederlandse voorbeeldtekst om te testen",
      "Je kunt deze app gebruiken om spraak naar tekst en vice versa te converteren"
    ]
  },
  sv: {
    samples: [
      "Välkommen till talomvandlaren",
      "Detta är en svensk exempeltext för testning",
      "Du kan använda denna app för att konvertera tal till text och vice versa"
    ]
  },
  uk: {
    samples: [
      "Ласкаво просимо до конвертера мовлення",
      "Це приклад тексту українською мовою для тестування",
      "Ви можете використовувати цей додаток для перетворення мовлення в текст і навпаки"
    ]
  }
};

// Helper functions for language samples
export function getRandomSampleForLanguage(languageCode: string): string {
  const language = languageSamples[languageCode as keyof typeof languageSamples];
  if (!language || !language.samples || language.samples.length === 0) {
    return "Sample text not available for this language.";
  }
  
  const samples = language.samples;
  const randomIndex = Math.floor(Math.random() * samples.length);
  return samples[randomIndex];
}

export function getAllLanguagesWithSamples(): string[] {
  return Object.keys(languageSamples);
}

export function isSampleAvailableForLanguage(languageCode: string): boolean {
  return Boolean(languageSamples[languageCode as keyof typeof languageSamples]);
}
