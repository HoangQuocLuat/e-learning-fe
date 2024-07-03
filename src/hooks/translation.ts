import { useTranslation } from 'react-i18next'

export const useTranslations = (v?: string) => {
  const { t } = useTranslation(v)

  return t
}
