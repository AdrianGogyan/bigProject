export function roundNumber(value:number): number {
    return Math.round(value);
}

export function toFixNumber(value:number): string {
    return value.toFixed(1);
}

export function capitalize(word:string): string {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
}