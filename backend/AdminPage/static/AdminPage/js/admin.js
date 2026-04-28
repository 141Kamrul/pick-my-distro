// AdminPage static JS
// Unobtrusive handlers for admin page

document.addEventListener('DOMContentLoaded', function () {
  console.log('AdminPage admin.js loaded, DOMContentLoaded');
  // Confirm deletes (in case inline onclick is removed later)
  document.querySelectorAll('form[action*="delete_distro"] button, button.delete-confirm').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      // If the button is inside a form, let the form submit proceed only on confirm
      var ok = confirm('Are you sure you want to delete this distro?');
      if (!ok) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  // Helper to bind action handlers for buttons inside a container
  function bindActionHandlers(container) {
    container = container || document;
    container.querySelectorAll('button[data-action]').forEach(function (btn) {
      if (btn._adminBound) return;
      btn._adminBound = true;
      btn.addEventListener('click', function (e) {
        var action = btn.getAttribute('data-action');
        var id = btn.getAttribute('data-id');
        if (action === 'delete') {
          if (confirm('Are you sure you want to delete this distro?')) {
            var form = document.createElement('form');
            form.method = 'POST';
            form.action = '';
            var csrfInput = document.querySelector('#csrf-form input[name=csrfmiddlewaretoken]') || document.querySelector('input[name=csrfmiddlewaretoken]');
            var csrf = csrfInput;
            if (csrf) {
              var token = document.createElement('input');
              token.type = 'hidden';
              token.name = 'csrfmiddlewaretoken';
              token.value = csrf.value;
              form.appendChild(token);
            }
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'delete_id';
            input.value = id;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
          }
        } else if (action === 'edit') {
          alert('Edit distro ' + id + ' (not implemented yet)');
        } else if (action === 'details') {
          alert('View details for distro ' + id + ' (not implemented yet)');
        }
      });
    });
  }

  function attachRowHover(tr) {
    if (!tr) return;
    tr.addEventListener('mouseenter', function () { tr.classList.add('table-active'); });
    tr.addEventListener('mouseleave', function () { tr.classList.remove('table-active'); });
  }

  // Intercept add-distro modal form and submit via AJAX
  var addForm = document.querySelector('#addDistroModal form');
  if (addForm) {
    addForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var form = e.target;
      // If form has no action, compute endpoint as current path + 'add/'
      var action = form.getAttribute('action');
      if (!action) {
        action = window.location.pathname.replace(/\/$/, '') + '/add/';
      }
      var formData = new FormData(form);

      var csrfInput = document.querySelector('#csrf-form input[name=csrfmiddlewaretoken]') || document.querySelector('input[name=csrfmiddlewaretoken]');
      var csrf = csrfInput ? csrfInput.value : null;

      var headers = { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' };
      if (csrf) headers['X-CSRFToken'] = csrf;

      fetch(action, {
        method: 'POST',
        headers: headers,
        body: formData,
        credentials: 'same-origin'
      }).then(function (res) {
        return res.json().then(function (data) { return { status: res.status, body: data }; });
      }).then(function (resp) {
        if (resp.status >= 200 && resp.status < 300 && resp.body && resp.body.ok) {
          var d = resp.body.distro;
          // Close modal
          var modalEl = document.getElementById('addDistroModal');
          if (modalEl) {
            var bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            bsModal.hide();
          }

          // Clear form
          form.reset();

          // Prepend a new row to the table
          var tbody = document.querySelector('table.table tbody');
          if (tbody) {
            var tr = document.createElement('tr');
            tr.innerHTML = '<td>' + escapeHtml(d.name) + '</td>' +
              '<td class="text-truncate" style="max-width:40ch;">' + escapeHtml(d.description || '—') + '</td>' +
              '<td>' + (d.website ? ('<a href="' + escapeAttr(d.website) + '" target="_blank" rel="noopener">' + escapeHtml(d.website) + '</a>') : '—') + '</td>' +
              '<td>' + (new Date(d.created_at)).toISOString().slice(0,10) + '</td>' +
              '<td class="text-end">' +
                '<button class="btn btn-sm btn-outline-secondary me-1" data-action="edit" data-id="' + d.id + '">Edit</button>' +
                '<button class="btn btn-sm btn-outline-info me-1" data-action="details" data-id="' + d.id + '">Details</button>' +
                '<button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="' + d.id + '">Delete</button>' +
              '</td>';
              tbody.insertBefore(tr, tbody.firstChild);
              // Bind action handlers and hover for the new row
              bindActionHandlers(tr);
              attachRowHover(tr);
          }

          // Optionally show a temporary alert
          showTemporaryAlert('Distro "' + d.name + '" added.', 'success');
        } else {
          var err = (resp.body && resp.body.error) ? resp.body.error : 'Failed to create distro';
          showTemporaryAlert(err, 'danger');
        }
      }).catch(function (err) {
        showTemporaryAlert('Network error: ' + err.message, 'danger');
      });
    });
  }

  // Load existing distros via AJAX and render rows entirely in JS
  (function loadDistros() {
    console.log('loadDistros: starting');
    var listEndpoint = window.location.pathname.replace(/\/$/, '') + '/api/distros/';
    fetch(listEndpoint, 
      { 
        headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' })
      .then(function (res) 
      { 
        console.log('Fetch distros response:', res);
        return res.json(); 
      })
      .then(function (data) 
      {
        if (!data || !Array.isArray(data.distros)) 
          return;
        var tbody = document.querySelector('table.table tbody');
        if (!tbody) 
          return;
        data.distros.forEach(function (d) 
        {
          var tr = document.createElement('tr');
          tr.innerHTML = '<td>' + escapeHtml(d.name) + '</td>' +
            '<td class="text-truncate" style="max-width:40ch;">' + escapeHtml(d.description || '—') + '</td>' +
            '<td>' + (d.website ? ('<a href="' + escapeAttr(d.website) + '" target="_blank" rel="noopener">' + escapeHtml(d.website) + '</a>') : '—') + '</td>' +
            '<td>' + (new Date(d.created_at)).toISOString().slice(0,10) + '</td>' +
            '<td class="text-end">' +
              '<button class="btn btn-sm btn-outline-secondary me-1" data-action="edit" data-id="' + d.id + '">Edit</button>' +
              '<button class="btn btn-sm btn-outline-info me-1" data-action="details" data-id="' + d.id + '">Details</button>' +
              '<button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="' + d.id + '">Delete</button>' +
            '</td>';
          tbody.appendChild(tr);
          bindActionHandlers(tr);
          attachRowHover(tr);
        });
      }).catch(function (err) 
      {
        console.warn('Failed to load distros:', err);
      });
  })();

  // Simple row highlight on hover (visual aid)
  document.querySelectorAll('table.table tr').forEach(function (tr) {
    tr.addEventListener('mouseenter', function () {
      tr.classList.add('table-active');
    });
    tr.addEventListener('mouseleave', function () {
      tr.classList.remove('table-active');
    });
  });
});

// Helper: escape text for HTML insertion
function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, function (c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}

function showTemporaryAlert(message, type) {
  var container = document.querySelector('.container');
  if (!container) return;
  var div = document.createElement('div');
  div.className = 'alert alert-' + (type || 'info') + ' mt-3';
  div.textContent = message;
  container.insertBefore(div, container.firstChild);
  setTimeout(function () { div.remove(); }, 4000);
}
