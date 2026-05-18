import type { InitialProjectOptions } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})

// Add any custom config to be passed to Jest
const config: InitialProjectOptions = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        '/node_modules/(?!(react-markdown|vfile|vfile-message|unist-.*|unified|bail|is-plain-obj|trough|remark-.*|mdast-util-.*|micromark.*|decode-named-character-reference|character-entities|property-information|comma-separated-tokens|hast-util-.*|space-separated-tokens|web-namespaces|zwitch|html-url-attributes|ccount|devlop|estree-util-.*|@ungap/structured-clone|trim-lines|mdurl|uvu|dequal)/)',
    ],
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
