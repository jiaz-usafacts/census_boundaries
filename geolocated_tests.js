//TODO
//"csa",
var layers = [
	"cd","elementary-school","places","secondary-school","senate-upper","senate-lower","county","unified-school"
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
//G4000: "#e62790",
G5220: "#00906e",
G5210: "#e62790",
G5200: "#6929c4",
G5410: "#20659d",
G5400:  "#6929c4",
//G4110: "#851c6a",
G5420: "#cf77ad",
//G4210: "#006600",
G4040: "#249edc",
G4020: "#a56eff"//
// X0072:'red',
// X0001:"magenta", X0014:"green", X0005:"gold", X0029:"gold"
		}
		
		//
//
	//
//
// csa: "00347b
// cd - 249edc
// senate upper - e62790
// senate lower - 00906e
// places - 871d6c
// county - a56eff
// elementary school - 6929c4
// secondary - 20659d
// unified - cf77ad


		var mtfccsFileNames = {
			"G5200":"congress",
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
 userCenter = center
	 map	= drawMap()
 map.on("load",function(){
 	setCenter(center)
 })
 
}   

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
	DP03_0001E:"population over 16",
DP03_0005PE :"Unemployed",
DP03_0052PE: "Less than $10,000",
DP03_0061PE: "$200,000 or more",
DP03_0062E: "Median household income",
	DP03_0028PE:"service occupations"
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
	  
	  for(var f in features){		  
		  var geoid = features[f].properties.GEOID
		  if(existingFeatures.indexOf(geoid)==-1){
			  existingFeatures.push(geoid)
			  var layer = features[f].layer.id+" copy"
			 var mtfccId = features[f].properties["MTFCC"]
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
	}else{
		var yScale = d3.scaleLinear().domain([0,30]).range([h-p*2,0])
	}
			//var yScale = d3.scaleLinear().domain([0,30]).range([h-p*2,0])
	
		var xAxis = d3.axisBottom().scale(xScale).ticks(2)
		var yAxis = d3.axisLeft().scale(yScale).ticks(2)
			
	for(var d in data){
		var color = layerColors[d]
		var chartData = data[d][popKey]
		var chartDiv = d3.select("#group_"+key).append("div").style("display","inline-block").style("width",w+"px")
		.attr("class", "chart")
		
		chartDiv.append("div").html(mtfccsFileNames[d])
		
		var svg = chartDiv.append("svg").attr("height",h).attr("width",w)
		.attr("id", popKey+"_"+d+"_value")
				
				svg.append("g").call(xAxis)
			.attr("transform","translate("+p*3+","+(h-p)+")")
		
				svg.append("g").call(yAxis)
			.attr("transform","translate("+p*3+","+p+")")
		
		
	d3.select("#"+popKey+"_"+d+"_value")
	.append("path")
	.datum(Object.keys(chartData))
  	.attr("stroke", color)
	.attr("stroke-width",2)
	.attr("opacity",.5)
   .attr("fill", "none")
			.attr("transform","translate("+p*3+","+p+")")
		
	.attr("d",d3.line()
		.x(function(d){			
			return xScale(d)})
		.y(function(d){
			var previousYear = d-1
			var previousValue = parseInt(chartData[previousYear])
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
	console.log("small")
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
			var yScale = d3.scaleLinear().domain([30,-30]).range([h-p*2,0])
	
		var xAxis = d3.axisBottom().scale(xScale).ticks(2)
		var yAxis = d3.axisLeft().scale(yScale).ticks(4)
			
	for(var d in data){
		var color = layerColors[d]
		var chartData = data[d][popKey]
		var chartDiv = d3.select("#group_"+key).append("div").style("display","inline-block").style("width",w+"px")
		.attr("class", "chart")
		
		chartDiv.append("div").html(mtfccsFileNames[d])
		
		var svg = chartDiv.append("svg").attr("height",h).attr("width",w)
		.attr("id", popKey+"_"+d)
							//
			// 	svg.append("g").call(xAxis)
			// .attr("transform","translate("+p+","+(h-p)+")")
			//
			// 	svg.append("g").call(yAxis)
			// .attr("transform","translate("+p+","+p+")")
			//
		
	d3.select("#"+popKey+"_"+d)
	.data(Object.keys(chartData))
		.enter()
	.append("rect")
   .attr("fill", color)
			//.attr("transform","translate("+p+","+p+")")
	.attr("x",function(d,i){return i*20})
		.attr("y",function(d,i){
			return 20
				var previousYear = d-1
 			var previousValue = parseInt(chartData[previousYear])
 			var currentValue = parseInt(chartData[d])
 			var percentChange = (previousValue-currentValue)/currentValue*100
			if(isNaN(percentChange)==true){
				//console.log(previousYear,previousValue,currentValue,percentChange,yScale(currentValue))
				return h- yScale(0)
			}else{
				return h- yScale(percentChange)
			}})
			.attr("width",10)
			.attr("height",function(d,i){
				return 20
				var previousYear = d-1
 			var previousValue = parseInt(chartData[previousYear])
 			var currentValue = parseInt(chartData[d])
 			var percentChange = (previousValue-currentValue)/currentValue*100
				if(isNaN(percentChange)==true){
					//console.log(previousYear,previousValue,currentValue,percentChange,yScale(currentValue))
					return yScale(0)
				}else{
					return yScale(percentChange)
				}
			})
	// .attr("d",d3.line()
// 		.x(function(d){
// 			return xScale(d)})
// 		.y(function(d){
// 			var previousYear = d-1
// 			var previousValue = parseInt(chartData[previousYear])
// 			var currentValue = parseInt(chartData[d])
// 			var percentChange = (previousValue-currentValue)/currentValue*100
// 			if(isNaN(percentChange)==true){
// 				//console.log(previousYear,previousValue,currentValue,percentChange,yScale(currentValue))
// 				return yScale(0)
// 			}else{
// 				return yScale(percentChange)
// 			}
//
// 		})
// 	)			
	//.attr("transform","translate("+p+","+p+")")
	}
}


function drawChart(data){
	console.log(data)
	for(var c in dp03Columns){
		var columnName = dp03Columns[c]
		var combinedColumnData =[]
		for(var g in data){
			var geo = g
			var geoData = data[g]
			var cData = geoData[c]
			var data2020 = cData["2020"]
			//console.log(data2020)
			combinedColumnData.push([c,geo,data2020])
		}
		console.log(c,combinedColumnData)
		drawCircle(c,combinedColumnData)
	}
}
function drawCircle(column,data){
	console.log(data)
	var chartDiv = d3.select("#chart")
	.append("div")
	
	if(column=="DP03_0001E"){
		var yScale = d3.scaleSqrt().domain([0,1000000]).range([0,50])
	}else if(column=="DP03_0062E"){
		var yScale = d3.scaleSqrt().domain([0,200000]).range([0,50])
	}else{
		var yScale = d3.scaleSqrt().domain([0,20]).range([0,50])
	}
	
	var h = 200
	var bw = 50
	var svg = chartDiv.append("svg").attr("width",500).attr("height",h)
	//svg.append("rect").attr("x",20).attr("y",20).attr("width",20).attr("height",20)
	
	svg.selectAll(".bars")	
	 .data(data)
	 .enter()
	 .append("rect")
	 .attr("x",function(d,i){return i*bw})
	 .attr("y",function(d,i){return h-yScale(d[2])})
	 .attr("width",bw-2)
	 .attr("height",function(d){console.log(d[2]); 
		 return yScale(d[2])})
		 .attr("fill",function(d){
		 	return layerColors[d[1]]
		 })
	
}


function drawMap(){
	
	  popup = new mapboxgl.Popup({ closeOnClick: false })
	
//	console.log(dict)
//var maxBounds = [[-74.3, 40.5],[-73.5, 41]]
    mapboxgl.accessToken = "pk.eyJ1Ijoiamlhei11c2FmYWN0cyIsImEiOiJjbDNrOXUxNmoxamNmM2ltcmdhemQwNWJiIn0.QVFg3eeO5XBtNc5WRDHEYg"
    map = new mapboxgl.Map({
		container: 'map',
		//style:"mapbox://styles/jiaz-usafacts/cl65eu5qq000h15oajkphueac?fresh=true",// ,//newest
		style: "mapbox://styles/jiaz-usafacts/cl6e3gmlc000315npkvm6z7f7?fresh=true",
		zoom: 10,
		preserveDrawingBuffer: true,
		minZoom:10,
		maxZoom:15,// ,
		 // maxBounds: maxBounds,
        //pitch: 30, // pitch in degrees
        // bearing: -60, // bearing in degrees
		center: [-86.670,36.140]
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
			  map.setCenter({
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
					map.setCenter({center:center, zoom:10})
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

