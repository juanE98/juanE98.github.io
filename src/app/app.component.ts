import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "./header/header.component";
import {BannerComponent} from "./banner/banner.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BannerComponent, HeaderComponent, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'website-portfolio';
}
