import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

import { includeIgnoreFile } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const gitignorePath = resolve(__dirname, ".gitignore")

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  includeIgnoreFile(gitignorePath),
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:prettier/recommended"
  ),
  {
    "rules": {
      "no-unused-vars": "off",
      "react/react-in-jsx-scope": "off",
      "prettier/prettier": 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    }
  },
]

export default eslintConfig
