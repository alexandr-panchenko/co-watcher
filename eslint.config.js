import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tsPlugin from 'typescript-eslint';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import i18nextPlugin from 'eslint-plugin-i18next';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

export default tsPlugin.config(
  {
    ignores: ['dist', 'node_modules', 'public', 'vite.config.ts'],
  },
  js.configs.recommended,
  ...tsPlugin.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      tailwindcss: tailwindPlugin,
      i18next: i18nextPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.flatConfigs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Rule: Zero arbitrary values in Tailwind classNames
      'tailwindcss/no-arbitrary-value': 'error',
    },
  },
  // Line limit relaxed per user directive
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'max-lines': 'off',
    },
  },
  // Rule: Complexity & depth constraints across all source files
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      complexity: ['error', 12],
      'max-depth': ['error', 4],
      'max-params': ['error', 4],
    },
  },
  // Rule: Forbid native interactive elements outside UI Primitives
  {
    files: ['src/components/!(ui)/**/*.tsx', 'src/components/*.tsx'],
    rules: {
      'react/forbid-elements': [
        'error',
        {
          forbid: [
            {
              element: 'button',
              message: 'Use <Button> or <IconButton> or <SegmentedControl> from "src/components/ui" instead of native <button>.',
            },
            {
              element: 'input',
              message: 'Use <Input> from "src/components/ui" instead of native <input>.',
            },
            {
              element: 'textarea',
              message: 'Use <TextArea> from "src/components/ui" instead of native <textarea>.',
            },
          ],
        },
      ],
    },
  },
  // Rule: Forbid unlocalized string literals in JSX for components
  {
    files: ['src/components/**/*.tsx'],
    rules: {
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-text-only',
          'jsx-components': {
            exclude: ['Icon', 'IconButton', 'AspectBadge', 'span'],
          },
          words: {
            exclude: [
              '•',
              '★',
              '✓',
              '16:9',
              '9:16',
              '1080p',
              '4K',
              'YOU',
              'AI',
              'ME',
              'Attention(Q, K, V) = softmax( (Q Kᵀ) / √d_k ) V',
              '12 Jun 2017 (v1), 6 Dec 2017 (v7)',
              'arXiv:1706.03762v7 [cs.CL]',
              'arXiv:1706.03762',
              'Sec 3.2',
              'Section 3.2',
              'Ashish Vaswani*, Noam Shazeer*, Niki Parmar*, Jakob Uszkoreit*, Llion Jones*, Aidan N. Gomez*†, Łukasz Kaiser*, Illia Polosukhin*‡',
              'Google Brain • Google Research • Univ. of Toronto',
            ],
          },
        },
      ],
      'react/jsx-no-literals': [
        'error',
        {
          noStrings: true,
          ignoreProps: true,
          allowedStrings: [
            '•',
            '★',
            '✓',
            '16:9',
            '9:16',
            '1080p',
            '4K',
            '0',
            'x',
            'YOU',
            'AI',
            'ME',
            ' / ',
            '-',
            'dB',
            'Attention(Q, K, V) = softmax( (Q Kᵀ) / √d_k ) V',
            '12 Jun 2017 (v1), 6 Dec 2017 (v7)',
            'arXiv:1706.03762v7 [cs.CL]',
            'arXiv:1706.03762',
            'Sec 3.2',
            'Section 3.2',
            'Ashish Vaswani*, Noam Shazeer*, Niki Parmar*, Jakob Uszkoreit*, Llion Jones*, Aidan N. Gomez*†, Łukasz Kaiser*, Illia Polosukhin*‡',
            'Google Brain • Google Research • Univ. of Toronto',
            // Material Symbols glyph names
            'psychology',
            'schedule',
            'verified',
            'videocam',
            'videocam_off',
            'movie_edit',
            'help_outline',
            'arrow_back',
            'ios_share',
            'auto_awesome',
            'content_cut',
            'volume_off',
            'splitscreen',
            'movie_filter',
            'graphic_eq',
            'closed_caption',
            'timer',
            'play_arrow',
            'tune',
            'explore',
            'filter_list',
            'menu_book',
            'reply',
            'replay',
            'mic',
            'check',
            'speed',
            'progress_activity',
            'history_edu',
            'bolt',
            'check_circle',
            'link',
            'auto_fix_high',
            'info',
            'folder_open',
          ],
        },
      ],
    },
  }
);
