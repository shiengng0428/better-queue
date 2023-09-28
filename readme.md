# Queue
A queue.js module that utilizes [Better Queue](https://www.markdownguide.org/cheat-sheet/) to create and push tasks(function) to a queue for asynchronous processing.

## Installation (via npm)
Install the [Better Queue](https://www.npmjs.com/package/better-queue) module using npm:
```bash
npm install better-queue
```

## Initialization
```bash
/*
* To check if the queue_config.json exist in the folder.
*/
const fs = require('fs');   // Node.js as a File Server

if (fs.existsSync('queue_config.json')) {
    let queueGETValue = require('./queue_config.json');
    const numberOfQueues = queueGETValue.length;   // 
    BetterQueue.createQueues(numberOfQueues, queueGETValue);   

} else {
    const queueGETValue = []; //empty means defaault
    const numberOfQueues = 5; // set how many queue here
    BetterQueue.createQueues(numberOfQueues, queueGETValue); 
}
```

| Code | Description |
| -----------| ------------|
| fs.existsSync('queue_config.json') | check if the queue_config.json exist in the folder. | 
| .length   | use to calculate how many queue in the queue_config.json|


## queue_config.json
```bash
[
    { "queueIndex": 1 },
    { "queueIndex": 2, "retry": true, "maxRetries": 5, "retryDelay": 1000 },
    { "queueIndex": 3, "retry": false },
    { "queueIndex": 4, "retry": true, "maxRetries": 3, "retryDelay": 2000 },
    { "queueIndex": 5, "retry": true, "maxRetries": 2, "retryDelay": 1000 }
]
```

## Function : Create Queue
```bash
.createQueues(queueNum, retryOptionsArray);
```
It allows you to efficiently create and configure multiple queues in a single function call, simplifying the process of setting up and managing multiple queues.
| Parameters | Description |
| -----------| ------------|
| queueNum   | The number of queue|
| retryOptionsArray| The retry option for each queue|

### RetryOptionArray
| Property | Description |
| -----------| ------------|
| queueIndex   | The index or identifier of the queue |
| retry | Specifies whether retry attempts are enabled (true) or disabled (false) for the queue |
| maxRetries | The maximum number of retry attempts allowed for the queue. |
| retryDelay | The delay (in milliseconds) between retry attempts for the queue. |

[retryOptionsArray]
## Function : Push Function into Queue
```bash
.pushItemIntoQueues(queueNumber, InputTask);
```
It enables you to add an function to the desired queue for further processing, allowing you to distribute and manage function across different queues based on your specific needs and requirements.

| Parameters | Description |
| -----------| ------------|
| queueNumber | Specific queue determine by user|
| InputTask | The function that needed to push into the selected queue |

## Function : Run queue
```bash
.runTask(task, cb, retryCount, retryOptions);
```
The runTask function is automatically executed in the createQueues method for each task added/pushed to the created queues, ensuring their execution according to the specified retryOptions.

| Parameters | Description |
| -----------| ------------|
| task | The task to be executed, a function representing the task to be performed. |
| cb | The callback function that will be invoked once the task execution is complete or encounters an error. |
| retryCount | The number of retry attempts for the task execution in case of failures or errors. |
| retryOptions | Options for controlling the retry behavior, such as delay between retries, etc. |

# Example/Sample Testing
## Sample Testing 1: Pushing function into the selected queue
```bash
// Sample Function
function printMessage1() {
    console.log("Print Message 1");
};

function printMessage2() {
    console.log("Print Message 2");
};

BetterQueue.pushItemIntoQueues(1, printMessage1);
BetterQueue.pushItemIntoQueues(1, printMessage2);

BetterQueue.pushItemIntoQueues(2, printMessage1);
BetterQueue.pushItemIntoQueues(2, printMessage2);

BetterQueue.pushItemIntoQueues(3, printMessage1);
BetterQueue.pushItemIntoQueues(3, printMessage2);

BetterQueue.pushItemIntoQueues(4, printMessage1);
BetterQueue.pushItemIntoQueues(5, printMessage1);

Output: 
    Start Queue
    Print Message 1           <-- printMessage1 from queue 1

    Start Queue    
    Print Message 1           <-- printMessage1 from queue 2

    Start Queue    
    Print Message 1           <-- printMessage1 from queue 3

    Start Queue    
    Print Message 1           <-- printMessage1 from queue 4

    Start Queue    
    Print Message 1           <-- printMessage1 from queue 5

    Start Queue
    Print Message 2           <-- printMessage2 from queue 1

    Start Queue
    Print Message 2           <-- printMessage2 from queue 2

    Start Queue
    Print Message 2           <-- printMessage2 from queue 3
```

## Sample Testing 2: Testing Fail Case Function
```bash
/**
 * The retryOption will be default(retry = false) if queue_config.json not
 * created in the folder.
 * Please include the queue_config.json to see the retry on fail action.
 */
function fail() {
    if (Math.random() < 0.75) {
        console.log('Task failed');
        throw new Error("Task failed");
    } else {
        console.log('Task succeeded');
    }
}

BetterQueue.pushItemIntoQueues(2, () => fail());

                  OR

BetterQueue.pushItemIntoQueues(2, fail);

Sample Output 1: All tests have failed:

    Start Queue
    Task failed
    Error: Task failed
    Retrying task in 1000ms (retry 1 of 5)...

    Start Queue
    Task failed
    Error: Task failed
    Retrying task in 1000ms (retry 2 of 5)...

    Start Queue
    Task failed
    Error: Task failed
    Retrying task in 1000ms (retry 3 of 5)...

    Start Queue
    Task failed
    Error: Task failed
    Retrying task in 1000ms (retry 4 of 5)...

    Start Queue
    Task failed
    Error: Task failed
    Max retries (5) exceeded. Aborting task.

Sample Output 2: Task was successfully executed on the second retry

    Start Queue
    Task failed
    Error: Task failed
    Retrying task in 1000ms (retry 1 of 5)...

    Start Queue
    Task succeeded
```

# Additional Info(To avoid)
### Error :
```bash
/**
 * Cause Error:
 * Calling function directly instead of passing/pushing it to the queue
 */
To avoid: 

    BetterQueue.pushItemIntoQueues(3, printMessage3());

    BetterQueue.pushItemIntoQueues(1, myFunction2(1,2,3));
```

### Solution :
```
Solution 1:
    function myFunction2(input, happy, neo) {
        console.log("Answer: ", (input + happy + neo));
    };

    const myFunction2Wrapper = function () {
        myFunction2(1, 3, 6);
    };

    BetterQueue.pushItemIntoQueues(1, myFunction2Wrapper);

Solution 2:
    BetterQueue.pushItemIntoQueues(1, myFunction2.bind(null, 1, 3, 6));

Solution 3:
    BetterQueue.pushItemIntoQueues(3, () => printMessage3());
        
Solution 4:
    BetterQueue.pushItemIntoQueues(1, () => myFunction2(1, 2, 3));
```