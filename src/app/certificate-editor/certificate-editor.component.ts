import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FabricService } from './services/fabric.service';
import { CertificateTemplate } from './models/certificate.model';
import { ElementsPanelComponent } from './components/elements-panel/elements-panel.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel.component';
import { SavedTemplatesComponent } from './components/saved-templates/saved-templates.component';
import { TemplateService } from './services/template.service';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-certificate-editor',
  templateUrl: './certificate-editor.component.html',
  styleUrls: ['./certificate-editor.component.scss'],
  imports: [
    ElementsPanelComponent,
    ToolbarComponent,
    PropertiesPanelComponent,
    SavedTemplatesComponent,
    CommonModule,
  ],
})
export class CertificateEditorComponent implements OnInit {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  template: CertificateTemplate = {
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    backgroundImage: null,
    elements: [],
  };

  selectedObject: any = null;
  savedTemplates: { name: string; data: any }[] = [];
  currentTemplate: { name: string; data: any } | null = null;

  constructor(
    public fabricService: FabricService,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.fabricService.initializeCanvas(
      this.canvas.nativeElement,
      this.template.width,
      this.template.height
    );

    this.fabricService.canvas.on('selection:created', (e) => {
      const activeObject = this.fabricService.canvas.getActiveObject();

      if (activeObject) {
        // Check if the object has a type property
        const objType = activeObject.type ? activeObject.type : 'unknown';
        this.selectedObject = activeObject;

        console.log('Selected object type:', objType);
        console.log('Selected object:', this.selectedObject);

        // Additional logic to handle the selected object can go here
      } else {
        console.warn('No active object found.');
      }
    });

    this.fabricService.canvas.on('selection:cleared', () => {
      this.selectedObject = null;
      console.log('Selection cleared');
    });

    this.savedTemplates = this.templateService.getTemplates();
  }

  addText() {
    this.fabricService.addText('Double click to edit', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '#000000',
    });
  }

  addImage() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (event: Event) => {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.files && inputElement.files[0]) {
        const file = inputElement.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          this.fabricService.addImage(imageUrl);
        };

        reader.onerror = () => {
          console.error('Error reading the file.');
        };

        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  }

  addShape(shapeType: string) {
    switch (shapeType) {
      case 'rectangle':
        this.fabricService.addRectangle();
        break;
      case 'circle':
        this.fabricService.addCircle();
        break;
      case 'line':
        this.fabricService.addLine();
        break;
    }
  }

  setBackgroundColor(color: string) {
    this.fabricService.setBackgroundColor(color);
  }

  setBackgroundImage(image: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      this.fabricService.setBackgroundImage(event.target?.result as string);
    };
    reader.readAsDataURL(image);
  }

  deleteBackgroundImage() {
    this.fabricService.setBackgroundImage(''); // Clear the background image
  }

  createNewTemplate() {
    const templateName = prompt('Enter a name for the new template:');
    if (templateName) {
      const newTemplate = { name: templateName, data: {} };
      this.savedTemplates.push(newTemplate);
      this.templateService.saveTemplate(newTemplate);
      this.loadTemplate(newTemplate);
      console.log('New template created:', templateName);
    }
  }

  saveTemplate() {
    if (this.currentTemplate) {
      const templateData = this.fabricService.getTemplateData();
      this.currentTemplate.data = templateData; // Update the data of the current template
      this.templateService.saveTemplate(this.currentTemplate);
      alert(
        `Template "${this.currentTemplate.name}" has been saved successfully!`
      );
      console.log('Template updated:', this.currentTemplate.name);
    } else {
      alert('No template is currently loaded to save.');
      console.error('No template is currently loaded to save.');
    }
  }

  loadTemplate(template: any) {
    this.fabricService.loadTemplateData(template.data);
    this.currentTemplate = template; // Track the currently loaded template
    console.log('Template loaded:', template.name);
    console.log('Current:', this.currentTemplate);
  }

  deleteTemplate(template: any) {
    const index = this.savedTemplates.indexOf(template);
    if (index > -1) {
      this.savedTemplates.splice(index, 1);
      this.templateService.deleteTemplate(template);
      console.log('Template deleted:', template.name);
    }
  }

  exportToPDF() {
    const canvasElement = this.canvas.nativeElement;
    const canvasDataURL = canvasElement.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [this.template.width, this.template.height],
    });

    pdf.addImage(
      canvasDataURL,
      'PNG',
      0,
      0,
      this.template.width,
      this.template.height
    );
    pdf.save('certificate.pdf');
  }
}
