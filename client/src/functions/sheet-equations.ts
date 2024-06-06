/**
 * @file sheet-equations.ts
 * @brief A simple function to parse and evaluate simple mathematical operations.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 */

import { parseCellReferences, retrieveCellRangeValues } from "./cell-referencing";

// function to parse and evaluate a standard mathematical operation
export const parseEquation = (equation: string) => {
  // ensure the operation is in the correct format
  if (!equation.startsWith("=") || equation.length < 4) {
    return null;
  }

  // extract the arithmetic expression
  const expression = equation.slice(1).trim();

  // check if the expression is a simple operation
  if (
    expression.includes("=") ||
    expression.includes("<>") ||
    expression.includes(":") ||
    expression.includes("&") ||
    expression.includes("|")
  ) {
    return null;
  }

  // check if the expression contains anything other than numbers and operators
  // security vulnerability
  const regex = /^([0-9+\-*/<>|&=:.\s()]+)$/;
  if (!regex.test(expression)) {
    return null;
  }

  // evaluate the function
  const funcResult = eval(expression);

  // return the result as a string
  return funcResult.toString();
};

const validValues = (values: string[]): boolean => {
  // define the regex formats
  const regexFormats: RegExp[] = [
    /^\$[A-Z]+\d+$/, // cell reference format
    /^\d+(\.\d+)?$/, // number format (integer or decimal)
  ];

  return values.every((value) =>
    regexFormats.some((regex) => regex.test(value))
  );
};

// function to parse and evaluate a function
export const parseFunction = (data: string[][], formula: string) => {
  // ensure the operation is in the correct format
  if (!formula.startsWith("=") || formula.length < 4) {
    return null;
  }

  const commaSeparatedFunction = /=([a-zA-Z]{2,6})\(([^)]+)\)/;
  const commaSeparatedMatch = formula.match(commaSeparatedFunction);

  const rangeFunction = /=([a-zA-Z]{3,6})\(\$[a-zA-Z]+\d+:\$[a-zA-Z]+\d+\)/;
  const rangeMatch = formula.match(rangeFunction);


  if (commaSeparatedMatch) {
    const functionValues = commaSeparatedMatch[2].split(",").map((value) => value.trim());
    if (!validValues(functionValues)) {
      return null;
    }

    const parsedFunctionValues = functionValues.map((value) =>
      parseCellReferences(data, value)
    );

    return computeFunction(commaSeparatedMatch[1], parsedFunctionValues);

  } else if (rangeMatch) {
    const cellRange = rangeMatch[2];
    const [startCell, endCell] = cellRange.split(":");
    const cellValues = retrieveCellRangeValues(startCell, endCell, data);

    return computeFunction(rangeMatch[1], cellValues);
  }

  return null;
};

const computeFunction = (func: string, values: string[]): string | null => {
  let nums: number[];
  if (values.length === 0) {
    return null;
  }
  try {
    switch (func) {
      case "SUM":
        nums = values.map((value) => parseFloat(value));
        return nums.reduce((acc, curr) => acc + curr, 0).toString();
      case "AVG":
        nums = values.map((value) => parseFloat(value));
        return (nums.reduce((acc, curr) => acc + curr, 0) / nums.length).toString();
      case "MAX":
        nums = values.map((value) => parseFloat(value));
        return Math.max(...nums).toString();
      case "MIN":
        nums = values.map((value) => parseFloat(value));
        return Math.min(...nums).toString();
      case "CONCAT":
        return values.join("");
      case "IF":
        if (values.length !== 3) {
          return null;
        }
        return (parseFloat(values[0]) !== 0) ? values[1] : values[2];
      case "DEBUG":
        if (values.length !== 1) {
          return null;
        }
        return values[0];
      default:
        return "";
    }
  } catch (e) {
    return null;
  }
};
