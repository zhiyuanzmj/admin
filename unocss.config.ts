import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      blue: { 500: '#409EFF' },
    },
  },
  shortcuts: [
    // ['btn', 'px-4 py-1 rounded inline-block transition duration-200 ease-in-out bg-gray-500 dark:bg-gray-200 text-base cursor-pointer hover:!bg-blue-500 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['btn', 'inline-block cursor-pointer text-base select-none transition duration-200 ease-in-out hover:text-blue-500 text-gray-500  dark:text-gray-200'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      // warn: true,
      prefix: '',
      extraProperties: {
        display: 'inline-block',
      },
      collections: {
        custom: FileSystemIconLoader(
          './src/assets/icons',
        ),
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
})
