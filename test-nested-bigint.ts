import { jeon2js } from './src/jeon2js'; const jeon = { 'obj': { 'bigint': '1234567890123456789' } }; const js = jeon2js(jeon); console.log('JavaScript:', js);
