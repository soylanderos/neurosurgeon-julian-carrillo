import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Shield, Award, User, CalendarCheck, Brain, HeartPulse } from 'lucide-angular';

@Component({
  selector: 'app-about-preview',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './about-preview.html',
  styleUrl: './about-preview.css',
})
export class AboutPreview {
  iShield = Shield;
  iAward = Award;
  iUser = User;
  iCalendar = CalendarCheck;
  iBadgeCheck = CalendarCheck;
  iBrain = Brain
  iPulse = HeartPulse
}
