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
import { PlaceholderPanelComponent } from './components/placeholder-panel/placeholder-panel.component';

interface PlaceholderData {
  id: string;
  key: string;
  value: string;
  objectIds: string[]; // Track which objects contain this placeholder
}

interface TextObjectWithMetadata extends fabric.Text {
  __originalText?: string;
  __placeholders?: string[]; // Track which placeholders exist in this object
}

@Component({
  selector: 'app-certificate-editor',
  templateUrl: './certificate-editor.component.html',
  styleUrls: ['./certificate-editor.component.scss'],
  imports: [
    ElementsPanelComponent,
    ToolbarComponent,
    PropertiesPanelComponent,
    SavedTemplatesComponent,
    PlaceholderPanelComponent,
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
  isPreviewMode = false;
  placeholderMap: Map<string, { id: string; key: string; value: string }> =
    new Map();

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
      } else {
        console.warn('No active object found.');
      }
    });

    this.fabricService.canvas.on('selection:updated', (e) => {
      const activeObject = this.fabricService.canvas.getActiveObject();

      if (activeObject) {
        // Check if the object has a type property
        const objType = activeObject.type ? activeObject.type : 'unknown';
        this.selectedObject = activeObject;
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
    } else {
      alert('No template is currently loaded to save.');
      console.error('No template is currently loaded to save.');
    }
  }

  loadTemplate(template: any) {
    this.fabricService.loadTemplateData(template.data);
    this.currentTemplate = template; // Track the currently loaded template
  }

  deleteTemplate(template: any) {
    const index = this.savedTemplates.indexOf(template);
    if (index > -1) {
      this.savedTemplates.splice(index, 1);
      this.templateService.deleteTemplate(template);
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

  deleteSelectedElement() {
    const activeObject = this.fabricService.canvas.getActiveObject();
    if (activeObject) {
      this.fabricService.canvas.remove(activeObject);
      this.fabricService.canvas.discardActiveObject();
      this.fabricService.canvas.renderAll();
      this.selectedObject = null;
    } else {
      console.warn('No element selected to delete.');
    }
  }

  cloneSelectedElement() {
    const activeObject = this.fabricService.canvas.getActiveObject();
    if (activeObject) {
      activeObject.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (activeObject.left || 0) + 20, // Offset the clone
          top: (activeObject.top || 0) + 20,
        });
        this.fabricService.canvas.add(cloned);
        this.fabricService.canvas.setActiveObject(cloned);
        this.fabricService.canvas.renderAll();
        console.log('Element cloned.');
      });
    } else {
      console.warn('No element selected to clone.');
    }
  }

  togglePreviewMode() {
    this.isPreviewMode = !this.isPreviewMode;

    if (this.isPreviewMode) {
      this.scanPlaceholders();
    } else {
      this.restoreOriginalTexts();
      this.placeholderMap.clear();
    }
  }

  private scanPlaceholders() {
    this.placeholderMap.clear();
    const canvas = this.fabricService.canvas;
    let placeholderId = 0;

    canvas.forEachObject((obj) => {
      if (obj.type === 'textbox' || obj.type === 'text') {
        const text = (obj as fabric.Text).text;
        const matches = text?.match(/{{(.+?)}}/g) || [];

        matches.forEach((match) => {
          const key = match.replace(/[{}]/g, '').trim();
          const id = `ph-${obj.type}-${placeholderId++}-${key}`;

          if (!this.placeholderMap.has(key)) {
            this.placeholderMap.set(key, {
              id,
              key,
              value: '',
            });
          }
        });
      }
    });
  }

  get placeholders() {
    return Array.from(this.placeholderMap.values());
  }

  updatePlaceholder(key: string, value: string) {
    const canvas = this.fabricService.canvas;

    canvas.forEachObject((obj) => {
      if (obj.type === 'textbox' || obj.type === 'text') {
        const textObj = obj as TextObjectWithMetadata;

        // First time: store the original text and identify placeholders
        if (!textObj.__originalText) {
          textObj.__originalText = textObj.text;
          textObj.__placeholders = [];

          // Find all placeholders in this text object
          const matches = textObj.text?.match(/{{(.+?)}}/g) || [];
          textObj.__placeholders = matches.map((m) =>
            m.replace(/[{}]/g, '').trim()
          );
        }

        // Check if this object contains the placeholder we're updating
        if (textObj.__placeholders?.includes(key)) {
          // Start with the original text
          let newText = textObj.__originalText || '';

          // Replace all placeholders with their current values
          textObj.__placeholders?.forEach((placeholderKey) => {
            const placeholderPattern = `{{ ${placeholderKey} }}`;

            // If the current placeholder is being updated and has an empty value,
            // keep the original placeholder text
            if (placeholderKey === key && value === '') {
              // Do nothing - leave the original placeholder in place
            } else {
              // Otherwise use the appropriate value
              const placeholderValue =
                placeholderKey === key
                  ? value // Use the new value for the placeholder being updated
                  : this.placeholderMap.get(placeholderKey)?.value || ''; // Use existing value

              // Only replace if the value is not empty
              if (placeholderValue !== '') {
                newText = newText.replace(
                  new RegExp(placeholderPattern, 'g'),
                  placeholderValue
                );
              }
            }
          });

          textObj.set('text', newText);
        }
      }
    });

    // Update the value in the placeholder map
    if (this.placeholderMap.has(key)) {
      const placeholder = this.placeholderMap.get(key)!;
      placeholder.value = value;
      this.placeholderMap.set(key, placeholder);
    }

    canvas.renderAll();
  }

  private restoreOriginalTexts() {
    const canvas = this.fabricService.canvas;

    canvas.forEachObject((obj) => {
      if (
        (obj.type === 'textbox' || obj.type === 'text') &&
        (obj as any).__originalText
      ) {
        const textObj = obj as fabric.Text;
        textObj.set('text', (obj as any).__originalText);
        delete (obj as any).__originalText;
      }
    });

    canvas.renderAll();
  }
}
