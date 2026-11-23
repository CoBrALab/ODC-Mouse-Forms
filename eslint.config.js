import { config } from '@douglasneuroinformatics/eslint-config';

export default config(
  {
    env: {
      browser: true,
      es2021: true
    },
    react: {
      enabled: true,
      version: '18'
    },
    typescript: {
      enabled: true
    }
  },
  {
    ignores: ['vendor/**/*', '**/TestMyBrain.*.js']
  },
  {
    rules: {
      'perfectionist/sort-objects': 'off'
    }
  }
);
