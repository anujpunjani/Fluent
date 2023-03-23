# Fluent Programming Language
Introduction
Fluent is a simple, easy-to-use programming language designed for readability and ease of use. It supports basic programming constructs such as variables, data types, built-ins, conditionals, loops, and functions.

## Data Types
Fluent supports the following data types:

- Boolean
- String
- Number
- List
- Functions

## Variables
Variables are declared using the let keyword. The syntax for declaring a variable is as follows:

- let \<variableName> = \<value>;

For example:
```
let name = "Alice";
let age = 30;
let isMarried = true;
let numbers = [1, 2, 3, 4, 5];
```

## Functions
Functions are defined using the define keyword. The syntax for defining a function is as follows:

define \<functionName>(\<argument1>, \<argument2>, ...) {
  \<functionBody>
  return \<returnValue>;
}

For example:
```
define square(number) {
  return number * number;
}

let result = square(5); // result = 25
```

## Conditionals
Fluent supports if-else-if conditional statements. The syntax for using conditionals is as follows:

if \<condition1> {
  \<codeBlock1>
} else if \<condition2> {
  \<codeBlock2>
} else {
  \<codeBlock3>
}

For example:
```
let age = 30;

if age < 18 {
  print("You are not old enough to vote.");
} else if age < 25 {
  print("You are eligible for military service.");
} else if age < 60 {
  print("You are eligible to work.");
} else {
  print("You are eligible for retirement benefits.");
}
```

## Loops
Fluent supports both while and for loops. The syntax for using loops is as follows:

while \<condition> {
  \<codeBlock>
}

for \<variableName> until \<length> {
  \<codeBlock>
}
For example:
```
let numbers = [1, 2, 3, 4, 5];

for number until 5 {
  print(number/i);
}

let i = 0;

while i < length(numbers) {
  print(numbers[i]);
  i = i + 1;
}
```
<!-- ### Built-ins
Fluent provides built-in functions to perform common operations on data types. Here are some examples:
```
// Convert a string to uppercase
let message = "hello";
let uppercaseMessage = upper(message); // "HELLO"

// Convert a string to lowercase
let name = "ALICE";
let lowercaseName = lower(name); // "alice"

// Check if a list contains a specific value
let numbers = [1, 2, 3, 4, 5];
let containsThree = in(3, numbers); // true

// Get the length of a list
let lengthOfNumbers = len(numbers); // 5
``` -->
