import {
  faArrowRightFromBracket,
  faImages,
  faChevronLeft,
  faList,
  faTableList,
  faPlus,
  faWrench,
  faHammer,
  faRuler,
  faCalendar,
  faTrowel,
  faToolbox,
  faDumpster,
  faBucket,
  faBrush,
  faPersonDigging,
  faTree,
  faLeaf,
  faWater,
  faHouse,
  faHotel,
  faHouseMedical,
  faHelmetSafety,
  faPencil,
  faPen,
  faTrash,
  faPaintBrush,
  faCar,
  faUser,
  faMapMarkerAlt,
  faMapMarker,
  faMapPin,
  faMapSigns,
  faMap,
  faPlug,
  faFire,
  faBolt,
  faExplosion,
  faCircleRadiation,
  faCarBattery,
  faBatteryFull,
  faLightbulb,
  faPowerOff,
  faCircleUser,
  faHeart,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  heart: faHeart,
  star: faStar,
  wrench: faWrench,
  signOut: faArrowRightFromBracket,
  back: faChevronLeft,
  images: faImages,
  calendar: faCalendar,
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
  list: faList,
  plus: faPlus,
  tableList: faTableList,
  circleUser: faCircleUser,
};

export function getIconByName(iconName) {
  return iconMap[iconName] || null;
}

export function getAllIcons() {
  return Object.keys(iconMap);
}
