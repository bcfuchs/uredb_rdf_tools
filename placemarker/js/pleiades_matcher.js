/**
* Match Pleiades against local names
*/
! function() {
    var storage,names,hasWorkers;

    hasWorkers = false;
    storage = $.localStorage;
    names = Object.keys(pleiades_names).join('|').toLowerCase().split('|'); // loaded before this in matcher.html

    // set up an event queue to process worker stuff

    var signal = 'row_process';
    var event_queue = [];
    $(window).on(signal, function (e, d) {
	event_queue.push(d);
	
    });
    
    if(typeof(Worker) !== "undefined") {
	hasWorkers = true;
    } 
    $(document).ready(function(){
	init()
    })
    

    function init() {
	$("#load-topos").click(function(){
	    $("#topos-file").toggle();
	    document.getElementById('topos-file').addEventListener('change', load_topos_from_csv,false);

	});
	
	$("#load-db").click(function(){
	    $("#db-file").toggle();
	    document.getElementById('db-file').addEventListener('change', load_db_from_csv,false);

	});

	$("#run").click(function(){
	    extract_names(storage.get('db'))
	});
    }
    
   function load_topos_from_csv(e) {


	var file = e.target.files[0];

	var reader = new FileReader();

	reader.readAsText(file);
	reader.onload = function(e) {

	    var csv = e.target.result;
	    var data = $.csv.toArrays(csv);

	    console.log("adding csv from file...");
	    load_topos_into_table(data);

	    $("#topos-file").hide();
	    console.log("done loading topos from file");
	    window.location.href = "#screen3"
	}





    }
/**
*  split into tokens and check against Pleiades
*/
    function extract_names(data,callback) {
	// iterate over fields
	// get NE candidates
	// match tri-/bigrams against pleiades file
	// single tokens
	var max, out,pile,theRows,numWorkers;
	max = 2500;
	numWorkers = 30;
	out = {};
	pile = [];
	theRows =[];
	$("#screen4 .message").html("going to process " + max + " lines...");
	

	for (var i = 0; i < max; i++) {
	    row = data[i]
	    if (i % 100 === 0 ) {
		$("#screen4 .message").html("processed " + i + " lines...");
		console.log(i)
	    }
	    // skip rows without a-z
	    
	    if (row.join().match(/[a-zA-Z]/)) {
		theRows.push(row)
		

//		pile.push(process_row(row))
	    }
	}
	var reducer = function(pile) {
	    var out = {}
	    
	    console.log("reducing...");
	    console.log("pile : " + pile.length);

	    for (var i = 0; i < pile.length; i++) {
		var g = pile[i];

		for (var j in g) {
		    var word = g[j]
		    if (!(out[word])){
			out[word] = g[j]
			
		    }
		}
		
	    }
	    
	    // add to table here
	    var names = Object.keys(out).sort();
	    var t = [];
	    for (var i = 0; i < names.length; i++) {
		t.push([names[i],names[i]])
	    }
	    load_topos_into_table(t)
	}
	storage.set('db',data); // might exceed localstorage limit
	parallelize(theRows,"js/process_row.js",numWorkers,reducer);

	
	
    }
    
    // parallelize data processing then use data in callback when all workers finish
    function parallelize_local(data,worker,nSlices,callback) {
	var reg,slices;
	reg = {}
	slices = get_slices(data,nSlices);
	for (var i = 0; i < slices.size; i++) {
	    var proc = new Worker(worker);
	    proc.postMessage(slices[i])
	    proc.on_message = {
		
	    }
	}

    }

    function get_slices(ar,n) {
	var out,sl,div;
	div = Math.floor(ar.length / n);
	out =[]
	sl = [];
	for (var i = 0; i < ar.length; i++) {
	    sl.push(ar[i]);
	    if (i % div  === 0 ) {
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

    function process_row(row) {
	var out = {}

		for (var j = 0; j < row.length; j++) {
		    words = row[j].split();
		    
		    for (var k = 0; k < words.length; k++) {
			
			word = words[k].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
			if (! (out[word]) ) {
			    var ples = check_pleiades(word);
			    if (ples) {
				out[word] = ples;
			    }
			}
		    }
		}
	return out;

    }
    function load_db_from_csv(e) {
	console.log('load_db_from_csv');

	var file = e.target.files[0];

	var reader = new FileReader();

	reader.readAsText(file);

	reader.onload = function(e) {

	    var csv = e.target.result;

	    var data = $.csv.toArrays(csv);

	    console.log("adding csv from file...");
	    extract_names(data);
//	    storage.set('db',data); // might exceed localstorage limit
	    $("#db-file").hide();
	    console.log("done loading db file");
	    window.location.href = "#screen3"
	}





    }

    
    function check_pleiades(name) {
	
	
	if (names.indexOf(name.toLowerCase()) > -1) {
	    return pleiades_names[name]
	}

    }
    
    function load_topos_into_table(ar) {
	$(document).data('pids',{});
	var save_pid = function(pid,name) {
	    var pids = $(document).data('pids')
	    pids[name] = pid
	    $(document).data('pids',pids)
	    

	}

	$("#place-templatebody row").remove();
	for (var i = 0;i < ar.length; i++) {
	    var row = $("#templaterow").clone().attr("id","name_row"+i);
	    var namef = ar[i][0];
	    var namec = ar[i][1];
	    var ples = check_pleiades(namec);
	    var pid = []
	    if (ples) {
		
		for (var j = 0; j < ples.length;j++) {
		    // display the item in pop-over 
		    console.log(ples[j]['pid'])
		    var pid = ples[j]['pid']
		    var item  = ples[j]
		    var lat = parseFloat(item['reprLat'])
		    var lng = parseFloat(item['reprLong'])
		    var title = item['title'];
		    
		    var sp = $("<button class='btn btn-primary pid-span' data-pid-group='pid_"
			       +i
			       +"' data-pid='"+pid+"' id='pid_"+i+"_"+j
			       +"' "
			       +"data-pid-name='"
			       +namec
			       +"'>"
			       +pid
			       +"</button>")
		    sp.data('latlon',[lat,lng,title]);
		    console.log(lat);
		    console.log(lng);
		    console.log(title);
		    // choose this one
		    // hide the other in the row
		    // change its colour
		    
		    sp.click(function() {
			var pidgroup = $(this).attr('data-pid-group');
			var pid = $(this).attr('data-pid');
			var name = $(this).attr('data-pid-name');
			$("[data-pid-group='"+pidgroup+"']").hide();
			
			$(this).removeClass('btn-primary').addClass('btn-success').show().off();

			// save this pid to document with the name
			save_pid(pid,name);
		    })
		    sp.hover(function(){
			$("#map").html("");
			var pos = $(this).position();
			var width = $(this).outerWidth();


			$("#map").css({
			    position: "absolute",
			    top: (pos.top - 200)  + "px",
			    left: (pos.left + width) + "px",
			    width: "300px",
			    height: "200px"
			}).show();

			var d = $(this).data('latlon');

			// move map to left upper
   			var map = new GMaps({
			    div: '#map',
			    lat: d[0],
			    lng: d[1],
			    zoom: 6,
			});


			
			map.addMarker({
			    lat: d[0],
			    lng: d[1],

			    title: d[2],
			    click: function(e) {
				alert(title);
			    },
			    infoWindow: {
				content: '<p>'+pid+'</p>'
			    }
			});


		    });
		    $(row).find("td.pleiades-c").append(sp)
		}
	    }
	    
	    console.log(pid);



	    if (ples) {
		$(row).find("td.name-f").html(namef);
		$(row).find("td.name-c").html(namec);
		$(row).find("td.pleiades-c").data("pleiades",ples);

	   
	    
		$("#place-templatebody").append(row);
		$(row).show();
	    }
	}
	$('[data-toggle="popover"]').popover()
    }


    function make_popover(item,id) {
	var pop = $("#popover-template").clone().attr("id",id);
	var pid = item['pid']
	pop.html(pid);
	html = "<h2>pid</h2>";
	
	pop.attr("data-content",html);
	
	return pop;

    }




}()
