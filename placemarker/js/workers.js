/**
 * Quick MR example using workers
 * Note: data is copied!
 */
! function() {
    var runWorkers = function (data,mapper,numberWorkers,reducer)  {
    var ar, max, workerF;

/**
    var workerF = function(e) {
	console.log(e.data.id)
	var data = e.data.data;
	var out = data.reduce(function(p, c) {
	    return p + Math.sqrt(c)
	});
	self.postMessage(out)

    }
*/

	//    var mapper = makeWorker(workerF)


/**
//   sample function to  call in reduce stage
    var reducer = function(d) {

	var tot = d.reduce(function(p, c) {
	    return p + c;
	})

	if (nw < maxRuns) {
	    doRun(nw+2,max,maxRuns)
	}
    }
*/
    	
	parallelize(data, mapper, numberWorkers, reducer);
}



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
  when the function reaches numberWorkers, it evals the callback with resultQueue as parameter
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

    for (var i = 0; i < max; i++) {
	var proc = new Worker(worker);
	proc.postMessage({
	    data: slices[i],
	    id: i
	})
	proc.addEventListener('message', function(e) {
	    resultQueue.push(e.data)
	    reg(1)
	})
    }

}

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
    window.parallelize = runWorkers
    window.makeWorker = function(f) { return makeWorker(f)}
    
} ()
