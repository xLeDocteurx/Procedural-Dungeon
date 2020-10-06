---
inject: true
to:"<%= folder !== 'debug' || folder !== 'custom' ? `src/scripts/objects/${type}/${folder}/index.ts` : `src/script/object/${type}/index.ts` %>"
append: true
---
export { default as <%= h.inflection.classify(name) %> } from './<%= name %>/<%= name %>'
