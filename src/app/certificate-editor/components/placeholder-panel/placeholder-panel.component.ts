import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-placeholder-panel',
  template: `
    <div class="placeholder-panel" *ngIf="visible">
      <h3>Fill Placeholders</h3>
      <div *ngFor="let placeholder of placeholders" class="placeholder-item">
        <label [attr.for]="placeholder.id">{{ placeholder.key }}</label>
        <input
          type="text"
          [id]="placeholder.id"
          [(ngModel)]="placeholder.value"
          (input)="onChange(placeholder.key, placeholder.value)"
          placeholder="Enter value for {{ placeholder.key }}"
        />
      </div>
    </div>
  `,
  styles: [
    `
      .placeholder-item {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #333;
      }
      input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
      input:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
      }
    `,
  ],
  imports: [CommonModule, FormsModule],
})
export class PlaceholderPanelComponent {
  @Input() visible = false;
  @Input() placeholders: { id: string; key: string; value: string }[] = [];
  @Output() placeholderChange = new EventEmitter<{
    key: string;
    value: string;
  }>();

  onChange(key: string, value: string) {
    this.placeholderChange.emit({ key, value });
  }
}
