import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "src/app/shared/services/api.service";
import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import mime from "mime";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
import { MatDialog } from "@angular/material/dialog";
import { UpdateEsignComponent } from "./update-esign/update-esign.component";

interface Regimen {
  regimen: string;
  fechaInicio: string;
  fechaFin?: string;
}

interface Obligacion {
  descripcion: string;
  vencimiento: string;
  fechaInicio: string;
  fechaFin?: string;
}

@Component({
  selector: "app-my-company",
  templateUrl: "./my-company.component.html",
  styleUrls: ["./my-company.component.scss"],
})
export class MyCompanyComponent implements OnInit {
  empresaForm: FormGroup;

  company = null;

  isDraggingPDF = false;
  isDraggingCER = false;
  isDraggingKEY = false;
  fileNamePDF: string | null = null;
  fileNameCER: string | null = null;
  fileNameKEY: string | null = null;

  verticalPosition: MatSnackBarVerticalPosition = "top";
  config_snack = {
    duration: 3000,
    verticalPosition: this.verticalPosition,
    panelClass: ["custom-snackbar"],
  };

  companyInformation = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.empresaForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      rfc: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Z]{3}[0-9]{6}[A-Z_0-9]{3}$"),
        ],
      ],
      capitalRegime: ["", Validators.required],
      commercialName: ["", Validators.required],
      startDate: ["", Validators.required],
      status: ["", Validators.required],
      lastUpdateDate: ["", Validators.required],
      postalCode: ["", [Validators.required, Validators.pattern("^[0-9]{5}$")]],
      streetName: ["", [Validators.required, Validators.maxLength(100)]],
      interiorNumber: ["", Validators.required],
      localityName: ["", Validators.required],
      state: ["", Validators.required],
      street: ["", Validators.required],
      avenueType: ["", Validators.required],
      exteriorNumber: ["", [Validators.required, Validators.maxLength(5)]],
      neighborhoodName: ["", [Validators.required, Validators.maxLength(100)]],
      municipalityName: ["", [Validators.required, Validators.maxLength(100)]],
      betweenStreets: ["", [Validators.required, Validators.maxLength(200)]],
      password: ["", [Validators.required, Validators.maxLength(100)]],
      moreBranches: [false, [Validators.required]],
      fileKey: [null],
      fileCer: [null],
    });

    this.fetchCompanyInformation();
  }

  /**
   * Handles the file input change event and updates the form control with the selected file.
   *
   * @param event - The file input change event containing the selected file.
   * @param controlName - The name of the form control to update with the selected file.
   */
  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    const type = mime.getType(file.name);
    console.log("TYPE", type);
    if (file) {
      // Update the form control with the selected file
      this.empresaForm.patchValue({
        [controlName]: file,
      });
      // Ensure the form control's value is valid
      this.empresaForm.get(controlName)?.updateValueAndValidity();

      // Set the appropriate file name based on the control name
      if (controlName === "fileCer") {
        this.fileNameCER = file.name;
      } else {
        this.fileNameKEY = file.name;
      }
    }
  }

  /**
   * Handles the upload of a PDF file, reads its content, and extracts specific data.
   *
   * @param event - The event triggered by the file input element when a file is selected.
   */
  onPDFUpload(event: any): void {
    const file = event.target.files[0];

    // Check if the file is a PDF
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();

      // Define the onload event for the FileReader
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorker;
        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        let text = "";

        // Iterate through each page of the PDF
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          text += pageText + "\n";
        }

        // Split the text to extract specific data
        const splittedText = text.split(
          "Datos de Identificación del Contribuyente:"
        );

        // Extract data from the relevant section of the text
        this.extractData(splittedText[1]);
      };

      // Read the file as an ArrayBuffer
      reader.readAsArrayBuffer(file);
    } else {
      console.error("El archivo no es un PDF");
    }
  }

  /**
   * Extracts and processes data from a given text string, updating the form values if the extracted RFC matches the form's RFC.
   *
   * @param {string} text - The text containing the data to be extracted.
   *
   * The function performs the following operations:
   * - Extracts various fields from the text using regular expressions, such as RFC, commercial name, start date, etc.
   * - Compares the extracted RFC with the RFC from the form values.
   * - If the RFCs do not match, a notification is shown to the user.
   * - If the RFCs match, the form is updated with the extracted data.
   * - Sets a flag indicating that the company data has been successfully processed.
   */
  extractData(text: string) {
    const cleanData = {
      rfc: text.match(/RFC:\s*([A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3})/)?.[1] || "",
      commercialName:
        text
          .match(/Denominación\/Razón Social:\s*(.+)/)?.[1]
          ?.trim()
          .split("Régimen")[0]
          .trim() || "",
      name:
        text
          .match(/Nombre Comercial:\s*(.+)/)?.[1]
          ?.trim()
          .split("Fecha inicio de operaciones")[0]
          .trim() || "",
      capitalRegime:
        text
          .match(/Régimen Capital:\s*(.+)/)?.[1]
          ?.trim()
          .split("Nombre Comercial")[0]
          .trim() || "",
      startDate:
        text
          .match(/Fecha inicio de operaciones:\s*(.+)/)?.[1]
          ?.trim()
          .split("Estatus en el padrón")[0]
          .trim() || "",
      status:
        text
          .match(/Estatus en el padrón:\s*(.+)/)?.[1]
          ?.trim()
          .split("Fecha de último cambio de estado")[0]
          .trim() || "",
      lastUpdateDate:
        text
          .match(/Fecha de último cambio de estado:\s*(.+)/)?.[1]
          ?.trim()
          .split("Datos del domicilio registrado")[0]
          .trim() || "",
      postalCode: parseInt(text.match(/Código Postal:\s*(\d{5})/)?.[1]) || 0,
      streetName:
        text
          .match(/Nombre de Vialidad:\s*(.+)/)?.[1]
          ?.trim()
          .split("Número Exterior")[0]
          .trim() || "",
      interiorNumber:
        text
          .match(/Número Interior:\s*([\w\s]+)/)?.[1]
          ?.trim()
          .split("Nombre de la Colonia")[0]
          .trim() || "",
      localityName:
        text
          .match(/Nombre de la Localidad:\s*(.+)/)?.[1]
          ?.trim()
          .split("Nombre del Municipio o Demarcación Territorial")[0]
          .trim() || "",
      state:
        text
          .match(/Nombre de la Entidad Federativa:\s*(.+)/)?.[1]
          ?.trim()
          .split("Entre Calle")[0]
          .trim() || "",
      street:
        text
          .match(/Y Calle:\s*(.+)/)?.[1]
          ?.trim()
          .split("Actividades Económicas:")[0]
          .trim() || "",
      avenueType:
        text
          .match(/Tipo de Vialidad:\s*(.+)/)?.[1]
          ?.trim()
          .split("Nombre de Vialidad:")[0]
          .trim() || "",
      exteriorNumber: text.match(/Número Exterior:\s*(\d+)/)?.[1].trim() || "",
      neighborhoodName:
        text
          .match(/Nombre de la Colonia:\s*(.+)/)?.[1]
          ?.trim()
          .split("Nombre de la Localidad:")[0]
          .trim() || "",
      municipalityName:
        text
          .match(/Nombre del Municipio o Demarcación Territorial:\s*(.+)/)?.[1]
          ?.trim()
          .split("Nombre de la Entidad Federativa:")[0]
          .trim() || "",
      betweenStreets:
        text
          .match(/Entre Calle:\s*(.+)/)?.[1]
          ?.trim()
          .split("Y Calle:")[0]
          .trim() || "",
      economicActivities: [],
      regimes: [],
      obligations: [],
    };

    const values = this.empresaForm.value;
    if (cleanData.rfc.trim() !== values.rfc.trim()) {
      console.log("ESTA ENTRANDO PORQ UE");
      this.snackBar.open(
        "El RFC no coincide entre lo ingresado por usted y el documento",
        "",
        this.config_snack
      );
      return;
    }

    this.empresaForm.patchValue({
      name: cleanData.name,
      rfc: cleanData.rfc,
      capitalRegime: cleanData.capitalRegime,
      commercialName: cleanData.commercialName,
      startDate: cleanData.startDate,
      status: cleanData.status,
      lastUpdateDate: cleanData.lastUpdateDate,
      postalCode: cleanData.postalCode,
      streetName: cleanData.streetName,
      interiorNumber: cleanData.interiorNumber,
      localityName: cleanData.localityName,
      state: cleanData.state,
      street: cleanData.street,
      avenueType: cleanData.avenueType,
      exteriorNumber: cleanData.exteriorNumber,
      neighborhoodName: cleanData.neighborhoodName,
      municipalityName: cleanData.municipalityName,
      betweenStreets: cleanData.betweenStreets,
    });
    this.company = true;
  }

  parseRegimenesYObligaciones(input: string): {
    regimenes: Regimen[];
    obligaciones: Obligacion[];
  } {
    const regimenes: Regimen[] = [];
    const obligaciones: Obligacion[] = [];

    // Extraer Regímenes
    const regimenRegex =
      /([\w\s]+)\s+(\d{2}\/\d{2}\/\d{4})(?:\s+(\d{2}\/\d{2}\/\d{4}))?/g;
    const regimenMatches = [...input.matchAll(regimenRegex)];

    for (const match of regimenMatches) {
      regimenes.push({
        regimen: match[1].trim(),
        fechaInicio: match[2],
        fechaFin: match[3] || undefined,
      });
    }

    // Extraer Obligaciones
    const obligacionRegex =
      /(.*?)\s{2,}(.+?)\s+(\d{2}\/\d{2}\/\d{4})(?:\s+(\d{2}\/\d{2}\/\d{4}))?/g;
    const obligacionMatches = [...input.matchAll(obligacionRegex)];

    for (const match of obligacionMatches) {
      obligaciones.push({
        descripcion: match[1].trim(),
        vencimiento: match[2].trim(),
        fechaInicio: match[3],
        fechaFin: match[4] || undefined,
      });
    }

    return { regimenes, obligaciones };
  }

  /**
   * Uploads company data using form data.
   *
   * This function iterates over the controls of the `empresaForm` to construct
   * a `FormData` object. It checks each control's value and appends it to the
   * `FormData` object. If the value is a file (either `File` or `Blob`), it is
   * appended directly with a specific MIME type. Other values are converted to
   * strings before appending.
   *
   * After constructing the `FormData`, it sends a POST request to upload the
   * company data using the `apiService`. It handles the response by displaying
   * a success message or an error message using a snackbar. If the error indicates
   * that the company is already registered, it fetches the existing company information.
   */
  uploadCompany() {
    const formData = new FormData();

    Object.keys(this.empresaForm.controls).forEach((key) => {
      const value = this.empresaForm.get(key)?.value;

      // Check if the value is not null or undefined
      if (value !== null && value !== undefined) {
        // If the value is a file (fileKey or fileCer), append it directly
        if (value instanceof File || value instanceof Blob) {
          // Append the file with the appropriate MIME type
          if (key === "fileKey")
            formData.append(
              key,
              new Blob([value], { type: "application/x-x509-ca-cert" }),
              "llave.key"
            );
          else
            formData.append(
              key,
              new Blob([value], { type: "application/x-x509-ca-cert" }),
              "certificado.cer"
            );
        } else {
          formData.append(key, value.toString()); // Convert other values to string
        }
      }
    });

    this.apiService.postCompany(formData).subscribe({
      next: (res) => {
        console.log("RESULT", res);
        this.snackBar.open(
          "Datos de la compañía subidos con éxito",
          "",
          this.config_snack
        );
        this.fetchCompanyInformation();
      },
      error: (err) => {
        console.log("ERROR", err);
        if (err.error.detail === "Company already registered") {
          this.snackBar.open(
            "La compañía que intenta registrar ya fue registrada",
            "",
            this.config_snack
          );
        } else {
          this.snackBar.open(
            "Ocurrió un error al subir los datos de su compañía",
            "",
            this.config_snack
          );
        }
      },
    });
  }

  /**
   * Handles the drag over event for different file types.
   * Prevents the default behavior and sets the dragging state
   * based on the type of file being dragged.
   *
   * @param event - The drag event triggered when a file is dragged over the target area.
   * @param type - The type of file being dragged. Expected values are 'pdf', 'cer', or 'key'.
   */
  onDragOver(event: DragEvent, type: string) {
    event.preventDefault();
    switch (type) {
      case "pdf":
        this.isDraggingPDF = true;
        break;
      case "cer":
        this.isDraggingCER = true;
        break;
      case "key":
        this.isDraggingKEY = true;
    }
  }

  /**
   * Handles the drag leave event for different file types.
   *
   * @param event - The drag event triggered when a draggable element leaves a valid drop target.
   * @param type - The type of file being dragged. Can be 'pdf', 'cer', or 'key'.
   */
  onDragLeave(event: DragEvent, type: string) {
    switch (type) {
      case "pdf":
        this.isDraggingPDF = false;
        break;
      case "cer":
        this.isDraggingCER = false;
        break;
      case "key":
        this.isDraggingKEY = false;
    }
  }

  /**
   * Handles the drop event for a PDF file. It reads the PDF file, extracts text content from each page,
   * and processes the extracted data.
   *
   * @param event - The drag event containing the dropped file.
   */
  onDropPDF(event: DragEvent) {
    event.preventDefault();
    this.isDraggingPDF = false;

    const file = event.dataTransfer?.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();

      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorker;
        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          text += pageText + "\n";
        }

        const splittedText = text.split(
          "Datos de Identificación del Contribuyente:"
        );

        this.extractData(splittedText[1]);
      };

      reader.readAsArrayBuffer(file);
    } else {
      console.error("El archivo no es un PDF");
    }
  }

  /**
   * Handles the drop event for file uploads, specifically for .cer and .key files.
   * Prevents the default browser behavior and processes the file based on its type.
   *
   * @param event - The drag event containing the file data.
   * @param type - The type of file expected ('cer' or 'key').
   */
  onDrop(event: DragEvent, type: string) {
    event.preventDefault();
    this.isDraggingPDF = false;

    const file = event.dataTransfer?.files[0];
    if (file && (file.name.endsWith(".cer") || file.name.endsWith(".key"))) {
      switch (type) {
        case "cer":
          this.fileNameCER = file.name;
          console.log(this.fileNameCER);
          this.empresaForm.patchValue({
            ["certificadoFiel"]: file,
          });
          this.empresaForm.get("certificadoFiel")?.updateValueAndValidity();
        case "key":
          this.fileNameKEY = file.name;
          this.empresaForm.patchValue({
            ["llavePrivadaFiel"]: file,
          });
          this.empresaForm.get("llavePrivadaFiel")?.updateValueAndValidity();
      }
    } else {
      this.snackBar.open(
        "El archivo que intentó subir no es un " + type + ".",
        "",
        this.config_snack
      );
    }
  }

  /**
   * Fetches the company information using the API service.
   * Subscribes to the observable returned by the fetchMyCompany method.
   * On success, logs the response and assigns the first element of the response to companyInformation.
   * Handles errors silently (currently no error handling implemented).
   */
  fetchCompanyInformation() {
    this.apiService.fetchMyCompany().subscribe({
      next: (res) => {
        console.log(res);
        this.companyInformation = res[0];
      },
      error: (err) => {
        // Error handling logic can be implemented here
      },
    });
  }

  /**
   * Deletes the company information by calling the API service.
   * Upon successful deletion, it sets the company information to null.
   */
  deleteCompany() {
    this.apiService.deleteCompany().subscribe({
      next: (res) => {
        this.companyInformation = null;
      },
    });
  }

  openAddEsignModal() {
    const dialogRef = this.dialog.open(UpdateEsignComponent, {
      width: '40%',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchCompanyInformation()
    });
  }

  showReminder():boolean {
    if(this.companyInformation !== null) {
      const expirationDate = new Date(this.companyInformation.expireAt)
      const today = new Date()
      const diffInMs = expirationDate.getTime() - today.getTime();
      const diffInDays = (diffInMs / (1000 * 60 * 60 * 24));
      console.log('diffINDAYS', diffInDays)
      return diffInDays < 30;
    }
    return false
  }
}
