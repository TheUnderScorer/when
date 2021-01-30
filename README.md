# When ☝️

## What is "when" ?

"when" is a simple utility function. Have you ever dealt with similar case?

```javascript
const task = await getTask(taskId);

if (task.state === 'TODO') {
  handleTodo(task);
} else if (task.state === 'IN_PROGRESS') {
  handleInProgress(task);
} else if (task.state === 'DONE') {
  handleDone(task);
} else {
  throw new Error('Invalid task state.');
}
```

This could be improved by using `switch` or dictionary. Let's focus on second approach:

```javascript
const stateHandlers = {
  TODO: () => handleTodo(task),
  IN_PROGRESS: () => handleInProgress(task),
  DONE: () => handleDone(task),
};

const task = await getTask(taskId);

if (stateHandlers[task.state]) {
  stateHandlers[task.state]();

  return;
}

throw new Error('Invalid task state.');
```

This requires additional boilerplate code however. Also, what if we would like to handle multiple task states with single function?
<br>
That's where "when" comes to rescue! It gives you more flexible way of handling dictionaries. You can either use it to call function conditionaly:

```javascript
import { when } from '@theunderscorer/when';

when(task.state, {
  'TODO, IN_PROGRESS': () => handleTodoOrInProgress(task),
  DONE: () => handleDone(task),
});
```

You can also use it to return value:

```javascript
import { when } from '@theunderscorer/when';

const nextState = when(task.state, {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: () => {
    throw new Error('Invalid state provided.');
  },
});
```

> "when" will find first key that matches given value.

You can also use else branch:

```javascript
import { when, elseBranch } from '@theunderscorer/when';

const nextState = when(task.state, {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: () => {
    throw new Error('Invalid state provided.');
  },
  [elseBranch]: () => {
    // Handle every other task state
  },
});
```

## Operators

In addition to handling simple dictionaries, "when" also lets you handle more complex cases.

> Hint: Every operator is also provided as helper function,

### In array

Matches if value can be found in array.

```javascript
import { when } from '@theunderscorer/when';

when(task.state, {
  'TODO, IN_PROGRESS': () => handleTodoOrInProgress(task),
  DONE: () => handleDone(task),
});
```

Or as a helper function:

```javascript
import { when, inArray } from '@theunderscorer/when';

when(task.state, {
  [inArray('TODO', 'IN_PROGRESS')]: () => handleTodoOrInProgress(task),
  DONE: () => handleDone(task),
});
```

---

### Not in array

Matches if value cannot be found in array.

```javascript
import { when } from '@theunderscorer/when';

when(task.state, {
  '! TODO, IN_PROGRESS': () => handleNotTodoAndNotInProgress(task),
  TODO: () => handleTodo(task),
});
```

> Note: Mind space between "!" and values separated by a comma.

Or as a helper function:

```javascript
import { when, notInArray } from '@theunderscorer/when';

when(task.state, {
  [notInArray('TODO', 'IN_PROGRESS')]: () =>
    handleNotTodoAndNotInProgress(task),
  TODO: () => handleTodo(task),
});
```

---

### In range

Matches if value can be found between two numbers.

```javascript
import { when, elseBranch } from '@theunderscorer/when';

when(payment.amount, {
  '0..1000': () => handleSmallPayment(),
  '1001..9000': () => handleBigPayment(),
  [elseBranch]: () => handleReallyBigPayment(),
});
```

Or as a helper function:

```javascript
import { when, elseBranch, inRange } from '@theunderscorer/when';

when(payment.amount, {
  [inRange(0, 1000)]: () => handleSmallPayment(),
  [inRange(1001, 9000)]: () => handleBigPayment(),
  [elseBranch]: () => handleReallyBigPayment(),
});
```

---

### Not in range

Matches if values cannot be found between two numbers.

```javascript
import { when, elseBranch } from '@theunderscorer/when';

when(payment.amount, {
  '!0..1000': () => handleBigPayment(),
  '!1001..9000': () => handleSmallPayment(),
});
```

Or as a helper function:

```javascript
import { when, notInRange } from '@theunderscorer/when';

when(payment.amount, {
  [notInRange(0, 1000)]: () => handleBigPayment(),
  [notInRange(1001, 9000)]: () => handleSmallPayment(),
});
```

---

# Is

Matches if value "is" of a given type.

> Hint: "is" accepts every type that is used in `typeof`

```javascript
import { when, elseBranch } from '@theunderscorer/when';

when(unknownValue, {
  'is string': () => handleString(),
  'is number': () => handleNumber(),
  'is bigint': () => hangleBigInt(),
  'is symbol': () => handleSymbol(),
  'is boolean': () => handleBoolean(),
  'is undefined': () => handleUndefined(),
  'is object': () => handleObject(),
  'is function': () => handleFunction(),
  [elseBranch]: () => {
    throw new Error('Unknown type.');
  },
});
```

Or as a helper function:

```javascript
import { when, is } from '@theunderscorer/when';

when(unknownValue, {
  [is('string')]: () => handleString(),
  [is('number')]: () => handleNumber(),
  // And so on...
});
```

---

# Is not

Matches if value "is" not of a given type.

> Hint: "is not" accepts every type that is used in `typeof`

```javascript
import { when } from '@theunderscorer/when';

when(unknownValue, {
  '!is string': () => handleNotString(),
  '!is number': () => handleNotNumber(),
});
```

Or as a helper function:

```javascript
import { when, isNot } from '@theunderscorer/when';

when(unknownValue, {
  [isNot('string')]: () => handleNotString(),
  [isNot('number')]: () => handleNotNumber(),
  // And so on...
});
```

### License

This library is under [MIT License](LICENSE.md).
