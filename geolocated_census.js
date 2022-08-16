//TODO
//"csa",
var layers = [
	"cd","elementary-school","places","secondary-school","senate-upper","senate-lower","county","unified-school"
]

var map//	= drawMap()
var userCenter;
var dataRoot = "P4_race_hispanic_over17/data/"
var dataDict = {}
var positionsData;
var popup;
var dp03
		var layerColors = {
G4000: "#e62790",
G5220: "#00347B",
G5210: "#249edc",
G5200: "#6929c4",
G5410: "#20659d",
G5400: "#cf77ad",
G4110: "#851c6a",
G5420: "#a56eff",
G4210: "#006600",
G4040: "#CC6A19",
G4020: "#E5BD3F",
X0072:'red', 
X0001:"magenta", X0014:"green", X0005:"gold", X0029:"gold"
		}
		
		var tenesee = [-86.7501,36.1708]

var promises = []
for(l in layers){
	var url = dataRoot+layers[l]+".csv"
	//console.log(url)
	var promise = d3.csv(url)
	promises.push(promise)
}
promises.push(d3.csv("races2b.csv"))
// console.log(promises)
Promise.all([d3.json("dp03.json"),d3.csv("races2b.csv")])
 .then(function(data){
	 dp03 = data[0]
	console.log(dp03)
	  for(var d in data){
 // 		// console.log(d)
  		 if(d<data.length-1){
  		 dataDict[layers[d]]=formatData(data[d])
 
  		 }else{
  			positionsData = formatPositions(data[d])
  		 }
 //
  	 }
	  console.log(positionsData)
	//
	 var api_key = "a247bcaf741b4b90bb90e90badd1682c"; // Api key obtained from your account page
	 var url = `https://ipgeolocation.abstractapi.com/v1/?api_key=${api_key}`;
	 
         //getLocation()
	 
	 httpGetAsync(url, showLocation)
	
	 
})

function httpGetAsync(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", url, true); // true for asynchronous
  xmlHttp.send(null);
}

function showLocation(data) {
 // console.log(data);
  var parsedData = JSON.parse(data)
  var center = [parsedData.longitude,parsedData.latitude]
 console.log(center)  
 userCenter = center
	 map	= drawMap()
 map.on("load",function(){
	 console.log("set center initial")
 	setCenter(tenesee)
 })
 
}
// function getLocation() {
//
//
// 	$.getJSON('https://api.ipify.org?format=jsonp&callback=?', function(data) {
// 		  console.log(data.ip);
//
// 	  	    jQuery.get("http://ipinfo.io/"+data.ip, function (response)
// 	  	               {
// 	  	                   var lats = response.loc.split(',')[0];
// 	  	                   var lngs = response.loc.split(',')[1];
// 	  	                 // console.log(lats,lngs)
// 	  	               }, "jsonp");
// 	});
// }
         

function formatPositions(data){
	//console.log(data)
	var formatted ={}
	for(i in data){
		var geoid = data[i].geoId
		var mtfcc = data[i].mtfcc
		if(Object.keys(formatted).indexOf(mtfcc)==-1){
			formatted[mtfcc]={}
			if(Object.keys(formatted[mtfcc]).indexOf(geoid)==-1){
				formatted[mtfcc][geoid]=[]
				formatted[mtfcc][geoid].push(data[i])
			}else{
				formatted[mtfcc][geoid].push(data[i])
			}
		}else{
			if(Object.keys(formatted[mtfcc]).indexOf(geoid)==-1){
				formatted[mtfcc][geoid]=[]
				formatted[mtfcc][geoid].push(data[i])
			}else{
				formatted[mtfcc][geoid].push(data[i])
			}
		}
	}
	return formatted
}
function formatData(data){
	var formatted = {}
	for(var i in data){
		if(data[i]["GEO_ID"]!=undefined){
			var geoName = data[i].NAME
			var pop = data[i]["P4_001N"]
			var geoid = data[i]["GEO_ID"].split("US")[1]
			formatted[geoid]={geoName:geoName,pop:pop}
		}
	}
	return formatted
	
}

var marker = null;

var clicked = false
var resulted = false
var marker = new mapboxgl.Marker({
			color:"#E62790"
		})
		
function drawLines(data){
	console.log(data)
}
		
var dp03Columns = {
DP03_0005PE :"Unemployed",
DP03_0052PE: "Less than $10,000",
DP03_0061PE: "$200,000 or more",
DP03_0062E: "Median household income",
DP03_0099PE:"No health insurance coverage"
}
		
function setCenter(latLng){
	console.log(latLng)
//	 console.log(congressData)
	// console.log("call set center")
//	console.log(map.getStyle().layers)
	 marker.setLngLat([latLng[0],latLng[1]])
 	.addTo(map);
	
	  var pointOnScreen = map.project(latLng)
	
	var features = map.queryRenderedFeatures(pointOnScreen, {
	  	layers: layers
	  })
  		//console.log(features)
	  
	  var uniqueIds = []
	  for (var l in layers){
		  map.setLayoutProperty(
		  layers[l]+" copy",
		  'visibility',
		  'none'
		  );
	  }
	  
	  var displayString ="<span class=\"popupTitle\">"+Math.round(latLng[0]*100)/100+","+Math.round(latLng[1]*100)/100+"</span><br>"
	  
	  var existingFeatures = []
	  var lineData = []
	  
	  var chartData = {}
			  var displayString = ""
	  
	  for(var f in features){		  
		  var geoid = features[f].properties.GEOID
		  if(existingFeatures.indexOf(geoid)==-1){
			  existingFeatures.push(geoid)
			  var layer = features[f].layer.id+" copy"
			 var mtfccId = features[f].properties["MTFCC"]
			  var mtfccData = dp03[mtfccId][geoid]
			  chartData[mtfccId]=mtfccData
			  //console.log(censusData)
			 // var pop = dataDict[features[f].layer.id][geoid]["pop"]
			//  var geoName = dataDict[features[f].layer.id][geoid]["geoName"].split(",")[0]
			  
			  var positions = positionsData[mtfccId][geoid]
			  for(var p in positions){
			  	var position = positions[p]
				  var level = position.level
				  var label = position.name
				  var officeHolder = position.officeholderName
				  var salary = position.salary
				  var years = position.totalYearsInOffice
				  displayString +="level: "+level+"<br>name: "+label
				  +"<br>office holder: "+officeHolder
				  +"<br>salary: "+salary
				  +"<br>years in office: "+years+"<br>"				  
			  }
			  
			  displayString+="<br><span class=\"popupNumbers\">"+"</span><br>"//+positionString

			  map.setLayoutProperty(
			  layer,
			  'visibility',
			  'visible'
			  );
			  map.setFilter(layer,["==","GEOID",geoid])
			  map.setPaintProperty(layer, 'line-color', layerColors[mtfccId]);			  //
			  map.setPaintProperty(layer, 'line-width', 3);			  //
			  map.setPaintProperty(layer, 'line-opacity', .5);			  //
			  // map.setPaintProperty(layer, 'fill-outline-color', layerColors[mtfccId]);
			  // map.setPaintProperty(layer, 'fill-opacity', .2);
		  }
	  }

	  drawChart(chartData)
	  d3.select("#info").html(displayString)
}
function drawChart(data){
	d3.select("#chart svg").remove()
	console.log(data)
	var h = 400
	var w = 300
	var p = 100
	var svg = d3.select("#chart").append("svg").attr("height",h).attr("width",w+20)
	
	
	var keys = Object.keys(data[Object.keys(data)[0]])
	
	var yScale = d3.scaleLinear().domain([0,keys.length]).range([0,h-p])
	var xPScale = d3.scaleLinear().domain([0,100]).range([0,w-p])
	var xVScale = d3.scaleLinear().domain([0,100000]).range([0,w-p])
	
	for(var i in data){
		var census = data[i]
		var color = layerColors[i]
		for(var c in census){
			
			if(c=="DP03_0062E"){
				var xAxis = d3.axisBottom().scale(xVScale).ticks(2)
			}else{
				var xAxis = d3.axisBottom().scale(xPScale).ticks(2)
			}
			
			var yIndex = keys.indexOf(c)
			var xValue = census[c]
			var y = yScale(yIndex)
			if(c=="DP03_0062E"){
				var x = xVScale(xValue)
			}else{
				var x = xPScale(xValue)
			}
			svg.append("text").text(dp03Columns [c]).attr("x",10).attr("y",y).attr("fill","#fff")
			.attr("transform","translate("+0+","+p+")")
			
			svg.append("rect").attr("x",x).attr("y",y).attr("width",4).attr("height",30)
			.attr("fill",color)
			.attr("transform","translate("+p+","+p+")")
			
			svg.append("g").call(xAxis).style("color","#fff")
			.attr("transform","translate("+p+","+(y+p+30)+")")
		}
	}
}

function drawMap(){
	
	  popup = new mapboxgl.Popup({ closeOnClick: false })
	
//	console.log(dict)
//var maxBounds = [[-74.3, 40.5],[-73.5, 41]]
    mapboxgl.accessToken = "pk.eyJ1Ijoiamlhei11c2FmYWN0cyIsImEiOiJjbDNrOXUxNmoxamNmM2ltcmdhemQwNWJiIn0.QVFg3eeO5XBtNc5WRDHEYg"
    map = new mapboxgl.Map({
		container: 'map',
		style:"mapbox://styles/jiaz-usafacts/cl65eu5qq000h15oajkphueac?fresh=true",// ,//newest
		zoom: 12,
		preserveDrawingBuffer: true,
		minZoom:8,
		maxZoom:12,// ,
		 // maxBounds: maxBounds,
		center:[-86.468,32.470]
     });	
	

	 map.addControl(new mapboxgl.NavigationControl(),'bottom-right');

	  var geocoder = new MapboxGeocoder({
	  				 accessToken:mapboxgl.accessToken,
	  				 mapboxgl: mapboxgl,
	 				 flyTo:false,
	 				 marker:false
	  			 })
	
	 map.addControl(geocoder)
				 
      map.on("load",function(){
	  // console.log(map.getStyle().layers)
// 		  console.log(userCenter)
// 	  	setCenter(userCenter)
	 
	 	 map.on("move",function(){
	 	 	console.log(map.getZoom())
	 	 })
	   
		  clicked=true
		  map.on('click', (e) => {
			 center = [e.lngLat.lng,e.lngLat.lat]
			  map.flyTo({
				  center: center,
				  zoom:10
			  });
			  
			  if(clicked==true){
				  clicked = false
				  map.on("moveend",function(){
					  setCenter(center)
				  })
			  }
		});
	
	  		geocoder.on('result', function(result) {
					resulted = true
	  			if(result!=null){
	 				center = result.result.center
					//console.log(center)
					map.flyTo({center:center, zoom:10})
					if(resulted==true){
					  	 resulted=false
					  	 map.on("moveend",function(){
						  setCenter(center)
					  })	
				  }
	  			}
	  		});

		 })
		 return map
}


function filterOnResult(map,features){
	
	// for(var i in features){
	// 	var layerName = features[i].layer.id.replace("_hover","")
	// 	 var idKey = layerUniqueIds[layerName]
	// 	console.log(layerName)
	// 	if(layerName=="borough"){
	// 		console.log(features[i])
	// 		currentBorough = features[i]["properties"][idKey]
	// 		break
	//
	// 	}
	//
	// }
	// 	console.log(currentBorough)
	// var doubleFilterLayers = ["neighborhood","municipalCourt"]
	//
	for(var f in features){
			//console.log(features[f])
			 var layerName = features[f].layer.id.replace("_hover","")  	 	  
			 var idKey = layerUniqueIds[layerName]
			
		
			//console.log(idKey)
			 var gid = features[f]["properties"][idKey]
			//console.log([idKey,gid])
 			map.setFilter(layerName,["==",idKey,gid])
 			map.setFilter(layerName+"_outline",["==",idKey,gid])
   		 	map.setPaintProperty(layerName+"_outline",'line-opacity',onOpacity);
			map.setLayoutProperty(layerName,'visibility',"visible");//
			map.setLayoutProperty(layerName+"_outline",'visibility',"visible");//
		
			
			
		 

		 // map.setPaintProperty(layerName,'fill-color',colors[i]);
		 map.setPaintProperty(layerName,'fill-opacity',offOpacity);
			//map.setFilter(layerName+"_hover",["!=",idKey,gid])
		}
}

