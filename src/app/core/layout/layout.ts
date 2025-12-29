import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header";
import { RouterOutlet } from '@angular/router';
import { Footer } from "../footer/footer";
import { FloatingWhatsapp } from "../floating-whatsapp/floating-whatsapp";

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, RouterOutlet, Footer, FloatingWhatsapp],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
