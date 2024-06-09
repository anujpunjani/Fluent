# Fluent Programming Language 
Try out your code on [Fluent Playground](https://anujpunjani.github.io/Fluent/).

# Documentation
## Syntax

Syntax rules of `Fluent`.

```
# single line comments can be made using #

# variables can be declared without using any identifer
# every statement should end with a semicolon
a = 10;
b = "Fluent";


if 1 == 1 { # conditions don't require parenthesis
  pass; # any element with curly brakets shouldn't be empty
}


c = true; # boolean is treated as 1 for true and 0 for false
print(c); # 1
```

## Data Types & Keywords

Fluent supports data types such as `boolean`, `string`, `number` & `list`.

```
# Boolean
boolVar = true;

# String
stringVar = "Fluent";

# Number
numVar = 10;

# List
list = [1, 2.2, true, "Hello"];

# Keywords
keywords = ["and", "or", "not", "if", "else", "while", "for", "step", "until", "continue", "break", "func", "return", "pass"]
```

## String Operations

Operations that can be performed on data type `string`.

```
# Concat 2 strings
str1 = "Hello, " + "World";
print(str1); # Hello, World

# Access element at a Index in a string
num = str1[2];
print(num); # l

# Repeat string
str2 = str1[2] * 5;
print(str2); # lllll

# Number be added to string
str3 = str2 + 5;
print(str3); # lllll5
```

## List Operations

Operations that can be performed on data type `list`.

```
# Add element in a list
list1 = [1, 2.2, true, "Hello"] + 100;
print(list1); # [1, 2.2, 1, "Hello", 100]


# Remove element at a Index in a list
list2 = list1 - 1;
print(list2); # [1, 1, "Hello", 100]


# Access element at a Index in a list
num = list2[2];
print(num); # Hello


# Concat 2 lists
list3 = [1, 2] * [100, 200];
print(list3); # [1, 2, 100, 200]
```

## Conditionals

Fluent supports `if-else-if` ladder construct for conditional branching.

```
a = 5;
b = 7;

if a == b {
  print("Condition 1 is true");
} else if false {
  print("Condition 2 is true");
} else if a != b and a == 5 {
  print("Condition 3 is true");
} else {
  pass;
}

# Condition 3 is true
```

## Functions

Functions are first-class citizens in Fluent and can be defined using the `func` keyword.

```
func add(num1, num2) {
  print("Add Function");
  return num1 + num2;
}

c = add(1, 2); # Add Function
print("c = " + c); # c = 3

a = add;
print(a(3, 4)); 
# Add Function
# 7


# Single line return functions can be denoted by arrow notation and don't require return keyword 
func oopify(x) => x + "oop";
print(oopify("Hello")); # Hellooop
```

## Loops

Fluent supports both `while` and `for` loops for iteration.

```
# While Loop
a = 1;
while a <= 5 {
  print(a);
  a = a + 1;
}
# 1
# 2
# 3
# 4
# 5

# For Loop
for i = 0 until 5 {
  print(i);
}
# 0
# 1
# 2
# 3
# 4

# For Loop with step
for i = 0 until 4 step 2 {
  print(i);
}
# 0
# 2
```

## Built-Ins

Fluent provides built-in functions like `print`, `input`, and more.

```
# Print
print("Hello, world!");

# PrintReturn
str = printReturn("Hello, world!");

# Input
userInput = input();

# Is List
list = [1, 2];
isLis = isList(list);

# Is Number
isNum = isNumber(42);

# Is Function
f = func () {
  pass;
}
isFunc = isFunction(f);

# Is String
isStr = isString("Fluent");

# Len
length = len(list);
length = len("Fluent");

# Absolute
num = abs(-123);
```
