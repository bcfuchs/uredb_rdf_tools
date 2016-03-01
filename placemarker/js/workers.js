/**
 * Quick MR example using workers
 * Note: data is copied!
 */

var numWorkers = 1;
var datapointsMax = 1000000
var maxWorkers = 100;
var doRun;
doRun = function(nw, maxI,maxRuns) {
    var ar, numberWorkers, max, workerF;
    var numberWorkers = nw;
    var ar = [];
    var max = maxI;

    var workerF = function(e) {
	console.log(e.data.id)
	var data = e.data.data;
	var out = data.reduce(function(p, c) {
	    return p + Math.sqrt(c)
	});
	self.postMessage(out)

    }

    var worker = makeWorker(workerF)

    // make some data
    for (var i = 0; i < max; i++) {
	ar.push(i)
    }
    // function to call after workers finish
    var reducer = function(d) {

	var tot = d.reduce(function(p, c) {
	    return p + c;

	})

	if (nw < maxRuns) {
	    doRun(nw+2,max,maxRuns)
	}
    }


    parallelize(ar, worker, numberWorkers, reducer);
}

doRun(numWorkers,datapointsMax,maxWorkers)
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
function parallelize(data, worker, nSlices, callback) {
    var reg, slices, start, max, t0, t1,nWorkers,dataSize;
    start = 0
    slices = get_slices(data, nSlices);
    max = slices.length
    dataSize = data.length

    nWorkers = slices.length;

    console.log("data" + slices.length)
    var resultQueue = []
    reg = function(s) {
	start += 1
	if (start === max) {
	    console.log("res: " + resultQueue.length)
	    log(nWorkers+"\t" + dataSize + "\t" + (Date.now() - t0))
	    callback(resultQueue);
	}

    }
    t0 = Date.now();
    for (var i = 0; i < slices.length; i++) {
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
	    console.log(i);
	}

    }
    if (sl.length > 0) {
	out.push(sl)
    }
    return out
}

function log(m) {
    console.log(m);

}
