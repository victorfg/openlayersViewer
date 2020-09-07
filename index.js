import 'ol/ol.css';
import {Map, View} from 'ol';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import {Group as LayerGroup} from 'ol/layer';
import {defaults as defaultControls} from 'ol/control';

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
            visible:false,
            title:'orto'
        })
    ]
})
const map = new Map({
    target: 'map',
    layers: layers,
    view: view,
    controls : defaultControls({
        attribution : false,
        zoom : false,
    }),
});

//Switcher for Layers
const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]');
for(let baseLayerElements of baseLayerElements){
    baseLayerElements.addEventListener('change', function(){
        let baseLayerElementValue = this.value;
        layers.getLayers().forEach(function(element,index,array){
            let baseLayerTitle = element.get('title');
            element.setVisible(baseLayerTitle === baseLayerElementValue);
        })
    })
}
