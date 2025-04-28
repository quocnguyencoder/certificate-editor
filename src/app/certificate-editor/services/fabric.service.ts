import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root',
})
export class FabricService {
  public canvas!: fabric.Canvas;

  initializeCanvas(
    canvasElement: HTMLCanvasElement,
    width: number,
    height: number
  ) {
    this.canvas = new fabric.Canvas(canvasElement, {
      width: width,
      height: height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });
  }

  addText(text: string, options: any = {}) {
    const textObject = new fabric.Textbox(text, {
      left: options.left || 100,
      top: options.top || 100,
      width: 200,
      fontSize: options.fontSize || 24,
      fontFamily: options.fontFamily || 'Arial',
      fill: options.fill || '#000000',
      editable: true,
      hasControls: true,
    });

    this.canvas.add(textObject);
    this.canvas.setActiveObject(textObject);
    this.canvas.renderAll();
  }

  addRectangle() {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#000000', // Correct initial fill color
      stroke: '#000000', // Correct initial stroke color
      strokeWidth: 1, // Correct initial stroke width
      hasControls: true,
    });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
    this.canvas.renderAll();
  }

  addCircle() {
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: '#000000', // Correct initial fill color
      stroke: '#000000', // Correct initial stroke color
      strokeWidth: 1, // Correct initial stroke width
      hasControls: true,
    });

    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);
    this.canvas.renderAll();
  }

  addLine() {
    const line = new fabric.Line([50, 100, 200, 100], {
      stroke: '#000000', // Correct initial stroke color
      strokeWidth: 1, // Correct initial stroke width
      hasControls: true,
    });

    this.canvas.add(line);
    this.canvas.setActiveObject(line);
    this.canvas.renderAll();
  }

  setBackgroundColor(color: string) {
    this.canvas.setBackgroundColor(color, () => {
      this.canvas.renderAll();
    });
  }

  setBackgroundImage(url: string) {
    fabric.Image.fromURL(url, (img) => {
      img.set({
        scaleX: this.canvas.width! / img.width!,
        scaleY: this.canvas.height! / img.height!,
        selectable: false,
        evented: false,
      });
      this.canvas.setBackgroundImage(img, () => {
        this.canvas.renderAll();
      });
    });
  }

  updateObject(change: { name: string; value: any }) {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      // Use the `set` method to update the property
      activeObject.set(change.name as keyof fabric.Object, change.value);
      // Special handling for placeholder (custom property)
      if (change.name === 'placeholder') {
        (activeObject as any).placeholder = change.value;
      }
      // Mark the object as dirty to ensure Fabric.js re-renders it
      activeObject.dirty = true;

      // Trigger a re-render of the canvas
      this.canvas.renderAll();
    }
  }

  getTemplateData() {
    return this.canvas.toJSON(['id', 'name', 'lockMovementX', 'lockMovementY']);
  }

  loadTemplateData(data: any) {
    this.canvas.loadFromJSON(data, () => {
      this.canvas.renderAll();
    });
  }

  addImage(imageUrl: string) {
    fabric.Image.fromURL(imageUrl, (img) => {
      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
      });
      this.canvas.add(img);
      this.canvas.renderAll();
    });
  }

  bringToFront(object: fabric.Object) {
    this.canvas.bringToFront(object);
    this.canvas.renderAll();
  }

  sendToBack(object: fabric.Object) {
    this.canvas.sendToBack(object);
    this.canvas.renderAll();
  }
}
