import {defineConfig} from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import {satteri} from '@astrojs/markdown-satteri';
import guideLinks from './scripts/guide-links.mjs';

export default defineConfig({
 site: 'https://2unemployment.wilsonsoon.workers.dev',
 output: 'server',
 adapter: cloudflare({imageService:'passthrough'}),
 integrations: [react()],
 markdown: {processor:satteri({mdastPlugins:[guideLinks]})},
 session: false,
});
