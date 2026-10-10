import '@glob2/design-system/css/tokens.css';
import '@glob2/design-system/css/fonts.css';
import '@glob2/design-system/css/base.css';
import '@glob2/design-system/css/components.css';
import '@glob2/design-system/css/brand.css';
import { mountThemeToggle } from '@glob2/design-system';
mountThemeToggle(document.querySelector('#theme'), {system:'Theme: same as this device',light:'Theme: Meadow',dark:'Theme: Night colony',change:'Change theme'});
