export const omitTypeName = function(inputObjectArray) {
  // due to stupid issue
  // https://github.com/apollographql/apollo-feature-requests/issues/6
  return inputObjectArray.map(inputObject => {
    const returnObject = {};
    Object.keys(inputObject).forEach(key => {
      if (key === '__typename') {
        return;
      }
      returnObject[key] = inputObject[key];
    })
    return returnObject;
  })
}
