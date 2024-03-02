import { faWrench, faHammer, faRuler, faTrowel, faToolbox, faDumpster,
    faBucket, faBrush,  faPersonDigging,  faTree, faLeaf, faWater, faHouse,
    faHotel, faHouseMedical, faHelmetSafety, faPencil, faPen, faTrash, faPaintBrush,
    faCar, faUser, faMapMarkerAlt, faMapMarker, faMapPin, faMapSigns, faMap,
    faPlug, faFire, faBolt, faExplosion, faCircleRadiation, faCarBattery, faBatteryFull,
    faLightbulb, faPowerOff  } from '@fortawesome/free-solid-svg-icons';

const iconMap = {
    wrench: faWrench,
    car: faCar,
    user: faUser,
    hammer: faHammer,
    ruler: faRuler,
    trowel: faTrowel,
    toolbox: faToolbox,
    dumpster: faDumpster,
    bucket: faBucket,
    brush: faBrush,
    personDigging: faPersonDigging,
    tree: faTree,
    leaf: faLeaf,
    water: faWater,
    house: faHouse,
    hotel: faHotel,
    houseMedical: faHouseMedical,
    helmetSafety: faHelmetSafety,
    pencil: faPencil,
    pen: faPen,
    trash: faTrash,
    paintBrush: faPaintBrush,
    mapMarkerAlt: faMapMarkerAlt,
    mapMarker: faMapMarker,
    mapPin: faMapPin,
    mapSigns: faMapSigns,
    map: faMap,
    plug: faPlug,
    fire: faFire,
    bolt: faBolt,
    explosion: faExplosion,
    circleRadiation: faCircleRadiation,
    carBattery: faCarBattery,
    batteryFull: faBatteryFull,
    lightbulb: faLightbulb,
    powerOff: faPowerOff,
};

export function getIconByName(iconName) {
    return iconMap[iconName] || null;
}

export function getAllIcons() {
    return Object.keys(iconMap);
}