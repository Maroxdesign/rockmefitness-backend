import * as moment from 'moment';

export const { floor, random } = Math;

export const generateUpperCaseLetter = () => {
  return randomCharacterFromArray('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
};

function randomCharacterFromArray(array: any) {
  return array[floor(random() * array.length)];
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
