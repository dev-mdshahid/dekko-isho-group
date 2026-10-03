import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// Animation/layout code written before the React Compiler rules existed. These rules are
// advisory (extra renders / HMR), so they warn here instead of failing the deploy gate.
// New files get the full rule set.
const LEGACY_COMPILER_ADVISORY = [
  'src/components/layout/Navbar.tsx',
  'src/components/layout/NavSocialCycle.tsx',
  'src/components/splash/SplashScreen.tsx',
  'src/components/sustainability/SustainabilityFocusCardCarousel.tsx',
  'src/components/sustainability/SustainabilitySdgGoals.tsx',
  'src/context/SplashContext.tsx',
  'src/data/industry/globusGarmentsProcessIcons.tsx',
  'src/data/industry/globusGarmentsResponsibilityIcons.tsx',
  'src/data/industry/industryFeatureIcons.tsx',
  'src/hooks/useMediaQuery.ts',
  'src/hooks/useNavDropdowns.ts',
  'src/hooks/useNavMenu.ts',
  'src/hooks/useSnapshotCardAnimation.ts',
  'src/router.tsx',
]

export default defineConfig([
  globalIgnores(['dist', 'dist-e2e', 'coverage', 'playwright-report', 'test-results']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: LEGACY_COMPILER_ADVISORY,
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'test/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
