import { Component } from '@angular/core';
import { CertificateEditorComponent } from './certificate-editor/certificate-editor.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-certificate-editor></app-certificate-editor>
    </div>
  `,
  styles: [
    `
      .app-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
  imports: [CertificateEditorComponent],
})
export class AppComponent {
  title = 'Certificate Template Editor';
}
