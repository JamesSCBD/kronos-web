import { camelCase } from 'change-case';
import { library } from '@fortawesome/fontawesome-svg-core';

export const faToCoreUiGlobal = (faArr) => [ `${faArr[0]} ${faArr[1]}`, `<path d="${faArr[4]}" ></path>` ];

export const getFaJsSet = () => {
  const { definitions } = library;
  const set             = { };

  // eslint-disable-next-line
  for (const type in definitions) for (const name in definitions[type]) set[`${camelCase(name)}`] = faToCoreUiGlobal(definitions[type][name]);

  return set;
};
