/**
 * Multilingual Service
 * Internationalization, translations, and language management for India-focused disaster app
 */

// Supported language code
type LanguageCode = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'kn' | 'ml' | 'bn' | 'pa' | 'or' | 'as' | 'ur';

// Script type
type ScriptType = 'latin' | 'devanagari' | 'gujarati' | 'tamil' | 'telugu' | 'kannada' | 'malayalam' | 'bengali' | 'gurmukhi' | 'odia' | 'assamese' | 'arabic';

// Translation status
type TranslationStatus = 'pending' | 'in_progress' | 'translated' | 'reviewed' | 'approved' | 'rejected';

// Content type
type ContentType = 'ui' | 'alert' | 'notification' | 'document' | 'report' | 'help' | 'legal' | 'marketing';

// Language definition
interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: ScriptType;
  direction: 'ltr' | 'rtl';
  region: string;
  isDefault: boolean;
  isEnabled: boolean;
  completionPercentage: number;
  lastUpdated: Date;
  contributors: string[];
  fallbackLanguage?: LanguageCode;
  numberFormat: {
    decimal: string;
    thousand: string;
    currency: string;
    currencySymbol: string;
  };
  dateFormat: {
    short: string;
    medium: string;
    long: string;
    full: string;
  };
  timeFormat: {
    short: string;
    medium: string;
    is24Hour: boolean;
  };
}

// Translation key
interface TranslationKey {
  id: string;
  key: string;
  namespace: string;
  contentType: ContentType;
  description?: string;
  context?: string;
  maxLength?: number;
  placeholders: Placeholder[];
  tags: string[];
  isPlural: boolean;
  pluralForms?: ('zero' | 'one' | 'two' | 'few' | 'many' | 'other')[];
  screenshots?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Placeholder
interface Placeholder {
  name: string;
  type: 'string' | 'number' | 'date' | 'time' | 'currency' | 'percentage';
  description?: string;
  example?: string;
}

// Translation
interface Translation {
  id: string;
  keyId: string;
  languageCode: LanguageCode;
  value: string;
  pluralValues?: {
    zero?: string;
    one?: string;
    two?: string;
    few?: string;
    many?: string;
    other?: string;
  };
  status: TranslationStatus;
  translatedBy?: string;
  translatedAt?: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  comments: TranslationComment[];
  history: TranslationHistory[];
  machineTranslated: boolean;
  confidence?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Translation comment
interface TranslationComment {
  id: string;
  userId: string;
  comment: string;
  type: 'suggestion' | 'question' | 'issue' | 'note';
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
}

// Translation history
interface TranslationHistory {
  value: string;
  changedBy: string;
  changedAt: Date;
  reason?: string;
}

// Namespace
interface Namespace {
  id: string;
  name: string;
  description?: string;
  prefix: string;
  keyCount: number;
  translationStats: { languageCode: LanguageCode; translated: number; approved: number }[];
  createdAt: Date;
  updatedAt: Date;
}

// Glossary term
interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  context?: string;
  translations: { languageCode: LanguageCode; translation: string; approved: boolean }[];
  doNotTranslate: boolean;
  caseSensitive: boolean;
  category: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Translation memory entry
interface TranslationMemory {
  id: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  sourceText: string;
  targetText: string;
  context?: string;
  score: number;
  usageCount: number;
  lastUsed: Date;
  createdAt: Date;
}

// Import/Export format
type ImportExportFormat = 'json' | 'csv' | 'xliff' | 'po' | 'android_xml' | 'ios_strings';

// Translation job
interface TranslationJob {
  id: string;
  name: string;
  description?: string;
  sourceLanguage: LanguageCode;
  targetLanguages: LanguageCode[];
  keyIds: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignees: { languageCode: LanguageCode; userId: string; assignedAt: Date }[];
  deadline?: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  progress: { languageCode: LanguageCode; translated: number; total: number }[];
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
}

// User language preference
interface UserLanguagePreference {
  userId: string;
  preferredLanguage: LanguageCode;
  fallbackLanguages: LanguageCode[];
  dateFormat?: string;
  timeFormat?: string;
  numberFormat?: string;
  autoDetect: boolean;
  lastDetectedLanguage?: LanguageCode;
  updatedAt: Date;
}

// Content localization
interface LocalizedContent {
  id: string;
  contentId: string;
  contentType: ContentType;
  languageCode: LanguageCode;
  title?: string;
  body: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  status: TranslationStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Translation statistics
interface TranslationStatistics {
  totalKeys: number;
  byLanguage: {
    languageCode: LanguageCode;
    name: string;
    totalKeys: number;
    translated: number;
    approved: number;
    pending: number;
    completionPercentage: number;
  }[];
  byNamespace: {
    namespace: string;
    totalKeys: number;
    translated: number;
  }[];
  byContentType: {
    contentType: ContentType;
    totalKeys: number;
    translated: number;
  }[];
  recentActivity: {
    date: string;
    translations: number;
    approvals: number;
  }[];
  topContributors: {
    userId: string;
    name: string;
    translations: number;
    approvals: number;
  }[];
}

// Sample translations
const SAMPLE_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'common.appName': {
    en: 'Rescue Ping',
    hi: 'अलर्ट एड',
    mr: 'अलर्ट एड',
    gu: 'અલર્ટ એઇડ',
    ta: 'அலர்ட் எய்ட்',
    te: 'అలర్ట్ ఎయిడ్',
    kn: 'ಅಲರ್ಟ್ ಏಡ್',
    ml: 'അലേർട്ട് എയ്ഡ്',
    bn: 'অ্যালার্ট এইড',
    pa: 'ਅਲਰਟ ਏਡ',
    or: 'ଆଲର୍ଟ ଏଡ୍',
    as: 'এলাৰ্ট এইড',
    ur: 'الرٹ ایڈ',
  },
  'alert.emergency': {
    en: 'Emergency Alert',
    hi: 'आपातकालीन चेतावनी',
    mr: 'आणीबाणी सूचना',
    gu: 'કટોકટી ચેતવણી',
    ta: 'அவசர எச்சரிக்கை',
    te: 'అత్యవసర హెచ్చరిక',
    kn: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ',
    ml: 'അടിയന്തര മുന്നറിയിപ്പ്',
    bn: 'জরুরি সতর্কতা',
    pa: 'ਐਮਰਜੈਂਸੀ ਅਲਰਟ',
    or: 'ଜରୁରୀ ସତର୍କତା',
    as: 'জৰুৰীকালীন সতৰ্কবাণী',
    ur: 'ہنگامی انتباہ',
  },
  'alert.flood': {
    en: 'Flood Warning',
    hi: 'बाढ़ की चेतावनी',
    mr: 'पूर इशारा',
    gu: 'પૂર ચેતવણી',
    ta: 'வெள்ள எச்சரிக்கை',
    te: 'వరద హెచ్చరిక',
    kn: 'ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ',
    ml: 'വെള്ളപ്പൊക്ക മുന്നറിയിപ്പ്',
    bn: 'বন্যা সতর্কতা',
    pa: 'ਹੜ੍ਹ ਚੇਤਾਵਨੀ',
    or: 'ବନ୍ୟା ସତର୍କତା',
    as: 'বান সতৰ্কবাণী',
    ur: 'سیلاب کی وارننگ',
  },
  'alert.earthquake': {
    en: 'Earthquake Alert',
    hi: 'भूकंप चेतावनी',
    mr: 'भूकंप सूचना',
    gu: 'ધરતીકંપ ચેતવણી',
    ta: 'பூகம்ப எச்சரிக்கை',
    te: 'భూకంప హెచ్చరిక',
    kn: 'ಭೂಕಂಪ ಎಚ್ಚರಿಕೆ',
    ml: 'ഭൂകമ്പ മുന്നറിയിപ്പ്',
    bn: 'ভূমিকম্প সতর্কতা',
    pa: 'ਭੂਚਾਲ ਚੇਤਾਵਨੀ',
    or: 'ଭୂମିକମ୍ପ ସତର୍କତା',
    as: 'ভূমিকম্প সতৰ্কবাণী',
    ur: 'زلزلے کا انتباہ',
  },
  'alert.cyclone': {
    en: 'Cyclone Warning',
    hi: 'चक्रवात चेतावनी',
    mr: 'चक्रीवादळ इशारा',
    gu: 'વાવાઝોડું ચેતવણી',
    ta: 'புயல் எச்சரிக்கை',
    te: 'తుఫాను హెచ్చరిక',
    kn: 'ಚಂಡಮಾರುತ ಎಚ್ಚರಿಕೆ',
    ml: 'ചുഴലിക്കാറ്റ് മുന്നറിയിപ്പ്',
    bn: 'ঘূর্ণিঝড় সতর্কতা',
    pa: 'ਚੱਕਰਵਾਤ ਚੇਤਾਵਨੀ',
    or: 'ବାତ୍ୟା ସତର୍କତା',
    as: 'ঘূৰ্ণীবতাহ সতৰ্কবাণী',
    ur: 'طوفان کی وارننگ',
  },
  'action.evacuate': {
    en: 'Evacuate Immediately',
    hi: 'तुरंत निकासी करें',
    mr: 'त्वरित स्थलांतर करा',
    gu: 'તાત્કાલિક ખાલી કરો',
    ta: 'உடனடியாக வெளியேறுங்கள்',
    te: 'వెంటనే ఖాళీ చేయండి',
    kn: 'ತಕ್ಷಣ ಸ್ಥಳಾಂತರಿಸಿ',
    ml: 'ഉടൻ ഒഴിഞ്ഞുപോകുക',
    bn: 'অবিলম্বে সরে যান',
    pa: 'ਤੁਰੰਤ ਖਾਲੀ ਕਰੋ',
    or: 'ତୁରନ୍ତ ସ୍ଥାନାନ୍ତର କରନ୍ତୁ',
    as: 'তৎক্ষণাত স্থানান্তৰ কৰক',
    ur: 'فوری طور پر انخلاء کریں',
  },
  'status.safe': {
    en: 'I am Safe',
    hi: 'मैं सुरक्षित हूं',
    mr: 'मी सुरक्षित आहे',
    gu: 'હું સુરક્ષિત છું',
    ta: 'நான் பாதுகாப்பாக இருக்கிறேன்',
    te: 'నేను సురక్షితంగా ఉన్నాను',
    kn: 'ನಾನು ಸುರಕ್ಷಿತ',
    ml: 'ഞാൻ സുരക്ഷിതമാണ്',
    bn: 'আমি নিরাপদ',
    pa: 'ਮੈਂ ਸੁਰੱਖਿਅਤ ਹਾਂ',
    or: 'ମୁଁ ସୁରକ୍ଷିତ',
    as: 'মই নিৰাপদ',
    ur: 'میں محفوظ ہوں',
  },
  'help.needHelp': {
    en: 'I Need Help',
    hi: 'मुझे मदद चाहिए',
    mr: 'मला मदत हवी आहे',
    gu: 'મને મદદ જોઈએ છે',
    ta: 'எனக்கு உதவி தேவை',
    te: 'నాకు సహాయం కావాలి',
    kn: 'ನನಗೆ ಸಹಾಯ ಬೇಕು',
    ml: 'എനിക്ക് സഹായം വേണം',
    bn: 'আমার সাহায্য দরকার',
    pa: 'ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ',
    or: 'ମୋତେ ସାହାଯ୍ୟ ଦରକାର',
    as: 'মোক সহায় লাগে',
    ur: 'مجھے مدد چاہیے',
  },
  'shelter.findShelter': {
    en: 'Find Nearest Shelter',
    hi: 'निकटतम आश्रय खोजें',
    mr: 'जवळचा आश्रय शोधा',
    gu: 'નજીકનું આશ્રય શોધો',
    ta: 'அருகிலுள்ள தங்குமிடத்தைக் கண்டறியுங்கள்',
    te: 'సమీపంలోని ఆశ్రయం కనుగొనండి',
    kn: 'ಹತ್ತಿರದ ಆಶ್ರಯ ಹುಡುಕಿ',
    ml: 'അടുത്തുള്ള ഷെൽട്ടർ കണ്ടെത്തുക',
    bn: 'নিকটতম আশ্রয় খুঁজুন',
    pa: 'ਨਜ਼ਦੀਕੀ ਆਸਰਾ ਲੱਭੋ',
    or: 'ନିକଟତମ ଆଶ୍ରୟ ଖୋଜନ୍ତୁ',
    as: 'ওচৰৰ আশ্ৰয় বিচাৰক',
    ur: 'قریب ترین پناہ گاہ تلاش کریں',
  },
  'donate.donateNow': {
    en: 'Donate Now',
    hi: 'अभी दान करें',
    mr: 'आता दान करा',
    gu: 'હવે દાન કરો',
    ta: 'இப்போது நன்கொடை அளியுங்கள்',
    te: 'ఇప్పుడు విరాళం ఇవ్వండి',
    kn: 'ಈಗ ದಾನ ಮಾಡಿ',
    ml: 'ഇപ്പോൾ സംഭാവന ചെയ്യുക',
    bn: 'এখনই দান করুন',
    pa: 'ਹੁਣੇ ਦਾਨ ਕਰੋ',
    or: 'ବର୍ତ୍ତମାନ ଦାନ କରନ୍ତୁ',
    as: 'এতিয়াই দান কৰক',
    ur: 'ابھی عطیہ دیں',
  },
};

class MultilingualService {
  private static instance: MultilingualService;
  private languages: Map<LanguageCode, Language> = new Map();
  private translationKeys: Map<string, TranslationKey> = new Map();
  private translations: Map<string, Translation> = new Map();
  private namespaces: Map<string, Namespace> = new Map();
  private glossary: Map<string, GlossaryTerm> = new Map();
  private translationMemory: TranslationMemory[] = [];
  private userPreferences: Map<string, UserLanguagePreference> = new Map();
  private localizedContent: Map<string, LocalizedContent> = new Map();
  private jobs: Map<string, TranslationJob> = new Map();
  private currentLanguage: LanguageCode = 'en';
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): MultilingualService {
    if (!MultilingualService.instance) {
      MultilingualService.instance = new MultilingualService();
    }
    return MultilingualService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize languages
    const languageData: Omit<Language, 'lastUpdated'>[] = [
      { code: 'en', name: 'English', nativeName: 'English', script: 'latin', direction: 'ltr', region: 'India', isDefault: true, isEnabled: true, completionPercentage: 100, contributors: ['system'], numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'devanagari', direction: 'ltr', region: 'India', isDefault: false, isEnabled: true, completionPercentage: 95, contributors: ['translator-1'], fallbackLanguage: 'en', numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'devanagari', direction: 'ltr', region: 'Maharashtra', isDefault: false, isEnabled: true, completionPercentage: 90, contributors: ['translator-2'], fallbackLanguage: 'hi', numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'gujarati', direction: 'ltr', region: 'Gujarat', isDefault: false, isEnabled: true, completionPercentage: 85, contributors: ['translator-3'], fallbackLanguage: 'hi', numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'tamil', direction: 'ltr', region: 'Tamil Nadu', isDefault: false, isEnabled: true, completionPercentage: 88, contributors: ['translator-4'], fallbackLanguage: 'en', numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'telugu', direction: 'ltr', region: 'Andhra Pradesh', isDefault: false, isEnabled: true, completionPercentage: 82, contributors: ['translator-5'], fallbackLanguage: 'en', numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'kannada', direction: 'ltr', region: 'Karnataka', isDefault: false, isEnabled: true, completionPercentage: 80, contributors: ['translator-6'], fallbackLanguage: 'en', numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
      { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'malayalam', direction: 'ltr', region: 'Kerala', isDefault: false, isEnabled: true, completionPercentage: 78, contributors: ['translator-7'], fallbackLanguage: 'en', numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'bengali', direction: 'ltr', region: 'West Bengal', isDefault: false, isEnabled: true, completionPercentage: 75, contributors: ['translator-8'], fallbackLanguage: 'en', numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'gurmukhi', direction: 'ltr', region: 'Punjab', isDefault: false, isEnabled: true, completionPercentage: 70, contributors: ['translator-9'], fallbackLanguage: 'hi', numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
      { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'odia', direction: 'ltr', region: 'Odisha', isDefault: false, isEnabled: true, completionPercentage: 65, contributors: ['translator-10'], fallbackLanguage: 'hi', numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
      { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'assamese', direction: 'ltr', region: 'Assam', isDefault: false, isEnabled: true, completionPercentage: 60, contributors: ['translator-11'], fallbackLanguage: 'bn', numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
      { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'arabic', direction: 'rtl', region: 'India', isDefault: false, isEnabled: true, completionPercentage: 72, contributors: ['translator-12'], fallbackLanguage: 'hi', numberFormat: { decimal: '.', thousand: ',', currency: 'INR', currencySymbol: '₹' }, dateFormat: { short: 'DD/MM/YYYY', medium: 'DD MMM YYYY', long: 'DD MMMM YYYY', full: 'dddd, DD MMMM YYYY' }, timeFormat: { short: 'HH:mm', medium: 'HH:mm:ss', is24Hour: true } },
    ];

    languageData.forEach((lang) => {
      this.languages.set(lang.code, { ...lang, lastUpdated: new Date() });
    });

    // Initialize namespaces
    const namespaceData = [
      { id: 'ns-common', name: 'common', description: 'Common UI elements', prefix: 'common' },
      { id: 'ns-alerts', name: 'alerts', description: 'Alert messages and notifications', prefix: 'alert' },
      { id: 'ns-actions', name: 'actions', description: 'Action buttons and commands', prefix: 'action' },
      { id: 'ns-status', name: 'status', description: 'Status indicators', prefix: 'status' },
      { id: 'ns-help', name: 'help', description: 'Help and support content', prefix: 'help' },
      { id: 'ns-shelter', name: 'shelter', description: 'Shelter related content', prefix: 'shelter' },
      { id: 'ns-donate', name: 'donate', description: 'Donation related content', prefix: 'donate' },
    ];

    namespaceData.forEach((ns) => {
      this.namespaces.set(ns.id, {
        ...ns,
        keyCount: 0,
        translationStats: [],
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      });
    });

    // Initialize translation keys and translations from sample data
    let keyIndex = 0;
    Object.entries(SAMPLE_TRANSLATIONS).forEach(([key, translations]) => {
      const [namespace] = key.split('.');
      const nsId = `ns-${namespace}` === 'ns-common' ? 'ns-common' : Array.from(this.namespaces.values()).find((n) => key.startsWith(n.prefix))?.id || 'ns-common';

      const translationKey: TranslationKey = {
        id: `key-${(++keyIndex).toString().padStart(6, '0')}`,
        key,
        namespace: nsId,
        contentType: key.startsWith('alert') ? 'alert' : key.startsWith('help') ? 'help' : 'ui',
        description: `Translation for ${key}`,
        placeholders: [],
        tags: [namespace],
        isPlural: false,
        createdBy: 'system',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };

      this.translationKeys.set(translationKey.id, translationKey);

      // Create translations for each language
      Object.entries(translations).forEach(([langCode, value]) => {
        const translation: Translation = {
          id: `trans-${translationKey.id}-${langCode}`,
          keyId: translationKey.id,
          languageCode: langCode as LanguageCode,
          value,
          status: 'approved',
          translatedBy: langCode === 'en' ? 'system' : `translator-${Math.floor(Math.random() * 12) + 1}`,
          translatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          approvedBy: 'admin-1',
          approvedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          comments: [],
          history: [],
          machineTranslated: false,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        };

        this.translations.set(translation.id, translation);
      });
    });

    // Initialize glossary terms
    const glossaryTerms = [
      { term: 'Evacuation', definition: 'The process of moving people from a dangerous place to safety', category: 'disaster' },
      { term: 'Shelter', definition: 'A place providing protection from danger or bad weather', category: 'facility' },
      { term: 'Alert', definition: 'A warning or notification of potential danger', category: 'notification' },
      { term: 'Relief', definition: 'Aid and assistance provided to disaster victims', category: 'assistance' },
      { term: 'Cyclone', definition: 'A system of winds rotating around a center of low atmospheric pressure', category: 'disaster' },
    ];

    glossaryTerms.forEach((gt, index) => {
      const term: GlossaryTerm = {
        id: `gloss-${(index + 1).toString().padStart(6, '0')}`,
        term: gt.term,
        definition: gt.definition,
        translations: [],
        doNotTranslate: false,
        caseSensitive: false,
        category: gt.category,
        createdBy: 'system',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.glossary.set(term.id, term);
    });

    // Initialize user preferences
    for (let i = 1; i <= 50; i++) {
      const languages: LanguageCode[] = ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'kn', 'ml', 'bn', 'pa', 'or', 'as', 'ur'];
      const pref: UserLanguagePreference = {
        userId: `user-${i}`,
        preferredLanguage: languages[i % languages.length],
        fallbackLanguages: ['en'],
        autoDetect: true,
        updatedAt: new Date(),
      };
      this.userPreferences.set(pref.userId, pref);
    }
  }

  /**
   * Get translation
   */
  public t(key: string, options?: { language?: LanguageCode; params?: Record<string, unknown>; count?: number }): string {
    const language = options?.language || this.currentLanguage;

    // Find translation key
    const translationKey = Array.from(this.translationKeys.values()).find((tk) => tk.key === key);
    if (!translationKey) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    // Find translation
    const translation = Array.from(this.translations.values()).find(
      (t) => t.keyId === translationKey.id && t.languageCode === language
    );

    let value = translation?.value;

    // Try fallback language
    if (!value) {
      const fallbackLang = this.languages.get(language)?.fallbackLanguage;
      if (fallbackLang) {
        const fallbackTranslation = Array.from(this.translations.values()).find(
          (t) => t.keyId === translationKey.id && t.languageCode === fallbackLang
        );
        value = fallbackTranslation?.value;
      }
    }

    // Fall back to English
    if (!value) {
      const enTranslation = Array.from(this.translations.values()).find(
        (t) => t.keyId === translationKey.id && t.languageCode === 'en'
      );
      value = enTranslation?.value || key;
    }

    // Handle pluralization
    if (options?.count !== undefined && translation?.pluralValues) {
      value = this.getPluralForm(translation.pluralValues, options.count, language) || value;
    }

    // Replace placeholders
    if (options?.params) {
      Object.entries(options.params).forEach(([param, paramValue]) => {
        value = value!.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), String(paramValue));
      });
    }

    return value;
  }

  /**
   * Get plural form
   */
  private getPluralForm(
    pluralValues: Translation['pluralValues'],
    count: number,
    language: LanguageCode
  ): string | undefined {
    if (!pluralValues) return undefined;

    // Simple plural rules (can be extended for more complex languages)
    if (count === 0 && pluralValues.zero) return pluralValues.zero;
    if (count === 1 && pluralValues.one) return pluralValues.one;
    if (count === 2 && pluralValues.two) return pluralValues.two;
    if (count >= 3 && count <= 10 && pluralValues.few) return pluralValues.few;
    if (count > 10 && pluralValues.many) return pluralValues.many;
    return pluralValues.other;
  }

  /**
   * Set current language
   */
  public setLanguage(language: LanguageCode): void {
    const lang = this.languages.get(language);
    if (!lang || !lang.isEnabled) {
      throw new Error(`Language ${language} is not available`);
    }
    this.currentLanguage = language;
    this.emit('language_changed', { language });
  }

  /**
   * Get current language
   */
  public getCurrentLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  /**
   * Get language info
   */
  public getLanguage(code: LanguageCode): Language | undefined {
    return this.languages.get(code);
  }

  /**
   * Get all languages
   */
  public getLanguages(enabledOnly: boolean = true): Language[] {
    let languages = Array.from(this.languages.values());
    if (enabledOnly) {
      languages = languages.filter((l) => l.isEnabled);
    }
    return languages.sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : a.name.localeCompare(b.name)));
  }

  /**
   * Add translation
   */
  public addTranslation(data: {
    keyId: string;
    languageCode: LanguageCode;
    value: string;
    pluralValues?: Translation['pluralValues'];
    translatedBy: string;
    machineTranslated?: boolean;
  }): Translation {
    const key = this.translationKeys.get(data.keyId);
    if (!key) throw new Error('Translation key not found');

    const translation: Translation = {
      id: `trans-${data.keyId}-${data.languageCode}-${Date.now()}`,
      keyId: data.keyId,
      languageCode: data.languageCode,
      value: data.value,
      pluralValues: data.pluralValues,
      status: 'translated',
      translatedBy: data.translatedBy,
      translatedAt: new Date(),
      comments: [],
      history: [],
      machineTranslated: data.machineTranslated || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.translations.set(translation.id, translation);

    // Add to translation memory
    this.addToTranslationMemory('en', data.languageCode, this.getEnglishValue(data.keyId), data.value);

    this.emit('translation_added', translation);
    return translation;
  }

  /**
   * Get English value for a key
   */
  private getEnglishValue(keyId: string): string {
    const enTranslation = Array.from(this.translations.values()).find(
      (t) => t.keyId === keyId && t.languageCode === 'en'
    );
    return enTranslation?.value || '';
  }

  /**
   * Add to translation memory
   */
  private addToTranslationMemory(
    sourceLanguage: LanguageCode,
    targetLanguage: LanguageCode,
    sourceText: string,
    targetText: string
  ): void {
    const existing = this.translationMemory.find(
      (tm) =>
        tm.sourceLanguage === sourceLanguage &&
        tm.targetLanguage === targetLanguage &&
        tm.sourceText === sourceText
    );

    if (existing) {
      existing.targetText = targetText;
      existing.usageCount++;
      existing.lastUsed = new Date();
    } else {
      this.translationMemory.push({
        id: `tm-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        sourceLanguage,
        targetLanguage,
        sourceText,
        targetText,
        score: 100,
        usageCount: 1,
        lastUsed: new Date(),
        createdAt: new Date(),
      });
    }
  }

  /**
   * Search translation memory
   */
  public searchTranslationMemory(
    sourceText: string,
    sourceLanguage: LanguageCode,
    targetLanguage: LanguageCode,
    minScore: number = 70
  ): { sourceText: string; targetText: string; score: number }[] {
    return this.translationMemory
      .filter(
        (tm) =>
          tm.sourceLanguage === sourceLanguage &&
          tm.targetLanguage === targetLanguage &&
          this.calculateSimilarity(tm.sourceText, sourceText) >= minScore
      )
      .map((tm) => ({
        sourceText: tm.sourceText,
        targetText: tm.targetText,
        score: this.calculateSimilarity(tm.sourceText, sourceText),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  /**
   * Calculate string similarity (simple Levenshtein-based percentage)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 100;

    const distance = this.levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
    return Math.round(((longer.length - distance) / longer.length) * 100);
  }

  /**
   * Levenshtein distance
   */
  private levenshteinDistance(s1: string, s2: string): number {
    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  /**
   * Get translation statistics
   */
  public getStatistics(): TranslationStatistics {
    const totalKeys = this.translationKeys.size;
    const languages = Array.from(this.languages.values());

    const byLanguage = languages.map((lang) => {
      const langTranslations = Array.from(this.translations.values()).filter(
        (t) => t.languageCode === lang.code
      );
      const translated = langTranslations.filter((t) => t.status !== 'pending').length;
      const approved = langTranslations.filter((t) => t.status === 'approved').length;

      return {
        languageCode: lang.code,
        name: lang.nativeName,
        totalKeys,
        translated,
        approved,
        pending: totalKeys - translated,
        completionPercentage: Math.round((translated / totalKeys) * 100),
      };
    });

    const byNamespace = Array.from(this.namespaces.values()).map((ns) => {
      const nsKeys = Array.from(this.translationKeys.values()).filter((k) => k.namespace === ns.id);
      const translated = nsKeys.filter((k) =>
        Array.from(this.translations.values()).some((t) => t.keyId === k.id && t.status !== 'pending')
      ).length;

      return {
        namespace: ns.name,
        totalKeys: nsKeys.length,
        translated,
      };
    });

    return {
      totalKeys,
      byLanguage,
      byNamespace,
      byContentType: [],
      recentActivity: [],
      topContributors: [],
    };
  }

  /**
   * Get translation keys
   */
  public getTranslationKeys(filters?: {
    namespace?: string;
    contentType?: ContentType;
    search?: string;
  }): TranslationKey[] {
    let keys = Array.from(this.translationKeys.values());

    if (filters?.namespace) {
      keys = keys.filter((k) => k.namespace === filters.namespace);
    }

    if (filters?.contentType) {
      keys = keys.filter((k) => k.contentType === filters.contentType);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      keys = keys.filter(
        (k) => k.key.toLowerCase().includes(search) || k.description?.toLowerCase().includes(search)
      );
    }

    return keys;
  }

  /**
   * Get translations for key
   */
  public getTranslationsForKey(keyId: string): Translation[] {
    return Array.from(this.translations.values()).filter((t) => t.keyId === keyId);
  }

  /**
   * Format number
   */
  public formatNumber(num: number, language?: LanguageCode): string {
    const lang = this.languages.get(language || this.currentLanguage);
    if (!lang) return num.toString();

    return new Intl.NumberFormat(this.getLocale(lang.code), {
      useGrouping: true,
    }).format(num);
  }

  /**
   * Format currency
   */
  public formatCurrency(amount: number, language?: LanguageCode): string {
    const lang = this.languages.get(language || this.currentLanguage);
    if (!lang) return `₹${amount}`;

    return new Intl.NumberFormat(this.getLocale(lang.code), {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }

  /**
   * Format date
   */
  public formatDate(date: Date, format: 'short' | 'medium' | 'long' | 'full' = 'medium', language?: LanguageCode): string {
    const lang = this.languages.get(language || this.currentLanguage);
    
    let options: Intl.DateTimeFormatOptions;
    switch(format) {
      case 'short':
        options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        break;
      case 'medium':
        options = { day: '2-digit', month: 'short', year: 'numeric' };
        break;
      case 'long':
        options = { day: '2-digit', month: 'long', year: 'numeric' };
        break;
      case 'full':
        options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
        break;
      default:
        options = { day: '2-digit', month: 'short', year: 'numeric' };
    }

    return new Intl.DateTimeFormat(this.getLocale(lang?.code || 'en'), options).format(date);
  }

  /**
   * Format time
   */
  public formatTime(date: Date, language?: LanguageCode): string {
    const lang = this.languages.get(language || this.currentLanguage);

    return new Intl.DateTimeFormat(this.getLocale(lang?.code || 'en'), {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !lang?.timeFormat.is24Hour,
    }).format(date);
  }

  /**
   * Get locale string for Intl
   */
  private getLocale(code: LanguageCode): string {
    const localeMap: Record<LanguageCode, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      bn: 'bn-IN',
      pa: 'pa-IN',
      or: 'or-IN',
      as: 'as-IN',
      ur: 'ur-IN',
    };
    return localeMap[code] || 'en-IN';
  }

  /**
   * Get user preference
   */
  public getUserPreference(userId: string): UserLanguagePreference | undefined {
    return this.userPreferences.get(userId);
  }

  /**
   * Set user preference
   */
  public setUserPreference(userId: string, preference: Partial<Omit<UserLanguagePreference, 'userId' | 'updatedAt'>>): UserLanguagePreference {
    const existing = this.userPreferences.get(userId) || {
      userId,
      preferredLanguage: 'en',
      fallbackLanguages: ['en'],
      autoDetect: true,
      updatedAt: new Date(),
    };

    const updated: UserLanguagePreference = {
      ...existing,
      ...preference,
      userId,
      updatedAt: new Date(),
    };

    this.userPreferences.set(userId, updated);
    return updated;
  }

  /**
   * Get namespaces
   */
  public getNamespaces(): Namespace[] {
    return Array.from(this.namespaces.values());
  }

  /**
   * Get glossary
   */
  public getGlossary(category?: string): GlossaryTerm[] {
    let terms = Array.from(this.glossary.values());
    if (category) {
      terms = terms.filter((t) => t.category === category);
    }
    return terms.sort((a, b) => a.term.localeCompare(b.term));
  }

  /**
   * Subscribe to events
   */
  public subscribe(callback: (event: string, data: unknown) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  /**
   * Emit event
   */
  private emit(event: string, data: unknown): void {
    this.listeners.forEach((callback) => callback(event, data));
  }
}

export const multilingualService = MultilingualService.getInstance();
export type {
  LanguageCode,
  ScriptType,
  TranslationStatus,
  ContentType,
  Language,
  TranslationKey,
  Placeholder,
  Translation,
  TranslationComment,
  TranslationHistory,
  Namespace,
  GlossaryTerm,
  TranslationMemory,
  ImportExportFormat,
  TranslationJob,
  UserLanguagePreference,
  LocalizedContent,
  TranslationStatistics,
};
