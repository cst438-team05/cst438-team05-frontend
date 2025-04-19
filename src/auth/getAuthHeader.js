/**
 * This function retrieves the JWT token from session storage and returns an object with the Authorization header set to the Bearer token. If no token is found, it returns an empty object. This is useful for making authenticated requests to a server that requires a JWT for authorization.
 *
 * @example
 * // Usage in a fetch request:
 * fetch('https://api.example.com/data', {
 *   method: 'GET',
 *   headers: {
 *     'Content-Type': 'application/json',
 *    ...getAuthHeader(),
 *   },
 * });
 */
export const getAuthHeader = () => {
  const token = sessionStorage.getItem('jwt');
  if (token) {
    return { Authorization: token };
  } else {
    return {};
  }
};
