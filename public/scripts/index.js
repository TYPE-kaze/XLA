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

// Gaussian modal
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

// FFT-HPF modal
const fftHPFModal = new bootstrap.Modal(document.getElementById("fftHPFModal"));
document.querySelector('#fftHPFModal #perform').addEventListener("click", () => {
  const size = document.querySelector("#fftHPFModal #size").value;
  const intensity = document.querySelector("#fftHPFModal #intensity").value;
  filter("fft-hpf", { size, intensity });
  fftHPFModal.hide();
});

// FFT-LPF modal
const fftLPFModal = new bootstrap.Modal(document.getElementById("fftLPFModal"));
document.querySelector('#fftLPFModal #perform').addEventListener("click", () => {
  const size = document.querySelector("#fftLPFModal #size").value;
  const intensity = document.querySelector("#fftLPFModal #intensity").value;
  filter("fft-lpf", { size, intensity });
  fftLPFModal.hide();
});

const fftGaussModal = new bootstrap.Modal(document.getElementById("fftGaussModal"));
document.querySelector('#fftGaussModal #perform').addEventListener("click", () => {
  const sigma = document.querySelector("#fftGaussModal #sigma").value;
  filter("fft-gauss", { sigma });
  fftGaussModal.hide();
});

const fftBPFModal = new bootstrap.Modal(document.getElementById("fftBPFModal"));
document.querySelector('#fftBPFModal #perform').addEventListener("click", () => {
  const inR = document.querySelector("#fftBPFModal #inR").value;
  const outR = document.querySelector("#fftBPFModal #outR").value;
  const intensity = document.querySelector("#fftBPFModal #intensity").value;
  filter("fft-bpf", { inR, outR, intensity });
  fftBPFModal.hide();
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

document.getElementById("hpf3x3").addEventListener("click", () => { filter("hpf3x3") })
document.getElementById("hpf5x5").addEventListener("click", () => { filter("hpf5x5") })
document.getElementById("spectrum").addEventListener("click", () => { filter("spectrum") })