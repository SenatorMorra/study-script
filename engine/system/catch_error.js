function e_code(x) {
  console.log("\x1b[31m", `\tERROR_CODE: ${x}`);
}

function e(x) {
  console.log("\x1b[31m", `\t${x}`);
}

let errors = {
  undefined: "undefined error",
  0: "undefined command",
  's0': 'syntax error. undefined command or misspell in command name',

  // log
  "000": "not a 'log' operator",
  "001": "wrong log data type operator",
  "s001": "syntax error. wrong type operator, only number and string are available",
  "002": "variable does not exist",
  "003": "variable type is not a number",
  "004": "undefined math operation with numbers",
  "005": "cannot use variable in sentences, memory storage does not exist",
  "s006_0": 'syntax error. data expression issue. text between "here" or variable name with only a-Z, _, 0-9 starts from a-Z or _',
  "s006_1": 'syntax error. data expression issue. number is set of figures starts from anything except 0 or variable name with only a-Z, _, 0-9 starts from a-Z or _',
  "s007_0": 'syntax error. missed concatination operator >> between 2 strings/variables or string must be defined as "text"',
  "s007_1": 'syntax error. missed operator + or - between 2 numbers/variables',

  // new
  100: "not a 'new' operator",
  101: "this variable is already exist",
  102: "wrong variable type",
  's102': "syntax error. wrong type operator, only number and string are available",
  103: "cannot create a new variable, memory storage does not exist",
  's104': "syntax error. 'new' command found more arguments than expected (2) - variable name, variable type",
  's105': 'syntax error. bad variable name, it can containts a-Z, _, 0-9 and start from a-Z and _',

  // set
  200: "not a 'set' operator",
  201: "cannot set a value for a variable that does not exist",
  202: "wrong variable value for String type",
  203: "wrong variable value for Number type",
  204: "cannot set value for this variable. undefined type",
  205: "number is out of range",
  206: "cannot set a variable value, memory storage does not exist",
  's207': 'syntax error. bad variable name, it can containts a-Z, _, 0-9 and start from a-Z and _',
  's208': 'syntax error. missed operator between 2 raw-data/variable',

  // delete
  300: "not a 'delete' operator",
  301: "cannot delete a variable that does not exist",
  302: "cannot delete a variable, memory storage does not exist",
  's303': "syntax error. 'delete' command found more arguments than expected (1) - variable name",
  's304': "syntax error. bad variable name, it can containts a-Z, _, 0-9 and start from a-Z and _",

  // start
  400: "not a 'start' operator",
  401: "'start' command found more arguments than expected (0)",
  's401': "syntax error. 'start' command found more arguments than expected (0)",
  402: "storage already assembled",

  // if
  500: "not a 'if' operator",
  501: "undefined condition operator",
  502: "cannot use variables in sentences, memory storage does not exist",
  503: "cannot operate sentence, variable does not exist",
  504: "cannot operate with this variable, arguments must be in Number type",

  // close
  600: "not a 'close' operator",
  601: "'close' command found more arguments than expected (0)",

  // else
  700: "not a 'else' operator",
  701: "'else' command found more arguments than expected (0)",
  's701': "syntax error. 'else' command found more arguments than expected (0)",

  // finish
  800: "not a 'finish' operator",
  801: "'finish' command found more arguments than expected (0)",
  's801': "syntax error. 'finish' command found more arguments than expected (0)",

  // loop

  // end
};

export default function catch_error(status, index, line) {
  if (status === false || status?.[0] === false) {
    console.log("\x1b[31m", `> error in line: ${index}`);
    e_code(status?.[1]);
    e(errors[status?.[1]]);

    return true;
  } else return false;
}
