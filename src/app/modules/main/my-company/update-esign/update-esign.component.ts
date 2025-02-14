import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import mime from "mime";
import { ApiService } from "src/app/shared/services/api.service";

@Component({
  selector: "app-update-esign",
  templateUrl: "./update-esign.component.html",
  styleUrls: ["./update-esign.component.scss"],
})
export class UpdateEsignComponent implements OnInit {
  empresaForm: FormGroup;

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

  constructor(
    private fb: FormBuilder, 
    public snackBar: MatSnackBar, 
    private apiService: ApiService,
    public dialogRef: MatDialogRef<UpdateEsignComponent>,
  ) {}

  ngOnInit(): void {
    this.empresaForm = this.fb.group({
      password: ["", [Validators.required, Validators.maxLength(100)]],
      fileKey: [null],
      fileCer: [null],
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

  uploadEsign() {
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

    this.apiService.postEsign(formData).subscribe({
      next: (res) => {
        console.log("RESULT", res);
        this.snackBar.open(
          "e.firma subida con éxito",
          "",
          this.config_snack
        );
        this.dialogRef.close()
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
            "Ocurrió un error al subir los datos de su e.firma",
            "",
            this.config_snack
          );
        }
      },
    });
  }
}
