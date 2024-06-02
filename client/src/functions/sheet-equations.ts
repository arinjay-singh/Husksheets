/**
 * @file sheet-equations.ts
 * @brief A simple function to parse and evaluate simple mathematical operations.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 */

export const parseOperationString = (input: string) => {
    // Regular expressions to match different operations
    const sumPattern = /^=SUM\(([\d\s,]*)\)$/;
    const subPattern = /^=SUB\(([\d\s,]*)\)$/;
    const mulPattern = /^=MUL\(([\d\s,]*)\)$/;
    const divPattern = /^=DIV\(([\d\s,]*)\)$/;
  
    // Function to extract numbers from matched pattern
    const extractNumbers = (pattern : RegExp, input : string) => {
      const match = input.match(pattern);
      if (match) {
        const numbersString = match[1];
        const numbers = numbersString.split(',').map(num => Number(num.trim()));
        return numbers;
      }
      return null;
    };
  
    // Check and perform the corresponding operation
    if (sumPattern.test(input)) {
      const numbers = extractNumbers(sumPattern, input);
      if (numbers) {
        const result = numbers.reduce((acc, num) => acc + num, 0);
        return result.toString();
      }
    } else if (subPattern.test(input)) {
      const numbers = extractNumbers(subPattern, input);
      if (numbers && numbers.length === 2) {
        const result = numbers[0] - numbers[1];
        return result.toString();
      }
    } else if (mulPattern.test(input)) {
      const numbers = extractNumbers(mulPattern, input);
      if (numbers && numbers.length === 2) {
        const result = numbers[0] * numbers[1];
        return result.toString();
      }
    } else if (divPattern.test(input)) {
      const numbers = extractNumbers(divPattern, input);
      if (numbers && numbers.length === 2) {
        if (numbers[1] !== 0) {
          const result = numbers[0] / numbers[1];
          return result.toString();
        } else {
          return '#DIV/0!';
        }
      }
    }
    return null; 
  };
