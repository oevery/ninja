import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class', // or 'media'
  shortcuts: {
    'content': 'w-11/12 max-w-5xl m-auto',
    'card': 'm-auto mt-5 shadow-lg rounded-lg bg-white overflow-hidden',
    'card-no-shodow': 'm-auto mt-5 rounded-lg bg-white overflow-hidden border',
    'card-header': 'border-b p-4',
    'card-title': 'font-medium text-lg',
    'card-subtitle': 'font-normal text-sm text-gray-500',
    'card-body': 'text-sm p-4',
    'card-footer': 'text-right pl-4 pr-4 pb-4',
  }
})
