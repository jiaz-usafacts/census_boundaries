//TODO
//"csa",


var map//	= drawMap()
var userCenter;
var dataDict = {}
var positionsData;
var popup;
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
G5420:'red', 
X0001:"magenta", X0014:"green", X0005:"gold", X0029:"gold"
		}
		
var dataRoot = "mtfcc_centroids/"
		
		var mtfccsFile = [
"G5200",
"G4040",
"G4110",
"G5420",
"G5220",
"G4020",
"G5400",
"G5210","G5410"]
			
			var mtfccsFileNames = {
	"G5200":"Congressional District",
	"G4040":"County Subdivision ",
	"G4110":"Incorporated Place ",
	"G5420":"Unified School District ",
	"G5220":"State Legislative District(Lower Chamber)",
	"G4020":"County or Equivalent Feature",
	"G5400":"Elementary School District",
	"G5210":" State Legislative District(Upper Chamber)",
			"G5410":"Secondary School District"}




var mtfccsPositionsCount = {'G5400': 944,
'G4040': 9742,
'G4020': 21278,
'G4110': 10503,
'G4000': 391,
'G5200': 477,
'G5210': 1290,
'G5220': 4577,
'G4210': 61,
			"G5410":540,
	'G5420': 4804}
//
			var layerGeos ={}	

var promises = []
			
for(l in mtfccsFile){
	var url = dataRoot+mtfccsFile[l]+".geojson"
	//console.log(url)
	var promise = d3.json(url)
	promises.push(promise)
}
//promises.push(d3.csv("races2b.csv"))
// console.log(promises)

var layerVisiblities = {}
for(var l in mtfccsFile){
	layerVisiblities[mtfccsFile[l]]="visible"
}
//console.log(layerVisiblities)

Promise.all([d3.json("merged_grid_coordinates.geojson"),d3.json("DP03_2020.json"),d3.json("combined_grid_layers.json")])
 .then(function(data){
	// console.log(geoids_count)
	 console.log(data[1])
	 map = drawMap()
	 
	 var combinedData = combineDataWithGeo(data[0],data[1],data[2])
	 
	 map.on("load",function(){
		 console.log(map.getStyle().layers)
		 addLayers(combinedData,"test","#fff",0)
		 	 	
	 })
})
function combineDataWithGeo(geoData,censusData,gridIds){
	console.log(gridIds)
	console.log(censusData)
	for(var i in geoData.features){
		//console.log(geoData.features[i])
		var gridId = geoData.features[i].properties.id
		var idLayers = gridIds[gridId]
		var maxIncome = 0
		var minIncome = 99999999999
		for(var layer in idLayers){
			var geoid = idLayers[layer]
			if(censusData[layer]!=undefined && censusData[layer][geoid]!=undefined){
			var income = parseInt(censusData[layer][geoid]["DP03_0062E"])
			geoData.features[i].properties[layer+"_"+geoid]=income
				if(income>maxIncome){
					maxIncome = income
				}
				if(income<minIncome){
					minIncome =income
				}
			}
			geoData.features[i].properties["maxIncome"]=maxIncome
			geoData.features[i].properties["minIncome"]=minIncome
			var dif = maxIncome-minIncome
			geoData.features[i].properties["incomeRange"]=dif			
		}
	}
//console.log(geoData)
	return geoData
}

function addLayers(layerData,layerName,color,offset){
	//var positionsActive =Object.keys(geoids_count[layerName])
	//console.log(layerName,positionsActive.length)
	//	console.log(positionsActive)
	
	map.addSource(layerName, {
		'type': 'geojson',
		data:layerData
	})
	map.addLayer({
		'id': layerName,
		'type': 'circle',
		'source': layerName,
		'paint': {
		//'circle-radius': 1,
		'circle-color': color,
		'circle-opacity': {
			property: 'incomeRange',
			stops: [
			[5000, 0.1],
			[100000, .2]
			]
		},
		//'circle-translate':[parseInt(offset),0]
			'circle-radius': {
			property: 'incomeRange',
			stops: [
			[5000, 0],
			[100000, 5]
			]
		}//,
			 // map.setFilter(layer,["==","GEOID",positionsActive])
		//'filter': ["in","GEOID"].concat(positionsActive)
	}});
	
		 map.on('mousemove', layerName, (e) => {
			 var feature = e.features[0]
			 var string =""
			 for(var i in feature.properties){
			 	var layer = i
				 var value = feature.properties[i]
				  string+=layer+": "+value+"<br>"
			 }
			 d3.select("#info").html(string)
		 })
}

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
	 for(var l in mtfccsFile){
		 //console.log(mtfccsFile[l])
		 addLayers(layerGeos[mtfccsFile[l]],mtfccsFile[l],layerColors[mtfccsFile[l]],l)
	 }
	// console.log(map.getStyle().layers)
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

		


function drawMap(){
	
	  popup = new mapboxgl.Popup({ closeOnClick: false })
	
//	console.log(dict)
//var maxBounds = [[-74.3, 40.5],[-73.5, 41]]
    mapboxgl.accessToken = "pk.eyJ1Ijoiamlhei11c2FmYWN0cyIsImEiOiJjbDNrOXUxNmoxamNmM2ltcmdhemQwNWJiIn0.QVFg3eeO5XBtNc5WRDHEYg"
    map = new mapboxgl.Map({
		container: 'map',
		style:"mapbox://styles/jiaz-usafacts/cl6b3lj0o000r15nj6rabo5cw?fresh=true",
		zoom: 4,
		preserveDrawingBuffer: true,
		minZoom:3.5,
		maxZoom:15,// ,
		 // maxBounds: maxBounds,
		center:[-96.202,38.95912082960433]//userCenter 
     });	


	 map.addControl(new mapboxgl.NavigationControl(),'bottom-right');

	  var geocoder = new MapboxGeocoder({
	  				 accessToken:mapboxgl.accessToken,
	  				 mapboxgl: mapboxgl,
	 				 flyTo:false,
	 				 marker:false
	  			 })
	
	// map.addControl(geocoder)
	//
//       map.on("load",function(){
// 	  // console.log(map.getStyle().layers)
// // 		  console.log(userCenter)
// // 	  	setCenter(userCenter)
//
// 		  clicked=true
// 		  map.on('click', (e) => {
// 			 center = [e.lngLat.lng,e.lngLat.lat]
// 			  map.flyTo({
// 				  center: center,
// 				  zoom:7
// 			  });
//
// 			  if(clicked==true){
// 				  clicked = false
// 				  map.on("moveend",function(){
// 					  setCenter(center)
// 				  })
// 			  }
// 		});
//
// 	  		geocoder.on('result', function(result) {
// 					resulted = true
// 	  			if(result!=null){
// 	 				center = result.result.center
// 					//console.log(center)
// 					map.flyTo({center:center, zoom:7})
// 					if(resulted==true){
// 					  	 resulted=false
// 					  	 map.on("moveend",function(){
// 						  setCenter(center)
// 					  })
// 				  }
// 	  			}
// 	  		});
//
// 		 })
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

