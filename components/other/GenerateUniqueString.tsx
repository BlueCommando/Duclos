const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';

/**
 * Will most likely to never be the same.
 * 
 * It's a 1 in 354 octillion chance for 2, 8 digit long strings to be the same.
 * */
const genUniqueStr = (digits: number) =>  {
  const uuid = [];

  for (let i = 0; i < digits; i++) {
    uuid.push(str[Math.floor(Math.random() * str.length)]);
  }

  return uuid.join('');
};

export default genUniqueStr;
