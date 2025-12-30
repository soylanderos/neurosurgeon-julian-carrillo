import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, PhoneCallIcon } from 'lucide-angular';


export type TrustItem = {
  key: string;
  label: string;
  value: string;
  icon: 'award' | 'graduation' | 'shield' | 'filecheck';
};

@Component({
  selector: 'app-trust-strip',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './trust-strip.html',
  // si quieres css separado:
  // styleUrls: ['./trust-strip.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustStripComponent {
  @Input({ required: true }) trustItems: TrustItem[] = [];

  iWhatsapp = PhoneCallIcon
}
