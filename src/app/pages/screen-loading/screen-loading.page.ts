import { Component, Renderer2, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-screen-loading',
  templateUrl: './screen-loading.page.html',
  styleUrls: ['./screen-loading.page.scss']
})
export class ScreenLoadingPage implements OnInit {
  constructor(private router: Router, private renderer: Renderer2) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const logo = document.querySelector('.circle-background img');
        if (logo) {
          this.renderer.addClass(logo, 'stop-rotation');

          setTimeout(() => {
            console.log("Animação finalizada, continuando a navegação.");
          }, 1000);
        }
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 6000);
  }
}
