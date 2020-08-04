import { Component } from '@angular/core';
import { auth } from "firebase/app"
import { PopoverController, MenuController } from "@ionic/angular"
import { AngularFirestore } from "@angular/fire/firestore"
import { AngularFireStorage } from "@angular/fire/storage"
import { Router } from '@angular/router';
import { LoadingAlertService } from "../../loading-alert.service"
@Component({
  selector: 'app-popover-mpp',
  templateUrl: './popover-mpp.page.html',
  styleUrls: ['./popover-mpp.page.scss'],
})

export class PopoverMppPage {

  slider = { pager: true, autoHeight: true }
  slides

  hide_spin = false
  err = { phone_err: "", phone1_err: "", pass_err: "", empty: "", match: "" }
  //recaptcha proper's
  recaptcha
  recap = ""
  hide_recap = "d-block"
  //confirm code
  verifier
  collection
  phone
  constructor(

    public db: AngularFirestore,
    public router: Router,
    public menu: MenuController,
    public storage: AngularFireStorage,
    public pop: PopoverController,
    public load_alert: LoadingAlertService
  ) { }

  async ngOnInit() {
    this.recaptcha = new auth.RecaptchaVerifier("recaptcha-container")
    await this.recaptcha.render().catch(e => { this.load_alert.presentAlert("Recaptcha can't load, again double click on " + "MyPublicProfile".bold().italics()) })
    this.hide_spin = true
    await this.recaptcha.verify()
    console.log("verified")
    this.recap = ""
    this.hide_recap = "d-none"
    this.slides.update()
  }





  slidesLoaded(slides) {
    slides.update()
    slides.lockSwipes(true)
    this.slides = slides
  }
  next() {
    this.slides.lockSwipes(false)
    this.slides.slideNext()
    this.slides.lockSwipes(true)
  }
  async prev() {
    this.slides.lockSwipes(false)
    this.slides.slidePrev()
    this.slides.lockSwipes(true)
    var index = await this.slides.getActiveIndex()
    if (index == 1) {
      this.hide_recap = "d-block"
      this.recaptcha.reset()
    }
  }

  validPhone(phone, arg) {
    phone = phone.trim()
    if (!phone || phone.length < 12 || phone[0] != "+") {
      console.log(phone[0] != "+")
      this.err[arg] = "Phone number isn't valid"
      this.slides.update()
      return true
    }
    else {
      this.err[arg] = ""
      return false
    }
  }


  //slide1
  async submit(phone, pass, collect) {
    this.collection = collect
    phone = phone.trim()
    if (this.validPhone(phone, "phone_err")) { return }
    if (this.valid_pass(pass)) { return }
    this.load_alert.presentLoading(2000, "Please wait 2s...")
    try {
      var data = await this.get_data(phone, collect)

      if (!data) {
        this.load_alert.presentAlert("Record doesn't exist")
        return
      }
    } catch (error) {
      this.load_alert.presentAlert("Network Connection Error")
      window.location.reload()
    }

    var bool = await this.resetPass(data.password, pass, null, "pass_err")

    if (bool) {
      return
    }

    else {
      var file_ext = data.file_ext
      var url = "none"
      this.pop.dismiss()
      this.menu.close()
      if (file_ext) {
        url = await this.storage.storage.ref("images/" + data.phone + "." + file_ext).getDownloadURL()
        this.router.navigate(["watchprofile/person", { data: JSON.stringify(data), url: url, edit: true, collect: this.collection }])
      }
      else this.router.navigate(["watchprofile/person", { data: JSON.stringify(data), url: url, edit: true, collect: this.collection }])
    }
  }
  //function sends code to user slide2

  valid_pass(pass) {
    if (!pass) {
      this.err.pass_err = "Password is short!"
      return true
    }
    else {
      this.err.pass_err = ""
      return false
    }
  }

  async get_data(phone, collect) {
    return (await this.db.firestore.collection(collect).doc(phone).get()).data()
  }

  send_code(phone, collect) {
    this.phone = phone
    this.collection = collect

    if (!this.recaptcha) { this.recap = "Solve Recaptcha first"; return }
    if (this.validPhone(phone, "phone1_err")) { return }
    this.err.phone1_err = ""
    this.next()
    console.log(phone)
    auth().signInWithPhoneNumber(phone, this.recaptcha).then(confirmation => {
      this.verifier = confirmation
    }).catch(e => {
      console.log("err:" + e)
    })

  }

  // verify slide3
  verify_code(code) {
    this.verifier.confirm(code).then((result) => {
      this.next()
    }).catch((error) => {
      this.load_alert.presentAlert("Wrong verification code!")
    });

  }

  //slide 4
  async resetPass(pass1, pass2, arg1, arg2) {
    if (!pass1) {
      this.err[arg1] = "Empty"
      this.slides.update()
      return
    }
    this.err[arg1] = ""
    if (pass1 != pass2) {
      this.err[arg2] = "Password don't match"
      this.slides.update()
      return true
    }

    this.err[arg2] = ""

    if (arg1 == null) { return false }

    this.next()
    await this.db.firestore.collection(this.collection).doc(this.phone).update({ password: pass2 })
    setTimeout(() => {
      this.slides.lockSwipes(false)
      this.slides.slideTo(0, 1500)
      this.slides.lockSwipes(true)
    }, 2000)
  }
}