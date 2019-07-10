export const omitTypeNameFromArray = function(input) {
  // due to stupid issue
  // https://github.com/apollographql/apollo-feature-requests/issues/6
  return input.map(inputObject => stripTypeNameFromObj(inputObject))
}

export const stripTypeNameFromObj = function(inputObj) {
  if (!inputObj) {
    return inputObj;
  }
  const returnObject = {};
  Object.keys(inputObj).forEach(key => {
    if (key === '__typename') {
      return;
    }
    if (Array.isArray(inputObj[key])) {
      returnObject[key] = inputObj[key].map(d => typeof d ===
'object' ? stripTypeNameFromObj(d) : d)
    } else if (typeof inputObj[key] === 'object') {
      returnObject[key] = stripTypeNameFromObj(inputObj[key])
    } else {
      returnObject[key] = inputObj[key];
    }
  })
  return returnObject;
}
