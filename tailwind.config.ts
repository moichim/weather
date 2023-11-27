import type { Config } from 'tailwindcss'
import {nextui} from "@nextui-org/react";

import colors from 'tailwindcss/colors';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/graphql/weatherSources/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        ntc: {
          ...colors.pink,
          DEFAULT: colors.pink[500]
        }
      }
    },
  },
  darkMode: "class",
  plugins: [nextui({
    addCommonColors: true
  })],
}
export default config
