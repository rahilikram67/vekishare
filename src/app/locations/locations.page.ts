import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router"
import { AngularFirestore } from "@angular/fire/firestore"
import { ModalController } from "@ionic/angular"
import { ModalPage } from "./modal/modal.page"
declare var google: any
@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage {

  id = ""
  data
  array = ["name", "address", "phone"]
  person
  hide_map = true
  slot = "start"
  show_content = false
  show_detail = false
  constructor(
    private active: ActivatedRoute,
    private db: AngularFirestore,
    private modal: ModalController
  ) {

    this.active.params.subscribe(data => {
      this.id = data['id']
    })

  }


  async ngAfterViewInit() {
    this.db.collection(this.id).ref.onSnapshot(async data => {
      this.data = await data.docs
     
      if (!this.data[0]) {
        alert("error")
      }
      else this.makeMap("origin")
    })
    var obj = this
    function resize() {
      var w = window.innerWidth
      if (w <= 700) {
        obj.slot = "start"
      }
      else obj.slot = "end"
    }
    resize()
    window.onresize = resize
  }

  async presentModal() {
    const modal = await this.modal.create({
      component: ModalPage,
      swipeToClose: true,
      showBackdrop:true,
      animated:true,
      backdropDismiss:true,
      
      
    });
    return await modal.present();
  }

  makeMap(val) {
    var op = {
      center: { lat: this.data[0].data()[val].lat, lng: this.data[0].data()[val].lng },
      zoom: 8
    }
    this.hide_map = true
    var map = new google.maps.Map(document.getElementById("map"), op)
    var display = new google.maps.DirectionsRenderer()
    var service = new google.maps.DirectionsService()
    var marker = []
    for (var i = 0; i < this.data.length; i++) {
      var obj = this
      var doc = this.data[i].data()
      marker[i] = new google.maps.Marker({
        position: { lat: doc["" + val].lat, lng: doc["" + val].lng },
        map: map,
        title: "" + i,
        label: { text: "" + doc.name.split(" ")[0], color: "purple" },
        inner: "blop",
        icon: "assets/icon/beachflag.png"
      })
    }
    this.hide_map = false
    marker.forEach((el) => {

      el.addListener("dblclick", (res) => {
        this.show_detail = true

        for (var p of this.data) {
          var doc = p.data()
          var latZ = Math.abs(doc[val].lat - res.latLng.lat())
          var lngZ = Math.abs(doc[val].lng - res.latLng.lng())
          if (latZ == 0 && lngZ == 0) {
            this.person = doc
            display.setMap(map)
            service.route({
              origin: { lat: doc.origin.lat, lng: doc.origin.lng },
              destination: { lat: doc.dest.lat, lng: doc.dest.lng },
              travelMode: "DRIVING"
            }, (res, state) => {
              if (state = "OK") {
                display.setDirections(res)
                this.person = doc
              }
            })
          }
        }
      })

    })


    /**/


  }

  segmentChanged(val) {
    this.makeMap(val)
    this.show_detail = false
  }

  animate() {
    var id = document.getElementById("content")

    var icon = document.getElementById("icon")
    var height = id.style.height
    if (height == "0px" || !height) {
      
      var icon_deg = 0
      
      id.style.height="auto"
      var inter = setInterval(() => {
        if (icon_deg != 180)
          icon.style.transform = "rotate(" + (icon_deg = icon_deg + 4) + "deg)"
      }, 1)
    }
    else if (id.style.height == "auto") {

      
      icon_deg = 180
      id.style.height="0px"
      
      var inter = setInterval(() => {
        if (icon_deg != 0)
          icon.style.transform = "rotate(" + (icon_deg = icon_deg - 4) + "deg)"
      }, 1)
    }
  }

}
