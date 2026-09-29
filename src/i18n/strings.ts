import en from './locales/en.json';
import tr from './locales/tr.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ru from './locales/ru.json';
import de from './locales/de.json';

export const LOCALES = ['en', 'tr', 'fr', 'es', 'ru', 'de'] as const;
export type Locale = (typeof LOCALES)[number];
export type TranslationKey = keyof typeof en;
// Every locale must contain the complete interface, including interpolation keys.
export const dictionaries: Record<Locale, Record<TranslationKey, string>> = { en, tr, fr, es, ru, de };
export const LANGUAGES: { id: Locale; label: string }[] = [
  { id: 'tr', label: 'Türkçe' }, { id: 'en', label: 'English' },
  { id: 'fr', label: 'Français' }, { id: 'es', label: 'Español' },
  { id: 'ru', label: 'Русский' }, { id: 'de', label: 'Deutsch' },
];
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && LOCALES.includes(value as Locale);
}
export function translate(locale: Locale, key: string, vars?: Record<string, string>) {
  const dictionary = dictionaries[locale] ?? en;
  const value = dictionary[key as TranslationKey] ?? en[key as TranslationKey] ?? key;
  return value.replace(/\{(\w+)\}/g, (match, name: string) => vars?.[name] ?? match);
}
