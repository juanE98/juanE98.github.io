import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  isAboutInView = false;
  currentText = '';
  textIndex = 0;
  charIndex = 0;
  isDeleting = false;
  typeSpeed = 100;
  deleteSpeed = 75;
  pauseDuration = 1000;
  
  texts = [
    'I write code',
    'I build software',
    'I fix software',
    'I integrate backend communications',
    'I design system architecture',
    'I solve problems'
  ];
  
  private typingInterval?: number;

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll);
    this.startTyping();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  scrollToTechnologies() {
    const technologiesSection = document.getElementById('technologies');
    const arrowButton = document.querySelector('.arrow-button');
    if (technologiesSection) {
      technologiesSection.scrollIntoView({ behavior: 'smooth' });
      if (arrowButton) {
        arrowButton.classList.add('hidden');
      }
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const arrowButton = document.querySelector('.arrow-button');
    if (arrowButton) {
      if (window.scrollY > 0) {
        arrowButton.classList.add('hidden');
      } else {
        arrowButton.classList.remove('hidden');
      }
    }
  }
  
  private startTyping() {
    this.typingInterval = window.setInterval(() => {
      const currentFullText = this.texts[this.textIndex];
      
      if (!this.isDeleting) {
        this.currentText = currentFullText.substring(0, this.charIndex + 1);
        this.charIndex++;
        
        if (this.charIndex === currentFullText.length) {
          setTimeout(() => {
            this.isDeleting = true;
          }, this.pauseDuration);
        }
      } else {
        this.currentText = currentFullText.substring(0, this.charIndex - 1);
        this.charIndex--;
        
        if (this.charIndex === 0) {
          this.isDeleting = false;
          this.textIndex = (this.textIndex + 1) % this.texts.length;
        }
      }
    }, this.isDeleting ? this.deleteSpeed : this.typeSpeed);
  }
}
