// given a value and expected data type, convert the value to that type if necessary
const cleanInput = (type, value) => {
  if (type === 'int' && typeof value !== 'number') {
    return value ? parseInt(value.replace(/,/g, '')) : 0;
  } else if (type === 'float' && typeof value !== 'number') {
    return value ? parseFloat(value.replace(/,/g, '')) : 0;
  } else if (type === 'string' && typeof value !== 'string') {
    return value ? String(value) : '';
  }
  return value;
}

// export public functions
module.exports = {
  cleanInput
}