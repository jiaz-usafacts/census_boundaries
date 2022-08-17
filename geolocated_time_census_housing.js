//TODO
//"csa",
var layers = [
	"states","cbsa","cd","elementary-school","places","secondary-school","senate-upper","senate-lower","county","unified-school"
]

var map//	= drawMap()
var userCenter;
var dataRoot = "timeseries_census_data_processed/"
var housingRoot = "timeseries_housing_data_processed/"
var dataDict = {}
var positionsData;
var popup;
var dp03
var timeSeries
		var layerColors = {
//G4000: "#e62790",
G4020: "#E5BD3F",//
G5200: "#6929c4",
G5210: "#249edc",
G5220: "#00347B",
G5400: "#cf77ad",
G5410: "#20659d",
G5420: "#a56eff",
//G4040: "#CC6A19",
//G4110: "#851c6a",
//G4210: "#006600",
//G3110: "green"
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
	var url2 = housingRoot+l+"_housing_timeseries.json"
	//console.log(url)
	var promise = d3.json(url)
	var promise2 = d3.json(url2)
	keys.push(l,l+"_housing")
	promises.push(promise)
	promises.push(promise2)
}
//promises.push(d3.csv("races2b.csv"))
// console.log(promises)
Promise.all(promises)
 .then(function(data){
	 timeSeries={}
	 for(var i in data){
		 //console.log(keys[i])
		//console.log(data[i])
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
 //console.log(center)  
 userCenter = center
	 map	= drawMap()
 map.on("load",function(){
	// console.log("set center initial")
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
//	DP03_0028PE:"service occupations",
	"housing": "housing prices",
DP03_0062E: "Median household income"
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
		  var geoid = features[f].properties.GEOID //== 'cbsa' ? features[f].properties.geoid : features[f].properties.GEOID;
		  if(existingFeatures.indexOf(geoid)==-1){
			  existingFeatures.push(geoid)
			  var layer = features[f].layer.id//+" copy"
			var notInUseGeos=["states","cd","cbsa","places"]
			 // console.log(layer)
			 if(notInUseGeos.indexOf(layer)==-1){
				 var mtfccId = features[f].properties.MTFCC //== 'cbsa' ? features[f].properties["mtfcc"] : features[f].properties["MTFCC"];
				 // console.log(timeSeries)
	 // 			 	console.log(mtfccId,geoid)
				  var mtfccData = timeSeries[mtfccId][geoid]["DP03_0062E"]
				  var housingData = timeSeries[mtfccId+"_housing"][geoid]["B25077_001E"]
				 				  //
				  // console.log(mtfccData)
				  // console.log(housingData)
				 chartData[mtfccId]={income:mtfccData,housing:housingData}
				  //console.log(censusData)
				 // var pop = dataDict[features[f].layer.id][geoid]["pop"]
				//  var geoName = dataDict[features[f].layer.id][geoid]["geoName"].split(",")[0]
		  
				  displayString+="<br><span class=\"popupNumbers\">"+"</span><br>"//+positionString

				  map.setLayoutProperty(
				  layer+" copy",
				  'visibility',
				  'visible'
				  );
				  map.setFilter(layer+" copy",["==","GEOID",geoid])
				  //map.setPaintProperty(layer,"line-offset",parseInt(f)*20)
				 // map.setPaintProperty(layer,"line-translate",[parseInt(f),parseInt(f)])
				  // map.setPaintProperty(layer, 'line-color', layerColors[mtfccId]);			  //
	  				  map.setPaintProperty(layer+" copy", 'line-width', 10-parseInt(f));		
			 }
			 
		  }
	  }
	 // console.log(chartData)
	  drawChart(chartData)
	  d3.select("#info").html(displayString)
}

var p = 40
var w = 400
var h = 200

function drawLines(data,layer,xScale,yScale,svg,color){
	
	svg.selectAll("."+layer)
	.data(Object.keys(data[layer]))
	.enter()
	.append("circle")
	.attr("fill",color)
	.attr("r",4)
	.attr("cx",function(d){		
			//console.log(xScale(d))	
			return xScale(d)
			//return popKey === 'housing' ? xScale(dateParse(d)) : xScale(d)
		})
	.attr("cy",function(d, i){
			var previousValue = parseInt(data[layer]["2010"])
			var currentValue = parseInt(data[layer][d])
			var percentChange = (previousValue-currentValue)/currentValue*100
			//console.log(percentChange,previousValue,currentValue)
			//console.log(yScale(percentChange))
			if(isNaN(percentChange)==true){
				//console.log(previousYear,previousValue,currentValue,percentChange,yScale(currentValue))
				return yScale(0)
			}else{
				//console.log(yScale(percentChange))
				return yScale(percentChange)
			}
	
		})
	.attr("transform","translate("+p+","+p+")")
	.on("mouseover",function(d,i){
		var year = d
		var housing2010 =  parseInt(data["housing"]["2010"])
		var income2010 =  parseInt(data["income"]["2010"])
		
			var housingCurrent = parseInt(data["housing"][d])
			var incomeCurrent = parseInt(data["income"][d])
		
		var incomeChange = Math.round((incomeCurrent-income2010)/incomeCurrent*100)+"%"
		var housingChange = Math.round((housingCurrent-housing2010)/housingCurrent*100)+"%"
		
		var displayString = "MEDIAN HOUSE VALUE: <br> 2010: "+housing2010+"<br>"+d+": "+housingCurrent+"<br> Change from 2010: "+housingChange
		+"<br><br>MEDIAN INCOME: <br> 2010:"+income2010+"<br>"+d+": "+incomeCurrent+"<br> Change from 2010: "+incomeChange
		d3.select("#rollover").html(displayString)
	})
	.on("mouseout",function(d,i){
		d3.select("#rollover").html("rollover circles on chart - text placeholder")
		
	})
	
	svg//.selectAll(".housingLines")
	.append("path")
	.datum(Object.keys(data.housing))
  	.attr("stroke", color)
	.attr("stroke-width",4)
	.attr("class","housingLines")
		.attr("fill","none")
	.attr("opacity",.5)
			.attr("transform","translate("+p+","+p+")")
	.attr("d",d3.line()
		.x(function(d){		
			//console.log(xScale(d))	
			return xScale(d)
			//return popKey === 'housing' ? xScale(dateParse(d)) : xScale(d)
		})
		.y(function(d, i){
			var previousValue = parseInt(data[layer]["2010"])
			var currentValue = parseInt(data[layer][d])
			var percentChange = (previousValue-currentValue)/currentValue*100
			//console.log(percentChange,previousValue,currentValue)
			if(isNaN(percentChange)==true){
				//console.log(previousYear,previousValue,currentValue,percentChange,yScale(currentValue))
				return yScale(0)
			}else{
				//console.log(yScale(percentChange))
				return yScale(percentChange)
			}
		})
	)				
	
}


function drawChangeSmallMultiple(data,key){	
	var chartDiv = d3.select("#chart").append("div").attr("id",key).attr("class","chartsWrapper")
	chartDiv.append("div").html("% change from 2010 "+mtfccsFileNames[key])
	var svg = chartDiv.append("svg").attr("width",w).attr("height",h).attr("id",key)
	
	var xScale = d3.scaleLinear().domain([2010,2020]).range([0,w-p*2])
	var yScale = d3.scaleLinear().domain([30,-30]).range([h-p*2,0])
	
	var xAxis = d3.axisBottom().scale(xScale).ticks(2)
	var yAxis = d3.axisLeft().scale(yScale).ticks(4)
			
	
		
	svg.append("g").call(xAxis)
.attr("transform","translate("+p+","+(h-p)+")")

	svg.append("g").call(yAxis)
.attr("transform","translate("+p+","+p+")")
		

drawLines(data,"housing",xScale,yScale,svg,"#000")
drawLines(data,"income",xScale,yScale,svg,"#aaa")

}


function drawChart(data){
	d3.selectAll(".chartsWrapper").remove()
	//console.log(data)
	d3.select("#chart").append("div").attr("class","chartsWrapper").html("black=housing, grey=income").style("font-size","24px")
	.style("margin-bottom","20px")
	for(var i in data){
		//console.log(data[i])
		drawChangeSmallMultiple(data[i],i)
	}
	
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

