import { break_points_value } from '@themes/styled/globalStyle'
import { useMediaQuery } from 'react-responsive'

export const useMobile = () =>
  useMediaQuery({
    query: `(max-width: ${break_points_value.xs}px)`,
  })

export const useTablet = () =>
  useMediaQuery({
    query: `(max-width: ${break_points_value.md}px)`,
  })
