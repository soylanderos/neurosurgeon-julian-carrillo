import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  ChevronDown,
} from 'lucide-angular';
import { ServicePreviewCarouselComponent } from '../service-preview-carousel/service-preview-carousel';


@Component({
  selector: 'app-service-preview',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, ServicePreviewCarouselComponent],
  templateUrl: './service-preview.html',
  styleUrl: './service-preview.css',
})
export class ServicePreview {
  iChevronRight = ChevronDown;
}
