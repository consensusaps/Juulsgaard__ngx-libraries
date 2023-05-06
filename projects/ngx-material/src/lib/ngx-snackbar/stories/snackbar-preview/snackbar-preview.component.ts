import {Component, inject} from '@angular/core';
import {SnackbarService} from "../../services/snackbar.service";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'ngx-snackbar-preview',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './snackbar-preview.component.html',
  styleUrls: ['./snackbar-preview.component.css']
})
export class SnackbarPreviewComponent {
  snacks = inject(SnackbarService);

  error() {
    this.snacks.error('This is a really really long Error message to see how the snackbar handles overflow and long text. Lorem Ipsum', 'Error!', {additional: 'more'});
  }

  success() {
    this.snacks.success('This is a really really really long success message for overflow testing and the like. Lorem Ipsum etc. etc.', 'Hurray!');
  }
}
