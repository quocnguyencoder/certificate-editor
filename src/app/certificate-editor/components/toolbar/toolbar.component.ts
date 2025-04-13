import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FabricService } from '../../services/fabric.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  imports: [CommonModule, FormsModule],
})
export class ToolbarComponent {
  @Input() currentTemplate: any = null;
  @Output() createNewTemplate = new EventEmitter<void>();
  @Output() saveTemplate = new EventEmitter<void>();
  @Output() exportToPDF = new EventEmitter<void>();

  backgroundColor = '#ffffff';

  constructor(private fabricService: FabricService) {}

  ngOnInit() {
    console.log('ToolbarComponent initialized', this.currentTemplate);
  }

  onBackgroundColorChange() {
    this.fabricService.setBackgroundColor(this.backgroundColor);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        this.fabricService.setBackgroundImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteBackgroundImage() {
    this.fabricService.setBackgroundImage(''); // Clear the background image
  }
}
