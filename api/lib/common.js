import _get from 'lodash/get';

export function isValidProductId(n) {
  const regex = new RegExp('^[0-9]{8}$');
  return regex.test(n);
}

export function isValidBody(body = {}, validProperties = []) {
  const missingProps = validProperties.reduce((reducedList, prop) => {
    if (!_get(body, prop)) {
      reducedList.push(prop);
    }
    return reducedList;
  }, []);

  let propsString = '';

  if (missingProps.length > 0) {
    missingProps.forEach((p, i) => {
      propsString += p;
      if (i + 1 < missingProps.length) {
        propsString += ', ';
      }
    });
  }

  return propsString;
}