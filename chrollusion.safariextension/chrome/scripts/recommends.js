/*
  A content script that flags tracking requests.

  Copyright 2012 Disconnect, Inc.

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Authors (one per line):

    Gary Teh <garyjob@gmail.com>
*/

var recommends = function(popupCallback) {
  var self = this;  
  if(!popupCallback) {
    var self = this;
    var xhrD = new XMLHttpRequest();
    xhrD.open("GET", "http://artariteenageriot.disconnect.me:9000/campaignData", true);
    xhrD.onreadystatechange = function() {
      if (xhrD.readyState == 4 && xhrD.status == 200) {
        localStorage.recommendsCampaigns = xhrD.responseText;
        self.setCurrentCampaign();        
      }
    }
    xhrD.send();    
  } else {
    popupCallback && popupCallback({
      key : self.getCurrentCampaignKey(),
      html : self.getCurrentCampaignHtml()
    });    
  }

};

recommends.prototype.defaultCampaign = {
  key: '',
  html: ''
}

recommends.prototype.setCurrentCampaign = function() {
  var self = this;
  if(!self.deserialize(localStorage.recommendsExperiment)) {
    var xhrS = new XMLHttpRequest();
    xhrS.open("GET", "http://artariteenageriot.disconnect.me:9000/campaignSample", true);
    xhrS.onreadystatechange = function() {
      if (xhrS.readyState == 4 && xhrS.status == 200) {
        if(xhrS.responseText && xhrS.responseText !='') {
          var allCampaigns = self.getAllCampaigns();
          if(allCampaigns && allCampaigns[xhrS.responseText]) {
            localStorage.recommendsExperiment = JSON.stringify(xhrS.responseText);
            atr && atr.triggerEvent('chrollusion campaign started', {});            
          }          
        }
      }
    }
    xhrS.send();    
  } else {
    var allCampaigns = self.getAllCampaigns();
    if(allCampaigns && !allCampaigns[self.deserialize(localStorage.recommendsExperiment)]) {
      delete localStorage.recommendsExperiment;
    }    
  }
};

recommends.prototype.getCurrentCampaignKey = function() {
  var self = this;
  var allCampaigns = self.getAllCampaigns();
  if(allCampaigns && allCampaigns[self.deserialize(localStorage.recommendsExperiment)]) {
    return self.deserialize(localStorage.recommendsExperiment);
  } else {
    return self.defaultCampaign.key;
  }
};

recommends.prototype.hasCampaign = function() {
  var self = this;
  var allCampaigns = self.getAllCampaigns();  
  if(allCampaigns && allCampaigns[deserialize(localStorage.recommendsExperiment)]) {
    return true;
  } else {
    return false;
  }
}

recommends.prototype.getCurrentCampaignHtml = function() {
  var self = this;
  var allCampaigns = self.getAllCampaigns();
  if(allCampaigns && allCampaigns[deserialize(localStorage.recommendsExperiment)]) {
    return allCampaigns[deserialize(localStorage.recommendsExperiment)].html;
  } else {
    return self.defaultCampaign.html;
  }
};

recommends.prototype.getAllCampaigns = function() {
  var self = this;  
  if(localStorage.recommendsCampaigns) {
    return JSON.parse(localStorage.recommendsCampaigns);
  } else {
    return false;
  }
};

recommends.prototype.deserialize = function(object) {
  return typeof object == 'string' ? JSON.parse(object) : object;
};