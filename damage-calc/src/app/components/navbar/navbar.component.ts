import { CurrencyPipe, Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Languages } from 'src/app/models/languages';
import { LanguageService } from 'src/app/services/language.service';
import { ScreenService, Theme } from 'src/app/services/screen.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit  {

  @ViewChild('darkModeSwitch') element: ElementRef | undefined;

  languages = Object.values(Languages);
  countries = Object.entries(Languages).map(([key, value]) => value.countryCode)
  toolTitles: string[] = [];
  languageSelection = new UntypedFormControl(Languages.us);
  toolSelection: UntypedFormControl;

  Theme = Theme;

  darkModeIconPath = 'M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z';
  lightModeIconPath = 'M7 12a5 5 0 1 1 5 5 5 5 0 0 1-5-5zm5-7a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1zm-1 15v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-2 0zm10-9h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zM3 13h1a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2zm14.657-5.657a1 1 0 0 0 .707-.293l.707-.707a1 1 0 1 0-1.414-1.414l-.707.707a1 1 0 0 0 .707 1.707zM5.636 16.95l-.707.707a1 1 0 1 0 1.414 1.414l.707-.707a1 1 0 0 0-1.414-1.414zm11.314 0a1 1 0 0 0 0 1.414l.707.707a1 1 0 0 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 0zM5.636 7.05A1 1 0 0 0 7.05 5.636l-.707-.707a1 1 0 0 0-1.414 1.414z';

  constructor(
    public languageService: LanguageService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public screenService: ScreenService
  ) {
    this.toolSelection = new UntypedFormControl(this.languageService.toolTitles[0]);
  }

  ngOnInit() {
    this.toolTitles = this.languageService.toolTitles;
    this.languageService.language.subscribe(language => {
      this.languageSelection.setValue(language);
    })

    this.screenService.extraLargeScreen.subscribe(value => {
      if (value) {
        this.setSlideToggleIcons();
      }
    })


    const activePath = window.location.href.split('/')
    let activeTool: string = activePath.pop() || activePath.pop() || 'damage-calculator';

    if (!Object.keys(this.languageService.toolPathToTitleMap).includes(activeTool)) {
      activeTool = 'damage-calculator';
    }

    this.toolSelection.setValue(this.languageService.toolPathToTitleMap[activeTool])
  }

  async setSlideToggleIcons() {
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log(await document.querySelector('.mdc-switch__icon--on path'))
    if (this.element){
      await document.querySelector('.mdc-switch__icon--on path')?.setAttribute('d', this.darkModeIconPath);
      document.querySelector('.mdc-switch__icon--off path')?.setAttribute('d', this.lightModeIconPath);
    }

    console.log(document.querySelector('.mdc-switch__icon--on path'))

  }

  openKofi() {
    window.open('https://ko-fi.com/tyopoyt', '_blank');
  }

  toggleDarkMode() {
    this.screenService.toggleDarkMode();
  }

  // The navigation here and in selectTool is a bit clunky but ActivatedRoute is only populated for the component that matched the route
  // There's probably a better way to do this but it works and is performant enough so it's fine
  selectLanguage(event: MatSelectChange) {
    const newUrl = this.router.createUrlTree([event.value.countryCode]).toString()
    this.languageService.setLanguage(event.value);
    this._location.go(`${newUrl}/${this.languageService.toolTitleToPathMap[this.toolSelection.value]}`)
  }

  selectTool(tool: string) {
    if (this.toolSelection.value !== tool) {
      this.toolSelection.setValue(tool);
    }

    const newUrlParts = []
    let currentRoute = this._location.path().split('/')[1] || '';
    if (!this.countries.includes(currentRoute)) {
      currentRoute = '';
    }
    if (currentRoute) {
      newUrlParts.push(currentRoute);
    }
    newUrlParts.push(this.languageService.toolTitleToPathMap[tool])

    this.router.navigate(newUrlParts)
  }
}
