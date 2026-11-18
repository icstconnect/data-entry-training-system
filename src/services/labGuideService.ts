export type GuideLang = 'en' | 'bn';

export type LabGuideContext =
  | 'word-express-dashboard'
  | 'word-express-typing'
  | 'word-express-report'
  | 'touch-typing-dashboard'
  | 'touch-typing-workbench';

const GUIDE_LANG_KEY = 'icst_lab_guide_lang';

export function loadGuideLang(): GuideLang {
  try {
    const saved = localStorage.getItem(GUIDE_LANG_KEY);
    return saved === 'bn' ? 'bn' : 'en';
  } catch {
    return 'en';
  }
}

export function saveGuideLang(lang: GuideLang): void {
  try {
    localStorage.setItem(GUIDE_LANG_KEY, lang);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('icst_guide_lang_changed', { detail: { lang } }));
    }
  } catch {
    // Ignore storage issues
  }
}

export function clearGuideLang(): void {
  try {
    localStorage.removeItem(GUIDE_LANG_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('icst_guide_lang_changed', { detail: { lang: 'en' } }));
    }
  } catch {
    // Ignore
  }
}

export interface GuideTipItem {
  icon: string;
  en: string;
  bn: string;
}

export interface ContextGuideBundle {
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  tips: GuideTipItem[];
}

export const LAB_GUIDE_CONTENT: Record<LabGuideContext, ContextGuideBundle> = {
  'word-express-dashboard': {
    titleEn: 'Quick Start Guide',
    titleBn: 'সহজ শুরু করার গাইড',
    subtitleEn: 'Word Express Delivery Lab',
    subtitleBn: 'ওয়ার্ড এক্সপ্রেস ল্যাব',
    tips: [
      {
        icon: '🎯',
        en: 'Pick Easy, Moderate, or Hard toughness first. Your choice saves automatically in cookies.',
        bn: 'প্রথমে Easy, Moderate বা Hard বেছে নিন। আপনার পছন্দ নিজে থেকেই সেভ হয়ে থাকবে।'
      },
      {
        icon: '🚀',
        en: 'Click any unlocked stage to start in Full Screen mode and grow your courier from Runner to UFO 3.',
        bn: 'যেকোনো খোলা স্টেজে ক্লিক করে Full Screen-এ শুরু করুন। স্ট্রিক বাড়লে মানুষ থেকে UFO 3 পর্যন্ত গাড়ি বড় হবে!'
      },
      {
        icon: '🔥',
        en: 'Pass a stage cleanly and your active streak continues straight into the next stage!',
        bn: 'একটা স্টেজ পাশ করলে আপনার স্ট্রিক পরের স্টেজেও চলতে থাকবে!'
      }
    ]
  },
  'word-express-typing': {
    titleEn: 'Live Typing Help',
    titleBn: 'টাইপিং সহজ গাইড',
    subtitleEn: 'How Word Delivery Works',
    subtitleBn: 'কীভাবে কাজ করে',
    tips: [
      {
        icon: '✋',
        en: 'Rest fingers on A S D F (left) and J K L ; (right). Look at the screen, not the keyboard.',
        bn: 'বাম হাত A S D F আর ডান হাত J K L ; কী-এর ওপর রাখুন। কিবোর্ড না দেখে স্ক্রিনে তাকান।'
      },
      {
        icon: '🚚',
        en: 'The center vehicle waits until you type the full word correctly, then zooms right!',
        bn: 'মাঝের গাড়িটি পুরো শব্দ ঠিকভাবে টাইপ না করা পর্যন্ত দাঁড়িয়ে থাকবে, তারপর ডানদিকে চলে যাবে!'
      },
      {
        icon: '⚡',
        en: 'Wrong key? The center word vibrates and the next vehicle steps down 1 tier. Stay calm and finish!',
        bn: 'ভুল কী চাপলে মাঝের শব্দটা কাঁপবে আর পরের গাড়ি ১ ধাপ নিচে নামবে। তাড়াহুড়ো না করে ঠিক অক্ষর চাপুন।'
      },
      {
        icon: '🖥️',
        en: 'Full Screen keeps the runway and hands aligned. Click "Hand Guide" at top anytime to check fingers.',
        bn: 'ভালোভাবে দেখার জন্য Full Screen চালু রাখা দরকার। আঙুল দেখতে চাইলে ওপরে "Hand Guide"-এ ক্লিক করুন।'
      }
    ]
  },
  'word-express-report': {
    titleEn: 'Understanding Your Report',
    titleBn: 'রিপোর্ট বোঝার সহজ উপায়',
    subtitleEn: 'Interactive Result Analytics',
    subtitleBn: 'আপনার পারফরম্যান্স বিশ্লেষণ',
    tips: [
      {
        icon: '📊',
        en: 'Green bars = perfect words. Click or hover any word bar to see its speed and mistakes.',
        bn: 'সবুজ বার মানে একদম নির্ভুল শব্দ। যেকোনো শব্দের বারে ক্লিক করে তার গতি আর ভুল দেখুন।'
      },
      {
        icon: '🖐️',
        en: 'Check the colored hand map: green fingers are strong, orange/red fingers need a little practice.',
        bn: 'রঙিন হাতের ছবি দেখুন: সবুজ আঙুল খুব ভালো, আর কমলা বা লাল আঙুলে একটু প্র্যাকটিস দরকার।'
      },
      {
        icon: '⌨️',
        en: 'Press Enter to jump to the next stage (keeping your streak!) or press R to retry this stage.',
        bn: 'পরের স্টেজে যেতে Enter চাপুন (স্ট্রিক বজায় থাকবে!), অথবা আবার চেষ্টা করতে R চাপুন।'
      }
    ]
  },
  'touch-typing-dashboard': {
    titleEn: 'Touch Typing Guide',
    titleBn: 'টাচ টাইপিং সহজ গাইড',
    subtitleEn: '25 Levels • Learning & Challenge',
    subtitleBn: '২৫টি লেভেল • শেখা ও চ্যালেঞ্জ',
    tips: [
      {
        icon: '🌱',
        en: 'Levels 1–12 are Learning Focus (relaxed speed & accuracy). Levels 13–25 add fun challenges.',
        bn: 'লেভেল ১ থেকে ১২ সহজে শেখার জন্য। লেভেল ১৩ থেকে ২৫ ধীরে ধীরে গতি ও নির্ভুলতার চ্যালেঞ্জ।'
      },
      {
        icon: '✋',
        en: 'Always feel the tiny raised bumps on F and J keys with your index fingers before typing.',
        bn: 'টাইপ করার আগে দুই হাতের তর্জনী (Index) আঙুল দিয়ে F আর J কী-এর ছোট উঁচু দাগ অনুভব করুন।'
      },
      {
        icon: '⭐',
        en: 'Earn up to 3 Golden Stars per level by beating speed and accuracy goals.',
        bn: 'ভালো গতি ও সঠিক টাইপিং করে প্রতি লেভেলে ৩টি করে গোল্ডেন স্টার জিতুন।'
      }
    ]
  },
  'touch-typing-workbench': {
    titleEn: 'Live Key Guide',
    titleBn: 'লাইভ টাইপিং গাইড',
    subtitleEn: 'Follow the Light Beam',
    subtitleBn: 'আলো দেখে টাইপ করুন',
    tips: [
      {
        icon: '💡',
        en: 'Follow the glowing blue beam straight down to the target key, and use the glowing finger.',
        bn: 'নীল আলোটা যে কী-এর ওপর পড়েছে সেটি চাপুন, আর হাতের যে আঙুলটা জ্বলছে সেটি ব্যবহার করুন।'
      },
      {
        icon: '🔑',
        en: 'The top "Practicing Keys" bar shows all keys in this level and lights up the active key.',
        bn: 'ওপরের "Practicing Keys" বারে এই লেভেলের সব কী দেখা যাবে এবং এখন যেটি চাপতে হবে তা জ্বলবে।'
      },
      {
        icon: '🔥',
        en: 'Accuracy comes before speed — steady typing unlocks higher speed naturally!',
        bn: 'গতির আগে নির্ভুলতা জরুরি — ধীরে ও ঠিকভাবে টাইপ করলে গতি নিজে থেকেই বেড়ে যাবে!'
      }
    ]
  }
};
