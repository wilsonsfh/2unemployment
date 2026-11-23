import {defineConfig} from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

export default defineConfig({
 site: 'https://2unemployment.wilsonsoon.workers.dev',
 output: 'server',
 adapter: cloudflare({imageService:'passthrough'}),
 integrations: [react()],
 session: false,
});
