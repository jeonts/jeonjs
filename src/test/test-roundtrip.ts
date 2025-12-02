import { js2jeon, jeon2js } from '../index'; const jeon = js2jeon('/abc/g'); console.log('JEON:', JSON.stringify(jeon, null, 2)); const js = jeon2js(jeon); console.log('JavaScript:', js)
