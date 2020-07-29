function isEmailValid(email) {
  const re = /^[\w](?:[&'_\\.-]?\w+)*@\w+(?:[\\.-]?\w+)*\.[A-Za-z]{2,}$/gi;
  return re.test(String(email).toLowerCase());
}

// eslint-disable-next-line import/prefer-default-export
export { isEmailValid };
