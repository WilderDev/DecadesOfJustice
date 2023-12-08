import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TimecapsuleService } from '../../timecapsule.service';

@Component({
  selector: 'app-view-timecapsule',
  templateUrl: './view-timecapsule.component.html',
  styleUrls: ['./view-timecapsule.component.scss']
})
export class ViewTimecapsuleComponent {

  constructor(public timecapsuleService: TimecapsuleService, private route: ActivatedRoute,) {}

}
