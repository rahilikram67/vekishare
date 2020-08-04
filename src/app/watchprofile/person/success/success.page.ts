import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {

  info
  constructor(private locations:Location,private active:ActivatedRoute) {
    this.active.params.subscribe(data=>{
      this.info=data["info"]
    })
   }

  ngOnInit() {
  }
  //just for info how to go back in angular 
  /*back(){
    this.locations.back()
  }*/
}
