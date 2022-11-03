export function addSVG(tag: string, parent: HTMLElement, attrs = {}) {
    const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attrs)) {
      elem.setAttribute(key, value);
    }
    parent.appendChild(elem);
    return elem;
}

export const lol = "deez nuts"