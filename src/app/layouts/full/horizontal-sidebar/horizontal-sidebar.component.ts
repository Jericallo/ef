import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-horizontal-sidebar",
  templateUrl: "./horizontal-sidebar.component.html",
  styleUrls: ["./horizontal-sidebar.styles.css"],
})
export class HorizontalAppSidebarComponent implements OnInit {
  isHomeActive: boolean = false;
  isInicioActive: boolean = false;
  isCumplimientoActive: boolean = false;
  isControlActive: boolean = false;
  showSubMenu: boolean = false;

  isIntroActive: boolean = false;
  isMyCompanyActive: boolean = false;
  isNoticiasActive: boolean = false;
  isLeyesActive: boolean = false;
  isTemarioActive: boolean = false;
  isBusquedaActive: boolean = false;

  isResumenCumplimientoActive: boolean = false;
  isRegisterActive:boolean = false
  isCalendarioActive: boolean = false;

  isCapacitacionActive: boolean = false;
  isAyudaActive: boolean = false;
  isSupervisionActive: boolean = false;

  timer: any;
  timerInicio: any;

  showSubMenuInicio: boolean = false;
  showSubMenuCumplimiento: boolean = false;
  showSubMenuControl: boolean = false;
  showSubMenuPrecaucion: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const currentUrl = this.router.url;
    this.isHomeActive = currentUrl === "/home";
    this.isInicioActive = [
      "/home/intro",
      "/home/news",
      "/home/my-company",
      "/home/laws",
      "/home/topics",
      "/home/busqueda"
    ].includes(currentUrl);
    this.isCumplimientoActive = [
      "compliance/index", 
      "compliance/register",
      "compliance/register-client"
    ].includes(
      currentUrl
    );
    this.isControlActive = [
      "control/capacitaciones", 
      "control/ayuda",
      "control/questionnaire-history"
    ].includes(currentUrl);

    this.isIntroActive = currentUrl === "/home/intro";
    this.isMyCompanyActive = currentUrl === "/home/my-company";
    this.isNoticiasActive = currentUrl === "/home/news";
    this.isLeyesActive = currentUrl === "/home/laws";
    this.isTemarioActive = currentUrl === "/home/topics";
    this.isBusquedaActive = currentUrl === "/home/busqueda";

    this.isResumenCumplimientoActive = currentUrl === "/compliance/index";
    this.isRegisterActive = currentUrl === "/compliance/register";
    this.isCalendarioActive = currentUrl === "/compliance/register-client";

    this.isCapacitacionActive = currentUrl === "/capacitaciones";
    this.isAyudaActive = currentUrl === "/ayuda";
    this.isAyudaActive = currentUrl === "/supervision";
  }

  onMouseEnter() {
    this.showSubMenu = true;

    this.timer = setTimeout(() => {
      this.showSubMenu = false;
    }, 180000);
  }

  onMouseEnterInicio() {
    this.showSubMenuInicio = true;

    console.log(this.showSubMenuInicio);

    this.timerInicio = setTimeout(() => {
      this.showSubMenuInicio = false;
    }, 100000);
  }
}
