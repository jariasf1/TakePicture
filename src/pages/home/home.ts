import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';

//Plugins
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  imageURI:any;
  imageFileName:any;

  constructor(public navCtrl: NavController,
    private transfer: FileTransfer,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {}

    getImage() {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
      }
    
      this.camera.getPicture(options).then((imageData) => {
        this.imageURI = imageData;
      }, (err) => {
        console.log(err);
        this.presentToast(err);
      });
    }

    uploadFile() {
      let loader = this.loadingCtrl.create({
        content: "Uploading..."
      });
      loader.present();
      let nameFile = this.createFileName();
      const fileTransfer: FileTransferObject = this.transfer.create();
      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: nameFile,
        chunkedMode: false,
        httpMethod: 'POST',
        params: {'type': 1, 'entityName': 'UserBundle:Cuidador', 'entityId': 40, 'isActive': 'true'},
        mimeType: "image/jpeg",
        headers: {}
      }
    
      // fileTransfer.upload(this.imageURI, 'http://54.152.202.228/UploadVideo/upload.php', options)
      //   .then((data) => {
      //   console.log(data+" Uploaded Successfully");
      //   this.imageFileName = "http://54.152.202.228/UploadVideo/uploads/"+nameFile;
      //   loader.dismiss();
      //   this.presentToast("Image uploaded successfully");
      // }, (err) => {
      //   console.log(err);
      //   loader.dismiss();
      //   this.presentToast(err);
      // });

      fileTransfer.upload(this.imageURI, 'http://54.152.202.228/SeniorFirst/web/media/file-send-app/', options)
        .then((data) => {
        console.log("Uploaded Successfully");
        let response = JSON.parse(data.response);
        this.imageFileName = "http://54.152.202.228/SeniorFirst/web/uploads/" + response.path;
        loader.dismiss();
        this.presentToast("Image uploaded successfully");
      }, (err) => {
        console.log(err);
        loader.dismiss();
        this.presentToast(err);
      });
    }

    private createFileName() {
      var d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpeg";
      return newFileName;
    }

    presentToast(msg) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom'
      });
    
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
    
      toast.present();
    }
}
