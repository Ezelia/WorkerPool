//   MIT License
//   Copyright(c) 2012 - 2013 Ezelia.com and other contributors
//   Author : Alaa-eddine KADDOURI (alaa.eddine@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of 
// this software and associated documentation files(the 'Software'), to deal in the 
// Software without restriction, including without limitation the rights to use, 
// copy, modify, merge, publish, distribute, sublicense, and / or sell copies of 
// the Software, and to permit persons to whom the Software is furnished to do so, 
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
// IMPLIED, INCLUDING  BUT NOT LIMITED  TO THE WARRANTIES  OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE 
// AUTHORS  OR COPYRIGHT HOLDERS BE LIABLE  FOR  ANY CLAIM,  DAMAGES OR OTHER 
// LIABILITY,  WHETHER IN AN ACTION OF CONTRACT,  TORT OR OTHERWISE,  ARISING 
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
// IN THE SOFTWARE.

module Ezelia {

    // Class
    export class WorkerPool {

        _pool: any;
        _tasks: any;
        _doneCB: any;
        // Constructor
        constructor(size?: number, script?: string) {
            
            this._doneCB = function () { };
            if (size && script) this.reset(size, script);
            
        }
        reset(size: number, script: string) {
            var _this = this;
            if (this._pool && this._pool.length > 0) {
                for (var i = 0; i < this._pool; i++) {
                    this._pool.worker.terminate();
                    delete this._pool.worker;
                }
            }
            this._pool = [];
            this._tasks = [];

            for (var i = 0; i < size; i++) {
                var worker = new Worker(script);
                var handler = function () { };
                this._pool.push({ id: i, worker: worker, tasks: [], currentTask: -1 });

                (function (poolId) {
                    worker.onmessage = function (e) {

                        var wObj = _this._pool[poolId];
                        var tasks = _this._pool[poolId].tasks;
                        var taskId = e.data.__taskId;

                        
                        if (e.data && taskId != undefined) {
                            tasks.splice(tasks.indexOf(taskId), 1);
                            wObj.currentTask = -1;
                            if (typeof _this._tasks[taskId].handler == 'function') {
                                _this._tasks[taskId].handler(e.data);
                            }

                        }

                        _this.runTask(wObj);

                        ///////////
                    }
                })(i);
            }
        }
        private _getWorkerObj() {
            var min = 9999;
            var id = -1;
            for (var i = 0; i < this._pool.length; i++) {
                if (this._pool[i].tasks.length == 0) {
                    id = i;
                    break;
                }
                else if (this._pool[i].tasks.length < min) {
                    min = this._pool[i].tasks.length;
                    id = i;
                }

            }

            return this._pool[id];
        }
        private runTask(wObj) {
            var tasks = wObj.tasks;
            if (wObj.currentTask == -1) {
                
                var id = tasks[0];
                if (id != undefined) {
                    
                    var task = this._tasks[id];
                    wObj.currentTask = task.id;
                    wObj.worker.postMessage(task.data);
                }
            }
            
            var doCb = true;
            for (var i = 0; i < this._pool.length; i++) {
                var pObj = this._pool[i];
                if (pObj.currentTask != -1 || pObj.tasks.length > 0) {
                    doCb = false;
                    break;
                }
            }

            if (doCb) {
                this._doneCB();
            }
        }
        clearTasks() {
            this._tasks.length = 0;
        }
        // Instance member
        addTask(data: any, handler?: any) {
            
            var task = { id: this._tasks.length, data: data, handler: handler };
            data.__taskId = task.id;
            this._tasks.push(task);
            var wObj = this._getWorkerObj();
            wObj.tasks.push(task.id);            

            this.runTask(wObj);
            return task.id;
        }

        onTasksDone(cb)
        {
            if (typeof cb == 'function')
                this._doneCB = cb;
        }


    }

}

