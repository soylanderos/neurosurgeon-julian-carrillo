// floating-whatsapp.component.ts
import { Component, Input, computed } from '@angular/core';

@Component({
  selector: 'app-floating-whatsapp',
  standalone: true,
  templateUrl: './floating-whatsapp.html',
  styleUrls: ['./floating-whatsapp.css'],
})
export class FloatingWhatsapp {
  /** Ej: "52XXXXXXXXXX" (sin +, sin espacios). */
  @Input() phone = '52XXXXXXXXXX';

  /** Mensaje opcional (se URL-encodea). */
  @Input() text = '';

  waLink = computed(() => {
    const base = `https://wa.me/${this.phone}`;
    const t = this.text?.trim();
    return t ? `${base}?text=${encodeURIComponent(t)}` : base;
  });
}
