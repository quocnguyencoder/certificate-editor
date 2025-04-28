import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fabric } from 'fabric';
import type { Object as FabricObject } from 'fabric/fabric-impl';

@Component({
  selector: 'app-properties-panel',
  templateUrl: './properties-panel.component.html',
  imports: [CommonModule],
})
export class PropertiesPanelComponent {
  @Input() selectedObject: FabricObject | null = null;
  @Output() propertyChange = new EventEmitter<{ name: string; value: any }>();
  @Output() deleteElement = new EventEmitter<void>();
  @Output() cloneElement = new EventEmitter<void>();
  @Output() bringToFront = new EventEmitter<void>();
  @Output() sendToBack = new EventEmitter<void>();

  fontFamilies = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
  ];

  ngOnChanges(): void {
    console.log('Selected Object:', this.selectedObject);
  }

  getTextObject(): fabric.Textbox {
    return this.selectedObject as fabric.Textbox;
  }

  onPropertyChange(property: string, event: any) {
    const inputElement = event.target as HTMLInputElement;
    let value: any;

    if (inputElement.type === 'checkbox') {
      value = inputElement.checked
        ? property === 'fontWeight'
          ? 'bold'
          : 'italic'
        : property === 'fontWeight'
        ? 'normal'
        : 'normal';
    } else if (inputElement.type === 'number') {
      value = +inputElement.value;
    } else {
      value = inputElement.value;
    }

    if (this.selectedObject) {
      // Update the selected object's property
      (this.selectedObject as any)[property] = value;

      // Emit the property change to the parent component
      this.propertyChange.emit({ name: property, value });
    }
  }

  onLineStyleChange(event: any) {
    const style = event.target.value;
    if (this.selectedObject) {
      switch (style) {
        case 'solid':
          this.selectedObject.strokeDashArray = undefined;
          break;
        case 'dashed':
          this.selectedObject.strokeDashArray = [10, 5];
          break;
        case 'dotted':
          this.selectedObject.strokeDashArray = [2, 2];
          break;
      }
      this.propertyChange.emit({
        name: 'strokeDashArray',
        value: this.selectedObject.strokeDashArray,
      });
    }
  }

  deleteSelectedElement() {
    this.deleteElement.emit();
  }

  cloneSelectedElement() {
    this.cloneElement.emit();
  }
}
