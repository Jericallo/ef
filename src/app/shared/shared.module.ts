import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { HorizontalMenuItems } from './menu-items/horizontal-menu-items';
import {
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective
} from './accordion';
import { TrafficLightComponent } from './components/traffic-light/traffic-light.component';
import { ChatBubbleComponent } from './components/chat-bubble/chat-bubble.component';
import { CommonModule } from '@angular/common';
import { AppModule } from '../app.module';
import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    TrafficLightComponent,
    ChatBubbleComponent,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    TrafficLightComponent,
    ChatBubbleComponent,
    LoaderComponent
  ],
  providers: [MenuItems, HorizontalMenuItems],
})
export class SharedModule {}
