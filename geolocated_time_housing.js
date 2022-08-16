//TODO
//"csa",
var layers = [
	"states","cbsa","cd","elementary-school","places","secondary-school","senate-upper","senate-lower","county","unified-school"
]

var map//	= drawMap()
var userCenter;
var dataRoot = "timeseries_census_data_processed/"
var dataDict = {}
var positionsData;
var popup;
var dp03
var timeSeries
		var layerColors = {
G4000: "#e62790",
G5220: "#00347B",
G5210: "#249edc",
G5200: "#6929c4",
G5410: "#20659d",
G5400: "#cf77ad",
//G4110: "#851c6a",
G5420: "#a56eff",
//G4210: "#006600",
G4040: "#CC6A19",
G4020: "#E5BD3F",//
G3110: "green"
// X0072:'red',
// X0001:"magenta", X0014:"green", X0005:"gold", X0029:"gold"
		}
	//
//
// csa - 00347b
// cd - 249edc
// senate upper - e62790
// senate lower - 00906e
// places - 871d6c
// county - a56eff
// elementary school - 6929c4
// secondary - 20659d
// unified - cf77ad


		var mtfccsFileNames = {
			"G3110":"cbsa",
			"G5200":"congress",
			"G4000":"state",
			"G4040":"county_subdivisions",
			"G4110":"places",
			"G5420":"school_unified",
			"G5220":"legislative_lower",
			"G4020":"county",
			"G5400":"school_elementary",
			"G5210":"legislative_upper",
			"G5410":"school_secondary"}

var promises = []
		var keys = []
for(l in layerColors){
	var url = dataRoot+l+"_dp03_timeseries.json"
	console.log(url)
	var promise = d3.json(url)
	keys.push(l)
	promises.push(promise)
}
//promises.push(d3.csv("races2b.csv"))
// console.log(promises)
Promise.all(promises)
 .then(function(data){
	 timeSeries={}
	 for(var i in data){
	 	//console.log(i)
		 timeSeries[keys[i]]=data[i]
	 }
	 console.log(timeSeries)
	// dp03 = data[0]
	//console.log(data)
	 // for(var d in data){
 // 		// console.log(d)
 // 		// if(d<data.length-1){
 // 		 dataDict[layers[d]]=formatData(data[d])
 //
 // 		// }else{
 // 			//positionsData = formatPositions(data[d])
 // 		// }
 //
 // 	 }
	 // console.log(dataDict)
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
 	setCenter(center)
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
		
var dp03Columns = {
	//DP03_0001E:"population over 16",
// DP03_0005PE :"Unemployed",
// DP03_0052PE: "Less than $10,000",
// DP03_0061PE: "$200,000 or more",
DP03_0062E: "Median household income",
//	DP03_0028PE:"service occupations",
	"housing": "housing prices"
}
		
function setCenter(latLng){
	//console.log(latLng)
//	 console.log(congressData)
	// console.log("call set center")
//	console.log(map.getStyle().layers)
	 marker.setLngLat([latLng[0],latLng[1]])
 	.addTo(map);
	
	  var pointOnScreen = map.project(latLng)
	
	var features = map.queryRenderedFeatures(pointOnScreen, {
	  	layers: layers
	  })
  		console.log(features)
	  
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
	  
	  for(var f in features){		  
		  var geoid = features[f].layer.id == 'cbsa' ? features[f].properties.geoid : features[f].properties.GEOID;
		  if(existingFeatures.indexOf(geoid)==-1){
			  existingFeatures.push(geoid)
			  var layer = features[f].layer.id+" copy"
			 var mtfccId = features[f].layer.id == 'cbsa' ? features[f].properties["mtfcc"] : features[f].properties["MTFCC"];
			 if (features[f].layer.id == 'states') mtfccId = 'G4000';
			  if(keys.indexOf(mtfccId)>-1){
				  //console.log(Object.keys(timeSeries[mtfccId]))
				  //console.log(mtfccId,geoid)
				  //console.log(timeSeries[mtfccId],mtfccId)
				  var mtfccData = timeSeries[mtfccId][geoid]
				  //console.log(mtfccData)
				  chartData[mtfccId]=mtfccData
				  //console.log(censusData)
				 // var pop = dataDict[features[f].layer.id][geoid]["pop"]
				//  var geoName = dataDict[features[f].layer.id][geoid]["geoName"].split(",")[0]
			  
				  displayString+="<br><span class=\"popupNumbers\">"+"</span><br>"//+positionString

				  map.setLayoutProperty(
				  layer,
				  'visibility',
				  'visible'
				  );
				  console.log(f)
				  map.setFilter(layer,["==","GEOID",geoid])
				  //map.setPaintProperty(layer,"line-offset",parseInt(f)*20)
				 // map.setPaintProperty(layer,"line-translate",[parseInt(f),parseInt(f)])
				  // map.setPaintProperty(layer, 'line-color', layerColors[mtfccId]);			  //
   				  map.setPaintProperty(layer, 'line-width', 6-parseInt(f));			  //
  // 				  map.setPaintProperty(layer, 'line-opacity', .5);			  //
  //  // map.setPaintProperty(layer, 'fill-outline-color', layerColors[mtfccId]);
				  // map.setPaintProperty(layer, 'fill-opacity', .2);
			  }
			 
		  }
	  }

	  drawChart(chartData)
	  d3.select("#info").html(displayString)
}
function  drawSmallMultiple(data,key){
	if (key === 'housing') console.log(data)
	d3.select("#group_"+key).append("div").html(dp03Columns[key])//+" "+mtfccsFileNames[d])
	.style("font-size","24px")
	.style("padding-top","10px")
		.attr("class", "chart")
	
	var popKey = key
	
	var w = 200
	var h = 100
	var p = 20
	var xScale = d3.scaleLinear().domain([2010,2020]).range([0,w-p*4])


	 if(key=="DP03_0062E"){
		var yScale = d3.scaleLinear().domain([0,100000]).range([h-p*2,0])
	}else if(key=="DP03_0001E"){
		var yScale = d3.scaleLinear().domain([0,500000]).range([h-p*2,0])
	} else if (key === 'housing') {
		var yScale = d3.scaleLinear().domain([100,300]).range([h-p*2,0])
	}else {
		var yScale = d3.scaleLinear().domain([0,30]).range([h-p*2,0])
	}
			//var yScale = d3.scaleLinear().domain([0,30]).range([h-p*2,0])
	
		var xAxis = d3.axisBottom().scale(xScale).ticks(2)
		var yAxis = d3.axisLeft().scale(yScale).ticks(2)
			
	for(var d in data){
		var color = layerColors[d]
		if (Object.keys(data[d]).indexOf(popKey) < 0) continue;
		var chartData = data[d][popKey]
		if (key === 'housing') console.log(chartData)
		var chartDiv = d3.select("#group_"+key).append("div").style("display","inline-block").style("width",w+"px")
		.attr("class", "chart")
		
		chartDiv.append("div").html(mtfccsFileNames[d])

		var dateParse = d3.timeParse("%Y-%m");

		var dates = Object.keys(chartData);

		if (popKey === 'housing'){
			xScale = d3.scaleLinear().domain(d3.extent(dates, d => dateParse(d))).range([0,w-p*4]);
			xAxis = d3.axisBottom().scale(xScale).ticks(2).tickFormat(d3.timeFormat("%Y"))
		} else {
			xScale = d3.scaleLinear().domain([2010,2020]).range([0,w-p*4]);
			xAxis = d3.axisBottom().scale(xScale).ticks(2);
		}
		
		var svg = chartDiv.append("svg").attr("height",h).attr("width",w)
		.attr("id", popKey+"_"+d+"_value")
				
				svg.append("g").call(xAxis)
			.attr("transform","translate("+p*3+","+(h-p)+")")
		
				svg.append("g").call(yAxis)
			.attr("transform","translate("+p*3+","+p+")")
		
	d3.select("#"+popKey+"_"+d+"_value")
	.append("path")
	.datum(dates)
  	.attr("stroke", color)
	.attr("stroke-width",2)
	.attr("opacity",.5)
   .attr("fill", "none")
			.attr("transform","translate("+p*3+","+p+")")
		
	.attr("d",d3.line()
		.x(function(d){			
			return popKey === 'housing' ? xScale(dateParse(d)) : xScale(d)
		})
		.y(function(d, i){
			var previousYear = i-1
			var previousValue = parseInt(chartData[dates[previousYear]])
			var currentValue = parseInt(chartData[d])
			var percentChange = (previousValue-currentValue)/currentValue*100
			if(isNaN(percentChange)==true){
				//console.log(previousYear,previousValue,currentValue,percentChange,yScale(currentValue))
				return yScale(currentValue)
			}else{
				return yScale(currentValue)
			}
		
		})
	)				
	//.attr("transform","translate("+p+","+p+")")
	}
}


function drawChangeSmallMultiple(data,key){
	d3.select("#group_"+key).append("div").html("% change "+dp03Columns[key])
	.style("font-size","24px")
	.style("padding-top","10px")
		.attr("class", "chart")
	.style("border-top","1px solid black")
		.attr("class", "chart")
	
	var popKey = key
	var w = 200
	var h = 100
	var p = 20
	var xScale = d3.scaleLinear().domain([2010,2020]).range([0,w-p*2])
	var yScale = popKey === 'housing' ? d3.scaleLinear().domain([3,-3]).range([h-p*2,0]) : d3.scaleLinear().domain([30,-30]).range([h-p*2,0])
	
		var xAxis = d3.axisBottom().scale(xScale).ticks(2)
		var yAxis = d3.axisLeft().scale(yScale).ticks(4)
			
	for(var d in data){
		var color = layerColors[d]
		if (Object.keys(data[d]).indexOf(popKey) < 0) continue;
		var chartData = data[d][popKey]
		var chartDiv = d3.select("#group_"+key).append("div").style("display","inline-block").style("width",w+"px")
		.attr("class", "chart")
		
		chartDiv.append("div").html(mtfccsFileNames[d])

		var dateParse = d3.timeParse("%Y-%m");

		var dates = Object.keys(chartData);

		if (popKey === 'housing'){
			xScale = d3.scaleLinear().domain(d3.extent(dates, d => dateParse(d))).range([0,w-p*4]);
			xAxis = d3.axisBottom().scale(xScale).ticks(2).tickFormat(d3.timeFormat("%Y"))
		} else {
			xScale = d3.scaleLinear().domain([2010,2020]).range([0,w-p*4]);
			xAxis = d3.axisBottom().scale(xScale).ticks(2);
		}
		
		var svg = chartDiv.append("svg").attr("height",h).attr("width",w)
		.attr("id", popKey+"_"+d)
				
				svg.append("g").call(xAxis)
			.attr("transform","translate("+p+","+(h-p)+")")
		
				svg.append("g").call(yAxis)
			.attr("transform","translate("+p+","+p+")")
		
		
	d3.select("#"+popKey+"_"+d)
	.append("path")
	.datum(dates)
  	.attr("stroke", color)
	.attr("stroke-width",2)
	.attr("opacity",.5)
   .attr("fill", "none")
			.attr("transform","translate("+p+","+p+")")
		
	.attr("d",d3.line()
		.x(function(d){			
			return popKey === 'housing' ? xScale(dateParse(d)) : xScale(d)
		})
		.y(function(d, i){
			var previousYear = i-1
			var previousValue = parseInt(chartData[dates[previousYear]])
			var currentValue = parseInt(chartData[d])
			var percentChange = (previousValue-currentValue)/currentValue*100
			if(isNaN(percentChange)==true){
				//console.log(previousYear,previousValue,currentValue,percentChange,yScale(currentValue))
				return yScale(0)
			}else{
				return yScale(percentChange)
			}
		
		})
	)				
	//.attr("transform","translate("+p+","+p+")")
	}
}


function drawChart(data){
	//d3.select("#chart svg").remove()
	var h = 200
	var w = 600
	var p = 50
	var keys = Object.keys(data[Object.keys(data)[0]])
	//drawChangeSmallMultiple(data,"DP03_0001E")
	//	drawChangeSmallMultiple(data,"DP03_0062E")
		d3.selectAll(".chart").remove()
	
	var xScale = d3.scaleLinear().domain([2010,2020]).range([0,w-p*2])
	
	var columns  = Object.keys(dp03Columns)
	for(var c in columns){
		//console.log(c)
		
		var columnName = columns[c]
		
		
		d3.select("#chart").append("div").attr("id","group_"+columnName)
		.style("margin-top","20px")
		.style("padding","10px")
		.style("border","1px solid black")
		.attr("class", "chart")
		
	//	.html(columnName)
		
		drawSmallMultiple(data,columnName)
		//drawChangeSmallMultiple(data,columnName)
	}
	//var svg = d3.select("#chart").append("svg").attr("height",h).attr("width",w+20)
	
	
}

function drawMap(){
	
	  popup = new mapboxgl.Popup({ closeOnClick: false })
	
//	console.log(dict)
//var maxBounds = [[-74.3, 40.5],[-73.5, 41]]
    mapboxgl.accessToken = "pk.eyJ1Ijoiamlhei11c2FmYWN0cyIsImEiOiJjbDNrOXUxNmoxamNmM2ltcmdhemQwNWJiIn0.QVFg3eeO5XBtNc5WRDHEYg"
    map = new mapboxgl.Map({
		container: 'map',
		//style:"mapbox://styles/jiaz-usafacts/cl65eu5qq000h15oajkphueac?fresh=true",// ,//newest
		style: "mapbox://styles/jiaz-usafacts/cl6usncbd000a14ny7oi5k9gs",
		zoom: 10,
		preserveDrawingBuffer: true,
		minZoom:3.5,
		maxZoom:15,// ,
		 // maxBounds: maxBounds,
        //pitch: 30, // pitch in degrees
        // bearing: -60, // bearing in degrees
		center: userCenter 
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
	   
		  clicked=true
		  map.on('click', (e) => {
			 center = [e.lngLat.lng,e.lngLat.lat]
			  map.flyTo({
				  center: center,
				  zoom:9
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
					map.flyTo({center:center, zoom:9})
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

