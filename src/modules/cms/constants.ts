export const CMS_ADVERTISEMENT_PLACES = [
  'vk',
  'max',
  'youtube',
  'telegram',
  'tiktok',
] as const;

export type CmsAdvertisementPlace = (typeof CMS_ADVERTISEMENT_PLACES)[number];

export const CMS_BLOGGER_STATUSES = ['В работе', 'Завершен'] as const;
export type CmsBloggerStatus = (typeof CMS_BLOGGER_STATUSES)[number];

// Публикации
// Набор может отличаться на фронте и бэке (аналогично площадкам), поэтому держим его локально.
export const CMS_PUBLICATION_STATUSES = ['В работе', 'Опубликовано'] as const;
export type CmsPublicationStatus = (typeof CMS_PUBLICATION_STATUSES)[number];

export const CMS_MARKETPLACES = ['wb', 'ozon'] as const;
export type CmsMarketplace = (typeof CMS_MARKETPLACES)[number];

export const CMS_CONTACT_TYPES = ['phone', 'email', 'vk', 'telegram'] as const;
export type CmsContactType = (typeof CMS_CONTACT_TYPES)[number];

export const CMS_CONTACT_TYPE_LABELS: Record<CmsContactType, string> = {
  phone: 'Мобильный',
  email: 'Электронная почта',
  vk: 'VK',
  telegram: 'Telegram',
};

export const CMS_ADVERTISEMENT_PLACE_LABELS: Record<string, string> = {
  vk: 'VK',
  max: 'MAX',
  youtube: 'YouTube',
  telegram: 'Telegram',
  tiktok: 'TikTok',
};
