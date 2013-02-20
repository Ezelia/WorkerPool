//this is a global counter, it will increase each time the worker is called;
var count = 0;



var taskId = undefined;
onmessage = function (e) {
    taskId = e.data.__taskId; //we can store internal taskId for later use if we need.

    handle(e.data);
};


//here is the worker logic
function handle(data) {
    count++;

    var resultData = {
        __taskId: data.__taskId //this is mandatory for WorkerPool to identify witch task resturned result!
    };

    //random value to simulate computation time (between 1000 and 1500ms)
    var randTime = (Math.random() * 500 | 0) + 1000;


    // Send back the results to the parent page
    setTimeout(function () {
        resultData.result = '(' + count + ') => ' + randTime; // just send back something
        postMessage(resultData);
    }, randTime);
    
}

