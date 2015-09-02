import { Styles } from 'material-ui';

let ThemeManager = new Styles.ThemeManager();
let { Colors } = Styles;

ThemeManager.setPalette({
  primary1Color: Colors.blue500,
  primary2Color: Colors.blue700,
  primary3Color: Colors.blue100,
  accent1Color: Colors.deepOrangeA200,
  accent2Color: Colors.deepOrangeA400,
  accent3Color: Colors.deepOrangeA100
});

if (typeof cordova !== 'undefined' && cordova.platformId == 'android') {
  StatusBar.backgroundColorByHexString(Colors.blue700);
}

export default ThemeManager;
