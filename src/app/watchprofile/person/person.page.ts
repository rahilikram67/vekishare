import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"
import { AngularFirestore } from "@angular/fire/firestore"
import { LoadingAlertService } from "../../loading-alert.service"
import { AlertController } from "@ionic/angular"
declare var google: any

@Component({
  selector: 'app-person',
  templateUrl: './person.page.html',
  styleUrls: ['./person.page.scss'],
})
export class PersonPage implements OnInit {

  data = {}
  url = undefined
  table = ["name", "address", "phone", "cnic"]
  distance
  path
  start
  end
  time = undefined
  edit = undefined
  todo = { choice: "origin" }
  show_message = false
  click_dest_map = "If location is incorrect, find location on map (Start or End),double click on that"
  //ion segment toggler
  change
  collection
  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private router: Router,
    private load_alert: LoadingAlertService,
    private alert:AlertController
  ) {
    this.route.params.subscribe(data => {
      this.data = JSON.parse(data["data"])
      this.edit = data["edit"]
      
      
      if (!this.edit) {
        delete this.data["cnic"] 
      }


      delete this.data["number"]
      
      if (data["url"] != "none") {
        this.url = data["url"]
      }
      this.collection = data["collect"]
    })

  }

  ngOnInit() {
    this.mapper()
  }

  mapper() {
    var map = new google.maps.Map(document.getElementById("map"), { zoom: 10, zoomControl: true })
    var display = new google.maps.DirectionsRenderer()
    var service = new google.maps.DirectionsService()

    display.setMap(map)
    var obj = this
    function routing() {

    }
    service.route({
      origin: new google.maps.LatLng(this.data["origin"].lat, this.data["origin"].lng),
      destination: new google.maps.LatLng(this.data["dest"].lat, this.data["dest"].lng),
      travelMode: "DRIVING"
    }, (res, state) => {
      if (state = "OK") {
        display.setDirections(res)
        var result = res.routes[0]
        this.path = result.summary
        var legs = result.legs[0]
        this.distance = legs.distance.text
        this.start = legs.start_address
        this.end = legs.end_address
        this.time = legs.duration.text

      }
      else {

        var obj = this
        setTimeout(() => {
          if (obj.time == undefined) {
            alert("Network Error")
            window.location.reload()
          }
        }, 2000)
      }
    })
    map.addListener("dblclick", (result) => {
      if (this.todo.choice == "origin") {
        this.data['origin'] = { lat: result.latLng.lat(), lng: result.latLng.lng() }
      }
      else {
        this.data['dest'] = { lat: result.latLng.lat(), lng: result.latLng.lng() }
      }
      this.mapper()
    })
  }


 async segmentChanged(value) {
    this.change = (value == "view") ? false : true
    if(value=="delete"){
      var present=await this.alert.create({
         header:"Confirmation",
         message:"Are you really want to Delete?",
         backdropDismiss:false,
         buttons:["Cancel",{
           text:"OK",
           cssClass:"bg-danger text-light",
           handler:async()=>{
             await this.db.collection(this.collection).doc(this.data["phone"]).delete()
             this.router.navigate(["watchprofile/person/success",{info:"Deleted"}])
           }
         }]  
       })
      await present.present()  
    }
  }

  Message() {
    this.show_message = (this.show_message) ? false : true
  }

  validate_info(array): boolean {
    if (array.cnic.length < 15) {
      this.load_alert.presentAlert("CNIC is incomplete")
      return false
    }
    if (!array.cnic || !(array.cnic.match(/[!@#$%&*()a-zA-Z_+]/g) == null)) {
      this.load_alert.presentAlert("CNIC Must be numbers")
      return;
    }

    if (array.name.match(/[0-9!@#$%*()_-]/g) || !array.name) {
      this.load_alert.presentAlert("Name Incorrect")
      return false
    }
    if (!array.address) {
      this.load_alert.presentAlert("Complete address Credential")
      return false
    }
    return true
  }

  insert() {
    this.data["name"] = (<HTMLInputElement>
      document.getElementById("name")).value
    this.data["address"] = (<HTMLInputElement>
      document.getElementById("address")).value
    this.data["cnic"] = (<HTMLInputElement>
      document.getElementById("cnic")).value
  }

  async update() {
    this.load_alert.presentLoading(1500,"Please Wait")
    await this.insert()
    if (!this.validate_info(this.data)) { return }
    console.table(this.data)
    await this.db.collection(this.collection).doc(this.data["phone"]).set(this.data)
    setTimeout(() => {
      this.router.navigate(['watchprofile/person/success',{info:"Updated"}])
    }, 1000)
     
  }

}

