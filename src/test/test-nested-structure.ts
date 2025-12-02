import { jeon2js } from '../jeon2js'; const jeon = { '(': { 'bigint': { 'bigint': '1234567890123456789' } } }; const js = jeon2js(jeon); console.log('JavaScript:', js)
