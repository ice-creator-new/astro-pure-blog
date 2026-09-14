/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

interface IceI18nWindow {
  __iceMessages?: Record<string, Record<string, string>>
  __iceApplyLocale?: (locale: string) => void
  __iceGetLocale?: () => string
}
interface Window extends IceI18nWindow {}
