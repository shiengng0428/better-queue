let BetterQueue = require('./queue');
const fs = require('fs');

/**
 * Check if the queue_config,json exist in the folder
 */
if (fs.existsSync('queue_config.json')) {
    let queueGETValue = require('./queue_config.json');
    const numberOfQueues = queueGETValue.length; // use to calculate how many queue in the queue_config.json
    BetterQueue.createQueues(numberOfQueues, queueGETValue); // use the createQueues function with the information from queue_config.json to create queues
} else {
    const queueGETValue = []; // empty means default(no retry)
    const numberOfQueues = 5; // set how many queue here
    BetterQueue.createQueues(numberOfQueues, queueGETValue); // use the createQueues function with the information from queue_config.json to create queues
}

// Sample Function
function printMessage1() {
    console.log("Print Message 1");
};

function printMessage2() {
    console.log("Print Message 2");
};

function printMessage3() {
    console.log("Print Message 3");
};

/**
 * Testing Function(With Parameters)
 */
function myFunction2(input, happy, neo) {
    console.log("Answer: ", (input + happy + neo));
};

const myFunction2Wrapper = function () {
    myFunction2(1, 3, 6);
};

/**
 * Testing Fail Case Function
 */
function fail() {
    if (Math.random() < 0.75) {
        console.log('Task failed');
        throw new Error("Task failed");
    } else {
        console.log('Task succeeded');
    }
}

/**
 * Push Function
 */
// BetterQueue.pushItemIntoQueues(1, printMessage1);
// BetterQueue.pushItemIntoQueues(1, printMessage2);

// BetterQueue.pushItemIntoQueues(2, printMessage1);
// BetterQueue.pushItemIntoQueues(2, printMessage2);

// BetterQueue.pushItemIntoQueues(3, printMessage1);
// BetterQueue.pushItemIntoQueues(3, printMessage2);

// BetterQueue.pushItemIntoQueues(4, printMessage1);
// BetterQueue.pushItemIntoQueues(5, printMessage1);

/**
 * Retry Testing
 */
// BetterQueue.pushItemIntoQueues(1, () => fail());

// BetterQueue.pushItemIntoQueues(2, () => fail());

// BetterQueue.pushItemIntoQueues(3, () => fail());

// BetterQueue.pushItemIntoQueues(4, () => fail());

// BetterQueue.pushItemIntoQueues(5, () => fail());

/**
 * Cause Error:
 *     Calling function directly instead of passing/pushing it to the queue
 */
// BetterQueue.pushItemIntoQueues(3, printMessage3()); // cannot push like this
// BetterQueue.pushItemIntoQueues(1, myFunction2(1,2,3));

/**
 * Solution For the Error
 */
// console.log('Solution')
// BetterQueue.pushItemIntoQueues(1, myFunction2Wrapper);
// BetterQueue.pushItemIntoQueues(1, myFunction2.bind(null, 1, 3, 6));
// BetterQueue.pushItemIntoQueues(3, () => printMessage3());
// BetterQueue.pushItemIntoQueues(1, () => myFunction2(1, 2, 3));
