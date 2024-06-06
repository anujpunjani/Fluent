import React from "react";
import Snippet from "./Snippet";
import SectionHeader from "../utils/SectionHeader";
import "./documentation.css";

const Documentation = () => {
  return (
    <section id="documentation" className="section-wrapper">
      <SectionHeader title={"Documentation"} direction="left" />
      <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
        {snippets.map((snippet) => (
          <Snippet key={snippet.name} {...snippet} />
        ))}
      </div>
    </section>
  );
};

const snippets = [
  {
    name: "Syntax",
    description: (
      <>
        Syntax rules of <code>Fluent</code>.
      </>
    ),
    code: `
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
        `,
  },
  {
    name: "Data Types & Keywords",
    description: (
      <>
        Fluent supports data types such as <code>boolean</code>,
        <code>string</code>, <code>number</code> & <code>list</code>.
      </>
    ),
    code: `
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
        `,
  },
  {
    name: "String Operations",
    description: (
      <>
        Operations that can be performed on data type <code>string</code>.
      </>
    ),
    code: `
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
        `,
  },
  {
    name: "List Operations",
    description: (
      <>
        Operations that can be performed on data type <code>list</code>.
      </>
    ),
    code: `
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
        `,
  },
  {
    name: "Conditionals",
    description: (
      <>
        Fluent supports <code>if-else-if</code> ladder construct for conditional
        branching.
      </>
    ),
    code: `
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
        `,
  },
  {
    name: "Functions",
    description: (
      <>
        Functions are first-class citizens in Fluent and can be defined using
        the <code>func</code> keyword.
      </>
    ),
    code: `
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
        `,
  },
  {
    name: "Loops",
    description: (
      <>
        Fluent supports both <code>while</code> and <code>for</code> loops for
        iteration.
      </>
    ),
    code: `
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
        `,
  },
  {
    name: "Built-Ins",
    description: (
      <>
        Fluent provides built-in functions like <code>print</code>,
        <code>input</code>, and more.
      </>
    ),
    code: `
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
        `,
  },
];

export default Documentation;
