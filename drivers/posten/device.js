'use strict';

const { Device } = require('homey');
const fetch = require('node-fetch');

class Posten extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    clearInterval(this.interval);
    const settings = this.getSettings();
    this.interval = undefined;
    this.log('Posten has been initialized');
    this.ready();
  }

  async ready() {
    const pollInterval = this.getSetting('pollInterval')*1000;
    this.interval = setInterval(() => this.updateDevice(), pollInterval);
    this.log('Posten is ready');
    this.updateDevice();
  }

  async updateDevice(postnr=this.getSetting('postnr')) {
    //const postnr = this.getSetting('postnr');
    const apiurl = "https://www.posten.no/levering-av-post/_/component/main/1/leftRegion/11?postCode=" + postnr;
    fetch(apiurl, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      }
    })
    .then(response =>
      response.json())
    .then(data => {
      if (data.nextDeliveryDays[0].includes("i dag")) {
        const response = data.nextDeliveryDays[0].split(" ").slice(0, 2).join(" ");
        this.setCapabilityValue("posten_sensor", response);
        this.setCapabilityValue("meter_posten_sensor", parseFloat(0));
        this.setCapabilityOptions("meter_posten_sensor", {"units": "dager"});
      } else if (data.nextDeliveryDays[0].includes("i morgen")) {
        const response = data.nextDeliveryDays[0].split(" ").slice(0, 2).join(" ");
        this.setCapabilityValue("posten_sensor", response);
        this.setCapabilityValue("meter_posten_sensor", parseFloat(1));
        this.setCapabilityOptions("meter_posten_sensor", {"units": "dag"});
      } else {
        const response = data.nextDeliveryDays[0];
        this.setCapabilityValue("posten_sensor", response);
        let currentYear = new Date().getFullYear();
        const date = new Date(response+" "+currentYear);
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        let countdown = Math.abs(date) - new Date();
        countdown = Math.ceil(countdown / (1000 * 60 * 60 * 24));
        this.setCapabilityValue("meter_posten_sensor", parseFloat(countdown));
        this.setCapabilityOptions("meter_posten_sensor", {"units": "dager"});
      }
    });
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('Posten has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('Posten settings were changed');
    if (changedKeys.includes('postnr')) {
      this.updateDevice(newSettings.postnr);
    }
    if (changedKeys.includes('pollInterval')) {
      clearInterval(this.interval);
      const pollInterval = newSettings.pollInterval*1000;
      this.interval = setInterval(() => this.updateDevice(), pollInterval);
    }
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('PostenPosten was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('Posten has been deleted');
  }

}

module.exports = Posten;