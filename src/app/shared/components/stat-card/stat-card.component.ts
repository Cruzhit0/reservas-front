import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center p-6" [class]="getBackgroundClass()">
      <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
           [class]="getIconBackgroundClass()">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            [attr.d]="getIconPath()"
          />
        </svg>
      </div>
      <h3 class="font-semibold text-gray-700 mb-1">{{ title }}</h3>
      <p class="text-lg font-medium" [class]="getTextClass()">{{ value | titlecase }}</p>
    </div>
  `
})
export class StatCardComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() value!: string;
  @Input() colorClass: 'blue' | 'green' | 'red' = 'blue';

  getBackgroundClass(): string {
    const classes = {
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100',
      green: 'bg-gradient-to-br from-green-50 to-green-100',
      red: 'bg-gradient-to-br from-red-50 to-red-100'
    };
    return `${classes[this.colorClass]} rounded-xl`;
  }

  getIconBackgroundClass(): string {
    const classes = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500'
    };
    return classes[this.colorClass];
  }

  getTextClass(): string {
    const classes = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600'
    };
    return classes[this.colorClass];
  }

  getIconPath(): string {
    const paths = {
      building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1',
      users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      check: 'M5 13l4 4L19 7',
      x: 'M6 18L18 6M6 6l12 12'
    };
    return paths[this.icon as keyof typeof paths] || '';
  }
}