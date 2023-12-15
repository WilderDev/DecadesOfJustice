import { Component, Input } from '@angular/core';
import { ActivatedRoute, Params, Router, Route } from '@angular/router';
import { TimecapsuleService } from '../../timecapsule.service';
import { Timecapsule } from '../../timecapsule.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-timecapsule',
  templateUrl: './view-timecapsule.component.html',
  styleUrls: ['./view-timecapsule.component.scss']
})
export class ViewTimecapsuleComponent {
  timecapsulesChangedSub: Subscription;
  timecapsulesUploadsSub: Subscription;

  uploadsArray
  timecapsuleUploads
  timecapsuleArray
  timecapsuleUuid
  timecapsule

  constructor(public timecapsuleService: TimecapsuleService, private route: ActivatedRoute,) {}

  ngOnInit() {
// * Get Timecapsule
    this.fetchTimecapsules();
    this.timecapsulesChangedSub =
      this.timecapsuleService.timecapsulesChanged.subscribe(
        (updatedTimecapsulesList) => {
          this.timecapsuleService.loadedTimecapsules = updatedTimecapsulesList;
        }
      );

      this.timecapsuleArray = this.timecapsuleService.loadedTimecapsules;

    this.route.params.subscribe((params) => {
      const curTimecapsuleUuid = params['uuid'];
      this.timecapsule = this.getByUuid(curTimecapsuleUuid);
    })



  // * Get Uploads
  this.fetchTimecapsuleUploads();
  this.timecapsulesUploadsSub =
  this.timecapsuleService.timecapsulesUploadsChanged.subscribe(
    (uploadsList) => {
      this.timecapsuleService.timecapsuleUploads = uploadsList;
    }
  );

  this.uploadsArray = this.timecapsuleService.timecapsuleUploads;
  console.log(this.uploadsArray);

  this.route.params.subscribe((params) => {
    const curTimecapsuleUploadUuid = params['uuid'];
    this.timecapsuleUploads = this.getByParentUuid(curTimecapsuleUploadUuid);
  })

  console.log(this.timecapsuleUploads);

}

ngOnDestroy() {
  this.timecapsulesChangedSub.unsubscribe();
  this.timecapsulesUploadsSub.unsubscribe();
}


// * METHODS
fetchTimecapsules = () => {
  this.timecapsuleService.onFetchAllTimecapsules().subscribe(
    (timecapsules) => {
      this.timecapsuleService.timecapsulesChanged.next(timecapsules.slice());
    },
  );
};

fetchTimecapsuleUploads = () => {
  this.timecapsuleService.getTimecapsuleUploads().subscribe(
    (uploads) => {
      this.timecapsuleService.timecapsulesUploadsChanged.next(uploads.slice());
    },
  );
};



getByUuid(uuid) {
  const foundTimecapsule = this.timecapsuleArray.find((timecapsule) => timecapsule.uuid === uuid);
  return foundTimecapsule;
}

getByParentUuid(parentUUID) {
  const foundUpload = this.uploadsArray.find((upload) => upload.parentUUID === parentUUID)
  return foundUpload;
}


}
