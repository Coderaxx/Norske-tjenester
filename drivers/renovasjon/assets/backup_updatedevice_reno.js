  async updateDevice(countyID=this.getSetting('countyId'), streetName=this.getSetting('streetName'), streetCode=this.getSetting('addressCode'), houseNumber=this.getSetting('houseNumber')) {
    let tDate = undefined;
    const apiurl = "https://komteksky.norkart.no/komtek.renovasjonwebapi/api/tommekalender/?kommunenr="+countyID+"&gatenavn="+streetName+"&gatekode="+streetCode+"&husnr="+houseNumber;
    fetch(apiurl, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "RenovasjonAppKey": "AE13DEEC-804F-4615-A74E-B4FAC11F0A30",
        "Kommunenr": countyID,
      }
    })
    .then(response =>
      response.json())
    .then(data => {
      data.forEach(data => {
        switch(data.FraksjonId) {
        case 1:
          tDate = new Date(data.Tommedatoer[0]);
          this.addRenoCap('general');
          this.setCapabilityValue('sensor_waste_general', tDate.toLocaleString('nb-NO', { weekday: 'long', month: 'long', day: 'numeric' }));
          break;
        case 2:
          tDate = new Date(data.Tommedatoer[0]);
          this.addRenoCap('paper');
          this.setCapabilityValue('sensor_waste_paper', tDate.toLocaleString('nb-NO', { weekday: 'long', month: 'long', day: 'numeric' }));
          break;
        case 3:
          tDate = new Date(data.Tommedatoer[0]);
          this.addRenoCap('bio');
          this.setCapabilityValue('sensor_waste_bio', tDate.toLocaleString('nb-NO', { weekday: 'long', month: 'long', day: 'numeric' }));
          break;
        case 4:
          tDate = new Date(data.Tommedatoer[0]);
          this.addRenoCap('glass');
          this.setCapabilityValue('sensor_waste_glass', tDate.toLocaleString('nb-NO', { weekday: 'long', month: 'long', day: 'numeric' }));
          break;
        case 7:
          tDate = new Date(data.Tommedatoer[0]);
          this.addRenoCap('plastic');
          this.setCapabilityValue('sensor_waste_plastic', tDate.toLocaleString('nb-NO', { weekday: 'long', month: 'long', day: 'numeric' }));
          break;
      }
      });
    });
  }