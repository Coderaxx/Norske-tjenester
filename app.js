'use strict';

const Homey = require('homey');

class App extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('Norweigan Public Services has been initialized');
  }

}

module.exports = App;
