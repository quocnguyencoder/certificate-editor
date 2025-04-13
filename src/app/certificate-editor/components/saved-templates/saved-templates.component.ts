import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FabricService } from '../../services/fabric.service';
import { TemplateService } from '../../services/template.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saved-templates',
  templateUrl: './saved-templates.component.html',
  styleUrls: ['./saved-templates.component.scss'],
  imports: [CommonModule],
})
export class SavedTemplatesComponent {
  @Input() savedTemplates: { name: string; data: any }[] = [];
  @Output() templateDelete = new EventEmitter<any>();
  @Output() templateLoaded = new EventEmitter<any>();

  loadTemplate(template: { name: string; data: any }) {
    this.templateLoaded.emit(template);
    console.log('Template loaded:', template.name);
  }

  deleteTemplate(template: { name: string; data: any }) {
    this.templateDelete.emit(template);
    console.log('Template deleted:', template.name);
  }
}
