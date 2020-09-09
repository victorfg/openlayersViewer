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

const extent = [257904,4484796,535907,4751795];
const view = new View({
    zoom: 4,
    projection: projection,
    center: [396905,4618292],
    resolutions: [275,100,50,25,10,5,2,1,0.5,],
    extent: extent,
    zoom: 0
});

var source = new VectorSource();

const layers = new LayerGroup({
    layers:[
        new TileLayer({
            extent: [257904,4484796,535907,4751795],
            source: new TileWMS({
                url: 'http://mapcache.icc.cat/map/bases/service?',
                params: {
                    'LAYERS': 'topo'
                }
            }),
            title:'topo'
        }),
        new TileLayer({
            extent: [257904,4484796,535907,4751795],
            source: new TileWMS({
                url: 'http://geoserveis.icgc.cat/icc_mapesbase/wms/service?',
                params: {
                    'LAYERS': 'orto25c'
                }
            }),
            title:'orto',
            visible:false
        }),
        new VectorLayer({
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
        })
    ]
})

var dragAndDropInteraction = new DragAndDrop({
    formatConstructors: [GPX, GeoJSON, IGC, KML, TopoJSON],
});

const map = new Map({
    interactions: defaultInteractions().extend([dragAndDropInteraction]),
    target: 'map',
    layers: layers,
    view: view,
    controls : defaultControls({
        attribution : false,
        zoom : false,
    }),
});

// Switcher for Layers
const baseLayerElements = document.querySelectorAll('#inputsLayers > input[type=radio]');

for (let baseLayerElements of baseLayerElements){
    baseLayerElements.addEventListener('change', function(){
        let baseLayerElementValue = this.value;
        layers.getLayers().forEach(function(element,index,array){
            let baseLayerTitle = element.get('title');
            element.setVisible(baseLayerTitle === baseLayerElementValue);
        })
    })
}

// Draw Features
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


// Drag-and-Drop
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