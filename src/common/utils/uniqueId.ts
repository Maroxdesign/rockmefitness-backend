import * as moment from 'moment';

export const { floor, random } = Math;

export const generateUpperCaseLetter = () => {
  return randomCharacterFromArray('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
};

function randomCharacterFromArray(array: any) {
  return array[floor(random() * array.length)];
}

export function randomFourDigitNumber() {
  let result = 0;
  for (let i = 0; i < 4; i++) {
    const digit = floor(random() * 10);
    result += digit;
  }
  return result;
}

const identifiers: any[] = [];

export const generateIdentifier: any = () => {
  const identifier = [
    ...moment().utcOffset('+01:00').format('YYYYMMDDHHmmss'),
    ...Array.from({ length: 8 }, generateUpperCaseLetter),
  ].join('');

  return (
    identifiers.includes(identifier)
      ? generateIdentifier()
      : identifiers.push(identifier),
    identifier
  );
};
