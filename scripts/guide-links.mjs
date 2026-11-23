import {dirname,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));

// Markdown remains readable on GitHub; published guides use site routes.
export function guideUrl(url,file) {
 if(/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(url))return url;
 const end=url.search(/[?#]/);
 const path=end<0?url:url.slice(0,end),suffix=end<0?'':url.slice(end);
 const target=relative(root,resolve(dirname(file),path)).split(sep).join('/');
 if(target.startsWith('docs/')&&target.endsWith('.md'))return `/guides/${target.slice(5,-3)}${suffix}`;
 if(target.startsWith('public/'))return `/${target.slice(7)}${suffix}`;
 return `https://github.com/wilsonsfh/2unemployment/blob/main/${target}${suffix}`;
}

export default function guideLinks({fileURL}) {
 if(!fileURL)return false;
 const file=fileURLToPath(fileURL),path=relative(resolve(root,'docs'),file);
 if(!path.endsWith('.md')||path.startsWith('..'))return false;
 const rewrite=(node,context)=>context.setField(node,'url',guideUrl(node.url,file));
 return {name:'guide-links',link:rewrite,image:rewrite,definition:rewrite};
}
