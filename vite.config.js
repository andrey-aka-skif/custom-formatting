import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.js'),
            name: 'customFormatting',
            fileName: (format) => `index.${format}.js`
        },
    },
    server: {
        open: '/samples/index.html'
    }
})
