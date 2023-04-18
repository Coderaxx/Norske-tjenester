'use strict';

const { Device } = require('homey');
const fetch = require('node-fetch');
const axios = require('axios');

class RenovasjonNorge extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    // Stopp tidligere intervall om det finnes
    clearInterval(this.interval);

    // Logger at RenovasjonNorge-modulen er initialisert
    this.log('RenovasjonNorge has been initialized');

    try {
      // Itererer gjennom avfallstypene og fjerner sensorer for disse
      ['general',
        'paper',
        'bio',
        'glass',
        'drinking_carton',
        'special',
        'plastic',
        'wood',
        'textile',
        'garden',
        'metal',
        'ewaste',
        'cardboard',
        'furniture',
        'plastic_packaging',
        'sub_waste',
        'glassiglo',
        'dangerous',
        'bio_cabin',
        'general_cabin',
        'paper_cabin',
        'reno_sensor'
        ].forEach(id => {
          this.removeRenoCap(`sensor_waste_${id}`);
        });
        if (this.hasCapability('measure_next_waste_days_left')) {
          this.removeRenoCap('measure_next_waste_days_left');
        }
        if (this.hasCapability('reno_sensor')) {
          this.removeRenoCap('reno_sensor');
        }
    } catch (error) {
      // Logger feilmelding dersom det oppstår en feil
      console.error(error);
    }

    // Kaller "ready" for å indikere at modulen er klar for bruk
    this.ready();
  }

  async ready() {
    const pollInterval = 3600*1000;
    this.interval = setInterval(() => this.updateDevice(), pollInterval);
    this.log('RenovasjonNorge is ready');
    this.updateDevice();
  }

  async addRenoCap(id) {
    if (!this.hasCapability(id)) {
      await this.addCapability(id);
      return true;
    }
    return false;
  }

  async removeRenoCap(id) {
    if (this.hasCapability(id)) {
      await this.removeCapability(id);
      return true;
    }
    return false;
  }

  async updateRenoCap(id, value) {
    if (this.hasCapability(id)) {
      await this.setCapabilityValue(id, value);
      return true;
    }
    return false;
  }

  async updateRenoCapOptions(id, options) {
    if (this.hasCapability(id)) {
      await this.setCapabilityOptions(id, options);
      return true;
    }
    return false;
  }

  async getRenoCap() {
    await this.getCapabilities();
    return this.getCapabilities();
  }

  async updateDevice(countyID=this.getSetting('countyId'), streetName=this.getSetting('streetName'), streetCode=this.getSetting('addressCode'), houseNumber=this.getSetting('houseNumber')) {
    try {
      const apiurl = `https://komteksky.norkart.no/komtek.renovasjonwebapi/api/tommekalender/?kommunenr=${countyID}&gatenavn=${streetName}&gatekode=${streetCode}&husnr=${houseNumber}`;
      const response = await axios({
        url: apiurl,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'RenovasjonAppKey': 'AE13DEEC-804F-4615-A74E-B4FAC11F0A30',
          'Kommunenr': countyID,
        },
      });

      const data = response.data;
      
      const wasteTypes = {
        1: 'general',
        2: 'paper',
        3: 'bio',
        4: 'glass',
        5: 'drinking_carton',
        6: 'special',
        7: 'plastic',
        8: 'wood',
        9: 'textile',
        10: 'garden',
        11: 'metal',
        12: 'ewaste',
        13: 'cardboard',
        14: 'furniture',
        19: 'plastic_packaging',
        23: 'sub_waste',
        24: 'glassiglo',
        25: 'dangerous',
        26: 'bio_cabin',
        27: 'general_cabin',
        28: 'paper_cabin'
      };

      const wasteTypesPretty = {
        1: 'Restavfall',
        2: 'Papp/papir',
        3: 'Matavfall',
        4: 'Glass/Metallemballasje',
        5: 'Drikkekartonger',
        6: 'Spesialavfall',
        7: 'Plastavfall',
        8: 'Trevirke',
        9: 'Tekstiler',
        10: 'Hageavfall',
        11: 'Metaller',
        12: 'Hvitevarer/EE-avfall',
        13: 'Papp',
        14: 'Møbler',
        19: 'Plastemballasje',
        23: 'Nedgravd løsning',
        24: 'GlassIGLO',
        25: 'Farlig avfall',
        26: 'Matavfall hytter',
        27: 'Restavfall hytter',
        28: 'Papir hytter'
      };

      const wasteTypesPrettyShort = {
        1: 'Rest',
        2: 'Papp',
        3: 'Mat',
        4: 'Glass/Metallemballasje',
        5: 'Drikkekartonger',
        6: 'Spesial',
        7: 'Plast',
        8: 'Trevirke',
        9: 'Tekstiler',
        10: 'Hage',
        11: 'Metaller',
        12: 'EE-avfall',
        13: 'Papp',
        14: 'Møbler',
        19: 'Plastemballasje',
        23: 'Nedgravd løsning',
        24: 'GlassIGLO',
        25: 'Farlig',
        26: 'Mat',
        27: 'Rest',
        28: 'Papir'
      };

      // Finn den nærmeste neste tømmedatoen for alle avfallstyper
      const allDates = data.flatMap(curr => curr.Tommedatoer.map(dateString => new Date(dateString)));
      const nextDate = allDates.filter(date => date > new Date()).sort()[0];

      if (nextDate) {
        // Beregn antall dager til den neste tømmedatoen
        const diffTime = nextDate - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const wasteType = wasteTypes[data[0].FraksjonId];
        const wasteTypePretty = wasteTypesPrettyShort[data[0].FraksjonId];

        setTimeout(() => {
          this.addRenoCap(`measure_next_waste_days_left`);
          setTimeout(() => {
            this.updateRenoCapOptions(`measure_next_waste_days_left`, { 'units': `dager - ${wasteTypePretty}` });
            this.updateRenoCap(`measure_next_waste_days_left`, diffDays);
          }, 500);
        }, 1000);
      } else {
        console.warn('Ingen tømmedatoer funnet.');
      }

      // Finn den neste tømmedatoen for hver avfallstype og oppdater sensorene
      data.forEach(curr => {
        const wasteType = wasteTypes[curr.FraksjonId];
        if (wasteType) {
          const dates = curr.Tommedatoer.map(dateString => new Date(dateString)).sort((a, b) => a - b);
          const nextDate = dates.find(date => date > new Date());
          if (nextDate) {
            const formatter = new Intl.DateTimeFormat('nb-NO', { weekday: 'long', month: 'long', day: 'numeric' });
            const dateString = formatter.format(nextDate);

            setTimeout(() => {
              this.addRenoCap(`sensor_waste_${wasteType}`);
              setTimeout(() => {
                this.updateRenoCap(`sensor_waste_${wasteType}`, dateString);
              }, 500);
            }, 500);
          } else {
            console.warn(`Ingen tømmedato funnet for avfallstype med ID ${curr.FraksjonId}`);
          }
        } else {
          console.warn(`Ukjent avfallstype med ID ${curr.FraksjonId}`);
        }
      });
    } catch (error) {
      console.error(error);
      if (error.response) {
        // Feil i API-responsen
        this.addRenoCap('reno_sensor');
        this.updateRenoCap('reno_sensor', 'Fant dessverre ingen tømmekalender for denne adressen..');
      } else {
        // Annen feil
        console.warn('En annen feil har oppstått:', error.message);
        this.addRenoCap('reno_sensor');
        this.updateRenoCap('reno_sensor', `En annen feil har oppstått: ${error.message}`);
      }

      // Fjern alle evner unntatt reno_sensor
      const capabilities = this.getRenoCap();
      capabilities.forEach((capability) => {
        if (capability !== 'reno_sensor') {
          this.removeRenoCap(capability);
        }
      });
    }
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('RenovasjonNorge has been added');
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
    this.log('RenovasjonNorge settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('RenovasjonNorge was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('RenovasjonNorge has been deleted');
  }

}

module.exports = RenovasjonNorge;
