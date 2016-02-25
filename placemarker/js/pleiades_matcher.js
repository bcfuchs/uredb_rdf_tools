/**
* Match Pleiades against local names
*/
! function() {
    $(document).ready(function(){
	init()
    })
    var names = Object.keys(pleiades_names);

    function init() {
	$("#load-topos").click(function(){
	    $("#topos-file").toggle();
	    document.getElementById('topos-file').addEventListener('change', load_topos_from_csv,false);

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
    
    function check_pleiades(name) {


	if (names.indexOf(name) > -1) {
	    return pleiades_names[name]
	}

    }

    function load_topos_into_table(ar) {
	console.log("load")


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
			console.log(d[0]);
			console.log(d[1]);
			console.log(d[2]);
		
			console.log("done");
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
				alert('You clicked in this marker');
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

	   
	    
		$("#templatebody").append(row);
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
