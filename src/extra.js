function setCookie20230723(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie20230723(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

const SSO_FUNCTION_URL = "https://validatecurriculumsso-bmqqputbza-uc.a.run.app";
const VERIFIED_COOKIE = "msportal_verified";

function showLoginModal() {
  Swal.fire({
    icon: 'info',
    title: 'Login Required.',
    iconHtml: '<img style="width: 100px;height: 100px;" src="//mscurriculum.thinkdataed.org/img/MSDS-logo.png">',
    showConfirmButton: true,
    confirmButtonText: 'Teachers: Login now (Portal)',
    reverseButtons: true,
    footer: 'Questions? Contact IDS Support at support@thinkdataed.org',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showLoaderOnConfirm: true,
    showLoaderOnDeny: true,
  }).then((result) => {
    if (result.isConfirmed) {
      var url = "https://msportal.thinkdataed.org/curriculum/open";
      document.location = url;
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      var url = "https://thinkdataed.org/ids-request";
      document.location = url;
    }
  });
}

function verifySsoToken(token) {
  fetch(SSO_FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: token }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.valid) {
        setCookie20230723(VERIFIED_COOKIE, "true", 1);
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } else {
        showLoginModal();
      }
    })
    .catch((err) => {
      console.error("Error verifying SSO token", err);
      showLoginModal();
    });
}

if (window.location == window.top.location) {
  if (document.location.pathname.endsWith('/applications/') == false) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const ssoToken = urlParams.get('ssoToken');

    if (ssoToken) {
      verifySsoToken(ssoToken);
    } else if (getCookie20230723(VERIFIED_COOKIE) != 'true') {
      showLoginModal();
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var searchDialog = document.querySelector('.md-search');
  if (searchDialog) { searchDialog.setAttribute('aria-label', 'Search'); }
});
