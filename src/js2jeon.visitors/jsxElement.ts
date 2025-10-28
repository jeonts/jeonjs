import { ast2jeon } from './ast2jeon'

export function visitJSXElement(node: any): any {
    const openingElement = node.openingElement
    const tagName = openingElement.name.name
    const attributes: Record<string, any> = {}

    // Process JSX attributes
    for (const attr of openingElement.attributes) {
        if (attr.type === 'JSXAttribute') {
            const attrName = attr.name.name
            const attrValue = attr.value ?
                (attr.value.type === 'Literal' ? attr.value.value : ast2jeon(attr.value)) :
                true
            attributes[attrName] = attrValue
        }
    }

    // Process children
    const children = node.children
        .filter((child: any) => child.type !== 'JSXText' || child.value.trim() !== '')
        .map((child: any) => {
            if (child.type === 'JSXText') {
                return child.value.trim()
            }
            return ast2jeon(child)
        })

    // Add children to attributes if they exist
    if (children.length > 0) {
        attributes.children = children
    }

    return {
        [`<${tagName}>`]: attributes
    }
}