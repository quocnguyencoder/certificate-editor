import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private readonly localStorageKey = 'savedTemplates';

  getTemplates(): { name: string; data: any }[] {
    const templates = localStorage.getItem(this.localStorageKey);
    return templates ? JSON.parse(templates) : [];
  }

  saveTemplate(template: { name: string; data: any }) {
    const templates = this.getTemplates();
    const existingTemplateIndex = templates.findIndex(
      (t) => t.name === template.name
    );

    if (existingTemplateIndex > -1) {
      // Update the existing template
      templates[existingTemplateIndex] = template;
    } else {
      // Add the new template
      templates.push(template);
    }

    localStorage.setItem(this.localStorageKey, JSON.stringify(templates));
    console.log('Template saved:', template.name);
  }

  createTemplate(name: string): { name: string; data: any } {
    const newTemplate = { name, data: {} };
    this.saveTemplate(newTemplate); // Save the new template to local storage
    return newTemplate;
  }

  deleteTemplate(template: { name: string; data: any }) {
    const templates = this.getTemplates();
    const updatedTemplates = templates.filter((t) => t.name !== template.name);
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(updatedTemplates)
    );
    console.log('Template removed from storage:', template.name);
  }
}
