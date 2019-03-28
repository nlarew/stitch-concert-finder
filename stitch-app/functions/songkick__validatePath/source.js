function zip(arr1, arr2) {
  return arr1.map((el, i) => ([el, arr2[i]]));
}

function isVariable(routePart) {
  const first = routePart[0];
  const last = routePart.slice(-1);
  return (first === "{" && last === "}");
}

function getParts(route, path) {
  const routeParts = route.split("/");
  const pathParts = path.split("/");
  const sameNumParts = routeParts.length === pathParts.length;
  if (!sameNumParts) { throw new Error("Supplied path doesn't match route definition.") }
  
  return [routeParts, pathParts];
}

function getRouteVariableName(routePart) {
  return routePart
    .substr(0, routePart.length - 1) // Remove }
    .substr(1); // Remove {
}

function validateVariablePath(route, path, validators = {}) {
  const [routeParts, pathParts] = getParts(route, path);
  let valid = true;
  let numValidatedVariables = 0;
  for (const part of zip(routeParts, pathParts)) {
    const [routePart, pathPart] = part;
    if(isVariable(routePart)) {
      const variableName = getRouteVariableName(routePart);
      const validate = validators[variableName];
      valid = validate(pathPart);
      numValidatedVariables += 1;
    } else {
      valid = routePart === pathPart;
    }
  }
  return valid;
}

exports = function({ route, path }){
  switch(route) {
    case "search/venues": {
      return path === route;
    }
    case "venues/{venue_id}/calendar": {
      return validateVariablePath(route, path, {
        "venue_id": (pathPart) => {
          return Number.isInteger(parseInt(pathPart));
        }
      });
    }
    default:
      return false;
  }
};