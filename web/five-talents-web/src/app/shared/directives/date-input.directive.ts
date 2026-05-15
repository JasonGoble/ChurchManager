import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: 'input[matDatepicker]',
  standalone: true,
})
export class DateInputDirective {
  private el = inject(ElementRef<HTMLInputElement>);
  private reformatting = false;

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const passThrough = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End',
    ];
    if (passThrough.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  }

  @HostListener('paste', ['$event'])
  onPaste(e: ClipboardEvent): void {
    e.preventDefault();
    const digits = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '');
    this.writeFormatted(digits);
    this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
  }

  @HostListener('input')
  onInput(): void {
    if (this.reformatting) return;
    this.reformatting = true;
    const digits = this.el.nativeElement.value.replace(/\D/g, '').substring(0, 8);
    this.writeFormatted(digits);
    this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
    this.reformatting = false;
  }

  private writeFormatted(digits: string): void {
    let result = digits.substring(0, 2);
    if (digits.length > 2) result += '/' + digits.substring(2, 4);
    if (digits.length > 4) result += '/' + digits.substring(4, 8);
    this.el.nativeElement.value = result;
  }
}
