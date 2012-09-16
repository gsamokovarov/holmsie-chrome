const Holmsie = function() {
  // Whether homlsie inspector is enabled or not.
  this.enabled = false;
};

Holmsie.LABEL_MESSAGES = {
  true: 'Disable Holmsie Inspector',
  false: 'Enable Holmsie Inspector'
};

Holmsie.INITIAL_LABEL = Holmsie.LABEL_MESSAGES[false];
Holmsie.INITIAL_ACTION = 'add';

Holmsie.cache = {};

Holmsie.forTab = function(tab) {
  return Holmsie.cache[tab.id] || (Holmsie.cache[tab.id] = new Holmsie);
};

Holmsie.prototype = {
  // Toggle the holmsie state.
  toggle: function() {
    this.enabled = !this.enabled;
  },

  // Resets the holmsie state - puts it back to disabled.
  reset: function() {
    this.enabled = false;
  },

  // The appropriate label message for enabled or disabled the inspector.
  get label() {
    return Holmsie.LABEL_MESSAGES[this.enabled];
  },

  // The action to do based on the current state.
  get action() {
    return this.enabled ? 'remove' : 'add';
  }
};

const itemId = chrome.contextMenus.create({
  title: Holmsie.INITIAL_LABEL,
  contexts: ['all'],
  onclick: function(info, tab) {
    var holmsie = Holmsie.forTab(tab);

    chrome.tabs.sendRequest(tab.id, {
      action: holmsie.action
    }, function(response) {
      if (response.done) {
        holmsie.toggle();
        chrome.contextMenus.update(info.menuItemId, {title: holmsie.label});
      }
    });
  }
});

chrome.tabs.onUpdated.addListener(function(tabId) {
  chrome.tabs.get(tabId, function(tab) {
    var holmsie = Holmsie.forTab(tab)
    holmsie.reset();

    chrome.contextMenus.update(itemId, {title: holmsie.label});
  });
});