import { createRoot } from 'react-dom/client';
import { ThemeProvider, ThemeToggle, Button, Card, Field, Wordmark } from '@glob2/design-system/react';
import '@glob2/design-system/css/tokens.css';
import '@glob2/design-system/css/fonts.css';
import '@glob2/design-system/css/base.css';
import '@glob2/design-system/css/components.css';
import '@glob2/design-system/css/brand.css';
createRoot(document.getElementById('root')!).render(<ThemeProvider><main style={{maxWidth:800,margin:'auto',padding:32}}><Wordmark label="Globulation 2"/><h1>A new downstream app</h1><ThemeToggle labels={{system:'Theme: device',light:'Theme: Meadow',dark:'Theme: Night colony',change:'Change theme'}}/><Card><Field label="Colony name"/><Button variant="primary">Create colony</Button></Card></main></ThemeProvider>);
