import { Component } from '@angular/core';
import { auth } from "firebase/app"
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from "@angular/fire/storage"
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingAlertService } from '../../loading-alert.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {

  id
  hide_recap = false
  recaptch
  data
  file
  progress = 0.2
  hide_progress_bar = true
  spinner = false
  buffer = 0.3
  constructor(
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private load_alert: LoadingAlertService
  ) {
    this.route.params.subscribe(data => {
      this.data = JSON.parse(data['data'])

      this.id = data['as']

    })

  }


  uploadfile(event) {
    this.file = event.target.files[0]
  }


  async ngOnInit() {
    this.recaptch = new auth.RecaptchaVerifier("recaptcha")
    await this.recaptch.render().catch(e => { this.load_alert.presentAlert("error occured in recaptcha".italics().big()) })
    this.spinner = true
    await this.recaptch.verify()
    this.hide_recap = true
    auth().signInWithPhoneNumber(this.data['phone'], this.recaptch).then((confor) => {
      this.recaptch = confor
    }).catch(e => {
      this.load_alert.presentAlert("Error occured RELOAD page now")
    })

  }

  submit(code) {
    this.recaptch.confirm(code).then((result) => {
      this.register()
    }).catch((error) => {
      this.load_alert.presentAlert("Wrong verification code!")
    });
  }

  register() {
    this.db.collection(this.id).doc(this.data['phone']).set(this.data)
      .then(() => {
        if (!this.file) {
          window.location.href = "/"
        }
        else {
          var filename = this.file.name.split(".")
          var length = filename.length
          this.hide_progress_bar = false
          this.db.collection(this.id).doc(this.data['phone']).update({ file_ext: filename[length - 1] })
          this.storage.ref("images/" + this.data['phone'] + "." + filename[length - 1])
            .put(this.file)
            .task.on("state_changed", (snap) => {
              this.progress = snap.bytesTransferred / snap.totalBytes
              this.buffer = this.progress + 0.1
            }, (err) => {
              this.load_alert.presentAlert("File Error.\n File may be corrupt")
            }, () => {
              window.location.href = "/"
            })
        }

      })

  }
}
