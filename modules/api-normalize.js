import camelCaseKeys from 'camelcase-keys'

export const toCamelCase = item => camelCaseKeys(item, { deep: true })

export const normalizeSolrResponse = (docs, locale = 'en') => {
  for (let i = 0; i < docs.length; i++){
    for (const variable in docs[i]){
      let sanitizedPropName

      if (~variable.indexOf('_')){
        sanitizedPropName = variable.slice(0, variable.indexOf('_'))

        docs[i][sanitizedPropName] = docs[i][variable]
      }
      if (isLString(docs[i][sanitizedPropName]))
        docs[i][sanitizedPropName] = normalizeLString(docs[i][sanitizedPropName], locale)
    }

    docs[i] = camelCaseKeys(docs[i], { deep: true })
  }

  return docs
}

export const normalizeApiResponse = (docs) => {
  const normDocs = []

  for (const doc of docs)
    normDocs.push({ ...doc, ...camelCaseKeys(doc, { deep: true }) })

  for (const doc of normDocs)
    for (const prop in doc)
      if (isLString(doc[prop]))
        doc[prop] = normalizeLString(doc[prop])

  return normDocs
}

export const isLString = prop => prop && (!isUndefined(prop.ar) || !isUndefined(prop.en) || !isUndefined(prop.zh) || !isUndefined(prop.ru) || !isUndefined(prop.fr) || !isUndefined(prop.es))

export const normalizeLString = (prop, locale = 'en') => {
  if (prop && prop[locale]) return prop[locale]
  return prop.en
}

export const isUndefined = prop => typeof prop === 'undefined'
