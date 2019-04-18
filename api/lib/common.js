export function isValidProductId(n) {
  const regex = new RegExp('^[0-9]{8}$');
  return regex.test(n);
}