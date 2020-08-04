import { Component } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore'
import { Router, ActivatedRoute } from '@angular/router';



import { LoadingAlertService } from "../loading-alert.service"



declare var google: any;
@Component({
  selector: 'app-makeprofile',
  templateUrl: './makeprofile.page.html',
  styleUrls: ['./makeprofile.page.scss'],
})
export class MakeprofilePage {
  //Ng models to validate CNIC and Last Pass and user choice
  todo = { cnic: '', last_pass: '', choice: "", map_mode: "DRIVING" }

  cnic_length = 0






  //url parameter to show for who's this page is
  id = ""
  header = ""
  //upload file from Machine


  //this input to hide or show the map origin dest options
  block = true
  start_input = true
  end_input = true
  //this is the message to call client for click on map for destination
  click_dest_map = ""

  //map route start end
  map_route = { start: "", end: "" }
  //map should be hidden from cient until it will loaded
  hide_map = true
  //password message
  password_text = ''




  //to reduce dom access let we will store our showMap() function values

  map_button = false
  //global variable to store route in latlng points 
  direct = {
    origin: { lat: 0, lng: 0 },
    dest: { lat: 0, lng: 0 }
  }
  //progress bar for indicating the image uplaoded


  constructor(

    public db: AngularFirestore,
    public router: Router,
    public activeroute: ActivatedRoute,
    public load_alert: LoadingAlertService
  ) {

    this.activeroute.params.subscribe(params => {
      this.id = params['id']
      this.header = this.id.charAt(0).toUpperCase() + this.id.slice(1)
    })

  }

  ngOnInit() {

    new google.maps.places.Autocomplete(document.getElementById("start"));
    new google.maps.places.Autocomplete(document.getElementById("end"));
  }







  //this is a continuous function that put slashes inside CNIC input tag to make a proper form
  validateCnic(event) {
    this.cnic_length = event.length
    if (this.cnic_length == 5) {
      return event + "-"
    }
    else if (this.cnic_length == 13) {
      return event + "-"
    }
    else return event
  }

  validate_pass(first_pass, last_pass) {
    if (first_pass !== last_pass) {
      this.password_text = "Passowrd is Not Matching"
    }
    else this.password_text = ""

  }
  //this is a action sheet that will appear after when client click on map "Map Options" button

  //this is a loading message for client to wait 








  //this functions shows map store in database as longitude and latitude
  async showMap(start, end) {

    if (!start || !end) {
      this.load_alert.presentAlert("Map Start or end point isn't given".italics().big())
      return;
    }
    this.map_button = true


    await this.load_alert.presentLoading(2000, "Please Wait Map is Loading....".italics().big())

    var map = new google.maps.Map(document.getElementById('map'))
    var display = new google.maps.DirectionsRenderer()
    var Service = new google.maps.DirectionsService()
    display.setMap(map)
    this.hide_map = false
    this.click_dest_map = "If location is incorrect, find location on map (Start or End),double click on that"


    //outer service.route options

    var op = {
      origin: start,
      destination: end,
      travelMode: this.todo.map_mode,
    }


    Service.route(op, (res, state) => {
      var msg = 'Please Enter Correct Start & End Point Again'
      if (state == "OK") {
        display.setDirections(res)
        var loc = res.routes[0].legs[0]
        this.direct.origin = { lat: loc.start_location.lat(), lng: loc.start_location.lng() }
        this.direct.dest = { lat: loc.end_location.lat(), lng: loc.end_location.lng() }

      }
      else this.load_alert.presentAlert(msg)
    })






    map.addListener('dblclick', (res) => {
      var op = {}
      if (this.todo.choice == "origin") {

        this.direct.origin = { lat: res.latLng.lat(), lng: res.latLng.lng() }
        op = {
          origin: new google.maps.LatLng(res.latLng.lat(), res.latLng.lng()),
          destination: new google.maps.LatLng(this.direct.dest.lat, this.direct.dest.lng),
          travelMode: this.todo.map_mode
        }
      }
      else if (this.todo.choice == "dest") {
        this.direct.dest = { lat: res.latLng.lat(), lng: res.latLng.lng() }
        op = {
          origin: new google.maps.LatLng(this.direct.origin.lat, this.direct.origin.lng),
          destination: new google.maps.LatLng(res.latLng.lat(), res.latLng.lng()),
          travelMode: this.todo.map_mode
        }
      }
      else {
        this.load_alert.presentAlert("First Select Your locations to " + "change".big())
        return
      }




      Service.route(op, (res, state) => {
        var msg = 'Please Enter Start & End Point Again'
        if (state == "OK") {
          display.setDirections(res)
        }
        else this.load_alert.presentAlert(msg)
      })

    })

  }


  //action to show map on the basis of user choice
  validate_info(array): boolean {
    if (this.cnic_length < 15) {
      this.load_alert.presentAlert("CNIC is incomplete")
      return false
    }
    if (!this.todo.cnic || !(this.todo.cnic.match(/[!@#$%&*()a-zA-Z_+]/g) == null)) {
      this.load_alert.presentAlert("CNIC Must be numbers")
      return;
    }
    if (!this.map_button) {
      this.load_alert.presentAlert("Map route isn't given")
      return;
    }
    if (array['name'].match(/[0-9!@#$%*()_-]/g) || !array['name']) {
      this.load_alert.presentAlert("Name Incorrect")
      return false
    }
    if (array['phone'].match(/[a-zA-Z!@#$%&*()_-]/g) || !array['phone'] || array['phone'][0] != "+") {
      this.load_alert.presentAlert("Phone Number isn't valid")
      return false
    }
    if (!array.address || array.passowrd) {
      this.load_alert.presentAlert("Complete address and Password Credentials")
      return false
    }
    return true
  }

  //user map.addlistener event  to change origin or destination



  //finally to submit user personal values only because the map 
  //components will be loaded after promise of javscript function resolve 
  async submit(name, address, phone) {


    //data in database will be submitted on the base of client phone number
    var values = {
      name: name,
      address: address,
      cnic: this.todo.cnic,
      password: this.todo.last_pass,
      origin: this.direct.origin,
      dest: this.direct.dest,
      phone: phone
    }

    if (!this.validate_info(values)) { return }
    this.load_alert.presentLoading(2000, "Wait while we validate information")
    this.db.collection(this.id).doc(phone).get().subscribe(doc => {
      if (doc.exists) {
        this.load_alert.presentAlert(phone + " Record Already Exist")
      }
      else {

        this.router.navigate(['makeprofile/auth', { data: JSON.stringify(values), as: this.id }])
      }
    })


  }
}
