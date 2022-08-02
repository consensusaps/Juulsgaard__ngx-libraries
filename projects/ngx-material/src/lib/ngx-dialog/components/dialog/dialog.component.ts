import {Component, ContentChild, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DialogFooterDirective} from "../../directives/dialog-footer.directive";
import {OverlayService, OverlayToken} from "@consensus-labs/ngx-tools";


@Component({
  selector: 'ngx-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {

  @ContentChild(DialogFooterDirective) footerItem?: DialogFooterDirective;

  @HostBinding('style.z-index') get zIndexStyle() {return this.zIndex ?? this.overlayToken?.zIndex ?? 600};

  @Input() header?: string;
  @Input() withScroll = false;
  @Input() zIndex?: number;

  @Output() close = new EventEmitter<void>();

  overlayToken?: OverlayToken;

  constructor(private element: ElementRef<HTMLElement>, private overlayService: OverlayService) { }

  ngOnInit() {
    this.overlayToken = this.overlayService.pushOverlay();
    this.overlayToken.handleEscape(() => this.close.emit());
  }

  ngOnDestroy() {
    this.overlayToken?.dispose();
  }
}
