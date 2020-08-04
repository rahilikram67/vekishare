import { Component } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage"
import { AngularFirestore } from "@angular/fire/firestore"
import { ActivatedRoute,Router } from "@angular/router"
import { AlertController } from "@ionic/angular"
import { Geolocation } from "@capacitor/core"
import * as compareStr from "string-similarity"
import * as near from "nearestneighbour"


declare var google: any
@Component({
  selector: 'app-watchprofile',
  templateUrl: './watchprofile.page.html',
  styleUrls: ['./watchprofile.page.scss'],
})
export class WatchprofilePage {

  //for page url parameter
  id = ""
  //hide content before data is loaded
  content_hide = true
  //toggle for search results 
  show_search: boolean = false
  //search spinner
  show_spinner = false
  //for database results 
  data = []
  //for geocoding of start dest btn
  route = { origin: {}, dest: {} }
  //for database objects urls
  image_urls = []
  //map properties
  map_button_size = "default"
  map_button_hide = true
  hide_map = true
  //for search results for btn address,start_end
  found_results = []

  //no data found variable
  no_data = false
  //for input shuffle of address ,start&end and NgModule for Start&End
  btn = { start_dest: false, address: true, from_curr_loc: false }
  //incorrect input and for information text
  incorrect_input = ""
  constructor(
    public storage: AngularFireStorage,
    private db: AngularFirestore,
    private router: ActivatedRoute,
    private alert: AlertController,
    private routeToGo:Router
  ) {
    this.router.params.subscribe(data => {
      this.id = data["id"]
    })

  }



  async ngOnInit() {
    const obj=this
   await this.db.collection(this.id).ref.onSnapshot(async (data) => {

      this.data = await data.docs
      
      setTimeout(()=>{
        if(!obj.data[0]){alert("poor internet connection")}
      },4000)
      if(this.data[0]){
         this.content_hide = false 
      }
    })
    
    
    
    function resize() {
      if (window.innerWidth <= 768) {
        obj.map_button_size = "default"
      }
      else obj.map_button_size = "large"
    }
    resize()
    window.onresize = resize
  }

  async alertControl(addr) {
    var alert = await this.alert.create({
      subHeader: "Error",
      message: "Incorrect Address :".big() + addr,
      backdropDismiss: true,
      animated: true,
      buttons: ["OK"]
    })
    await alert.present()
  }

  info_text(obj, input) {

    if (!this.btn.address) {
      var name2 = "text-center text-info  rounded"
      obj.className = name2
      this.incorrect_input = "Use names of popular places in your address"
    }
    if (this.btn.start_dest && !input.value.includes("-")) {
      input.value = "-"
      input.setSelectionRange(0, 0)
    }
  }


  //dropdown toggler for main button and child button bool=true for childs
  toolbar_button(n, input) {
    if (n == 1) {
      this.btn.address = true
      this.btn.start_dest = false
      this.btn.from_curr_loc = false
      input.placeholder = 'Address'
    }
    else if (n == 2) {
      this.btn.address = false
      this.btn.start_dest = true
      this.btn.from_curr_loc = false
      input.placeholder = "[Start Address]-[End Address]"
    }
    else {
      this.btn.address = false
      this.btn.start_dest = false
      this.btn.from_curr_loc = true
      input.placeholder = "Destination"
    }
    input.value = ''
  }
  
  toggle_map() {
    if (this.hide_map) {
      this.hide_map = false
    }
    else this.hide_map = true
  }

  

  //search desired information by following options 
  async search_results(value: String, input_obj, map_id) {

    this.extra_operation(input_obj)
    if (this.btn.address) {
      await this.btn_address_click(value)
    }
    else if (this.btn.start_dest) {
      await this.btn_start_dest(value, map_id)
    }
    else await this.from_curr_loc(value,map_id)
  }


  extra_operation(input_obj) {
    var name = "text-center text-danger rounded"
    input_obj.className = name
    this.show_spinner = true
    this.found_results = undefined
    this.found_results = []
    this.image_urls = undefined
    this.image_urls = []
    this.show_search = false
    this.hide_map = true
    this.map_button_hide = true
    this.incorrect_input = ""
  }
  //btn address starting
  async btn_address_click(value: String) {
    if (!this.validate_address(value)) return
    var i = 0
    for (var p of this.data) {
      var obj = p.data()

      if (compareStr.compareTwoStrings(obj.address.toLowerCase(), value.toLowerCase()) >= 0.3) {
        this.found_results.push(Object.assign(obj, { number: i }))
        i++;
      }
    }

    if (i == 0) {
      this.no_data = true
      this.show_spinner = false
      return
    }
    else if (i > 30) {
      this.found_results.length = 30
    }
    for (var j = 0; j < i; j++) {
      var doc = this.found_results[j]
      if (doc.file_ext) {
        var path = "images/" + doc.phone + "." + doc.file_ext
        this.image_urls[j] = await this.storage.storage.ref().child(path).getDownloadURL()
      }

    }
    this.show_spinner = false
    this.show_search = true
  }
  //this function validates perosnal info input

  validate_address(value: String) {
    if (!value) {
      this.incorrect_input = `Please Enter Something to input`
      this.no_data = true
      this.show_spinner = false
      return false
    }
    else {
      this.incorrect_input = ""
      this.no_data = false
      return true
    }
  }



  //btn start dest starting
  async  btn_start_dest(value: String, map_id) {

    var res = this.validate_start_dest(value)

    if (!res.valid) return
    this.createMap(map_id, res.value[0], res.value[1])

  }

  /*
     This function will validate info and split string from "-" sign
  */
  validate_start_dest(value: String) {
    var split = value.split("-")
    var len = split.length
    if (value.endsWith("-") || len < 2 || len > 2 || !value) {
      this.incorrect_input = `Write Start & End Address and place a "-" sign between them like 
                               "4th street, main market california  - karachi pakistan"`
      this.show_spinner = false
      this.no_data = true
      return { value: "", valid: false }
    }
    else {
      this.no_data = false
      this.incorrect_input = ""
      return { value: split, valid: true }
    }
  }
  //create map 
  createMap(map_id, start, dest) {

    var origin = ((typeof start) == "string") ? start : new google.maps.LatLng(start.latitude, start.longitude)

    var map = new google.maps.Map(map_id, { zoom: 12 })
    var display = new google.maps.DirectionsRenderer()
    var Service = new google.maps.DirectionsService()
    display.setMap(map)
    Service.route({
      origin: origin,
      destination: dest,
      travelMode: "DRIVING"
    }, (res, state) => {
      if (state == "OK") {
        display.setDirections(res)
        var start = res.routes[0].legs[0].start_location
        var end = res.routes[0].legs[0].end_location
        this.route.origin = { lat: start.lat(), lng: start.lng() }
        this.route.dest = { lat: end.lat(), lng: end.lng() }
        this.NearNeighbour()
      }
      else {
          this.alertControl("Not valid addresses");
          this.show_spinner = false
          this.no_data = true
       }
    })
    this.map_button_hide = false
  }

  //search  by start_dest btn information by 
  //using google maps api to find latLng of start dest  

  NearNeighbour() {
    var array = []
    var len = this.data.length
    if (!len) {
      this.no_data = true
      this.show_spinner = false
      return
    }
    for (var i = 0; i < len; i++) {
      array[i] = this.data[i].data().dest
      array[i].number = i
    }

    var config = { objects: array, number: 30 }
    var nearNeighbour = near(config)
    var res = nearNeighbour.nearest(this.route.dest)

    config = { objects: res, number: 15 }
    nearNeighbour = near(config)

    res = nearNeighbour.nearest(this.route.origin)


    this.btn_start_dest_finalize(res)
  }

  async btn_start_dest_finalize(array) {
    var len = array.length
   
    for (var i = 0; i < len; i++) {
      var doc=this.data[array[i].number].data()
      this.found_results.push(Object.assign(doc,{number:i}))
    }

    this.show_spinner = false
    this.show_search = true

    for (var i = 0; i < len; i++) {
      var doc=this.found_results[i]
      if(doc.file_ext) {
        var path = "images/" + doc.phone + "." + doc.file_ext
        this.image_urls[i] = (await this.storage.storage.ref().child(path).getDownloadURL())
      }
      else this.image_urls[i]=undefined
    }

  }

  //if user press from current location to destination
  async from_curr_loc(value,map_id){
    this.validate_address(value) 
    var start=await Geolocation.getCurrentPosition()
    this.createMap(map_id,start.coords,value)
    this.NearNeighbour()
  }
   
  navigate(num){
     var url=this.image_urls[num]
     if(url==undefined){
       url="none"
     }
     this.routeToGo.navigate(['watchprofile/person',{data:JSON.stringify(this.found_results[num]),url:url}])   
  }  
}