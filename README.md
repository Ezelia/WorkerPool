WorkerPool
==========

An implementation of Web workers pool to facilitate task distribution and pool maintenance.
the source code is written in TypeScript.


Usage
=====

Reference WorkerPool.js file
```html
  <head>
    <script src="WorkerPool.js"></script>
  </head>

```

### Initialization
To initialize a pool of 4 web workers using worker.js 

```js
var wPool = new Ezelia.WorkerPool();
```

You can also initialize an empty pool and create workers later using reset() method

```js
var wPool = new Ezelia.WorkerPool();
wPool.reset(wnb, "worker.js");
```

### adding a task and handling result
```js
	wPool.addTask({ n: 10, s:'someString' }, function (resultData) {
		Logger.log('task ' + resultData.__taskId + ' result ' + resultData.result); // __taskId is automatically added by WorkerPool.
		
	});
```

### Methods
* reset(nb, script) : resets the pool, if some workers are still running they'll be killed. nb is the number of workers to initialize and script is the source script to use as worker
* addTask(data, callback) : data is a json object holding the data to pass to the worker this should be a JSON object not a string!, callback(resultData) is called when worker finishes a task.
* clearTasks() : remove all queued tasks

### Events
* onTasksDone(callback) : this event is fired when all tasks are done.


Worker script specifications
============================
There are two things you need to take in consideration to allow WorkerPool to work correctly.
1 - You should allways send a json object as task data,
Javascript Web workers API allow sending a string but this will not work with WorkerPool tasks because it need to add a taskId to the data witch help identifying the task result once returned from the worker.

2 - The worker should allways return the result as an object and send back the taskId in __taskId property.

see how worker.js wotks :)


Licence
=======
   MIT License
   Copyright(c) 2012 - 2013 Ezelia.com and other contributors
   Author : Alaa-eddine KADDOURI (alaa.eddine@gmail.com)

 Permission is hereby granted, free of charge, to any person obtaining a copy of 
 this software and associated documentation files(the 'Software'), to deal in the 
 Software without restriction, including without limitation the rights to use, 
 copy, modify, merge, publish, distribute, sublicense, and / or sell copies of 
 the Software, and to permit persons to whom the Software is furnished to do so, 
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in 
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 IMPLIED, INCLUDING  BUT NOT LIMITED  TO THE WARRANTIES  OF MERCHANTABILITY, 
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE 
 AUTHORS  OR COPYRIGHT HOLDERS BE LIABLE  FOR  ANY CLAIM,  DAMAGES OR OTHER 
 LIABILITY,  WHETHER IN AN ACTION OF CONTRACT,  TORT OR OTHERWISE,  ARISING 
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
 IN THE SOFTWARE.