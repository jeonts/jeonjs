// Custom JSON serializer that preserves undefined values
function customStringify(obj: any): string {
    return JSON.stringify(obj, (key, value) => {
        // Preserve undefined values by converting them to a special marker
        if (value === undefined) {
            return '__UNDEFINED_MARKER__';
        }
        return value;
    });
}

function customParse(str: string): any {
    return JSON.parse(str, (key, value) => {
        // Convert the special marker back to undefined
        if (value === '__UNDEFINED_MARKER__') {
            return undefined;
        }
        return value;
    });
}

console.log('=== Custom Serializer Test ===');

// Test with undefined values
const testObj = {
    "@": {
        "d": undefined,
        "e": undefined,
        "f": 22
    }
};

console.log('Original object:');
console.log(testObj);

console.log('\nCustom stringify:');
const serialized = customStringify(testObj);
console.log(serialized);

console.log('\nCustom parse:');
const parsed = customParse(serialized);
console.log(parsed);

console.log('\nKeys in parsed object:');
console.log(Object.keys(parsed['@']));

console.log('\nDoes "d" exist in parsed object?', 'd' in parsed['@']);
console.log('Value of "d":', parsed['@']['d']);
console.log('Type of "d":', typeof parsed['@']['d']);