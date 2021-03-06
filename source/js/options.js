$(document).ready(function() {
  $("#excerpt_priority").sortable();
  $("#excerpt_priority").disableSelection();

  restore_options();
  // In the case of setting the defaults, we should still save.
  save_options();

  $('#save').click(function() {
    save_options();
  })
});


// Saves options to Google Storage.
function save_options() {
  var settings = {}

  // Save options for Matches View Mode
  var chosen_mode = $("select#mode").val();
  settings["mode"] = chosen_mode;

  // Store Priority as an Array
  var priority_array = []
  $('#excerpt_priority').find('li').each(function() {
    var id = $(this).attr('id');
    priority_array.push(id);
  });
  settings["priority"] = priority_array;

  // Update status to let user know options were saved.
  var status = $("#status");
  status.html("Options Saved.");
  setTimeout(function() {
    status.empty();
  }, 1000);

  // Store in Chrome Storage.
  chrome.storage.sync.set({"settings": settings});
}

function restore_options() {
  // Restore Matches View Mode Settings.
  chrome.storage.sync.get("settings", function (obj) {
    var default_tiles = "tiles";
    var default_priority = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    var options_mode;
    var priority_settings;

    if (obj && obj['settings']) {
      // Retrieve settings for Matches View Mode.
      if (obj['settings']['mode']) {
        options_mode = obj['settings']['mode'];
      }
      // Retrieve settings for Priority.
      if (obj['settings']['priority']) {
        priority_settings = obj['settings']['priority'];
      }

    } else {
      options_mode = default_tiles;
      priority_settings = default_priority;
    }
    // Set default Mode.
    $('select#mode').val(options_mode)
    // Set priority order.
    for (var i = 0; i < priority_settings.length; i++) {
      var item = $('li#' + priority_settings[i]);
      $('#excerpt_priority').append(item);
    }
  });
}
