export const getSEOTags = (settlement, pageTitle, pageDescription, pageKeywords = '') => {
  const settlementName = settlement === 'zapovednoe' ? 'ДПК Заповедное' : 'ДПК Колосок';
  const title = pageTitle ? `${pageTitle} | ${settlementName}` : settlementName;
  const description = pageDescription || `Официальный сайт ${settlementName}. Информация о посёлке, участках, новостях и документах.`;
  const keywords = pageKeywords || `дачный посёлок, ДПК, участки, инфраструктура, ${settlementName.toLowerCase()}`;
  return { title, description, keywords };
};