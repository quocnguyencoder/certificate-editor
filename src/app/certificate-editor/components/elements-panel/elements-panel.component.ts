import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-elements-panel',
  templateUrl: './elements-panel.component.html',
  imports: [CommonModule],
})
export class ElementsPanelComponent {
  @Output() addText = new EventEmitter<void>();
  @Output() addImage = new EventEmitter<void>();
  @Output() addShape = new EventEmitter<string>();

  shapes = [
    { name: 'Rectangle', type: 'rectangle', icon: 'bi-square' },
    { name: 'Circle', type: 'circle', icon: 'bi-circle' },
    { name: 'Line', type: 'line', icon: 'bi-dash' },
  ];
}
