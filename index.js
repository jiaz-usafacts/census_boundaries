//TODO
//"csa",
var layers = [
	"cd","elementary-school","places","secondary-school","senate-upper","senate-lower","county","unified-school"
]

var map;
var dataRoot = "P4_race_hispanic_over17/data/"
var dataDict = {}

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
X0072:'red', 
X0001:"magenta", X0014:"green", X0005:"gold", X0029:"gold"
		}

var promises = []
for(l in layers){
	var url = dataRoot+layers[l]+".csv"
	//console.log(url)
	var promise = d3.csv(url)
	promises.push(promise)
}
Promise.all(promises)
 .then(function(data){
	
	 for(var d in data){
		 print(d)
		 dataDict[layers[d]]=formatData(data[d])
	 }
	 // console.log(dataDict)
	 var map = drawMap()
})

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
// var marker = new mapboxgl.Marker({
// 			color:"#E62790"
// 		})
		
function drawLines(data){
	console.log(data)
}
		
function setCenter(latLng){
//	 console.log(congressData)
	// console.log("call set center")
//	console.log(map.getStyle().layers)
	// marker.setLngLat([latLng[0],latLng[1]])
// 	.addTo(map);
	
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
	  for(var f in features){		  
		  var geoid = features[f].properties.GEOID
		  if(existingFeatures.indexOf(geoid)==-1){
			  existingFeatures.push(geoid)
			  var layer = features[f].layer.id+" copy"
			 var mtfccId = features[f].properties["MTFCC"]
			  var pop = dataDict[features[f].layer.id][geoid]["pop"]
			  var geoName = dataDict[features[f].layer.id][geoid]["geoName"].split(",")[0]
			  
			  lineData.push({geoid,geoName,pop})

			  //"mtfcc: "+mtfccId+"<br>"+
			  displayString+=geoName+"<br><span class=\"popupNumbers\">"+pop+"</span><br>"
			  // map.setPaintProperty(layer,"fill-color","#ffffff")//"#E62790")
	  // 			  map.setPaintProperty(layer,"fill-opacity",.1)
			  map.setLayoutProperty(
			  layer,
			  'visibility',
			  'visible'
			  );
			  map.setFilter(layer,["==","GEOID",geoid])
		  }
		 
	  }

	  popup.setLngLat(latLng)
	  .setHTML(displayString)
	  .addTo(map);
	  
	  drawLines(lineData)
	 // d3.select("#info").html(displayString)
}

function drawMap(){
	
	  popup = new mapboxgl.Popup({ closeOnClick: false })
	
//	console.log(dict)
//var maxBounds = [[-74.3, 40.5],[-73.5, 41]]
    mapboxgl.accessToken = "pk.eyJ1Ijoiamlhei11c2FmYWN0cyIsImEiOiJjbDNrOXUxNmoxamNmM2ltcmdhemQwNWJiIn0.QVFg3eeO5XBtNc5WRDHEYg"
    map = new mapboxgl.Map({
		container: 'map',
		style:"mapbox://styles/jiaz-usafacts/cl65eu5qq000h15oajkphueac",// ,//newest
		zoom: 3.5,
		preserveDrawingBuffer: true,
		minZoom:3.5,
		maxZoom:15,// ,
		 // maxBounds: maxBounds,
		center: [-98, 36]
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
	  console.log(map.getStyle().layers)
		  
		  clicked=true
		  map.on('click', (e) => {
			 center = [e.lngLat.lng,e.lngLat.lat]
			  map.flyTo({
				  center: center,
				  zoom:7
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
					map.flyTo({center:center, zoom:7})
					if(resulted==true){
					  	 resulted=false
					  	 map.on("moveend",function(){
						  setCenter(center)
					  })	
				  }
	  			}
	  		});

		 })
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

