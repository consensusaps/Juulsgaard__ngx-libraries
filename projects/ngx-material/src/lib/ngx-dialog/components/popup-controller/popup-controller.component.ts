import {Component} from '@angular/core';
import {PopupService} from "../../services/popup.service";

@Component({
  selector: 'ngx-popup-controller',
  templateUrl: './popup-controller.component.html',
  styleUrls: ['./popup-controller.component.scss']
})
export class PopupControllerComponent {

  constructor(public service: PopupService) {

  }

}
