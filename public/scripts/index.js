import { canvas } from "./canvas.js";
import filter from "./filter.js";
// Load image drag and drop
document.getElementById("dragAndDropZone").addEventListener("dragover", (e) => {
  e.preventDefault();
});

document.getElementById("dragAndDropZone").addEventListener("drop", (e) => {
  e.preventDefault();

  function loadImage(src) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      document.querySelector(".drag-helper").classList.add("invisible");
      document.getElementById("controls").classList.remove("no-events");
      canvas.drawImage(image);
    };
  }

  const file = e.dataTransfer.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      loadImage(e.target.result);
    };
  }

  const url = e.dataTransfer.getData("url");
  if (url) loadImage(url);
});

// Resize modal
const modal = new bootstrap.Modal(document.getElementById("resolutionModal"));
document
  .getElementById("resolutionModal")
  .addEventListener("show.bs.modal", () => {
    const image = new Image();
    const widthInput = document.querySelector("#resolutionModal #width-size");
    const heightInput = document.querySelector("#resolutionModal #height-size");
    const ratioCheckbox = document.querySelector("#resolutionModal #checkbox-img-ratio");

    // Update values with current resolution
    const canvasSize = canvas.getSize();
    widthInput.value = canvasSize.width;
    heightInput.value = canvasSize.height;

    // Keep image ratio if selected
    const ratio = canvasSize.width / canvasSize.height;
    widthInput.addEventListener("keyup", () => {
      if (!ratioCheckbox.checked) return;
      heightInput.value = widthInput.value / ratio;
    });
    heightInput.addEventListener("keyup", () => {
      if (!ratioCheckbox.checked) return;
      widthInput.value = heightInput.value * ratio;
    });

    // Redraw image with new resolution values
    document.getElementById("saveResolution").addEventListener("click", () => {
      image.src = canvas.getOctetStream();
      image.width = widthInput.value;
      image.height = heightInput.value;
      image.onload = () => canvas.drawImage(image);
      modal.hide();
    });
  });

// Image filters
document.getElementById("threshold").addEventListener("click", () => {
  canvas.applyPixelTransformation((pixels) => {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = getRGB(pixels, i);
      const v = 0.2126 * r + 0.7152 * g + 0.0722 * b >= 180 ? 255 : 0;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = v;
    }
  });
});

document.getElementById("sephia").addEventListener("click", () => {
  canvas.applyPixelTransformation((pixels) => {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = getRGB(pixels, i);
      pixels[i] = r * 0.393 + g * 0.769 + b * 0.189;
      pixels[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
      pixels[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
    }
  });
});

document.getElementById("invert").addEventListener("click", () => {
  canvas.applyPixelTransformation((pixels) => {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = getRGB(pixels, i);
      pixels[i] = 255 - r;
      pixels[i + 1] = 255 - g;
      pixels[i + 2] = 255 - b;
    }
  });
});

function getRGB(pixel, position) {
  return [pixel[position], pixel[position + 1], pixel[position + 2]];
}

// Resize modal
const avgModal = new bootstrap.Modal(document.getElementById("averageModal"));
document.querySelector('#averageModal #perform').addEventListener("click", () => {
  const widthInput = document.querySelector("#averageModal #width-size");
  const heightInput = document.querySelector("#averageModal #height-size");
  const width = widthInput.value;
  const height = heightInput.value;

  filter("average", { width, height });
  avgModal.hide();
});

// Resize modal
const gaussianModal = new bootstrap.Modal(document.getElementById("gaussianModal"));
document.querySelector('#gaussianModal #perform').addEventListener("click", () => {
  const widthInput = document.querySelector("#gaussianModal #width-size");
  const heightInput = document.querySelector("#gaussianModal #height-size");
  const deviationInput = document.querySelector("#gaussianModal #deviation");
  const width = widthInput.value;
  const height = heightInput.value;
  const deviation = deviationInput.value;

  filter("gaussian", { width, height, deviation });
  gaussianModal.hide();
});

// Median modal
const medianModal = new bootstrap.Modal(document.getElementById("medianModal"));
document.querySelector('#medianModal #perform').addEventListener("click", () => {
  const size = document.querySelector("#medianModal #size").value;

  filter("median", { size });
  medianModal.hide();
});

// History buttons
document
  .getElementById("redoButton")
  .addEventListener("click", () => canvas.redo());
document
  .getElementById("undoButton")
  .addEventListener("click", () => canvas.undo());

// Download
document.getElementById("linkDownload").addEventListener("click", (e) => {
  if (canvas.isEmpty()) e.preventDefault();
  e.currentTarget.setAttribute("href", canvas.getOctetStream());
});

document.getElementById("test").addEventListener("click", () => { filter("test") })
document.getElementById("grayscale-py").addEventListener("click", () => { filter("grayscale") })