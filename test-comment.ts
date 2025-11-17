import { jeon2js } from './src/jeon2js'; const jeon = { '//': 'This is a test comment' }; const js = jeon2js(jeon); console.log('JavaScript:', js);
