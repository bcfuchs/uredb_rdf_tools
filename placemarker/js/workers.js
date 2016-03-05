/**
 * Simple  MapReduce example using webworkers and transferable objects, no exception handling
 * 
 * split an array into n slices
 * create a worker for each, convert code to dataUrl if needed.
 * transfer data to worker via json serialisation and arraybuffer
 * process results in a reducer stage
 * mapper  must implement arbuf <->obj and postMessage
 * 
 * parallelize([1,2,3],mapper,5,reducer)
 *    
 https://jsfiddle.net/asynch5/35yy97ho/3/
 * TODO: 
 *  -lots
 */
! function() {
    // public for export
    var runWorkers = function (data,mapper,numberWorkers,reducer)  {	
    	
	parallelize(data, mapper, numberWorkers, reducer);
    }




// serialize the code if needed
function makeWorker(f) {

    // variables need to be evaluated here for Blob
    var blob = new Blob([
	"onmessage = " + f
    ]);

    // Obtain a blob URL reference to our worker 'file'.
    return blobURL = window.URL.createObjectURL(blob);

}
    
// parallelize data processing then use data in callback when all workers finish
/**
* each worker increments a function
  when the function reaches numberWorkers, it invokes  the callback with resultQueue as parameter
*/
function parallelize(data, worker, numWorkers, callback) {
    var reg, slices, start, max, t0, t1,nWorkers,dataSize;
    start = 0
    slices = get_slices(data, numWorkers);
    max = slices.length;
    dataSize = data.length;
    nWorkers = slices.length;
    console.log("creating  " + slices.length + " workers")
    var resultQueue = []
    reg = function(s) {
	start += 1
	if (start === max) {
	    callback(resultQueue);
	}
    }
    
    var rec = function(e) {
	var res = ab2obj(e.data)
	resultQueue.push(res)
	reg(1)
    }

for (var i = 0; i < max; i++) {
// obj2ab
	var msg  =     {
	    data: slices[i],
	    id: i
	}
// transferable object for zero-length copying to worker
    var ab = obj2ab(msg);
    var proc = new Worker(worker);
    proc.postMessage(ab,[ab.buffer])
    proc.addEventListener('message',rec)

}

}
    // split up the arr by number of workers requested
    // NOTE: no worker pool
    
function get_slices(ar, n) {
    var out, sl, div;
    div = Math.floor(ar.length / n);
    out = []
    sl = [];
    for (var i = 0; i < ar.length; i++) {
	sl.push(ar[i]);
	if (i % div === 0) {
	    out.push(sl);
	    sl = [];
	}

    }
    if (sl.length > 0) {
	out.push(sl)
    }
    return out
}
/** convert between Object and ArrayBuffer */
    function obj2ab(obj) {

	var enc = new TextEncoder();
	var bin = enc.encode(JSON.stringify(obj))
	return bin

    }
    function ab2obj(ab) {

	var dec = new TextDecoder();
	var out = dec.decode(ab);
	return JSON.parse(out)


    }

    window.parallelize = runWorkers
    window.makeWorker = function(f) { return makeWorker(f)}
    

} ()
