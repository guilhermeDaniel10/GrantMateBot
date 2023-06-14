import { Component, Input } from '@angular/core';
import { ServiceOutputValueConfigs } from '../../model/service-call-automate-model/service-output-value-configs.model';

@Component({
  selector: 'app-service-output-config',
  templateUrl: './service-output-config.component.html',
  styleUrls: ['./service-output-config.component.scss'],
})
export class ServiceOutputConfigComponent {
  @Input() serviceOutputValueConfig: ServiceOutputValueConfigs;

  constructor() {}
}
