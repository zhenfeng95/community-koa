import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        rules: {
            'no-console': 'off',
            'no-debugger': 'off',
            'no-alert': 'off',
            'no-unused-vars': 'off',
            'no-undef': 'off',
            'no-unreachable': 'off',
            'no-unused-expressions': 'off',
            'no-unused-labels': 'off',
            'no-unused-private-property': 'off'
        }
    }
]);
