'use strict';

const { Driver } = require('homey');
const fetch = require('node-fetch');

class RenovasjonNorge extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('RenovasjonNorge has been initialized');
  }

  async onPair(session) {
    this.addressData = {
      "streetName": "",
      "houseNumber": "",
      "postCode": "",
      "countyId": "",
      "addressCode": ""
    }
    // Show a specific view by ID
    await session.showView("start");

    session.setHandler("settingsChanged", async (data) => {
      return await this.onSettingsChanged(data);
    });

    session.setHandler("getApiResult", async (data) => {
      //this.log("getApiResult: ");
      //this.log(data);
      return await this.getApiResult(data);
    });

    session.setHandler("getSettings", async () => {
      //this.log("getSettings: ");
      ///this.log(this.addressData);
      return this.addressData;
    });

    session.setHandler("list_devices", async () => {
      return await this.onPairListDevices(session);
    });
  }

  async onSettingsChanged(data) {
    //this.log("Event settingsChanged: ");
    //this.log(data);
    this.addressData = data;
    return true;
  }

  async getApiResult(data) {
    try {
      const apiurl = "https://ws.geonorge.no/adresser/v1/sok?sok="+data.streetName+"%20"+data.houseNumber+",%20"+data.postCode;
      const response = await fetch(apiurl, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        }
      });
      const result = await response.json();
      return result;
    } catch (error) {
      this.error(error);
      return { error: "An error occurred during the API call" };
    }
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices(session) {
    let devices = [];

    let deviceName = this.addressData["streetName"] + ' ' + this.addressData["houseNumber"];
    //let deviceId = crypto.randomBytes(16).toString('hex');
    let deviceId = this.addressData["streetName"] + this.addressData["houseNumber"];
    let device = {
      name: deviceName,
      data: {
        id: deviceId
      },
      settings: {
        streetName: this.addressData["streetName"],
        houseNumber: this.addressData["houseNumber"],
        postCode: this.addressData["postCode"],
        countyId: this.addressData["countyId"],
        addressCode: this.addressData["addressCode"]
      }
    };
    devices.push(device);
    this.log(device);
    return devices;
  }

}

module.exports = RenovasjonNorge;
