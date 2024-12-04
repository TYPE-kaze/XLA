/**
 * Canvas API wrapper.
 *
 * Encapsulates the canvas element and the drawing API.
 * Exposes undo and redo logic using the history object.
 */
function makeCanvas() {
  const processedImageCanvas = document.getElementById("processedImageCanvas");
  const processedImagecontext = processedImageCanvas.getContext('2d');
  const originalImageCanvas = document.getElementById("originalImageCanvas");
  const originalImageContext = originalImageCanvas.getContext('2d')
  const history = {
    past: [],
    present: null,
    future: [],

    add(newPresent) {
      if (this.present === newPresent) return;

      if (this.present) this.past.push(this.present);
      this.present = newPresent;
      this.future = [];
    },
    undo() {
      if (this.past.length === 0) return;

      const previous = this.past[this.past.length - 1];
      const newPast = this.past.slice(0, this.past.length - 1);
      const present = this.present;

      this.past = newPast;
      this.present = previous;
      this.future = [present, ...this.future];
    },
    redo() {
      if (this.future.length === 0) return;

      const next = this.future[0];
      const newFuture = this.future.slice(1);

      this.past.push(this.present);
      this.present = next;
      this.future = newFuture;
    },
  };

  return {
    isEmpty() {
      return history.present === null;
    },
    /**
     * Returns the position of the canvas element relative to the document
     */
    getPosition() {
      const box = canvasEl.getBoundingClientRect();
      return {
        top: box.top + window.pageYOffset - document.documentElement.clientTop,
        left:
          box.left + window.pageXOffset - document.documentElement.clientLeft,
      };
    },
    getSize() {
      return {
        width: processedImageCanvas.width,
        height: processedImageCanvas.height,
      };
    },
    resize(size, canvasToResize ) {
       const canvasElToResize = document.getElementById(canvasToResize)
      canvasElToResize.width = size.width;
      canvasElToResize.height = size.height;
    },
    /**
     * Draw something on the canvas without affecting the history.
     * This is useful for intermediate drawing steps.
     * @param {callback} drawOperation
     */
    drawWithoutCommit(drawOperation) {
      drawOperation(context);
    },

    /**
     * Commits a copy of the current ImageData to the history object
     * @param {mycontext} String
     */
    
    commitDraw() {
      const size = this.getSize();
      const data = processedImagecontext.getImageData(0, 0, size.width, size.height);
      history.add(
        new ImageData(new Uint8ClampedArray(data.data), data.width, data.height)
      );
    },
    /**
     * Abstracts the process of drawing an image on the canvas.
     * @param {HTMLImageElement} image
     * @param {canvaToDraw}
     */

    drawImage(image, canvaToDraw) {
      const { width, height } = image;
      this.resize({ width, height }, canvaToDraw);
      const mycontext = document.getElementById(canvaToDraw).getContext('2d')
      mycontext.drawImage(image, 0, 0, width, height);
      if(canvaToDraw==="processedImageCanvas"){this.commitDraw()}

    },
    /**
     * Performs mouse events on the canvas while the mouse is down.
     * Commits changes to the history once the mouse is released.
     * @param {callback} action return mouse events to be performed on the canvas
     */
    performWhileMouseDown(action) {
      let started = false;
      const { onmousedown, onmousemove, onmouseup } = action();
      canvasEl.onmousedown = (e) => {
        started = true;
        onmousedown?.(e);
      };
      canvasEl.onmousemove = (e) => {
        if (!started) return;
        onmousemove?.(e);
      };
      canvasEl.onmouseup = (e) => {
        started = false;
        onmouseup?.(e);
        this.commitDraw();
      };
    },
    /**
     * Modifies the canvas pixels using the given transformation.
     * @param {callback} pixelTransformation receives the pixel data to mutate in place
     */
    applyPixelTransformation(pixelTransformation) {
      this.draw((context) => {
        const { width, height } = this.getSize();
        const imgData = context.getImageData(0, 0, width, height);
        pixelTransformation(imgData.data);
        context.putImageData(imgData, 0, 0);
      });
    },
    /**
     * Undo the last action on the canvas.
     */
    undo() {
      history.undo();
      const { width, height } = history.present;
      this.resize({ width, height }, 'processedImageCanvas');
      processedImagecontext.putImageData(history.present, 0, 0);
      const { width: old_width, height: old_height } = history.past.at(-1);
      this.resize({ width: old_width, height: old_height }, 'originalImageCanvas');
      originalImageContext.putImageData(history.past.at(-1), 0, 0);
    },
    /**
     * Redo the last action on the canvas.
     */
    redo() {
      history.redo();
      const { width, height } = history.present;
      this.resize({ width, height }, 'processedImageCanvas');
      processedImagecontext.putImageData(history.present, 0, 0);
      const { width: old_width, height: old_height } = history.past.at(-1);
      this.resize({ width: old_width, height: old_height }, 'originalImageCanvas');
      originalImageContext.putImageData(history.past.at(-1), 0, 0);
    },
    /**
     * Return a data URI containing a representation of the current canvas as a base64 encoded string.
     */
    getOctetStream() {
      return processedImageCanvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    },

    /**
     *  Return a Promise object that resolve with the blob a.k.a raw binary data or reject with null
     */
    getBlob() {
      return new Promise((resolve, reject) => {
        processedImageCanvas.toBlob((blob) => {
          if (!blob) reject();
          else resolve(blob);
        })
      })
    }
  };
}

export const canvas = makeCanvas();
