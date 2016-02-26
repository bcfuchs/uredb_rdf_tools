/**
* Match Pleiades against local names
*/
! function() {
    var storage,names,hasWorkers;

    hasWorkers = false;
    storage = $.localStorage;
    names = Object.keys(pleiades_names).join('|').toLowerCase().split('|'); // loaded before this in matcher.html

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

	extract_names(storage.get('db'))
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
	var max, out,pile;
	max = 2500;
	out = {}
	pile = []
	$("#screen4 .message").html("going to process " + max + " lines...");
	
	var row_process = new Worker('js/process_row.js');
	for (var i = 0; i < max; i++) {
	    row = data[i]
	    if (i % 100 === 0 ) {
		$("#screen4 .message").html("processed " + i + " lines...");
		console.log(i)
	    }
	    // skip rows without a-z

	    if (row.join().match(/[a-zA-Z]/)) {
		row_process.postMessage(row)
		row_process.onmessage = function(e) {
		    console.log(e.data)
		    pile.push(e.data);
		    console.log('Message received from worker');
		    }
		
		//		pile.push(process_row(row))
	    }
	}
	for (var i = 0; i < pile.length; i++) {
	    var g = pile[i];
	    for (var word in g) {
		if (!(out[word])){
		    out[word] = g[word]
			
		}
	    }

	}
//	storage.set('db',data); // might exceed localstorage limit
	console.log(out)
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
	console.log("load")

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
		    
		    var sp = $("<span class='pid-span' id='pid_"+i+"_"+j+"'>"+pid+"</span>")
		    sp.data('latlon',[lat,lng,title]);
		    console.log(lat);
		    console.log(lng);
		    console.log(title);
		    
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
