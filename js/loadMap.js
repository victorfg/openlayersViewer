import 'ol/ol.css';
import {Map, View} from 'ol';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import {Group as LayerGroup} from 'ol/layer';
import {defaults as defaultControls} from 'ol/control';
import Draw from 'ol/interaction/Draw';
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';
import {GPX, GeoJSON, IGC, KML, TopoJSON} from 'ol/format';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

import {
    DragAndDrop,
    defaults as defaultInteractions,
  } from 'ol/interaction';

proj4.defs("EPSG:25831","+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4);

const projection = getProjection('EPSG:25831');
projection.setExtent([257904,4484796,535907,4751795]);

const extent = [257904,4284796,515907,4751795];
const view = new View({
    projection: projection,
    center: [396905,4618292],
    resolutions: [275,100,50,25,10,5,2,1,0.5,],
    extent: extent,
    zoom: 0
});

var source = new VectorSource();

const baseLayers = new LayerGroup({
    layers:[
        new TileLayer({
            extent: [257904,4484796,535907,4751795],
            source: new TileWMS({
                url: 'http://mapcache.icc.cat/map/bases/service?',
                params: {
                    'LAYERS': 'topo'
                }
            }),
            title:'topo',
            visible:false
        }),
        new TileLayer({
            extent: [257904,4484796,535907,4751795],
            source: new TileWMS({
                url: 'http://geoserveis.icgc.cat/icc_mapesbase/wms/service?',
                params: {
                    'LAYERS': 'orto25c'
                }
            }),
            title:'orto'
        })
        //dibuixar layer
        /*new VectorLayer({
            source: source,
            style: new Style({
                fill: new Fill({
                  color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new Stroke({
                  color: '#ffcc33',
                  width: 2,
                }),
                image: new CircleStyle({
                  radius: 7,
                  fill: new Fill({
                    color: '#ffcc33',
                  }),
                }),
            }),
            visible:true
        })*/
    ]
})

const comarquesLayers = new LayerGroup({
  layers:[
      new TileLayer({
        extent: [257904,4484796,535907,4751795],
        source: new TileWMS({
            url: 'http://geoserveis.icc.cat/icgc_bm5m/wms/service?',
            params: {
                'LAYERS': '20_COMARCA_PC'
            }
        }),
        title:'municipis1',
        visible:true
      }),
      new TileLayer({
        extent: [257904,4484796,535907,4751795],
        source: new TileWMS({
            url: 'http://geoserveis.icc.cat/icgc_bm5m/wms/service?',
            params: {
                'LAYERS': '50_NOMCAP_TX'
            }
        }),
        title:'municipis2',
        visible:true
      }),
      new TileLayer({
        extent: [257904,4484796,535907,4751795],
        source: new TileWMS({
            url: 'https://geoserveis.icgc.cat/icgc_bm5m/wms/service?',
            params: {
                'LAYERS': '40_TOPO_TX,70_NOMCOMARCA_TX'
            }
        }),
        title:'municipis3',
        visible:true
      })
  ]
})

const municipisLayers = new LayerGroup({
  layers:[
      new TileLayer({
        extent: [257904,4484796,535907,4751795],
        source: new TileWMS({
            url: 'http://geoserveis.icc.cat/icgc_bm5m/wms/service?',
            params: {
                'LAYERS': '02_TIPUSLINIA_LN'
            }
        }),
        title:'municipis1',
        visible:false
      }),
      new TileLayer({
        extent: [257904,4484796,535907,4751795],
        source: new TileWMS({
            url: 'http://geoserveis.icc.cat/icgc_bm5m/wms/service?',
            params: {
                'LAYERS': '50_NOMCAP_TX'
            }
        }),
        title:'municipis2',
        visible:false
      }),
      new TileLayer({
        extent: [257904,4484796,535907,4751795],
        source: new TileWMS({
            url: 'https://geoserveis.icgc.cat/icgc_bm5m/wms/service?',
            params: {
                'LAYERS': '40_TOPO_TX,70_NOMCOMARCA_TX'
            }
        }),
        title:'municipis3',
        visible:false
      })
  ]
})

var dragAndDropInteraction = new DragAndDrop({
    formatConstructors: [GPX, GeoJSON, IGC, KML, TopoJSON],
});

const map = new Map({
    interactions: defaultInteractions().extend([dragAndDropInteraction]),
    target: 'map',
    layers: [baseLayers,comarquesLayers,municipisLayers],
    view: view,
    controls : defaultControls({
        attribution : false,
        zoom : false,
    }),
});

//BASE LAYERS

// Switcher for Layers //
const baseLayerElements = document.querySelectorAll('#inputsLayers > div > input[type=radio]');

for (let baseLayerElements of baseLayerElements){
    baseLayerElements.addEventListener('change', function(){
        let baseLayerElementValue = this.value;
        baseLayers.getLayers().forEach(function(element,index,array){
            let baseLayerTitle = element.get('title');
            element.setVisible(baseLayerTitle === baseLayerElementValue);
        })
    })
}

// Opacity for Layers //
document.getElementById("topoOpacity").addEventListener("change", topoOpacity);
document.getElementById("ortoOpacity").addEventListener("change", ortoOpacity);

function topoOpacity(e) {
  var opacityInput = $('#topoOpacity');
  baseLayers.getLayers().forEach(function(lyr,index,array) {
    if (lyr.get('title') == 'topo'){
      lyr.setOpacity(parseFloat(opacityInput[0].value));
      opacityInput.val(String(lyr.getOpacity()));
    }
  });
}

function ortoOpacity(e) {
  var opacityInput = $('#ortoOpacity');
  baseLayers.getLayers().forEach(function(lyr,index,array) {
    if (lyr.get('title') == 'orto'){
      lyr.setOpacity(parseFloat(opacityInput[0].value));
      opacityInput.val(String(lyr.getOpacity()));
    }
  });
}

//SECONDARY LAYERS

// Switcher for Layers //
document.getElementById("comarques").addEventListener("change", changeVisibility);

function changeVisibility() {
  comarquesLayers.getLayers().forEach(function(lyr,index,array) {
      var is_visible = lyr.get('visible');
      lyr.setVisible(!is_visible);
  });
}

document.getElementById("municipis").addEventListener("change", changeVisibility2);

function changeVisibility2() {
  municipisLayers.getLayers().forEach(function(lyr,index,array) {
      var is_visible = lyr.get('visible');
      lyr.setVisible(!is_visible);
  });
}

// Opacity for Layers //
document.getElementById("comarquesOpacity").addEventListener("change", comarquesOpacity);
document.getElementById("municipisOpacity").addEventListener("change", municipisOpacity);

function comarquesOpacity(e) {
  var opacityInput = $('#comarquesOpacity');
  comarquesLayers.getLayers().forEach(function(lyr,index,array) {
    lyr.setOpacity(parseFloat(opacityInput[0].value));
    opacityInput.val(String(lyr.getOpacity()));
  });
}

function municipisOpacity(e) {
  var opacityInput = $('#municipisOpacity');
  municipisLayers.getLayers().forEach(function(lyr,index,array) {
    lyr.setOpacity(parseFloat(opacityInput[0].value));
    opacityInput.val(String(lyr.getOpacity()));
  });
}

// Draw Features

/*
function clearMap() {
    source.clear();
}

var typeSelect = document.getElementById('type');

var draw;
function addInteraction() {
  var value = typeSelect.value;
  if (value !== 'None') {
    draw = new Draw({
      source: source,
      type: typeSelect.value,
    });
    map.addInteraction(draw);
  }
}


typeSelect.onchange = function () {
  map.removeInteraction(draw);
  addInteraction();
};

document.getElementById("drawingTypeDelete").addEventListener("click", clearMap);

*/

// Drag-and-Drop

/*
dragAndDropInteraction.on('addfeatures', function (event) {
    var vectorSource = new VectorSource({
      features: event.features,
    });
    map.addLayer(
      new VectorLayer({
        source: vectorSource,
      })
    );
    map.getView().fit(vectorSource.getExtent());
});

*/