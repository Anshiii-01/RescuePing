// @ts-nocheck
/**
 * Localization Service - Issue #176 Implementation
 * 
 * Provides comprehensive multi-language and localization support for
 * disaster response applications including translations, regional formats,
 * cultural adaptations, and language detection.
 */

// Type definitions
type LanguageDirection = 'ltr' | 'rtl';
type TranslationStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'deprecated';
type PluralRule = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
type DateFormat = 'short' | 'medium' | 'long' | 'full' | 'custom';
type NumberFormat = 'decimal' | 'currency' | 'percent' | 'scientific' | 'compact';

// Language and locale interfaces
interface SupportedLanguage {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  direction: LanguageDirection;
  region?: string;
  script?: string;
  status: 'active' | 'beta' | 'deprecated' | 'maintenance';
  completeness: number;
  defaultLocale: string;
  fallbackLanguage?: string;
  translators: string[];
  metadata: LanguageMetadata;
  createdAt: Date;
  updatedAt: Date;
}

interface LanguageMetadata {
  speakers: number;
  countries: string[];
  emergencyRelevance: 'high' | 'medium' | 'low';
  machineTranslationSupport: boolean;
  textToSpeechSupport: boolean;
  spellCheckSupport: boolean;
  dictionaryAvailable: boolean;
  primaryFont: string;
  fallbackFonts: string[];
}

interface LocaleSettings {
  id: string;
  code: string;
  language: string;
  region: string;
  dateFormats: DateFormats;
  timeFormats: TimeFormats;
  numberFormats: NumberFormats;
  currencySettings: CurrencySettings;
  addressFormat: AddressFormat;
  nameFormat: NameFormat;
  contactFormats: ContactFormats;
  unitsOfMeasure: UnitsOfMeasure;
  calendarSettings: CalendarSettings;
  createdAt: Date;
  updatedAt: Date;
}

interface DateFormats {
  short: string;
  medium: string;
  long: string;
  full: string;
  custom?: string;
  separator: string;
  firstDayOfWeek: 0 | 1 | 6;
  monthNames: string[];
  monthNamesShort: string[];
  dayNames: string[];
  dayNamesShort: string[];
  dayNamesMin: string[];
}

interface TimeFormats {
  short: string;
  medium: string;
  long: string;
  is24Hour: boolean;
  amPmStrings: [string, string];
  timeSeparator: string;
  showTimezone: boolean;
  timezoneFormat: 'short' | 'long' | 'offset';
}

interface NumberFormats {
  decimalSeparator: string;
  thousandsSeparator: string;
  groupingSize: number;
  negativePattern: string;
  positivePattern: string;
  nanSymbol: string;
  infinitySymbol: string;
  percentSymbol: string;
  perMilleSymbol: string;
  minusSign: string;
  plusSign: string;
  exponentialSeparator: string;
}

interface CurrencySettings {
  code: string;
  symbol: string;
  name: string;
  symbolPosition: 'before' | 'after';
  spaceBetween: boolean;
  decimalPlaces: number;
  decimalSeparator: string;
  thousandsSeparator: string;
}

interface AddressFormat {
  pattern: string;
  fields: { name: string; label: string; required: boolean }[];
  postalCodePattern?: string;
  postalCodeLabel: string;
  stateProvinceLabel: string;
  countryDefault: string;
}

interface NameFormat {
  pattern: string;
  givenNameFirst: boolean;
  salutations: string[];
  suffixes: string[];
  middleNameSupport: boolean;
}

interface ContactFormats {
  phonePattern: string;
  phoneInternationalPattern: string;
  phonePrefix: string;
  phoneAreaCode?: string;
  emailValidation: string;
}

interface UnitsOfMeasure {
  system: 'metric' | 'imperial' | 'us_customary';
  distance: { unit: string; symbol: string }[];
  speed: { unit: string; symbol: string }[];
  temperature: { unit: string; symbol: string; conversion: string };
  area: { unit: string; symbol: string }[];
  volume: { unit: string; symbol: string }[];
  weight: { unit: string; symbol: string }[];
}

interface CalendarSettings {
  type: 'gregorian' | 'islamic' | 'hebrew' | 'chinese' | 'japanese' | 'buddhist';
  weekNumbers: boolean;
  minimalDaysInFirstWeek: number;
  workdays: number[];
  holidays: { date: string; name: string; type: string }[];
}

// Translation interfaces
interface TranslationResource {
  id: string;
  namespace: string;
  key: string;
  sourceLanguage: string;
  sourceText: string;
  context?: string;
  maxLength?: number;
  description?: string;
  screenshots?: string[];
  tags: string[];
  translations: Translation[];
  metadata: TranslationMetadata;
  createdAt: Date;
  updatedAt: Date;
}

interface Translation {
  languageCode: string;
  text: string;
  status: TranslationStatus;
  pluralForms?: PluralTranslation[];
  genderForms?: GenderTranslation[];
  formalForms?: FormalityTranslation[];
  translator?: string;
  reviewer?: string;
  machineTranslated: boolean;
  confidence?: number;
  lastModified: Date;
  approvedAt?: Date;
  comments?: TranslationComment[];
}

interface PluralTranslation {
  rule: PluralRule;
  text: string;
}

interface GenderTranslation {
  gender: 'masculine' | 'feminine' | 'neutral' | 'other';
  text: string;
}

interface FormalityTranslation {
  level: 'informal' | 'formal' | 'honorific';
  text: string;
}

interface TranslationComment {
  author: string;
  text: string;
  createdAt: Date;
  resolved: boolean;
}

interface TranslationMetadata {
  category: string;
  priority: 'high' | 'medium' | 'low';
  characterLimit?: number;
  platform?: string[];
  screenshots?: string[];
  relatedKeys?: string[];
  glossaryTerms?: string[];
  doNotTranslate?: string[];
}

// Glossary interfaces
interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  context: string;
  caseSensitive: boolean;
  partOfSpeech?: string;
  domain: string[];
  translations: { languageCode: string; term: string; definition?: string }[];
  forbidden?: boolean;
  alternatives?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Translation memory interfaces
interface TranslationMemoryEntry {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceSegment: string;
  targetSegment: string;
  context?: string;
  domain?: string;
  quality: number;
  usageCount: number;
  lastUsed: Date;
  source: 'manual' | 'imported' | 'machine' | 'reviewed';
  metadata?: Record<string, string>;
  createdAt: Date;
}

// Language detection interfaces
interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
  alternatives: { language: string; confidence: number }[];
  script?: string;
  isReliable: boolean;
  inputLength: number;
}

// User language preferences
interface UserLanguagePreferences {
  id: string;
  userId: string;
  primaryLanguage: string;
  secondaryLanguages: string[];
  locale: string;
  autoDetect: boolean;
  formalityLevel: 'informal' | 'formal' | 'auto';
  scriptPreference?: string;
  translationMemoryEnabled: boolean;
  showOriginalText: boolean;
  machineTranslationConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Emergency phrases
interface EmergencyPhrase {
  id: string;
  category: 'evacuation' | 'medical' | 'shelter' | 'safety' | 'assistance' | 'warning' | 'general';
  key: string;
  englishText: string;
  phonetic?: string;
  audioUrl?: string;
  signLanguageVideoUrl?: string;
  translations: Map<string, EmergencyPhraseTranslation>;
  priority: number;
  tags: string[];
}

interface EmergencyPhraseTranslation {
  text: string;
  phonetic?: string;
  audioUrl?: string;
  signLanguageVideoUrl?: string;
  verified: boolean;
  verifiedBy?: string;
}

// Sample data
const sampleLanguages: SupportedLanguage[] = [
  {
    id: 'lang-001',
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    status: 'active',
    completeness: 100,
    defaultLocale: 'en-US',
    translators: ['system'],
    metadata: {
      speakers: 1500000000,
      countries: ['US', 'GB', 'AU', 'CA', 'IN'],
      emergencyRelevance: 'high',
      machineTranslationSupport: true,
      textToSpeechSupport: true,
      spellCheckSupport: true,
      dictionaryAvailable: true,
      primaryFont: 'system-ui',
      fallbackFonts: ['Arial', 'Helvetica', 'sans-serif']
    },
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'lang-002',
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    status: 'active',
    completeness: 98,
    defaultLocale: 'es-ES',
    fallbackLanguage: 'en',
    translators: ['translator-001', 'translator-002'],
    metadata: {
      speakers: 550000000,
      countries: ['ES', 'MX', 'AR', 'CO', 'PE'],
      emergencyRelevance: 'high',
      machineTranslationSupport: true,
      textToSpeechSupport: true,
      spellCheckSupport: true,
      dictionaryAvailable: true,
      primaryFont: 'system-ui',
      fallbackFonts: ['Arial', 'Helvetica', 'sans-serif']
    },
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'lang-003',
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    script: 'Devanagari',
    status: 'active',
    completeness: 95,
    defaultLocale: 'hi-IN',
    fallbackLanguage: 'en',
    translators: ['translator-003'],
    metadata: {
      speakers: 600000000,
      countries: ['IN'],
      emergencyRelevance: 'high',
      machineTranslationSupport: true,
      textToSpeechSupport: true,
      spellCheckSupport: true,
      dictionaryAvailable: true,
      primaryFont: 'Noto Sans Devanagari',
      fallbackFonts: ['Mangal', 'Arial Unicode MS', 'sans-serif']
    },
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'lang-004',
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    status: 'active',
    completeness: 90,
    defaultLocale: 'ar-SA',
    fallbackLanguage: 'en',
    translators: ['translator-004'],
    metadata: {
      speakers: 400000000,
      countries: ['SA', 'EG', 'AE', 'IQ', 'MA'],
      emergencyRelevance: 'high',
      machineTranslationSupport: true,
      textToSpeechSupport: true,
      spellCheckSupport: true,
      dictionaryAvailable: true,
      primaryFont: 'Noto Naskh Arabic',
      fallbackFonts: ['Arial Unicode MS', 'Traditional Arabic', 'sans-serif']
    },
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date()
  }
];

const sampleLocales: LocaleSettings[] = [
  {
    id: 'locale-001',
    code: 'en-US',
    language: 'en',
    region: 'US',
    dateFormats: {
      short: 'M/d/yyyy',
      medium: 'MMM d, yyyy',
      long: 'MMMM d, yyyy',
      full: 'EEEE, MMMM d, yyyy',
      separator: '/',
      firstDayOfWeek: 0,
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    },
    timeFormats: {
      short: 'h:mm a',
      medium: 'h:mm:ss a',
      long: 'h:mm:ss a z',
      is24Hour: false,
      amPmStrings: ['AM', 'PM'],
      timeSeparator: ':',
      showTimezone: true,
      timezoneFormat: 'short'
    },
    numberFormats: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      groupingSize: 3,
      negativePattern: '-#',
      positivePattern: '#',
      nanSymbol: 'NaN',
      infinitySymbol: '∞',
      percentSymbol: '%',
      perMilleSymbol: '‰',
      minusSign: '-',
      plusSign: '+',
      exponentialSeparator: 'E'
    },
    currencySettings: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
      symbolPosition: 'before',
      spaceBetween: false,
      decimalPlaces: 2,
      decimalSeparator: '.',
      thousandsSeparator: ','
    },
    addressFormat: {
      pattern: '{street}\n{city}, {state} {postalCode}\n{country}',
      fields: [
        { name: 'street', label: 'Street Address', required: true },
        { name: 'city', label: 'City', required: true },
        { name: 'state', label: 'State', required: true },
        { name: 'postalCode', label: 'ZIP Code', required: true },
        { name: 'country', label: 'Country', required: false }
      ],
      postalCodePattern: '^\\d{5}(-\\d{4})?$',
      postalCodeLabel: 'ZIP Code',
      stateProvinceLabel: 'State',
      countryDefault: 'United States'
    },
    nameFormat: {
      pattern: '{given} {family}',
      givenNameFirst: true,
      salutations: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'],
      suffixes: ['Jr.', 'Sr.', 'III', 'IV', 'Ph.D.', 'M.D.'],
      middleNameSupport: true
    },
    contactFormats: {
      phonePattern: '(###) ###-####',
      phoneInternationalPattern: '+1 ### ### ####',
      phonePrefix: '+1',
      phoneAreaCode: undefined,
      emailValidation: '^[^@]+@[^@]+\\.[^@]+$'
    },
    unitsOfMeasure: {
      system: 'us_customary',
      distance: [
        { unit: 'mile', symbol: 'mi' },
        { unit: 'foot', symbol: 'ft' },
        { unit: 'inch', symbol: 'in' }
      ],
      speed: [
        { unit: 'miles per hour', symbol: 'mph' }
      ],
      temperature: { unit: 'fahrenheit', symbol: '°F', conversion: 'C*9/5+32' },
      area: [
        { unit: 'square mile', symbol: 'sq mi' },
        { unit: 'acre', symbol: 'ac' },
        { unit: 'square foot', symbol: 'sq ft' }
      ],
      volume: [
        { unit: 'gallon', symbol: 'gal' },
        { unit: 'quart', symbol: 'qt' },
        { unit: 'fluid ounce', symbol: 'fl oz' }
      ],
      weight: [
        { unit: 'pound', symbol: 'lb' },
        { unit: 'ounce', symbol: 'oz' }
      ]
    },
    calendarSettings: {
      type: 'gregorian',
      weekNumbers: false,
      minimalDaysInFirstWeek: 1,
      workdays: [1, 2, 3, 4, 5],
      holidays: [
        { date: '01-01', name: 'New Year\'s Day', type: 'federal' },
        { date: '07-04', name: 'Independence Day', type: 'federal' },
        { date: '12-25', name: 'Christmas Day', type: 'federal' }
      ]
    },
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date()
  }
];

class LocalizationService {
  private static instance: LocalizationService;
  private languages: Map<string, SupportedLanguage> = new Map();
  private locales: Map<string, LocaleSettings> = new Map();
  private translations: Map<string, TranslationResource> = new Map();
  private glossary: Map<string, GlossaryTerm> = new Map();
  private translationMemory: Map<string, TranslationMemoryEntry> = new Map();
  private userPreferences: Map<string, UserLanguagePreferences> = new Map();
  private emergencyPhrases: Map<string, EmergencyPhrase> = new Map();

  private currentLanguage: string = 'en';
  private currentLocale: string = 'en-US';

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): LocalizationService {
    if (!LocalizationService.instance) {
      LocalizationService.instance = new LocalizationService();
    }
    return LocalizationService.instance;
  }

  private initializeSampleData(): void {
    sampleLanguages.forEach(l => this.languages.set(l.code, l));
    sampleLocales.forEach(l => this.locales.set(l.code, l));
    this.initializeEmergencyPhrases();
  }

  private initializeEmergencyPhrases(): void {
    const phrases: Omit<EmergencyPhrase, 'id' | 'translations'>[] = [
      {
        category: 'evacuation',
        key: 'evacuate_now',
        englishText: 'Evacuate immediately!',
        phonetic: 'ee-VAK-yoo-ayt im-EE-dee-it-lee',
        priority: 1,
        tags: ['urgent', 'safety']
      },
      {
        category: 'medical',
        key: 'need_help',
        englishText: 'I need medical help',
        phonetic: 'eye need MED-ih-kul help',
        priority: 1,
        tags: ['medical', 'assistance']
      },
      {
        category: 'shelter',
        key: 'shelter_location',
        englishText: 'Where is the nearest shelter?',
        phonetic: 'wair iz thuh NEER-est SHEL-ter',
        priority: 2,
        tags: ['shelter', 'location']
      },
      {
        category: 'safety',
        key: 'stay_calm',
        englishText: 'Please stay calm',
        phonetic: 'pleez stay kahm',
        priority: 2,
        tags: ['safety', 'instruction']
      },
      {
        category: 'warning',
        key: 'danger_ahead',
        englishText: 'Danger ahead!',
        phonetic: 'DAYN-jer uh-HED',
        priority: 1,
        tags: ['warning', 'danger']
      }
    ];

    phrases.forEach((phrase, index) => {
      const id = `phrase-${String(index + 1).padStart(3, '0')}`;
      const translations = new Map<string, EmergencyPhraseTranslation>();
      translations.set('es', { text: this.getSpanishTranslation(phrase.key), verified: true });
      translations.set('hi', { text: this.getHindiTranslation(phrase.key), verified: true });
      
      this.emergencyPhrases.set(id, {
        ...phrase,
        id,
        translations
      });
    });
  }

  private getSpanishTranslation(key: string): string {
    const translations: Record<string, string> = {
      'evacuate_now': '¡Evacuar inmediatamente!',
      'need_help': 'Necesito ayuda médica',
      'shelter_location': '¿Dónde está el refugio más cercano?',
      'stay_calm': 'Por favor, mantenga la calma',
      'danger_ahead': '¡Peligro adelante!'
    };
    return translations[key] || '';
  }

  private getHindiTranslation(key: string): string {
    const translations: Record<string, string> = {
      'evacuate_now': 'तुरंत खाली करें!',
      'need_help': 'मुझे चिकित्सा सहायता चाहिए',
      'shelter_location': 'निकटतम आश्रय कहां है?',
      'stay_calm': 'कृपया शांत रहें',
      'danger_ahead': 'आगे खतरा!'
    };
    return translations[key] || '';
  }

  // ==================== Language Management ====================

  async getLanguage(code: string): Promise<SupportedLanguage | null> {
    return this.languages.get(code) || null;
  }

  async getLanguages(params?: {
    status?: SupportedLanguage['status'];
    direction?: LanguageDirection;
    emergencyRelevance?: 'high' | 'medium' | 'low';
  }): Promise<SupportedLanguage[]> {
    let languages = Array.from(this.languages.values());

    if (params?.status) {
      languages = languages.filter(l => l.status === params.status);
    }

    if (params?.direction) {
      languages = languages.filter(l => l.direction === params.direction);
    }

    if (params?.emergencyRelevance) {
      languages = languages.filter(l => l.metadata.emergencyRelevance === params.emergencyRelevance);
    }

    return languages.sort((a, b) => b.completeness - a.completeness);
  }

  async addLanguage(params: Omit<SupportedLanguage, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupportedLanguage> {
    const language: SupportedLanguage = {
      ...params,
      id: `lang-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.languages.set(language.code, language);
    return language;
  }

  async setCurrentLanguage(code: string): Promise<void> {
    const language = await this.getLanguage(code);
    if (!language) throw new Error(`Language not supported: ${code}`);
    this.currentLanguage = code;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // ==================== Locale Management ====================

  async getLocale(code: string): Promise<LocaleSettings | null> {
    return this.locales.get(code) || null;
  }

  async getLocales(languageCode?: string): Promise<LocaleSettings[]> {
    let locales = Array.from(this.locales.values());

    if (languageCode) {
      locales = locales.filter(l => l.language === languageCode);
    }

    return locales.sort((a, b) => a.code.localeCompare(b.code));
  }

  async addLocale(params: Omit<LocaleSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<LocaleSettings> {
    const locale: LocaleSettings = {
      ...params,
      id: `locale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.locales.set(locale.code, locale);
    return locale;
  }

  async setCurrentLocale(code: string): Promise<void> {
    const locale = await this.getLocale(code);
    if (!locale) throw new Error(`Locale not supported: ${code}`);
    this.currentLocale = code;
    this.currentLanguage = locale.language;
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

  // ==================== Translation Management ====================

  async addTranslation(params: Omit<TranslationResource, 'id' | 'createdAt' | 'updatedAt'>): Promise<TranslationResource> {
    const resource: TranslationResource = {
      ...params,
      id: `trans-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.translations.set(`${params.namespace}:${params.key}`, resource);
    return resource;
  }

  async getTranslation(namespace: string, key: string, languageCode?: string): Promise<string> {
    const resource = this.translations.get(`${namespace}:${key}`);
    if (!resource) return key;

    const targetLang = languageCode || this.currentLanguage;
    const translation = resource.translations.find(t => t.languageCode === targetLang);

    if (translation && translation.status === 'published') {
      return translation.text;
    }

    // Try fallback language
    const language = await this.getLanguage(targetLang);
    if (language?.fallbackLanguage) {
      const fallbackTranslation = resource.translations.find(t => t.languageCode === language.fallbackLanguage);
      if (fallbackTranslation) return fallbackTranslation.text;
    }

    return resource.sourceText;
  }

  async translate(namespace: string, key: string, languageCode: string, translation: Omit<Translation, 'languageCode'>): Promise<TranslationResource> {
    const resource = this.translations.get(`${namespace}:${key}`);
    if (!resource) throw new Error(`Translation resource not found: ${namespace}:${key}`);

    const existingIndex = resource.translations.findIndex(t => t.languageCode === languageCode);
    const newTranslation: Translation = { ...translation, languageCode };

    if (existingIndex >= 0) {
      resource.translations[existingIndex] = newTranslation;
    } else {
      resource.translations.push(newTranslation);
    }

    // Update completeness
    await this.updateLanguageCompleteness(languageCode);

    resource.updatedAt = new Date();
    return resource;
  }

  private async updateLanguageCompleteness(languageCode: string): Promise<void> {
    const language = this.languages.get(languageCode);
    if (!language) return;

    const allResources = Array.from(this.translations.values());
    const translatedResources = allResources.filter(r =>
      r.translations.some(t => t.languageCode === languageCode && t.status === 'published')
    );

    language.completeness = allResources.length > 0 ?
      Math.round((translatedResources.length / allResources.length) * 100) : 0;
    language.updatedAt = new Date();
  }

  async getTranslationStatus(namespace: string, key: string): Promise<{ language: string; status: TranslationStatus }[]> {
    const resource = this.translations.get(`${namespace}:${key}`);
    if (!resource) return [];

    return resource.translations.map(t => ({
      language: t.languageCode,
      status: t.status
    }));
  }

  // ==================== Interpolation ====================

  interpolate(template: string, params: Record<string, string | number>): string {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match;
    });
  }

  async translateWithParams(
    namespace: string,
    key: string,
    params: Record<string, string | number>,
    languageCode?: string
  ): Promise<string> {
    const template = await this.getTranslation(namespace, key, languageCode);
    return this.interpolate(template, params);
  }

  // ==================== Formatting ====================

  formatDate(date: Date, format: DateFormat = 'medium', localeCode?: string): string {
    const locale = this.locales.get(localeCode || this.currentLocale);
    if (!locale) return date.toLocaleDateString();

    const pattern = locale.dateFormats[format];
    return this.applyDatePattern(date, pattern, locale.dateFormats);
  }

  private applyDatePattern(date: Date, pattern: string, formats: DateFormats): string {
    return pattern
      .replace('EEEE', formats.dayNames[date.getDay()])
      .replace('EEE', formats.dayNamesShort[date.getDay()])
      .replace('MMMM', formats.monthNames[date.getMonth()])
      .replace('MMM', formats.monthNamesShort[date.getMonth()])
      .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
      .replace('M', String(date.getMonth() + 1))
      .replace('dd', String(date.getDate()).padStart(2, '0'))
      .replace('d', String(date.getDate()))
      .replace('yyyy', String(date.getFullYear()))
      .replace('yy', String(date.getFullYear()).slice(-2));
  }

  formatNumber(value: number, format: NumberFormat = 'decimal', localeCode?: string): string {
    const locale = this.locales.get(localeCode || this.currentLocale);
    if (!locale) return value.toString();

    const numFormat = locale.numberFormats;

    switch (format) {
      case 'currency':
        return this.formatCurrency(value, localeCode);
      case 'percent':
        return `${(value * 100).toFixed(0)}${numFormat.percentSymbol}`;
      case 'compact':
        return this.formatCompact(value);
      default:
        return this.formatDecimal(value, numFormat);
    }
  }

  private formatDecimal(value: number, format: NumberFormats): string {
    const parts = value.toString().split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, format.thousandsSeparator);
    return parts[1] ? `${integerPart}${format.decimalSeparator}${parts[1]}` : integerPart;
  }

  formatCurrency(value: number, localeCode?: string): string {
    const locale = this.locales.get(localeCode || this.currentLocale);
    if (!locale) return `$${value.toFixed(2)}`;

    const currency = locale.currencySettings;
    const formattedValue = this.formatDecimal(Math.abs(value), locale.numberFormats);
    const sign = value < 0 ? '-' : '';

    if (currency.symbolPosition === 'before') {
      return currency.spaceBetween ?
        `${sign}${currency.symbol} ${formattedValue}` :
        `${sign}${currency.symbol}${formattedValue}`;
    } else {
      return currency.spaceBetween ?
        `${sign}${formattedValue} ${currency.symbol}` :
        `${sign}${formattedValue}${currency.symbol}`;
    }
  }

  private formatCompact(value: number): string {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  }

  // ==================== Language Detection ====================

  detectLanguage(text: string): LanguageDetectionResult {
    // Simplified language detection based on character patterns
    const patterns: { language: string; pattern: RegExp }[] = [
      { language: 'ar', pattern: /[\u0600-\u06FF]/ },
      { language: 'hi', pattern: /[\u0900-\u097F]/ },
      { language: 'zh', pattern: /[\u4E00-\u9FFF]/ },
      { language: 'ja', pattern: /[\u3040-\u309F\u30A0-\u30FF]/ },
      { language: 'ko', pattern: /[\uAC00-\uD7AF]/ },
      { language: 'ru', pattern: /[\u0400-\u04FF]/ }
    ];

    for (const { language, pattern } of patterns) {
      if (pattern.test(text)) {
        return {
          detectedLanguage: language,
          confidence: 0.95,
          alternatives: [{ language: 'en', confidence: 0.05 }],
          isReliable: true,
          inputLength: text.length
        };
      }
    }

    // Default to English for Latin script
    return {
      detectedLanguage: 'en',
      confidence: 0.7,
      alternatives: [
        { language: 'es', confidence: 0.1 },
        { language: 'fr', confidence: 0.1 },
        { language: 'de', confidence: 0.1 }
      ],
      isReliable: text.length > 20,
      inputLength: text.length
    };
  }

  // ==================== Emergency Phrases ====================

  async getEmergencyPhrase(key: string, languageCode?: string): Promise<EmergencyPhraseTranslation | null> {
    const phrase = Array.from(this.emergencyPhrases.values())
      .find(p => p.key === key);

    if (!phrase) return null;

    const lang = languageCode || this.currentLanguage;
    if (lang === 'en') {
      return {
        text: phrase.englishText,
        phonetic: phrase.phonetic,
        audioUrl: phrase.audioUrl,
        signLanguageVideoUrl: phrase.signLanguageVideoUrl,
        verified: true
      };
    }

    return phrase.translations.get(lang) || null;
  }

  async getEmergencyPhrases(category?: EmergencyPhrase['category']): Promise<EmergencyPhrase[]> {
    let phrases = Array.from(this.emergencyPhrases.values());

    if (category) {
      phrases = phrases.filter(p => p.category === category);
    }

    return phrases.sort((a, b) => a.priority - b.priority);
  }

  // ==================== User Preferences ====================

  async getUserPreferences(userId: string): Promise<UserLanguagePreferences | null> {
    return this.userPreferences.get(userId) || null;
  }

  async setUserPreferences(params: Omit<UserLanguagePreferences, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserLanguagePreferences> {
    const prefs: UserLanguagePreferences = {
      ...params,
      id: `prefs-${params.userId}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.userPreferences.set(params.userId, prefs);
    return prefs;
  }

  async updateUserPreferences(userId: string, updates: Partial<UserLanguagePreferences>): Promise<UserLanguagePreferences> {
    const prefs = this.userPreferences.get(userId);
    if (!prefs) throw new Error(`User preferences not found: ${userId}`);

    Object.assign(prefs, updates);
    prefs.updatedAt = new Date();
    return prefs;
  }

  // ==================== Glossary Management ====================

  async addGlossaryTerm(params: Omit<GlossaryTerm, 'id' | 'createdAt' | 'updatedAt'>): Promise<GlossaryTerm> {
    const term: GlossaryTerm = {
      ...params,
      id: `term-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.glossary.set(term.term.toLowerCase(), term);
    return term;
  }

  async getGlossaryTerm(term: string): Promise<GlossaryTerm | null> {
    return this.glossary.get(term.toLowerCase()) || null;
  }

  async searchGlossary(query: string, domain?: string): Promise<GlossaryTerm[]> {
    const lowerQuery = query.toLowerCase();
    let terms = Array.from(this.glossary.values())
      .filter(t => t.term.toLowerCase().includes(lowerQuery) ||
                   t.definition.toLowerCase().includes(lowerQuery));

    if (domain) {
      terms = terms.filter(t => t.domain.includes(domain));
    }

    return terms;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalLanguages: number;
    activeLanguages: number;
    rtlLanguages: number;
    totalLocales: number;
    totalTranslations: number;
    publishedTranslations: number;
    averageCompleteness: number;
    totalGlossaryTerms: number;
    totalEmergencyPhrases: number;
    languagesByStatus: { status: string; count: number }[];
    languagesByRelevance: { relevance: string; count: number }[];
  }> {
    const languages = Array.from(this.languages.values());
    const locales = Array.from(this.locales.values());
    const translations = Array.from(this.translations.values());
    const allTranslations = translations.flatMap(r => r.translations);

    const statusCounts: Record<string, number> = {};
    const relevanceCounts: Record<string, number> = {};

    languages.forEach(l => {
      statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
      relevanceCounts[l.metadata.emergencyRelevance] = (relevanceCounts[l.metadata.emergencyRelevance] || 0) + 1;
    });

    return {
      totalLanguages: languages.length,
      activeLanguages: languages.filter(l => l.status === 'active').length,
      rtlLanguages: languages.filter(l => l.direction === 'rtl').length,
      totalLocales: locales.length,
      totalTranslations: translations.length,
      publishedTranslations: allTranslations.filter(t => t.status === 'published').length,
      averageCompleteness: languages.length > 0 ?
        languages.reduce((sum, l) => sum + l.completeness, 0) / languages.length : 0,
      totalGlossaryTerms: this.glossary.size,
      totalEmergencyPhrases: this.emergencyPhrases.size,
      languagesByStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
      languagesByRelevance: Object.entries(relevanceCounts).map(([relevance, count]) => ({ relevance, count }))
    };
  }
}

export const localizationService = LocalizationService.getInstance();
export default LocalizationService;
