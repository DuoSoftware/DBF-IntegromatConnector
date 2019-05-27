module.exports.validateParams = (json, required_list) => {
  var miss_list = [];
  for (let x of required_list) {
      if (!json[x]) {
          miss_list.push(x);
      }
  }

  if (miss_list.length > 0) {
      return { status: false, list: miss_list };
  } else {
      return { status: true, list: miss_list };
  }
};

module.exports.toCamelCase = (str) => {
  // Lower cases the string
  return str.toLowerCase()
    // Replaces any - or _ characters with a space
    .replace( /[-_]+/g, ' ')
    // Removes any non alphanumeric characters
    .replace( /[^\w\s]/g, '')
    // Uppercases the first character in each group immediately following a space
    // (delimited by spaces)
    .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
    // Removes spaces
    .replace( / /g, '' );
}

module.exports.getRandomNumber = () => {
  return (((1+Math.random())*0x10000)|0).toString(4).substring(1); 
}

module.exports.success = (message, data, code) => {
  let logString = message;

  if (code === undefined) {
      code = 200;
  }
  let obj = {
      code: code,
      status: true,
      message: message
  };

  if (data !== undefined) {
      obj.data = data;
      logString += ` | ${JSON.stringify(data)}`
  }
  
  return obj;
};

module.exports.error = (message, data, code) => {
  let logString = message;

  if (code === undefined) {
      code = 500;
  }

  let obj = {
      code: code,
      status: false,
      message: message
  };

  if (data !== undefined) {
      obj.data = data;
      logString += ` | ${JSON.stringify(data)}`
  }

  return obj;
};