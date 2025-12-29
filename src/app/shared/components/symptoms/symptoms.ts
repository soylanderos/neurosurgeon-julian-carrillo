import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
type Symptom = { text: string; icon: 'zap' | 'activity' | 'alert' | 'scan' };

@Component({
  selector: 'app-symptoms',
  imports: [RouterLink],
  templateUrl: './symptoms.html',
  styleUrl: './symptoms.css',
})


export class Symptoms {

 readonly symptoms: string[] = [
    'Dolor de espalda que no mejora con reposo',
    'Hormigueo o entumecimiento en brazos o piernas',
    'Debilidad en extremidades',
    'Dolor que se irradia hacia las piernas (ciática)',
    'Dolor de cuello persistente',
    'Dolores de cabeza intensos o frecuentes',
  ];

  trackByIndex = (i: number) => i;

}
