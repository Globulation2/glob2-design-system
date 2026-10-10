import '../../dist/css/tokens.css';
import '../../dist/css/fonts.css';
import '../../dist/css/base.css';
import '../../dist/css/components.css';
import '../../dist/css/brand.css';
import { mountThemeToggle } from '../../dist/theme.js';
mountThemeToggle(document.querySelector('#theme'), {system:'Theme: same as this device',light:'Theme: Meadow',dark:'Theme: Night colony',change:'Change theme'});
