// let queueGETValue = require('./queue_config.json'); // please include if need to use
const BetterQueue = require('better-queue'); // import

/**
 * To run the task inside the queue
 * @param {*} task | running task
 * @param {*} cb | callback
 */

function Queue() {
    this.queue = null;
}

function runTask(task, cb, retryCount, retryOptions) { // retryOptions get from the queue_config.json
    if (typeof task === "function") {
        try {
            console.log("\nStart Queue");
            task(); // task() = function that insert using pushItemIntoQueues()
            cb();  // callback
        } catch (e) {
            console.log(`Error: ${e.message}`);
            if (retryOptions.retry && retryCount < retryOptions.maxRetries - 1) {
                console.log(`Retrying task in ${retryOptions.retryDelay}ms (retry ${retryCount + 1} of ${retryOptions.maxRetries})...`);
                setTimeout(() => {
                    runTask(task, cb, retryCount + 1, retryOptions);
                }, retryOptions.retryDelay); // retryDelay also set in the que_config.json
            } else {
                console.log(`Max retries (${retryOptions.maxRetries}) exceeded. Aborting task.`); // if reach maxRetries set in the queue_config.json
            }
        }
    } else {
        console.log("Not function"); // if task not a function
        throw new Error("Not a function!")
    }
}

/**
 * To create the number of queues depends of the user
 * @param {*} queueNum | create how many queue
 * @returns 
 */
const queues = [];
Queue.prototype.createQueues = async function (queueNum, retryOptionsArray) { // retryOptionsArray get from queue_config.json and createQueues in app.js 
    for (let i = 0; i < queueNum; i++) {
        const retryOptions = retryOptionsArray[i] || {};
        const createQ = new BetterQueue((task, cb) => runTask(task, cb, 0, retryOptions), retryOptions); // cb = A callback function when the task is complete
        queues.push(createQ);
    }
    return queues;
}

/**
 * To push the task into the queue
 * @param {*} queuNumber | select the queue
 * @param {*} InputTask | input the function task
 */
Queue.prototype.pushItemIntoQueues = async function (queueNumber, InputTask) {
    try {
        queues[queueNumber - 1].push(InputTask) // array start from 0, therefore - 1
    } catch (e) {
        throw new Error("Queue instance not found");
    }

}

module.exports = new Queue();
